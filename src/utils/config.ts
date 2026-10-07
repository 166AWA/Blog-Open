// ============================================================
// utils/config.ts — 给 src/config.ts 加上类型，并导出给组件使用
//
// 设计说明：
//   这里用 `const typedConfig: SiteThemeConfig = config;` 而不是
//   `config as SiteThemeConfig`。区别很关键：
//     · as 断言 = 不检查，写错类型也照样通过（曾经让 analytics: true、
//       firework.number: "浙ICP备…" 这类错误静默上线）；
//     · 类型标注 = 真正校验，config.ts 里填错会在编译期直接报错。
//   所以改 config.ts 后如果类型报错，说明值填得不对，请按提示修正。
// ============================================================

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  keywords: string | string[];
  author: string;
  language: string;
}

export interface FooterConfig {
  since: number;
  powered: boolean;
  count: boolean;
  busuanzi: boolean;
  icp?: {
    icpnumber: string;
    beian: string;
    recordcode: string;
  };
  moe_icp?: {
    icpnumber: string;
  };
}

/**
 * 统计配置。
 * 必须是平台给的 **ID 字符串**；false 表示关闭。
 * 传布尔 true 会被当成 ID 拼进脚本 URL，因此类型上直接禁止。
 */
export interface AnalyticsConfig {
  baidu_analytics: string | false;
  google_analytics: string | false;
  clarity: string | false;
}

export interface SocialConfig {
  email?: string;
  github?: string;
  qq?: string;
  google?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  pinterest?: string;
  youtube?: string;
  vimeo?: string;
  flickr?: string;
  dribbble?: string;
  behance?: string;
  bilibili?: string;
  weibo?: string;
  zhihu?: string;
  douban?: string;
  reddit?: string;
  tumblr?: string;
  medium?: string;
  deviantart?: string;
  keybase?: string;
  telegram?: string;
  discord?: string;
  steam?: string;
}

export interface ValineConfig {
  enable: boolean;
  appId: string;
  appKey: string;
  pageSize: number;
  avatar: string;
  lang: string;
  placeholder: string;
  guest_info: string;
  recordIP: boolean;
  highlight: boolean;
  visitor: boolean;
  serverURLs: string;
}

export interface WalineConfig {
  enable: boolean;
  serverURL: string;
  lang: string;
  locale: Record<string, string>;
  emoji: string[];
  meta: string[];
  requiredMeta: string[];
  wordLimit: number;
  pageSize: number;
  pageview: boolean;
}

export interface GitalkConfig {
  enable: boolean;
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
  admin: string[];
}

export interface GiscusConfig {
  enable: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: number | string;
  reactionsEnabled: number | string;
  emitMetadata: number | string;
  inputPosition: string;
}

export interface UtterancesConfig {
  enable: boolean;
  repo: string;
  issue_term: string;
  theme: string;
}

export interface TwikooConfig {
  enable: boolean;
  envId: string;
  region: string;
}

export interface DisqusConfig {
  enable: boolean;
  shortname: string;
  count: boolean;
}

export interface FriendConfig {
  name: string;
  avatar: string;
  url: string;
  desc: string;
}

/** 线路配置：侧栏「线路切换」可跳转的镜像 / 备用入口 */
export interface RouteConfig {
  name: string; // 线路名（显示在侧栏）
  url: string; // 目标地址（当前页跳转，非新标签）
  icon?: string; // 可选图标（astro-icon 名称，如 "fa6-solid:server"）
  desc?: string; // 可选说明（hover 提示）
}

export interface CopyrightConfig {
  enable: boolean;
  content: {
    author: boolean;
    link: boolean;
    title: boolean;
    date: boolean;
    updated: boolean;
    license: boolean;
    license_type: string;
  };
}

export interface PreloaderConfig {
  enable: boolean;
  text: string;
  rotate: boolean;
}

export interface SidebarConfig {
  position: "left" | "right";
  avatar: string;
}

export interface MenuConfig {
  name: string;
  url: string;
}

export interface BannerSrcSetConfig {
  enable: boolean;
  srcset: {
    src: string;
    media: string;
  }[];
}

/** 单组烟花粒子。number 必须是数字，写字符串会让粒子数量计算失效 */
export interface FireworkParticleConfig {
  shape: string;
  move: string[];
  easing: string;
  colors: string[];
  number: number;
  duration: number[];
  shapeOptions: {
    radius: number | number[];
    alpha: number | number[];
    lineWidth?: number;
  };
}

