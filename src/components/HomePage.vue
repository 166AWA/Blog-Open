<script setup lang="ts">
// ============================================================
// HomePage.vue — 主页主体组件（Vue 3 + <script setup>）
// 由 src/pages/index.astro 通过 client:load 挂载，数据经 props 传入
// 展示区：文章时间轴 —— 竖向轨道 + 仿文章页的斜切封面卡片
// 卡片：一端斜切图，另一端信息区（日期 / 标题 / 摘要）
// JS 触发器：mouseenter/mouseleave 切换 active 状态，
//           悬浮时文字高亮（标题变色 + 摘要加深 + 阅读提示浮现）
// 懒加载：IntersectionObserver 分批渲染（初始 5 篇，滚动触发 +5）
// ============================================================
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

interface PostItem {
  title: string;
  url: string;
  date: string;
  cover: string;
  /** 纯文本简介（可选）。有 excerptHtml 时优先用它 */
  excerpt?: string;
  /** 简介 HTML（支持 markdown，已跳过图片，由 utils/mdToExcerpt.ts 净化后生成） */
  excerptHtml?: string;
}

const props = defineProps<{
  posts: PostItem[];
}>();

// ---------- JS 触发器：悬浮高亮 ----------
const activeIndex = ref(-1);

// ---------- 时间轴分批渲染 ----------
const PAGE_SIZE = 5; // 每批加载数量
const visibleCount = ref(PAGE_SIZE);
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const visiblePosts = computed(() => props.posts.slice(0, visibleCount.value));
const allLoaded = computed(() => visibleCount.value >= props.posts.length);

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !allLoaded.value) {
        visibleCount.value += PAGE_SIZE;
      }
      // 全部加载完即停止观察，避免无效触发
      if (allLoaded.value && sentinel.value) {
        observer?.unobserve(sentinel.value);
      }
    },
    { rootMargin: "300px 0px" }, // 提前 300px 预加载，滚动更跟手
  );
  if (sentinel.value) observer.observe(sentinel.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section id="home-page" class="home-page" aria-label="主页内容">
    <!-- ============ 文章时间轴 ============ -->
    <div class="hp-timeline" data-aos="fade-up">
      <h2 class="hp-section-title">✦ 文章时间轴</h2>

      <p v-if="posts.length === 0" class="hp-empty">还没有文章喵~ 敬请期待！</p>

      <div v-else class="tl-track">
        <!-- 竖向渐变轨道（向下无限衍生的视觉） -->
        <div class="tl-line" aria-hidden="true"></div>

        <article
          v-for="(post, index) in visiblePosts"
          :key="post.url"
          class="tl-item"
          :class="index % 2 === 1 ? 'right' : 'left'"
          @mouseenter="activeIndex = index"
          @mouseleave="activeIndex = -1"
        >
          <span class="tl-dot" aria-hidden="true"></span>
          <span class="tl-year" aria-hidden="true">{{ post.date }}</span>
          <a
            class="tl-card"
            :class="{ active: activeIndex === index }"
            :href="post.url"
          >
            <!-- 图片端：封面铺满整卡（随机图，10分钟本地缓存） -->
            <div class="tl-cover">
              <img
                :src="post.cover"
                :alt="post.title"
                loading="lazy"
                decoding="async"
              />
            </div>
            <!-- 信息端：日期 / 标题 / 摘要（支持 markdown 语法，已跳过图片） -->
            <div class="tl-info">
              <span class="tl-date">{{ post.date }}</span>
              <h3 class="tl-title">{{ post.title }}</h3>
              <!-- 简介 HTML 可能含列表/引用等块级元素，用 div 承载避免 p 嵌套 p -->
              <div
                v-if="post.excerptHtml"
                class="tl-excerpt"
                v-html="post.excerptHtml"
              ></div>
              <div v-else-if="post.excerpt" class="tl-excerpt">{{ post.excerpt }}</div>
              <span class="tl-more">继续阅读 →</span>
            </div>
          </a>
        </article>

        <!-- 懒加载哨兵 -->
        <div ref="sentinel" class="tl-sentinel" aria-hidden="true"></div>
      </div>

      <p v-if="!allLoaded && posts.length > 0" class="tl-loading">✧ 往下翻，加载更多喵~</p>
      <p v-else-if="allLoaded && posts.length > 0" class="tl-end">— 到底了喵~，共 {{ posts.length }} 篇 —</p>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  width: 100%;
  padding: 8px 0 0;
}

