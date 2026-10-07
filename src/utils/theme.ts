// ============================================================
// theme.ts — 把 config.ts 里的配色编译成 CSS 变量
//
// 为什么要有这个文件：
//   主题的样式分散在 30 多个组件的 <style> 里，它们统一通过 CSS 变量取色。
//   变量的"值"集中放在 config.ts 的 theme 段，这里负责把它渲染成
//   `:root { ... }` 与 `[data-theme="dark"] { ... }` 两段 CSS，
//   由 BaseLayout 注入到 <head>。
//
// 想换配色 → 只改 config.ts 的 theme，不要来这里。
// ============================================================
import { THEME } from "./config";

/**
 * 与配色无关、或由上面两组变量派生的结构性别名。
 * 这些不需要用户配置，所以写死在这里。
 */
const DERIVED_VARS = [
  "--grey-7: var(--color-default)",
  "--color-border: var(--red-3)",
  "--color-link: var(--red-1)",
  "--color-h2-after: var(--red-1)",
  "--shadow-meta: 0 0 5px 2px var(--color-meta-shadow)",
  "--shadow-meta-hover: 0 0 6px 4px var(--color-meta-shadow)",
  "--shadow-card: 0 0 10px 2px var(--color-hover-shadow)",
  "--shadow-card-hover: 0 0 10px 4px var(--color-hover-shadow)",
  "--shadow-red-6-shadow: 0 0 8px var(--color-red-6-shadow)",
];

const DARK_DERIVED_VARS = ["--color-meta-shadow: rgba(0, 0, 0, 0.2)"];

function declarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");
}

/**
 * 生成主题 CSS 变量声明。
 * @returns 可直接放进 <style> 的 CSS 文本
 */
export function buildThemeCss(): string {
  const theme = THEME;

  const lightVars = {
    ...theme.palette.light,
    ...theme.neutral.light,
  };
  const darkVars = {
    ...theme.palette.dark,
    ...theme.neutral.dark,
  };

  return [
    ":root {",
    declarations(lightVars),
    ...DERIVED_VARS.map((v) => `  ${v};`),
    "}",
    "",
    '[data-theme="dark"]:root {',
    declarations(darkVars),
    ...DARK_DERIVED_VARS.map((v) => `  ${v};`),
    "}",
    "",
    '[data-theme="dark"] img {',
    "  filter: brightness(70%);",
    "}",
  ].join("\n");
}
