import { mdToExcerptHtml } from "../src/utils/mdToExcerpt.ts";

const ALLOWED_TAGS = new Set([
  "a", "span", "strong", "em", "b", "i", "code", "del", "s",
  "p", "ul", "ol", "li", "blockquote", "br", "hr", "pre",
]);
const VOID_TAGS = new Set(["br", "hr", "img", "input", "wbr"]);

/** 把标签的属性和值解析出来（正确处理引号内的 &quot; 等实体） */
function parseAttrs(raw) {
  const re = /([a-zA-Z_:][-\w:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  const out = [];
  let m;
  while ((m = re.exec(raw)) !== null) {
    out.push([m[1].toLowerCase(), m[3] ?? m[4] ?? m[5] ?? ""]);
  }
  return out;
}

function inspect(html) {
  const problems = [];
  const stack = [];

  const tagRe = /<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const closing = m[1] === "/";
    const name = m[2].toLowerCase();
    const attrs = parseAttrs(m[3] || "");

    if (!ALLOWED_TAGS.has(name)) problems.push(`非白名单标签 <${name}>`);
    for (const [attr] of attrs) {
      if (/^on/i.test(attr)) problems.push(`事件属性 ${attr}= 出现在 <${name}>`);
      if (attr === "href") {
        const v = attrs.find((a) => a[0] === "href")[1];
        if (!/^(?:https?:|mailto:|tel:|#|\/|\.{1,2}\/)/i.test(v)) problems.push(`可疑 href: ${v}`);
      }
    }
    if (VOID_TAGS.has(name)) continue;
    if (closing) {
      const top = stack.pop();
      if (top !== name) problems.push(`闭合不匹配: 期望 </${top}> 得到 </${name}>`);
    } else {
      stack.push(name);
    }
  }
  if (stack.length) problems.push(`未闭合标签: ${stack.join(", ")}`);

  // 去掉全部合法标签后，若还剩裸标签起始符，说明有 HTML 逃逸
  const stripped = html.replace(/<\/?[a-zA-Z][\w-]*(?:(?:[^>"']|"[^"]*"|'[^']*')*)>/g, "");
  if (/<[a-zA-Z]/.test(stripped)) problems.push("存在未转义的标签");

  return problems;
}

const cases = [
  ["原始 HTML 注入", "hello <img src=x onerror=alert(1)> world"],
  ["script 注入", "前 <script>alert(1)</script> 后"],
  ["iframe 注入", "<iframe src=javascript:alert(1)></iframe>"],
  ["svg onload 注入", "<svg/onload=alert(1)>"],
  ["javascript: 链接", "[点我](javascript:alert(document.domain))"],
  ["data: 链接", "[点我](data:text/html,<script>alert(1)</script>)"],
  ["vbscript: 链接", "[点我](vbscript:msgbox(1))"],
  ["控制字符绕过", "[x](java\u0000script:alert(1))"],
  ["href 引号逃逸", '[x](https://a.com" onmouseover="alert(1))'],
  ["title 引号逃逸", '[x](https://a.com "恶意\\" onmouseover=\\"alert(1)")'],
  ["正常外链+粗体", "看这个 [**粗体链接**](https://example.com) 很好"],
  ["标题降级", "# 一级标题 with *斜体*"],
  ["图片跳过", "文字 ![图](a.png) 之后"],
  ["引用块", "> 引用内容 **加粗**"],
  ["列表", "- 第一项\n- 第二项"],
  ["HTML 实体", "a &amp; b &lt;tag&gt; c"],
  ["Markdown 强调", "**粗** 和 *斜* 和 `代码`"],
  ["行内代码含标签", "用 `<div>` 标签"],
];

let failed = 0;
for (const [name, src] of cases) {
  const out = mdToExcerptHtml(src);
  const problems = inspect(out);
  if (problems.length) failed++;
  console.log(`${problems.length ? "❌" : "✅"} ${name}`);
  console.log(`   出: ${out}`);
  for (const p of problems) console.log(`   ⚠ ${p}`);
}

// 真正超过 260 可见字符，且截断点落在链接中间
const LONG = (
  "这是一段很长很长的简介文本，用来说明这篇文章到底讲了些什么内容，确保它一定会超过二百六十个字符的限制从而触发截断分支。" +
  "接着放一个 [非常重要的超长链接文字内容指向某个外部地址](https://example.com/very/long/path) 然后继续写很多很多的内容，" +
  "再补充一些句子让总长度彻底越过阈值，并且让截断点正好落在上面那个链接的内部位置，用来验证闭合标签配平逻辑是否正常工作。" +
  "最后再来一段收尾文字，确保即使去掉标签后可见字符数也稳稳超过二百六十个。"
).repeat(2);

console.log("\n=== 长文本截断 ===");
const long = mdToExcerptHtml(LONG);
console.log(`  出: ${long}`);
console.log(`  原始可见长度: ${LONG.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").length}`);
console.log(`  截断后可见长度: ${long.replace(/<[^>]*>/g, "").length}`);
const longProblems = inspect(long);
console.log(`  ${longProblems.length ? "❌ " + longProblems.join("; ") : "✅ 结构完整、标签配平"}`);
if (longProblems.length) failed++;
console.log(`  以省略号结尾: ${long.endsWith("…") ? "✅" : "❌ 未触发截断"}`);

console.log(`\n${failed === 0 ? "全部通过 ✅" : `存在 ${failed} 处问题 ❌`}`);
process.exit(failed === 0 ? 0 : 1);