/* ================= 时间轴 ================= */
/* 直边为主：不套白底大卡片，卡片直接铺在页面背景上 */
.hp-timeline {
  padding: 8px 0 8px;
}

.hp-section-title {
  margin: 0 0 24px;
  font-size: 20px;
  letter-spacing: 1px;
  color: var(--color-link, #c62a2a);
  text-align: center;
}

.hp-empty {
  margin: 8px 0;
  color: var(--grey-6, #888);
  font-size: 14px;
  text-align: center;
}

/* ---------- 轨道 ---------- */
.tl-track {
  position: relative;
}

/* 竖向渐变线：居中，向下渐隐制造“无限衍生”感 */
.tl-line {
  position: absolute;
  top: 8px;
  bottom: -40px;
  left: 50%;
  width: 3px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(to bottom, #ffb6c1 0%, #c9a7eb 60%, #a0d8f1 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 65%, transparent 100%);
}

/* ---------- 节点 ---------- */
/* 入场动画交给 GSAP(GsapEntrance)：左右列各自从对应方向滑入。
   这里不再用自带 tl-fade-up，避免与 GSAP 的 transform 冲突 */
.tl-item {
  position: relative;
  width: 50%;
  margin-bottom: 32px;
  will-change: transform, opacity;
}

.tl-item.right {
  margin-left: 50%;
}

/* 竖线上的圆点 */
.tl-dot {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb6c1, #c9a7eb);
  border: 3px solid var(--color-bg, #fff);
  box-shadow: 0 0 8px rgba(255, 154, 162, 0.55);
  z-index: 1;
}

.tl-item.left .tl-dot {
  right: -8px; /* 点在竖线中心 */
}

.tl-item.right .tl-dot {
  left: -8px;
}

/* ---------- 日期标注：卡片对侧空白区域 ---------- */
.tl-year {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--grey-6, #999);
  white-space: nowrap;
  pointer-events: none;
}

/* 左列卡片：日期在右侧空白区（靠近竖线） */
.tl-item.left .tl-year {
  left: 100%;
  padding-left: 28px;
}

/* 右列卡片：日期在左侧空白区（靠近竖线） */
.tl-item.right .tl-year {
  right: 100%;
  padding-right: 28px;
  text-align: right;
}

/* ---------- 卡片：图片铺满整卡，文字浮在反方向 ---------- */
.tl-card {
  position: relative;
  display: block;
  height: 240px;
  margin: 0 18px;
  overflow: hidden;
  background: var(--color-wrap, #fff);
  border-radius: 12px; /* 圆角收敛在卡片整体，内里以斜边/直边为主 */
  text-decoration: none;
  box-shadow: var(--shadow-card, none);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* JS 触发器的 active 状态：上浮 + 阴影加深 */
.tl-card.active,
.tl-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover, none);
}

.tl-card:focus-visible {
  outline: 2px solid rgba(255, 154, 162, 0.7);
  outline-offset: 2px;
}

/* ---------- 图片端：封面图铺满整卡（简单可靠） ---------- */
.tl-cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.tl-cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 覆盖暗色主题全局 img brightness(70%)，保证封面主视觉清晰 */
  filter: brightness(1);
  /* 直角铺满，无斜边/遮罩，让 border-radius 自然收边 */
  transition: transform 0.5s ease;
  will-change: transform;
}

/* active / 键盘聚焦：轻微放大 */
.tl-card.active .tl-cover img,
.tl-card:focus-visible .tl-cover img {
  transform: scale(1.06);
}

/* ---------- 信息端：文字在图片反方向（左图→右端，右图→左端） ---------- */
.tl-info {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 54%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 22px 26px;
}

/* 左图→文字靠右端：从右向左渐变（右端实色，左端透明） */
.tl-item.left .tl-info {
  right: 0;
  text-align: left;
  background: linear-gradient(
    to left,
    var(--color-wrap, #fff) 90%,
    transparent
  );
  background: linear-gradient(
    to left,
    color-mix(in srgb, var(--color-wrap, #fff) 90%, transparent),
    transparent
  );
}

/* 右图→文字靠左端：从左向右渐变（左端实色，右端透明） */
.tl-item.right .tl-info {
  left: 0;
  text-align: left;
  background: linear-gradient(
    to right,
    var(--color-wrap, #fff) 90%,
    transparent
  );
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--color-wrap, #fff) 90%, transparent),
    transparent
  );
}

.tl-date {
  font-size: 12px;
  letter-spacing: 1px;
  color: #d4608c;
  margin-bottom: 8px;
}

.tl-title {
  /* 高对比标题色：亮色=近黑，暗色=近白，不依赖浅灰变量 */
  --tl-title-color: #111;
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--tl-title-color);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  transition: color 0.3s ease;
}

/* 暗色主题：标题用近白 */
:global([data-theme="dark"] .tl-title) {
  --tl-title-color: #f2f2f2;
}

/* JS 触发器的文字高亮：标题变主题色 */
.tl-card.active .tl-title,
.tl-card:focus-visible .tl-title {
  color: var(--red-1, #07bdff);
}

.tl-excerpt {
  /* 高对比描述色：亮色=深灰，暗色=浅灰 */
  --tl-desc-color: #333;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--tl-desc-color);
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.3s ease;

  /* markdown 渲染内容：链接/粗体/行内元素跟随简介色 */
  a {
    color: var(--red-1, #07bdff);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  strong,
  b {
    color: var(--tl-desc-color);
    font-weight: 700;
  }

  code {
    font-size: 12px;
    background: var(--color-wrap, #f5f5f5);
    padding: 0 4px;
    border-radius: 4px;
  }

  img {
    display: none; /* 简介内不应出现图片 */
  }

  p {
    margin: 0;
    display: inline;
  }

  /* 隐藏空段落（图片被跳过后的占位） */
  p:empty {
    display: none;
  }
}

/* 暗色主题：描述用浅灰（提高深底对比度） */
:global([data-theme="dark"] .tl-excerpt) {
  --tl-desc-color: #d0d0d0;
}

/* JS 触发的文字高亮：摘要加粗加深 */
.tl-card.active .tl-excerpt,
.tl-card:focus-visible .tl-excerpt {
  color: var(--tl-desc-color);
  font-weight: 600;
}

/* 阅读提示：悬浮时从左滑入 */
.tl-more {
  margin-top: auto;
  align-self: flex-start;
  font-size: 12px;
  letter-spacing: 1px;
  color: #d4608c;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tl-card.active .tl-more,
.tl-card:focus-visible .tl-more {
  opacity: 1;
  transform: translateX(0);
}

/* ---------- 懒加载状态 ---------- */
.tl-sentinel {
  height: 1px;
}

.tl-loading,
.tl-end {
  margin: 18px 0 10px;
  font-size: 13px;
  color: var(--grey-6, #888);
  text-align: center;
  letter-spacing: 1px;
}

/* ---------- 入场动画（懒加载新增项也会播放） ---------- */
@keyframes tl-fade-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- 减弱动效偏好：关闭动画与过渡 ---------- */
@media (prefers-reduced-motion: reduce) {
  .tl-item {
    animation: none;
  }

  .tl-card {
    transform: none !important; /* 连悬浮位移一起禁掉 */
  }

  .tl-cover img {
    transform: none !important; /* 悬浮缩放也禁掉 */
  }

  .tl-card,
  .tl-cover img,
  .tl-title,
  .tl-excerpt,
  .tl-more {
    transition: none;
  }
}

/* ---------- 移动端：竖线靠左，单列 ---------- */
@media screen and (max-width: 767px) {
  .hp-timeline {
    padding: 8px 0;
  }

  .tl-line {
    left: 14px;
    transform: none;
  }

  .tl-item,
  .tl-item.right {
    width: 100%;
    margin-left: 0;
    padding-left: 32px;
  }

  .tl-item.left .tl-dot,
  .tl-item.right .tl-dot {
    left: 6px;
    right: auto;
  }

  /* 移动端：隐藏空白区日期标注（卡片内已含日期） */
  .tl-year {
    display: none;
  }

  .tl-card {
    margin: 0;
    height: 180px;
  }

  .tl-info {
    width: 62%;
    padding: 14px 16px 12px;
  }

  .tl-excerpt {
    -webkit-line-clamp: 1;
  }
}
</style>
