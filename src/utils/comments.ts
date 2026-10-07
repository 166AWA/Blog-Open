// ============================================================
// comments.ts — 判断当前配置下哪个评论系统真正启用了
//
// 为什么需要这个文件：
//   评论框（components/post/Comment.astro）和文章底部的评论数/阅读量块
//   （layouts/BlogLayout.astro）都要判断"有没有评论"。
//   这两处过去各写了一份条件，且条件不一致 —— 只启用 Giscus / Gitalk /
//   Utterances 时，评论框会渲染、评论数却不渲染。
//   现在统一走这里，加新评论系统也只要改这一个地方。
// ============================================================
import {
  DISQUS,
  GISCUS,
  GITALK,
  TWIKOO,
  UTTERANCES,
  VALINE,
  WALINE,
} from "./config";

export type CommentSystem =
  | "valine"
  | "waline"
  | "gitalk"
  | "giscus"
  | "utterances"
  | "twikoo"
  | "disqus";

/**
 * 返回当前配置下实际启用的评论系统。
 *
 * 判断条件是「enable 为 true **且**必填项已填」——只打开 enable 却没填
 * 仓库/服务地址的话，组件会渲染出一个报错的空框，所以这里一并拦掉。
 *
 * @returns 启用的系统名；一个都没配置完整时返回 null
 */
export function getActiveCommentSystem(): CommentSystem | null {
  if (VALINE.enable && VALINE.appId && VALINE.appKey) return "valine";
  if (WALINE.enable && WALINE.serverURL) return "waline";
  if (GITALK.enable && GITALK.repo && GITALK.owner) return "gitalk";
  if (GISCUS.enable && GISCUS.repo && GISCUS.repoId) return "giscus";
  if (UTTERANCES.enable && UTTERANCES.repo) return "utterances";
  if (TWIKOO.enable && TWIKOO.envId) return "twikoo";
  if (DISQUS.enable && DISQUS.shortname) return "disqus";
  return null;
}
