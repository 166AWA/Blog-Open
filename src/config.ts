// ============================================================
// config.ts — 主题集中配置文件（唯一的事实来源）
//
// 所有可配置项都在这一个文件里，经 src/utils/config.ts 类型化导出
// （导出常量名与这里的键一一对应），供各组件按需引用。
// 改完不需要动任何组件代码，重启 dev / 重新 build 即生效。
//
// 配色也在本文件底部（theme 段），由 src/utils/theme.ts 编译成 CSS 变量。
// ============================================================

export default {
  // ==========================================================
  // 站点基本信息
  // ==========================================================
  site: {
    title: "我的博客", // 站点标题：顶栏品牌区、浏览器标签、首页大标题
    subtitle: "记录技术与生活", // 副标题：首页大标题下方
    description: "一个基于 Astro 的静态博客", // 站点描述：SEO meta description
    keywords: "astro, blog, theme, 静态博客", // SEO 关键词（meta keywords）
    author: "Your Name", // 作者：meta author、版权声明署名
    language: "zh-CN", // 站点语言：<html lang> 与 i18n 文案选择（zh-cn/zh-tw/en/ja）
  },

  // ==========================================================
  // 侧边栏
  // ==========================================================
  sidebar: {
    avatar: "/images/avatar.webp", // 侧栏头像路径（放在 public/images/ 下）
    position: "left", // 侧栏位置：left 或 right
  },

  // 侧栏卡片（widget）的显示顺序，按名称匹配 components/widget/ 下的组件：
  //   recent_posts=最新文章  category=文章分类  tag=标签  tagcloud=标签云
  // 想增删或调整顺序，改这个数组即可
  widgets: ["recent_posts", "category", "tag", "tagcloud"],

  // ==========================================================
  // 顶部导航菜单（由 PureNavbar 渲染）
  // name 是 i18n 文案键（见 src/languages/），url 是站内链接路径
  // ==========================================================
  menu: [
    { name: "home", url: "/" }, // 主页
    { name: "articles", url: "/articles" }, // 文章列表
    { name: "archives", url: "/archives" }, // 归档
    { name: "about", url: "/about" }, // 关于
  ],

  // ==========================================================
  // 横幅图（banner）：页面顶部大图区
  // 可以填站内路径（放 public/images/ 下）或完整 URL
  // ==========================================================
  banner: "/images/banner.webp",

  // 响应式横幅：按视口宽度切换不同尺寸的图，省流量
  // enable 为 false 时只用上面的 banner
  banner_srcset: {
    enable: true,
    srcset: [
      { src: "/images/banner-600w.webp", media: "(max-width: 479px)" }, // 手机
      { src: "/images/banner-800w.webp", media: "(max-width: 799px)" }, // 平板
      { src: "/images/banner.webp", media: "(min-width: 800px)" }, // 桌面
    ],
  },

  // 文章随机封面候选列表（frontmatter 没写 cover 时，按文章 id 稳定挑一张）
  // 路径放 public/images/ 下；留空数组则回退到上面的 banner
  covers: [
    "/images/cover-1.webp",
    "/images/cover-2.webp",
    "/images/cover-3.webp",
    "/images/cover-4.webp",
    "/images/cover-5.webp",
    "/images/cover-6.webp",
  ],

  // ==========================================================
  // 页脚（Footer）
  // ==========================================================
  footer: {
    since: 2026, // 建站年份：页脚显示 "2026 - 当前年份"
    powered: true, // 显示 "Powered by Astro & Theme Reimu" 标识
    count: true, // 显示文章数/分类数/标签数统计
    busuanzi: false, // 不蒜子访客统计（PV/UV，依赖外部脚本，国内可开）
    icp: {
      // 中国大陆 ICP 备案信息（留空则不显示）
      icpnumber: "", // 备案号，如 "京ICP备XXXXXXXX号"
      beian: "", // 公安备案号（可选）
      recordcode: "", // 备案查询代码（可选）
    },
    moe_icp: {
      icpnumber: "", // 萌国 ICP 备案号（可选）
    },
  },

  // ==========================================================
  // 网站统计 / 分析
  // 填对应平台的 **ID 字符串** 才会启用；填 false 关闭。
  // 注意：不要填 true —— 那会被当成 ID 拼进脚本地址（如 hm.js?true）
  // ==========================================================
  analytics: {
    baidu_analytics: false as string | false, // 百度统计 ID，如 "0123456789abcdef"
    google_analytics: false as string | false, // Google Analytics ID，如 "G-XXXXXXXXXX"
    clarity: false as string | false, // Microsoft Clarity 项目 ID
  },

  // ==========================================================
  // 社交链接：显示在侧栏社交图标区（SocialList）
  // 取消注释并填链接即可；没填的不会显示
  // ==========================================================
  social: {
    // email: "mailto:you@example.com",
    // github: "https://github.com/yourname",
    // qq: "https://qq.com/yourname",
    // bilibili: "https://space.bilibili.com/youruid",
    // google: "https://plus.google.com/yourname",
    // twitter: "https://twitter.com/yourname",
    // facebook: "https://www.facebook.com/yourname",
    // instagram: "https://www.instagram.com/yourname",
    // linkedin: "https://www.linkedin.com/in/yourname",
    // pinterest: "https://www.pinterest.com/yourname",
    // youtube: "https://www.youtube.com/channel/yourname",
    // vimeo: "https://vimeo.com/yourname",
    // flickr: "https://www.flickr.com/photos/yourname",
    // dribbble: "https://dribbble.com/yourname",
    // behance: "https://www.behance.net/yourname",
    // weibo: "https://weibo.com/yourname",
    // zhihu: "https://www.zhihu.com/people/yourname",
    // reddit: "https://www.reddit.com/user/yourname",
    // tumblr: "https://yourname.tumblr.com",
    // medium: "https://medium.com/@yourname",
    // deviantart: "https://yourname.deviantart.com",
    // keybase: "https://keybase.io/yourname",
    // telegram: "https://t.me/yourname",
    // discord: "https://discordapp.com/users/yourname",
    // steam: "https://steamcommunity.com/id/yourname",
  },

  // ==========================================================
  // 评论系统（七选一，全部默认关闭；开启一个即可）
  // 开启步骤：enable 设为 true + 按注释填对应平台信息
  // ==========================================================

  // 1. Valine（基于 LeanCloud 的轻量评论，https://valine.js.org）
  valine: {
    enable: false,
    appId: "", // LeanCloud 应用的 appId（必填）
    appKey: "", // LeanCloud 应用的 appKey（必填）
    pageSize: 10, // 每页评论数
    avatar: "mp", // 头像样式（mp/identicon/monsterid 等）
    lang: "zh-cn", // 语言：zh-cn / en
    placeholder: "Just go go", // 评论框占位提示
    guest_info: "nick,mail,link", // 访客可填信息
    recordIP: true, // 是否记录评论者 IP
    highlight: true, // 评论内容是否高亮代码
    visitor: false, // 是否显示文章阅读量（需 LeanCloud）
    serverURLs: "", // 自建 LeanCloud 服务地址（国内版需填）
  },

  // 2. Waline（Valine 的升级版，自带后端，https://waline.js.org）
  waline: {
    enable: false,
    serverURL: "", // Waline 服务端地址（必填，如 https://xxx.vercel.app）
    lang: "zh-CN",
    locale: {}, // 自定义文案覆盖
    emoji: [
      // 表情包 CDN 列表
      "https://unpkg.com/@waline/emojis@1.2.0/weibo",
      "https://unpkg.com/@waline/emojis@1.2.0/alus",
      "https://unpkg.com/@waline/emojis@1.2.0/bilibili",
      "https://unpkg.com/@waline/emojis@1.2.0/qq",
      "https://unpkg.com/@waline/emojis@1.2.0/tieba",
      "https://unpkg.com/@waline/emojis@1.2.0/tw-emoji",
    ],
    meta: ["nick", "mail", "link"], // 允许填写的字段
    requiredMeta: ["nick", "mail"], // 必填字段
    wordLimit: 0, // 评论字数上限（0 = 不限）
    pageSize: 10, // 每页评论数
    pageview: true, // 是否显示阅读量
  },

  // 3. Gitalk（基于 GitHub Issue，https://github.com/gitalk/gitalk）
  // ⚠️ 安全提醒：Gitalk 会把 clientSecret 下发到浏览器，等于公开泄露。
  //    它的前端 OAuth 模型本身就不安全，不建议启用；要用请自行评估风险。
  gitalk: {
    enable: false,
    clientID: "",
    clientSecret: "",
    repo: "",
    owner: "",
    admin: [],
  },

  // 4. Giscus（基于 GitHub Discussions，https://giscus.app/zh-CN）
  giscus: {
    enable: false,
    repo: "", // 格式 "owner/repo"（必填）
    repoId: "", // 仓库 ID（在 giscus.app 配置页获取）
    category: "", // Discussions 分类名
    categoryId: "", // 分类 ID
    mapping: "pathname", // 评论与文章的关联方式（pathname/url/title 等）
    strict: 0, // 严格模式（0/1）
    reactionsEnabled: 1, // 是否启用表情回应
    emitMetadata: 0, // 是否向 GitHub 发送元数据
    inputPosition: "bottom", // 评论框位置（top/bottom）
  },

  // 5. Utterances（基于 GitHub Issue，https://utteranc.es）
  utterances: {
    enable: false,
    repo: "owner/repo", // 格式 "用户名/仓库名"（必填）
    issue_term: "title", // 关联方式（title/pathname/url 等）
    theme: "auto", // auto 跟随站点明暗；也可 github-light / github-dark
  },

  // 6. Twikoo（腾讯云 / 自部署，https://twikoo.js.org）
  twikoo: {
    enable: false,
    envId: "", // 腾讯云环境填 envId；Vercel 部署填函数地址
    region: "", // 腾讯云区域（如 ap-shanghai），Vercel 留空
  },

  // 7. Disqus（https://disqus.com）
  disqus: {
    enable: false,
    shortname: "", // 你的 Disqus 站点 shortname（必填）
    count: true, // 是否显示评论数
  },

  // ==========================================================
  // 友情链接：渲染在友链页 /link 及关于页
  // 复制一组 { name, url, desc, avatar } 即可新增
  // ==========================================================
  friend: [
    {
      name: "Astro",
      url: "https://astro.build/",
      desc: "本主题使用的静态站点框架",
      avatar: "https://astro.build/favicon.svg",
    },
    {
      name: "D-Sketon",
      url: "https://d-sketon.github.io/",
      desc: "上游主题 hexo-theme-reimu 作者",
      avatar: "https://d-sketon.github.io/avatar/avatar.webp",
    },
  ],

  // ==========================================================
  // 线路切换（侧栏「线路」）：跳转到镜像 / 备用入口
  // 不需要就留空数组 []
  // name=线路名  url=目标地址  icon=图标(可选)  desc=说明(可选)
  // ==========================================================
  routes: [],

  // ==========================================================
  // 文章版权声明（显示在文章末尾，可逐项开关）
  // ==========================================================
  copyright: {
    enable: true, // 是否显示版权声明块
    content: {
      author: true, // 显示作者
      link: true, // 显示原文链接
      title: true, // 显示文章标题
      date: true, // 显示发布日期
      updated: true, // 显示更新日期
      license: true, // 显示许可证
      license_type: "by-nc-sa", // 知识共享协议：by-nc-sa / by / by-sa 等
    },
  },

  // ==========================================================
  // 页面加载动画（preloader）
  // ==========================================================
  preloader: {
    enable: true, // 是否显示加载动画
    text: "Loading…", // 加载文字
    rotate: true, // 太极图标是否旋转
  },

  // ==========================================================
  // 鼠标点击烟花特效（https://github.com/D-Sketon/mouse-firework）
  // particles[].number 必须是**数字**（一次产生的粒子数）
  // ==========================================================
  firework: {
    enable: true,
    disable_on_mobile: false, // true 时触屏设备不启用

    options: {
      excludeElements: ["a", "button"], // 这些元素上点击不触发
      particles: [
        // 第一组：点击处向四周迸射的小圆点
        {
          shape: "circle",
          move: ["emit"],
          easing: "easeOutExpo",
          colors: [
            "rgba(251, 251, 251, 0.9)",
            "rgb(255, 77, 0)",
            "rgba(0, 255, 195, 0.9)",
          ],
          number: 8, // 一次产生的粒子数
          duration: [1200, 1800], // 粒子存活时间范围（ms）
          shapeOptions: {
            radius: [16, 32], // 半径范围
            alpha: [0.3, 0.5], // 透明度范围
          },
        },
        // 第二组：扩散的圆环波纹
        {
          shape: "circle",
          move: ["diffuse"],
          easing: "easeOutExpo",
          colors: ["rgba(0, 187, 255, 0.9)"],
          number: 1,
          duration: [1200, 1800],
          shapeOptions: {
            radius: 20,
            alpha: [0.2, 0.5],
            lineWidth: 6, // 圆环线宽
          },
        },
      ],
    },
  },

  // ==========================================================
  // 首页分类卡片区（首页顶部展示指定分类的大卡片）
  // content[].categories 支持用英文逗号分隔多个分类名
  // ==========================================================
  home_categories: {
    enable: false,
    content: [
      // { categories: "技术,生活" },
    ],
  },

  // ==========================================================
  // 右上角三角形角标（如 "Fork me on GitHub"）
  // 由 PureNavbar 渲染
  // ==========================================================
  triangle_badge: {
    enable: false,
    type: "github", // Iconify fa6-brands 图标名
    link: "https://github.com/D-Sketon/astro-theme-reimu",
  },

  // ==========================================================
  // 文章过期提醒（文章太旧时在顶部提示）
  // ==========================================================
  outdate: {
    enable: false,
    daysAgo: 180, // 距发布超过多少天视为过期
  },

  // ==========================================================
  // 文章分享平台（文章页底部按钮）
  // 可选：weibo / twitter / facebook / linkedin / reddit / qq / weixin
  // ==========================================================
  share: ["qq", "weixin"],

  // ==========================================================
  // 打赏（文章页底部赞助二维码）
  // 二维码图片放 public/sponsor/ 下；不启用请保持 enable: false
  // ==========================================================
  sponsor: {
    enable: false,
    qr: [
      // { name: "支付宝", src: "/sponsor/alipay.png" },
      // { name: "微信", src: "/sponsor/wechat.png" },
    ],
  },

  // ==========================================================
  // 配色（改这里就能换整套配色，不需要动任何 CSS）
  //
  // 变量名沿用主题历史的 --red-N（上游是红色主题），语义上等同于"主色阶"：
  //   red-0   最亮的强调色（分隔线渐变、装饰）
  //   red-1   主色：链接、选中背景、加载动画
  //   red-2   主色变体
  //   red-3   浅色边框、滚动条
  //   red-4   深色强调（引用块左边框）
  //   red-5   卡片 / 版权块底色
  //   red-5-5 更浅的底色
  //   red-6   最浅底色
  //
  // 编译逻辑见 src/utils/theme.ts —— 它会生成 :root 与暗色模式两段变量。
  // 只想换个主色？把 red-1 / red-2 改成你想要的颜色即可。
  // ==========================================================
  theme: {
    palette: {
      // 亮色模式：完整 8 档 + 两个阴影色
      light: {
        "red-0": "#00d9ff",
        "red-1": "#07bdff",
        "red-2": "#00bbff",
        "red-3": "#83f0f2",
        "red-4": "#6744f1",
        "red-5": "#e6f7ff",
        "red-5-5": "#f0faff",
        "red-6": "#f7fcff",
        "color-red-6-shadow": "rgba(2, 141, 255, 0.992)",
        "color-red-3-shadow": "rgba(0, 187, 255, 0.3)",
      },
      // 暗色模式：只需要写和亮色不同的档位，其余自动沿用
      dark: {
        "red-0": "#07bdff",
        "red-4": "rgba(0, 187, 255, 0.5)",
        "red-5": "rgba(0, 187, 255, 0.15)",
        "red-5-5": "rgba(0, 187, 255, 0.05)",
        "red-6": "rgba(0, 187, 255, 0.2)",
      },
    },

    neutral: {
      // 亮色模式的中性色与背景
      light: {
        "grey-9": "#888",
        "color-archive-year": "#000",
        "color-default": "#444",
        "color-background": "#eee",
        "color-code-background": "#f8f8f8",
        "color-header-background": "rgba(255, 255, 255, 0.9)",
        "color-footer-background": "#fff",
        "color-mobile-nav-background": "#fff",
        "color-wrap": "#fff",
        "color-h2-border": "#eee",
        "color-meta-shadow": "var(--red-6)",
        "color-hover-shadow": "rgba(120, 120, 120, 0.15)",
      },
      // 暗色模式
      dark: {
        "color-archive-year": "#999",
        "color-default": "#999",
        "color-background": "#21252b",
        "color-code-background": "rgba(232, 232, 232, 0.2)",
        "color-header-background": "#222222",
        "color-footer-background": "#21252b",
        "color-mobile-nav-background": "#21252b",
        "color-wrap": "#272b30",
        "color-h2-border": "#47474a",
        "color-hover-shadow": "rgba(0, 0, 0, 0.2)",
      },
    },
  },
};
