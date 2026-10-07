---
title: 如何配置这个主题
description: 站点信息、导航、配色、评论、统计等所有可配置项，都集中在 src/config.ts 一个文件里。
pubDate: 2024-01-04T09:00:00+08:00
tags: ["示例", "配置"]
categories: ["开始"]
---

这个主题的设计原则是：**所有个性化配置只改一个文件** —— `src/config.ts`。
组件不直接写死任何站点相关信息，而是从这个文件读取。

## 三步开始

```bash
# 1. 安装依赖（需要 Node >= 22.12）
pnpm install

# 2. 本地开发
pnpm dev

# 3. 构建
pnpm build
```

## 必改的几项

打开 `src/config.ts`，先改这几处，否则站点上会带着示例信息：

| 位置 | 说明 |
| --- | --- |
| `site.title` / `subtitle` / `description` | 站点标题、副标题、SEO 描述 |
| `site.author` | 作者署名，出现在版权声明里 |
| `site.language` | `zh-cn` / `zh-tw` / `en` / `ja` |
| `sidebar.avatar` | 侧栏头像，图片放 `public/images/` 下 |
| `banner` | 首页横幅图 |
| `footer.since` | 建站年份 |

另外 **`astro.config.mjs` 里的 `site` 必须改成你自己的域名**，它决定 sitemap、RSS 和
canonical 链接的绝对地址。

## 换配色

配色在 `src/config.ts` 最底部的 `theme` 段。它由 `src/utils/theme.ts` 编译成 CSS 变量，
你不需要动任何 CSS 文件。

变量名沿用主题历史的 `--red-N`（上游是红色主题），语义上就是「主色阶」：

```
red-0   最亮的强调色（分隔线渐变、装饰）
red-1   主色：链接、选中背景、加载动画
red-2   主色变体
red-3   浅色边框、滚动条
red-4   深色强调（引用块左边框）
red-5   卡片 / 版权块底色
red-5-5 更浅的底色
red-6   最浅底色
```

**只想换个主色**，改 `theme.palette.light` 里的 `red-1` 与 `red-2` 即可。
暗色模式只需写与亮色不同的档位，其余自动沿用亮色。

> 组件里写的是 `var(--red-1)` 这类变量引用，所以改配置后全站同步生效。

## 开关功能

`config.ts` 里每个功能都有自己的开关，常用的几个：

| 配置项 | 作用 |
| --- | --- |
| `preloader.enable` | 首屏加载动画 |
| `firework.enable` | 鼠标点击烟花 |
| `copyright.enable` | 文章版权声明 |
| `outdate.enable` | 文章过期提醒 |
| `home_categories.enable` | 首页分类大卡片 |
| `triangle_badge.enable` | 右上角 GitHub 角标 |
| `widgets` | 侧栏卡片及顺序 |
| `menu` | 顶部导航项 |

## 评论系统

七选一，全部默认关闭。想用哪个就把它的 `enable` 改成 `true` 并填好必填项：

```ts
giscus: {
  enable: true,
  repo: "yourname/yourrepo",
  repoId: "R_xxxxxxx",
  category: "Announcements",
  categoryId: "DIC_kwDOxxxxxx",
  // ...
},
```

> ⚠️ **不要启用 Gitalk**：它会把 GitHub OAuth 的 `clientSecret` 下发到浏览器，
> 等于把密钥公开。这个前端 OAuth 模型本身就不安全。

## 网站统计

`analytics` 段填**平台给的 ID 字符串**才会生效，`false` 表示关闭：

```ts
analytics: {
  baidu_analytics: "0123456789abcdef",
  google_analytics: "G-XXXXXXXXXX",
  clarity: "abcdefghij",
},
```

> 不要填 `true`。那会被当成 ID 拼进脚本地址（`hm.js?true`），统计不会生效。

## 写文章

文章放 `src/content/blog/`，frontmatter 里 `title`、`description`、`pubDate` 必填：

```yaml
---
title: 文章标题
description: 一句话摘要
pubDate: 2024-01-01T09:00:00+08:00
tags: ["标签"]
categories: ["分类"]
cover: "/images/cover-1.webp"   # 不填则从 config.ts 的 covers 里稳定挑一张
---
```

更多组件用法见 [MDX 组件演示](/blog/mdx-components)。
