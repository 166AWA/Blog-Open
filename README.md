# Astro 静态博客主题（reimu 定制版）

一个用 **Astro 5** 构建的静态博客主题。特点是把**所有可配置项集中在一个文件**里 ——
站点信息、导航、配色、评论、统计、功能开关，全都改 `src/config.ts`，不用翻组件找。

> 本主题基于 [D-Sketon/astro-theme-reimu](https://github.com/D-Sketon/astro-theme-reimu) 二次开发，
> 在其基础上重构了配置层、修正了若干缺陷并做了安全加固。遵循上游的 MIT 许可，详见[许可与致谢](#许可与致谢)。

---

## 特性

| 分类 | 说明 |
| --- | --- |
| 内容 | Markdown / MDX，支持 frontmatter 定义标签、分类、封面、摘要、目录开关 |
| 搜索 | fuse.js 全文搜索，索引在打开搜索框时才加载，不拖慢首屏 |
| 数学公式 | KaTeX（`remark-math` + `rehype-katex`） |
| 图表 | mermaid 代码块直接渲染 |
| 代码高亮 | Expressive Code，带行号与可折叠区块 |
| 图片 | PhotoSwipe 灯箱、图片墙、懒加载、Astro 图片优化 |
| 主题色 | 亮/暗双模式，配色由 `src/config.ts` 生成 CSS 变量 |
| 评论 | 七选一：Valine / Waline / Gitalk / Giscus / Utterances / Twikoo / Disqus |
| 其他 | RSS、sitemap、归档、标签云、分类卡片、文章过期提醒、阅读量、分享、版权声明 |
| 部署 | 纯静态输出，Cloudflare Pages / 腾讯云 EdgeOne / Vercel / GitHub Pages 均可 |

---

## 环境要求

- **Node.js >= 22.12.0**
- **pnpm 9**（仓库只提供 `pnpm-lock.yaml`，用 npm/yarn 无法复现依赖版本）

## 快速开始

```bash
pnpm install     # 安装依赖
pnpm dev         # 本地开发，默认 http://localhost:4321
pnpm build       # 构建到 dist/
pnpm preview     # 本地预览构建产物
pnpm lint        # 代码检查
```

**开始前必做两件事：**

1. 改 `astro.config.mjs` 里的 `site`，填你自己的域名（影响 sitemap / RSS / canonical）。
2. 改 `src/config.ts` 里的 `site.title`、`site.author`、`sidebar.avatar`、`banner` 等基本信息。

> 没改的话站点上会带着示例信息。

---

## 目录结构

```
.
├── astro.config.mjs          # Astro 配置（site 必改）
├── src/
│   ├── config.ts             # ★ 唯一的配置文件，改这个就够
│   ├── content/
│   │   └── blog/             # 文章目录（.md / .mdx）
│   ├── components/           # 组件
│   │   ├── mdx/              # 可在 MDX 文章里按需引入的组件
│   │   ├── partial/          # 页面局部（meta、统计、加载动画等）
│   │   ├── post/             # 文章页部件 + 评论系统
│   │   ├── sidebar/          # 侧栏
│   │   └── widget/           # 侧栏卡片
│   ├── layouts/              # 布局
│   ├── pages/                # 路由
│   ├── styles/               # 全局样式（不含颜色，颜色见 config.ts）
│   └── utils/                # 工具函数（含配置类型、配色编译、摘要净化）
├── public/images/            # 静态图片（头像、横幅、封面占位图）
└── scripts/ensure-ffi.sh     # 部分云构建环境的字体子集化兜底脚本
```

---

## 配置

所有配置都在 **`src/config.ts`**。下面是最常用的部分，完整选项见文件内注释。

### 站点信息

```ts
site: {
  title: "我的博客",
  subtitle: "记录技术与生活",
  description: "一个基于 Astro 的静态博客",
  keywords: "astro, blog, theme",
  author: "Your Name",
  language: "zh-CN",   // zh-cn / zh-tw / en / ja
},
```

### 换配色

配色在 `src/config.ts` 底部的 `theme` 段，由 `src/utils/theme.ts` 编译成 CSS 变量，
**不需要改任何 CSS 文件**：

```ts
theme: {
  palette: {
    light: {
      "red-1": "#07bdff",   // 主色：链接、选中背景、加载动画
      "red-2": "#00bbff",   // 主色变体
      // red-0 / red-3 / red-4 / red-5 / red-5-5 / red-6 见文件注释
    },
    dark: {
      "red-0": "#07bdff",   // 暗色模式只需写与亮色不同的档位
    },
  },
},
```

变量名沿用上游的 `--red-N`（上游是红色主题），语义上就是「主色阶」。
**只想换个主色**：改 `palette.light` 里的 `red-1` 和 `red-2`。

### 评论

七选一，默认全关。把要用的那个 `enable` 改成 `true` 并填好必填项：

```ts
giscus: {
  enable: true,
  repo: "yourname/yourrepo",
  repoId: "R_xxxxxxx",
  category: "Announcements",
  categoryId: "DIC_kwDOxxxxxx",
},
```

> ⚠️ **不要启用 Gitalk**：它会把 GitHub OAuth 的 `clientSecret` 通过静态页面下发到浏览器，
> 等于公开泄露密钥。这个前端 OAuth 模型本身不安全。

### 统计

填平台给的 **ID 字符串**才生效，`false` 表示关闭：

```ts
analytics: {
  baidu_analytics: "0123456789abcdef",
  google_analytics: "G-XXXXXXXXXX",
  clarity: "abcdefghij",
},
```

> 不要填 `true` —— 那会被当成 ID 拼进脚本地址（`hm.js?true`），统计不会生效。

### 其他开关

`preloader`（加载动画）、`firework`（点击烟花）、`copyright`（版权声明）、`outdate`（过期提醒）、
`home_categories`（首页分类卡片）、`triangle_badge`（GitHub 角标）、`widgets`（侧栏卡片与顺序）、
`menu`（顶部导航）、`social`（社交链接）、`friend`（友情链接）、`routes`（镜像线路）、
`sponsor`（打赏二维码）。

---

## 写文章

文章放在 `src/content/blog/`，文件名即 URL（`hello-world.md` → `/blog/hello-world`）：

```yaml
---
title: 文章标题
description: 一句话摘要，用于 SEO 与列表页
pubDate: 2024-01-01T09:00:00+08:00
tags: ["标签"]
categories: ["分类"]
cover: "/images/cover-1.webp"   # 不填则从 config 的 covers 里按 id 稳定挑一张
excerpt: 自定义摘要                # 不填则从正文自动生成
---
```

> `pubDate` 建议写**带时区的完整时间**。只写 `2024-01-01` 会被按 UTC 午夜解析，
> 在负时区的构建机上可能显示成前一天。

图片可以放 `public/` 下用绝对路径引用，也可以放在文章旁边用相对路径引用（Astro 会自动优化尺寸）：

```markdown
![绝对路径](/images/cover-1.webp)
![相对路径](./assets/photo.png)
```

仓库自带 4 篇示例文章，演示了 markdown 语法、MDX 组件与配置方法，可以直接删掉。

### 可用的 MDX 组件

`src/components/mdx/` 下提供：`AlertBlockquote`、`Details`、`Tabs` / `TabItem`、
`Grid` / `GridCell`、`Gallery`、`FriendCard`、`FriendLinkCard`、`Link`、`TagRoulette`、`HeatMapCard`。

这些组件**需要手动 import**（没有全局注册，这样构建体积更小）。用法见示例文章 `mdx-components.mdx`。

---

## 部署

构建产物是纯静态文件，输出在 `dist/`。

**Cloudflare Pages**：构建命令 `pnpm build`，输出目录 `dist`。
仓库里的 `wrangler.jsonc` 请把 `name` 改成你的项目名。

**腾讯云 EdgeOne / ESA**：构建配置见 `esa.jsonc`，同样先改 `name`。
注意 `notFoundStrategy` 保持默认的 404 策略 —— 设成 `singlePageApplication`
会让所有未知路径返回首页 200，导致 `404.astro` 永不生效。

**通用 CI**：`.github/workflows/build.yml` 已配好 pnpm + Node 22/24 矩阵，
安装依赖后跑 lint 与 build。

> `scripts/ensure-ffi.sh` 只在部分云构建环境需要（字体子集化依赖的原生库下载失败时）。
> 出于供应链安全，它**默认拒绝下载未校验的原生库**，需要你先用
> `sha256sum` 算出哈希并通过环境变量 `CN_FONT_SPLIT_LIBFFI_SHA256` 传入。

---

## 安全说明

这个主题在几个容易出问题的地方做了加固，改动相关代码前请先读：

- **摘要 HTML 会做净化**。`src/utils/mdToExcerpt.ts` 的返回值经 `set:html` / `v-html` 注入 DOM，
  因此它对 markdown 里的原始 HTML 做转义、对链接 href 做协议白名单、对截断后的标签做闭合配平。
  修改这个文件时不要移除这些处理。
- **不要把内容字符串塞进 `define:vars`**。Astro < 6.1.6 存在
  [CVE-2026-41067](https://osv.dev/vulnerability/CVE-2026-41067)（`</script>` 净化不完整可致 XSS）。
  本主题已尽量避免在 `define:vars` 里传内容派生的字符串；新增代码请优先用 `data-*` 属性传值。
  建议把 `astro` 升级到 **>= 6.1.6** 以彻底修复。
- **没有路径穿越面**。所有动态路由都由 `getStaticPaths` 在构建期确定，项目内不存在
  运行时文件系统读写，也没有基于用户输入的 `fetch`。
- **依赖锁定**。CI 使用 `pnpm install --frozen-lockfile`，不要改成 `npm install`，否则会忽略锁文件。

---

## 常见问题

**构建报 `ERR_PNPM_UNSUPPORTED_ENGINE`？**
Node 版本低于 22.12.0，升级 Node 即可。

**标签/分类页第 2 页打不开？**
已修复（补上了分页组件）。如果你的分支还没有，检查 `src/pages/tags/[tag]/[...page].astro`
和 `src/pages/categories/[category]/[...page].astro` 里有没有 `<Pagination />`。

**统计后台没有数据？**
检查 `analytics` 里填的是 ID 字符串而不是 `true`。

**文章封面每次构建都不一样？**
不该发生：封面由 `post.id` 哈希映射，是确定性的。若确实变化，检查是否误用了 `Math.random()`。

---

## 许可与致谢

本项目基于 [D-Sketon/astro-theme-reimu](https://github.com/D-Sketon/astro-theme-reimu)
二次开发，遵循 **MIT License**，原始版权归 D-Sketon 所有，详见 [LICENSE](./LICENSE)。

字体 [LXGW WenKai Screen](https://github.com/lxgw/LxgwWenKai-Screen) 遵循 SIL Open Font License，
详见 [OFL.txt](./OFL.txt)。

感谢上游作者与所有依赖项目的维护者。
#   B l o g - O p e n  
 