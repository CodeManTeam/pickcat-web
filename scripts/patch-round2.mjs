// 第二轮调整：删除 Oldsquaw 合作专区 / 板块图标复用原 UI 素材 / 增加返回按钮
import { readFileSync, writeFileSync } from 'node:fs';

const appFile = 'web/app.js';
let src = readFileSync(appFile, 'utf8');
const before = src.length;

function cut(startMarker, endMarker, replacement, label) {
  const start = src.indexOf(startMarker);
  if (start === -1) throw new Error('定位失败(起始): ' + label);
  const end = src.indexOf(endMarker, start);
  if (end === -1) throw new Error('定位失败(结束): ' + label);
  src = src.slice(0, start) + replacement + src.slice(end);
  console.log('patched:', label);
}

function swap(from, to, label) {
  if (!src.includes(from)) throw new Error('定位失败: ' + label);
  src = src.replace(from, to);
  console.log('patched:', label);
}

// 1) 首页「发现」不再插入 Oldsquaw 合作专区
swap(
  `    const nodes = [createOldsquawSpotlight("Oldsquaw 工具可打开更多作品", "发现页会优先展示作品，合作工具用于后续编辑、控件制作和再创作。")];
    nodes.push(...(state.discoverWorks.length`,
  `    const nodes = [];
    nodes.push(...(state.discoverWorks.length`,
  'discover feed spotlight',
);

// 2) 喵圈不再渲染合作专区
swap(
  `  const oldsquawZone = $("[data-oldsquaw-zone]");
  if (oldsquawZone) {
    oldsquawZone.replaceChildren(
      createOldsquawSpotlight("Oldsquaw 合作专区", "AI 控件、CoCo 魔改、Nemo 拓展和 KittenN 镜像会作为 Pickcat 创作生态的一部分继续合并。")
    );
  }`,
  `  const oldsquawZone = $("[data-oldsquaw-zone]");
  if (oldsquawZone) oldsquawZone.replaceChildren();`,
  'circle spotlight',
);

// 3) 作品页编辑入口去掉 Oldsquaw 系列（本地包未随仓库打包）
cut(
  'function editorEntries(work = {}) {',
  'function setNativePlayerMode(active) {',
  `function editorEntries(work = {}) {
  const meta = engineMeta(work, work.id);
  return [
    { label: \`\${meta.label} 播放器\`, url: work.playerUrls?.[0] || meta.workUrl || "", disabled: !(work.playerUrls?.[0] || meta.workUrl) },
    { label: \`\${meta.label} 主页\`, url: meta.homeUrl || "", disabled: !meta.homeUrl },
    { label: "分享页", url: work.shareUrl || "", disabled: !work.shareUrl },
    { label: "PICKCAT 原站", url: work.originalUrl || "", disabled: !work.originalUrl }
  ];
}

`,
  'editorEntries',
);

// 4) 板块图标：用原 UI 素材按 slug 稳定分配，不再千篇一律同一个猫头
swap(
  `    icon: circleIconMap[String(board.id)] || board.icon_url || ASSETS.prefecture,`,
  `    icon: circleIconMap[String(board.id)] || board.icon_url || boardIconFor(String(board.id)),`,
  'normalizeBoard icon',
);

swap(
  `function normalizeBoard(board, index) {`,
  `const BOARD_ICON_POOL = [
  "public/assets/pickcat/ic_item_join_prefecture_logo.png",
  "public/assets/pickcat/ic_prefecture_flag.png",
  "public/assets/pickcat/ic_home_posts_play.png",
  "public/assets/pickcat/item_search_views.png",
  "public/assets/pickcat/ic_home_rec_pick.png",
  "public/assets/pickcat/ic_view.png",
  "public/assets/pickcat/box.png",
  "public/assets/pickcat/ic_collect.png"
];

/** 官方板块只有 tag slug，没有配图，这里用原 UI 素材稳定映射 */
function boardIconFor(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) % 9973;
  const fixed = {
    "interest-plaza": "public/assets/pickcat/ic_item_join_prefecture_logo.png",
    creation: "public/assets/pickcat/ic_home_posts_play.png",
    chat: "public/assets/pickcat/ic_prefecture_flag.png",
    tutorial: "public/assets/pickcat/item_search_views.png"
  };
  return fixed[slug] || BOARD_ICON_POOL[hash % BOARD_ICON_POOL.length];
}

function normalizeBoard(board, index) {`,
  'boardIconFor',
);

// 5) 返回按钮：stacked 视图显示，点击复用 nativeBack()
swap(
  `    $(".bottom-nav")?.classList.toggle("hidden", isSecondaryView(view));`,
  `    $(".bottom-nav")?.classList.toggle("hidden", isSecondaryView(view));
    document.body.classList.toggle("show-back-btn", ["detail", "work", "user", "tool", "login", "publish"].includes(view));`,
  'setView back button',
);

swap(
  `  $("[data-search]").addEventListener("click", () => navigateLocal("search"));`,
  `  $("[data-view-back]")?.addEventListener("click", () => nativeBack());
  $("[data-search]").addEventListener("click", () => navigateLocal("search"));`,
  'bind back button',
);

writeFileSync(appFile, src, 'utf8');
console.log('app.js:', before, '->', src.length);
