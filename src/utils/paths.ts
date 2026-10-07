// ============================================================
// paths.ts — 站内链接拼装（统一做 URL 编码）
//
// 为什么单独抽出来：
//   标签名 / 分类名 / 文章 id 都可能含空格、中文、`#`、`?`、`/` 等字符。
//   直接拼进 href 会生成错误路径（`#` 被当锚点、`/` 被当层级），
//   而各个组件过去各写各的 —— 有的编码、有的没编码，
//   同一个标签会出现两个不同的地址（一个能开、一个 404）。
//   所有站内链接统一走这里。
// ============================================================
import { urlFor } from "./urlFor";

/** 标签页地址 */
export function tagUrl(tag: string): string {
  return urlFor(`tags/${encodeURIComponent(tag)}`);
}

/** 分类页地址 */
export function categoryUrl(category: string): string {
  return urlFor(`categories/${encodeURIComponent(category)}`);
}

/**
 * 文章地址。
 * 内容 id 形如 `subdir/post-name`，按 `/` 分段后逐段编码，
 * 保留 `/` 作为层级分隔符。
 *
 * @param id 内容 id（post.id）
 * @param absolute 是否返回带域名的绝对地址（用于 og:url / RSS / 分享）
 */
export function postUrl(id: string, absolute = false): string {
  const encoded = id
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return urlFor(`blog/${encoded}`, absolute);
}
