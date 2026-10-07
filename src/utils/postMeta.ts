// postMeta.ts — 文章元信息工具：封面图 + 简介
// 封面：frontmatter cover 优先，否则从 config.ts 的 covers 按 seed 稳定取一张
// 简介：markdown 渲染但跳过图片（mdToExcerptHtml）
import { COVERS } from "./config";
import { mdToExcerptHtml } from "./mdToExcerpt";

/**
 * 从 config.ts 的 covers 列表里按 seed 稳定取一张封面图。
 * 用 seed 的简单哈希映射到数组索引：同一 seed（如文章 id）每次构建取同一张图，
 * 不同 seed 取不同图 —— 保证静态构建产物可复现。
 * @param seed 稳定标识（文章 id / 分类名）
 * @returns 封面 URL；列表为空返回 null
 */
function randomCover(seed: string): string | null {
  if (!COVERS || COVERS.length === 0) return null;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return COVERS[hash % COVERS.length];
}

/**
 * 综合封面解析：frontmatter cover > covers.ts 随机图。
 * @param cover - frontmatter 的 cover 字段（手动指定时优先）
 * @param seed - 稳定标识（文章 id / 分类名），用于随机图轮换稳定
 * @param fallback - 最终兜底（站点 BANNER 等）
 * @returns 封面 URL
 */
export function resolveCover(
  cover: string | undefined,
  seed: string = "",
  fallback: string = ""
): string {
  if (cover) return cover;
  return randomCover(seed || "default") || fallback;
}

/**
 * 生成文章简介 HTML（跳过图片，支持 markdown 语法）。
 * 优先用 frontmatter 的 excerpt；否则从正文生成。
 * @param excerpt - frontmatter 的 excerpt（可能是纯文本或 markdown）
 * @param body - markdown 正文（用于无 excerpt 时生成）
 * @returns HTML 字符串（已净化，可安全 set:html）
 */
export function postExcerptHtml(excerpt: string = "", body: string = ""): string {
  const src = excerpt.trim() || body || "";
  return mdToExcerptHtml(src);
}