export interface FireworkConfig {
  enable: boolean;
  disable_on_mobile: boolean;
  options: {
    excludeElements: string[];
    particles: FireworkParticleConfig[];
  };
}

export interface HomeCategoriesConfig {
  enable: boolean;
  content: {
    categories: string;
    cover?: string;
  }[];
}

export interface TriangleBadgeConfig {
  enable: boolean;
  type: string;
  link: string;
}

export interface OutdateConfig {
  enable: boolean;
  daysAgo: number;
}

export interface SponsorConfig {
  enable: boolean;
  qr?: { name: string; src: string }[];
}

/**
 * 配色配置。
 * 键名 = CSS 变量名去掉前缀 `--`，值 = 该变量的取值。
 * 暗色模式只需写与亮色不同的档位，其余自动沿用亮色。
 */
export interface ThemeConfig {
  palette: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  neutral: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

/** config.ts 的完整形状 */
export interface SiteThemeConfig {
  site: SiteConfig;
  footer: FooterConfig;
  analytics: AnalyticsConfig;
  social: SocialConfig;
  valine: ValineConfig;
  waline: WalineConfig;
  gitalk: GitalkConfig;
  giscus: GiscusConfig;
  utterances: UtterancesConfig;
  twikoo: TwikooConfig;
  disqus: DisqusConfig;
  friend: FriendConfig[];
  routes: RouteConfig[];
  copyright: CopyrightConfig;
  preloader: PreloaderConfig;
  sidebar: SidebarConfig;
  menu: MenuConfig[];
  banner: string;
  banner_srcset: BannerSrcSetConfig;
  covers: string[];
  firework: FireworkConfig;
  home_categories: HomeCategoriesConfig;
  widgets: string[];
  triangle_badge: TriangleBadgeConfig;
  outdate: OutdateConfig;
  share: string[];
  sponsor: SponsorConfig;
  theme: ThemeConfig;
}

import config from "../config";

// 类型标注而非 as 断言：config.ts 写错会在这里编译期报错
const typedConfig: SiteThemeConfig = config;

export const SITE = typedConfig.site;
export const FOOTER = typedConfig.footer;
export const ANALYTICS = typedConfig.analytics;
export const SOCIAL = typedConfig.social;
export const VALINE = typedConfig.valine;
export const WALINE = typedConfig.waline;
export const GITALK = typedConfig.gitalk;
export const GISCUS = typedConfig.giscus;
export const UTTERANCES = typedConfig.utterances;
export const TWIKOO = typedConfig.twikoo;
export const DISQUS = typedConfig.disqus;
export const FRIEND = typedConfig.friend;
export const ROUTES = typedConfig.routes;
export const COPYRIGHT = typedConfig.copyright;
export const PRELOADER = typedConfig.preloader;
export const SIDEBAR = typedConfig.sidebar;
export const WIDGETS = typedConfig.widgets;
export const MENU = typedConfig.menu;
export const BANNER = typedConfig.banner;
export const BANNER_SRCSET = typedConfig.banner_srcset;
export const COVERS = typedConfig.covers;
export const FIREWORK = typedConfig.firework;
export const HOME_CATEGORIES = typedConfig.home_categories;
export const TRIANGLE_BADGE = typedConfig.triangle_badge;
export const OUTDATE = typedConfig.outdate;
export const SHARE = typedConfig.share;
export const SPONSOR = typedConfig.sponsor;
export const THEME = typedConfig.theme;

let _BASE_URL = import.meta.env.BASE_URL;
// 规范化 BASE_URL：确保以 '/' 开头且不以 '/' 结尾
if (_BASE_URL.endsWith("/")) {
  _BASE_URL = _BASE_URL.slice(0, -1);
}
if (!_BASE_URL.startsWith("/")) {
  _BASE_URL = `/${_BASE_URL}`;
}
export const BASE_URL = _BASE_URL;

// 站点绝对地址（来自 astro.config.mjs 的 site）。
// 容错处理：若 site 未配置，这里返回空串而不是抛错。
const _SITE = import.meta.env.SITE;
export const SITE_URL = _SITE ? (_SITE.endsWith("/") ? _SITE.slice(0, -1) : _SITE) : "";
