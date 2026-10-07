// ============================================================
// mdToExcerpt.ts — 把 markdown 渲染成「文章简介 HTML」
//
// 设计目标：简介里保留 markdown 行内语法（粗体/斜体/链接/行内代码），
// 去掉图片，并把长度截断到约 260 个可见字符。
//
// ⚠️ 安全约定（改这个文件前务必读完）
//   本函数的返回值会被 `set:html` / `v-html` 直接注入 DOM，属于 HTML 注入边界。
//   因此这里对一切"内容侧"输入都做转义，而不是假定内容可信：
//     1. markdown 里的原始 HTML（`<img onerror=...>`）由 renderer.html 转义成纯文本；
//     2. 链接 href 走协议白名单，`javascript:` / `data:` 一律退化成 `#`；
//     3. 链接文字与 title 属性统一转义。
//   调用方若改用别的方式渲染简介，必须保留同等强度的净化。
// ============================================================
import { Marked } from "marked";

/** 简介默认最大可见字符数 */
const DEFAULT_MAX_LENGTH = 260;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** 标签闭合配平用的自闭合标签集合（HTML5 void elements） */
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img",
  "input", "link", "meta", "param", "source", "track", "wbr",
]);

/** 转义 HTML 特殊字符，用于一切要拼进 HTML 的动态内容。 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/**
 * 链接协议白名单。
 * 只放行 http/https/mailto/tel、页内锚点、站内绝对路径与相对路径，
 * 其余（`javascript:`、`data:`、`vbscript:` 等）一律退化为 `#`。
 * 先剔除控制字符，避免 `java\nscript:` 这类绕过。
 */
function safeHref(href: unknown): string {
  const raw = String(href ?? "")
    // 剔除控制字符：防止 `java\nscript:` 这类绕过协议白名单的写法
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
  if (!raw) return "#";
  return /^(?:https?:|mailto:|tel:|#|\/|\.{1,2}\/)/i.test(raw) ? raw : "#";
}

/** 行内 token 的最小结构（只取我们需要的字段） */
type InlineToken = {
  type?: string;
  raw?: string;
  text?: string;
  tokens?: InlineToken[];
};

/** 递归提取 token 的纯文本，用于把链接/标题内容降级成文字 */
function plainText(tokens: readonly InlineToken[] | undefined): string {
  if (!tokens || tokens.length === 0) return "";
  return tokens
    .map((token) => {
      if (token.type === "br") return " ";
      if (token.tokens && token.tokens.length > 0) return plainText(token.tokens);
      return token.text ?? token.raw ?? "";
    })
    .join("");
}

/**
 * 渲染行内内容的独立实例。
 *
 * 注意：这里**必须**是另一个 Marked 实例，且它的 link/heading 渲染器
 * 不再回调 parseInline —— 否则会出现 renderer.link → parseInline →
 * renderer.link 的无限递归（marked 会疯狂报 "Please report this"）。
 * 行内链接在简介里不再嵌套，只保留文字。
 */
function createInlineRenderer(): Marked {
  const inline = new Marked({ gfm: true, breaks: false });
  inline.use({
    renderer: {
      html: ({ text }) => escapeHtml(text),
      image: () => "",
      link: ({ tokens }) => escapeHtml(plainText(tokens as InlineToken[])),
      heading: ({ tokens }) => escapeHtml(plainText(tokens as InlineToken[])),
    },
  });
  return inline;
}

/**
 * 渲染 markdown 为简介 HTML。
 *
 * @param source  markdown 原文（通常是 frontmatter 的 excerpt，缺省时用正文）
 * @param maxLength 最大可见字符数，超出后按标点断句并追加省略号
 * @returns 可直接 `set:html` 的 HTML 字符串
 */
export function mdToExcerptHtml(
  source: string = "",
  maxLength: number = DEFAULT_MAX_LENGTH
): string {
  if (!source) return "";

  const md = new Marked({ gfm: true, breaks: false });
  const inlineMd = createInlineRenderer();

  /** 用独立实例渲染行内 token，保留粗体/斜体等格式 */
  const renderInline = (tokens: readonly InlineToken[]): string =>
    inlineMd.parseInline(
      tokens.map((t) => t.raw ?? "").join(""),
      { async: false }
    ) as string;

  md.use({
    renderer: {
      // 简介不显示图片
      image: () => "",
      // 关键：markdown 中的原始 HTML 一律转义为纯文本，杜绝注入
      html: ({ text }) => escapeHtml(text),
      link: ({ href, title, tokens }) => {
        const text = renderInline(tokens as InlineToken[]);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(safeHref(href))}"${titleAttr} rel="noopener noreferrer">${text}</a>`;
      },
      // 标题降级为行内 span：简介里不应再出现一个标题层级
      heading: ({ tokens }) => {
        const text = renderInline(tokens as InlineToken[]);
        return text ? `<span>${text}</span>` : "";
      },
    },
  });

  const html = md.parse(source, { async: false }) as string;
  return truncateHtml(html, maxLength);
}

/**
 * 按"可见字符数"截断 HTML。
 * 截断点落在标点/空白处时优先在该处断开；截断后会把未闭合的标签补全，
 * 避免产出 `set:html` 后把后续内容吞进 `<a>` / `<strong>` 里。
 */
function truncateHtml(html: string, maxLength: number): string {
  if (!html) return "";

  const plain = stripTags(html);
  if (plain.length <= maxLength) return html;

  // 从 maxLength 往回收，找最后一个自然断点
  let cut = maxLength;
  for (let i = Math.min(maxLength, plain.length) - 1; i >= 0; i--) {
    if (/[。．.!！?？,，、;；:：\s]/.test(plain[i])) {
      cut = i + 1;
      break;
    }
  }

  const out: string[] = [];
  let seen = 0;
  let i = 0;

  while (i < html.length && seen < cut) {
    const ch = html[i];

    if (ch === "<") {
      // 整个标签原样复制（标签不会被计入可见字符）
      const end = html.indexOf(">", i);
      if (end === -1) break; // 残缺标签直接丢弃，宁可少输出也不破坏结构
      out.push(html.slice(i, end + 1));
      i = end + 1;
    } else if (ch === "&") {
      // HTML 实体算 1 个可见字符
      const entity = /^&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/.exec(
        html.slice(i, i + 12)
      );
      if (entity) {
        out.push(entity[0]);
        i += entity[0].length;
      } else {
        out.push(ch);
        i += 1;
      }
      seen += 1;
    } else {
      out.push(ch);
      i += 1;
      seen += 1;
    }
  }

  return `${closeOpenTags(out.join(""))}…`;
}

/**
 * 配平 HTML 中未闭合的标签：按出现顺序入栈，结尾倒序补上闭合标签。
 * 只处理成对标签，自闭合标签（br/hr/img…）跳过。
 */
function closeOpenTags(html: string): string {
  const stack: string[] = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;

  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(html)) !== null) {
    const isClosing = m[1] === "/";
    const name = m[2].toLowerCase();
    if (m[4] === "/" || VOID_TAGS.has(name)) continue;

    if (isClosing) {
      const idx = stack.lastIndexOf(name);
      if (idx !== -1) stack.length = idx;
    } else {
      stack.push(name);
    }
  }

  const closing = stack
    .reverse()
    .map((tag) => `</${tag}>`)
    .join("");
  return html + closing;
}

/** 去掉 HTML 标签取纯文本，用于计算可见长度 */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
