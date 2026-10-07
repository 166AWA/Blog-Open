---
title: 欢迎使用这个 Astro 博客主题
description: 一篇示例文章，介绍这个主题包含哪些功能，以及内容应该放在哪里。
pubDate: 2024-01-01T09:00:00+08:00
tags: ["示例", "Astro"]
categories: ["开始"]
---

这是一篇**示例文章**，用来演示主题的基本排版。你可以直接删掉它，换成自己的内容。

## 文章放在哪里

所有文章都在 `src/content/blog/` 目录下，支持 `.md` 与 `.mdx` 两种后缀：

```
src/content/blog/
├── hello-world.md          ← 本文件
├── markdown-showcase.md    ← markdown 语法演示
├── mdx-components.mdx      ← MDX 组件演示
└── theme-configuration.md  ← 配置说明
```

文件名就是 URL：`hello-world.md` → `/blog/hello-world`。

## 必需的前置字段

每篇文章开头都要有 frontmatter，其中 `title`、`description`、`pubDate` 是必填的：

```yaml
---
title: 文章标题
description: 一句话摘要，用于 SEO 和列表页
pubDate: 2024-01-01T09:00:00+08:00
---
```

> 建议 `pubDate` 写成**带时区的完整时间**（如上）。只写 `2024-01-01` 会被按 UTC 午夜解析，
> 在负时区的构建机上可能显示成前一天。

## 这个主题提供的能力

- **深色模式**：跟随系统，也可以手动切换，刷新不会闪白
- **全文搜索**：基于 fuse.js，索引在打开搜索时才加载
- **数学公式**：KaTeX，写 `$E = mc^2$` 即可
- **图表**：mermaid 流程图 / 时序图
- **代码高亮**：Expressive Code，支持行号与可折叠区块
- **七种评论系统**：Valine / Waline / Gitalk / Giscus / Utterances / Twikoo / Disqus（按需开一个）
- **RSS 与站点地图**：自动生成

配置全部集中在 `src/config.ts` 一个文件里，详见 [配置说明](/blog/theme-configuration)。

行内公式示例：质能方程 $E = mc^2$，欧拉恒等式 $e^{i\pi} + 1 = 0$。

```mermaid
graph LR
    A[写 Markdown] --> B[Astro 构建]
    B --> C[静态 HTML]
    C --> D[部署到任意静态托管]
```
