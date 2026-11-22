const ASSETS = {
  codeIsland: "public/assets/img_enter_code_island.png",
  elf: "public/assets/img_enter_elf.png",
  library: "public/assets/img_enter_library.png",
  logo: "public/assets/pickcat/ic_home_logo.png",
  appLogo: "public/assets/pickcat/icon_about_main_logo.png",
  view: "public/assets/pickcat/ic_view.png",
  comment: "public/assets/pickcat/ic_comment_normal.png",
  homeComment: "public/assets/pickcat/ic_home_comment.png",
  recreate: "public/assets/pickcat/ic_home_recreate.png",
  share: "public/assets/pickcat/ic_home_share.png",
  pick: "public/assets/pickcat/ic_collect.png",
  prefecture: "public/assets/pickcat/ic_item_join_prefecture_logo.png",
  search: "public/assets/pickcat/ic_search.png",
  searchEmpty: "public/assets/pickcat/ic_empty_search.png",
  photo: "public/assets/pickcat/ic_photo.png",
  video: "public/assets/pickcat/ic_video.png",
  nemo: "public/assets/pickcat/nemo.png",
  kitten: "public/assets/pickcat/kitten.png",
  moreMenu: "public/assets/pickcat/ic_more_mine_black.png",
  settings: "public/assets/pickcat/imoji_menu_settings.png",
  kn: "public/assets/pickcat/kn.png",
  cocoPro: "public/assets/pickcat/cocopro.png",
  betterNemo: "public/assets/pickcat/betternemo.png",
};

const apiConfig = {
  codemao: location.protocol === "file:" ? "https://api.codemao.cn" : "/proxy/codemao",
  creation: location.protocol === "file:" ? "https://api-creation.codemao.cn" : "/proxy/creation",
  openService: location.protocol === "file:" ? "https://open-service.codemao.cn" : "/proxy/open-service",
  pid: "65edCTyg"
};

const feedPageSize = 8;
const userListPreviewSize = 6;
const stackedViews = new Set(["search", "publish", "detail", "work", "user", "tool", "login"]);

const oldsquawLinks = {
  org: "https://gitee.com/oldsquaw",
  website: "https://oldsquaw.rth1.xyz/",
  betterNemo: "https://gitee.com/oldsquaw/better-nemo",
  cocoPro: "https://gitee.com/oldsquaw/coco",
  kn: "https://gitee.com/oldsquaw/kn-oldsquaw",
  widgetEditor: "https://gitee.com/oldsquaw/oldsquaw-widget-editor"
};

const communityToolLinks = {
  betterNemoPc: "https://github.com/HHCL233/BetterNemoPC"
};

const oldsquawTools = [
  {
    id: "better-nemo",
    name: "BetterNemo",
    tag: "本地 Workspace",
    desc: "已随 Pickcat 打包 BetterNemo 工作区、扩展、主题和加载器资源，直接在软件内启动。",
    url: "public/tools/oldsquaw/better-nemo/index.html",
    fallbackUrl: oldsquawLinks.betterNemo,
    updateUrl: oldsquawLinks.betterNemo,
    icon: ASSETS.betterNemo,
    tone: "blue",
    integration: "local-static",
    layout: "workspace"
  },
  {
    id: "coco-pro",
    name: "CoCo Pro",
    tag: "本地部署",
    desc: "已随 Pickcat 打包 CoCo-Oldsquaw 静态站，直接在软件内启动编辑器。",
    url: "public/tools/oldsquaw/coco/index.html",
    fallbackUrl: oldsquawLinks.cocoPro,
    updateUrl: oldsquawLinks.cocoPro,
    icon: ASSETS.cocoPro,
    tone: "green",
    integration: "local-static"
  },
  {
    id: "kn-oldsquaw",
    name: "KN-Oldsquaw",
    tag: "本地单页",
    desc: "已内置 KN-Oldsquaw 静态入口，用本地 HTML 承接 KittenN 镜像体验。",
    url: "public/tools/oldsquaw/kn/1.0.2.html",
    fallbackUrl: oldsquawLinks.kn,
    updateUrl: oldsquawLinks.kn,
    icon: ASSETS.kn,
    tone: "yellow",
    integration: "local-static"
  },
  {
    id: "widget-editor",
    name: "控件编辑器",
    tag: "本地单页",
    desc: "已内置 Oldsquaw Widget Editor，面向 CoCo 自定义控件编辑。",
    url: "public/tools/oldsquaw/widget-editor/1.0.0.html",
    fallbackUrl: oldsquawLinks.widgetEditor,
    updateUrl: oldsquawLinks.widgetEditor,
    icon: ASSETS.photo,
    tone: "pink",
    integration: "local-static"
  }
];

const toolRegistry = {
  nemo: {
    id: "nemo",
    name: "Nemo",
    tag: "官方创作",
    desc: "在 Pickcat 内打开 Nemo 创作环境。",
    url: "https://nemo.codemao.cn/",
    fallbackUrl: "https://nemo.codemao.cn/",
    icon: ASSETS.nemo,
    tone: "blue"
  },
  kitten: {
    id: "kitten",
    name: "Kitten",
    tag: "官方创作",
    desc: "在 Pickcat 内打开 Kitten 编辑器。",
    url: "https://kitten4.codemao.cn/",
    fallbackUrl: "https://kitten4.codemao.cn/",
    icon: ASSETS.kitten,
    tone: "green"
  },
  kn: {
    id: "kn",
    name: "KittenN",
    tag: "官方创作",
    desc: "在 Pickcat 内打开 KittenN 创作环境。",
    url: "https://kn.codemao.cn/",
    fallbackUrl: "https://kn.codemao.cn/",
    icon: ASSETS.kn,
    tone: "yellow"
  },
  "better-nemo-pc": {
    id: "better-nemo-pc",
    name: "BetterNemoPC",
    tag: "本地 Workspace",
    desc: "接入 HHCL233 的 BetterNemoPC 网页适配版，保留首页、作品页和 BN 工作区入口。",
    url: "public/tools/hhcl233/better-nemo-pc/index.html",
    fallbackUrl: communityToolLinks.betterNemoPc,
    updateUrl: communityToolLinks.betterNemoPc,
    icon: ASSETS.betterNemo,
    tone: "blue",
    integration: "local-static",
    layout: "workspace"
  },
  ...Object.fromEntries(oldsquawTools.map((tool) => [tool.id, tool]))
};

const circleIconMap = {
  "3": ASSETS.codeIsland,
  "26": ASSETS.elf,
  "6": ASSETS.library
};

const boardMeta = {
  "3": {
    name: "神奇代码岛",
    desc: "3D 可视化编程与代码岛作品交流",
    site: "https://dao3.fun/"
  },
  "26": {
    name: "源码精灵",
    desc: "源码、素材、工具和项目拆解讨论",
    site: "https://shequ.codemao.cn/community"
  },
  "6": {
    name: "图书馆",
    desc: "教程、资料和长期沉淀内容",
    site: "https://shequ.codemao.cn/community"
  }
};

const fallbackBoards = [
  { id: "3", name: "神奇代码岛", description: "3D 可视化编程与代码岛作品交流", icon_url: ASSETS.codeIsland, n_posts: 0 },
  { id: "26", name: "源码精灵", description: "源码、素材和工具讨论", icon_url: ASSETS.elf, n_posts: 0 },
  { id: "6", name: "图书馆", description: "教程与资料沉淀", icon_url: ASSETS.library, n_posts: 0 },
  { id: "17", name: "热门活动", description: "Pickcat 残留截图所在板块", icon_url: ASSETS.prefecture, n_posts: 0 }
];

const state = {
  currentView: "home",
  previousView: "home",
  feedTab: "recommend",
  posts: [],
  allBoards: [],
  boards: [],
  boardPages: {},
  boardExhausted: {},
  homeLoaded: false,
  feedLoading: false,
  feedDone: false,
  discoverWorks: [],
  discoverLoaded: false,
  discoverLoading: false,
  discoverOffset: 0,
  discoverDone: false,
  recommendedUsers: [],
  mineTab: "activity",
  mineWorks: [],
  activeWorkId: "",
  activeUserId: "",
  activePostId: "",
  activeToolId: "",
  pendingPostReplyId: "",
  pendingWorkCommentId: "",
  activeCircleBoardId: "",
  circleBoardPage: 1,
  circleBoardDone: false,
  circleBoardLoading: false,
  circleBoardPosts: [],
  circleObserver: null,
  followingUsers: [],
  followingPosts: [],
  followingLoaded: false,
  followingLoading: false,
  followingDynamicOffset: 0,
  followingDynamicDone: false,
  followingNames: [],
  followingNameOffset: 0,
  followingDone: false,
  mineFollowers: [],
  mineFollowingUsers: [],
  mineFollowerOffset: 0,
  mineFollowingOffset: 0,
  user: JSON.parse(localStorage.getItem("pickcat:user") || "null"),
  auth: JSON.parse(localStorage.getItem("pickcat:auth") || "null"),
  savedLogin: JSON.parse(localStorage.getItem("pickcat:login") || "null"),
  lastScrollY: 0,
  topbarCollapsed: false,
  history: ["Pickcat", "新社区初代体验团", "源码精灵"],
  viewTransitionTimer: 0,
  msgTab: "all",
  msgCursor: null,
  mossSso: "",
  mossSsoMessage: ""
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function isNativeWrapper() {
  return Boolean(window.PickcatAndroid);
}

function applyRuntimeShellMode() {
  const nativeWrapper = isNativeWrapper();
  document.body.classList.toggle("native-wrapper", nativeWrapper);
  document.documentElement.style.setProperty("--shell-width", nativeWrapper ? "100vw" : "min(100vw, 430px)");
  document.documentElement.style.setProperty("--shell-inset-y", nativeWrapper ? "0px" : "");
}

function isSecondaryView(view = state.currentView) {
  return ["search", "publish", "detail", "work", "user", "tool", "login"].includes(view);
}

function isTextEntryTarget(target) {
  return Boolean(
    target instanceof HTMLElement &&
      (target.matches("textarea, [contenteditable='true'], [contenteditable=''], input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']):not([type='range']):not([type='file']):not([type='color'])") ||
        target.isContentEditable)
  );
}

function setKeyboardOpen(open) {
  document.body.classList.toggle("keyboard-open", Boolean(open));
}

function syncPlayerAuth() {
  try {
    if (!window.PickcatAndroid?.syncPlayerAuth || !state.auth) return;
    window.PickcatAndroid.syncPlayerAuth(state.auth.token || "", state.auth.cookie || "");
  } catch {
    // Native cookie sync is best-effort.
  }
}

function saveSessionToStorage(remember = true) {
  if (!state.user || !state.auth) return;
  if (remember) {
    localStorage.setItem("pickcat:user", JSON.stringify(state.user));
    localStorage.setItem("pickcat:auth", JSON.stringify(state.auth));
  } else {
    localStorage.removeItem("pickcat:user");
    localStorage.removeItem("pickcat:auth");
  }
  const payload = {
    user: state.user,
    auth: state.auth,
    login: state.savedLogin,
    savedAt: Date.now()
  };
  if (remember && window.PickcatAndroid?.saveLogin) {
    window.PickcatAndroid.saveLogin(JSON.stringify(payload));
  }
}

function clearSavedSession() {
  localStorage.removeItem("pickcat:user");
  localStorage.removeItem("pickcat:auth");
  if (window.PickcatAndroid?.clearLogin) {
    window.PickcatAndroid.clearLogin();
  }
}

function hydrateNativeSession() {
  if (state.auth?.token || !window.PickcatAndroid?.readLogin) return;
  try {
    const text = window.PickcatAndroid.readLogin();
    if (!text) return;
    const payload = JSON.parse(text);
    if (!payload?.auth || !payload?.user) return;
    state.user = payload.user;
    state.auth = payload.auth;
    state.savedLogin = payload.login || state.savedLogin;
    localStorage.setItem("pickcat:user", JSON.stringify(state.user));
    localStorage.setItem("pickcat:auth", JSON.stringify(state.auth));
    if (state.savedLogin) localStorage.setItem("pickcat:login", JSON.stringify(state.savedLogin));
    syncPlayerAuth();
  } catch {
    clearSavedSession();
  }
}

function hydrateLoginForm() {
  const form = $("[data-login-form]");
  if (!form) return;
  const identity = form.elements.identity;
  const remember = form.elements.remember;
  if (identity && state.savedLogin?.identity) identity.value = state.savedLogin.identity;
  if (remember) remember.checked = state.savedLogin?.remember !== false;
}

function runTransition(update) {
  update();
}

function cleanupViewTransitionClasses() {
  $$(".view").forEach((section) => {
    section.classList.remove(
      "active",
      "view-enter-forward",
      "view-enter-back",
      "view-exit-forward",
      "view-exit-back",
      "view-enter-active",
      "view-exit-active"
    );
  });
}

function animateViewChange(fromView, toView, { direction = "none", immediate = false } = {}) {
  const next = $(`.view[data-view="${toView}"]`);
  const current = fromView ? $(`.view[data-view="${fromView}"]`) : null;
  clearTimeout(state.viewTransitionTimer);

  if (!next) return;
  if (immediate || !current || current === next || direction === "none") {
    cleanupViewTransitionClasses();
    next.classList.add("active");
    return;
  }

  cleanupViewTransitionClasses();
  current.classList.add("active", `view-exit-${direction}`);
  next.classList.add("active", `view-enter-${direction}`);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      current.classList.add("view-exit-active");
      next.classList.add("view-enter-active");
    });
  });
  state.viewTransitionTimer = window.setTimeout(() => {
    cleanupViewTransitionClasses();
    next.classList.add("active");
  }, 260);
}

function resolveViewDirection(fromView, toView, preferred = "") {
  if (preferred) return preferred;
  const fromStacked = stackedViews.has(fromView);
  const toStacked = stackedViews.has(toView);
  if (!fromStacked && toStacked) return "forward";
  if (fromStacked && !toStacked) return "back";
  if (fromStacked && toStacked) return "forward";
  return "none";
}

function authHeaders() {
  const headers = {};
  if (state.auth?.token) headers["x-codemao-token"] = state.auth.token;
  if (state.auth?.cookie) headers["x-codemao-cookie"] = state.auth.cookie;
  return headers;
}

async function request(base, path, { method = "GET", params, body, auth = false, headers = {}, raw = false } = {}) {
  const url = new URL(`${base}${path}`, location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  let response;
  try {
    response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        ...(auth ? authHeaders() : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error(data?.error_message || data?.msg || `${path} ${response.status}`);
    }
    return raw ? { data, response } : data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`${path} 请求超时`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const api = window.PickcatOfficialApi;

function stripHtml(html = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent.replace(/\s+/g, " ").trim();
}

function proxyMediaUrl(value = "") {
  if (!value) return "";
  try {
    const target = new URL(value, location.origin);
    if (!/^https?:$/.test(target.protocol)) return value;
    if (target.origin === location.origin) return target.toString();
    const host = target.hostname.toLowerCase();
    const shouldProxy =
      host.endsWith(".codemao.cn") ||
      host === "codemao.cn" ||
      host.endsWith(".bcmcdn.com") ||
      host === "bcmcdn.com";
    if (!shouldProxy) return target.toString();
    return `${location.origin}/proxy/media?url=${encodeURIComponent(target.toString())}`;
  } catch {
    return value;
  }
}

function extractImages(html = "") {
  return [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((match) => proxyMediaUrl(match[1]));
}

function sanitizeHtml(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, style, iframe").forEach((node) => node.remove());
  doc.body.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.toLowerCase();
      if (name.startsWith("on") || value.startsWith("javascript:")) node.removeAttribute(attribute.name);
    });
  });
  doc.body.querySelectorAll("img[src]").forEach((node) => {
    const original = node.getAttribute("src") || "";
    node.setAttribute("data-origin-src", original);
    node.setAttribute("src", proxyMediaUrl(original));
  });
  return doc.body.innerHTML;
}

function escapeHtml(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function restoreMaskedWords(text = "") {
  const source = String(text);
  if (!source.includes("喵")) return source;
  return source
    .replace(/喵喵看/g, "喵喵看")
    .replace(/喵圈/g, "喵圈")
    .replace(/傻\s*喵/gi, "sb")
    .replace(/煞\s*喵/gi, "sb")
    .replace(/你\s*喵/gi, "nm")
    .replace(/尼\s*喵/gi, "nm")
    .replace(/草\s*喵/gi, "cs")
    .replace(/艹\s*喵/gi, "cs")
    .replace(/(?<!喵)喵(?!喵|看|圈|星|娘|咪|叫|窝|爪|粮)/g, "sb");
}

function apiText(text = "") {
  return restoreMaskedWords(stripHtml(text));
}

function cleanBoardText(text = "", fallback = "") {
  const value = apiText(text).replace(/[?？]{3,}/g, "").trim();
  return value || fallback;
}

function formatDate(seconds) {
  if (!seconds) return "未知";
  const date = new Date(seconds * 1000);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function avatarText(name = "皮") {
  return [...name][0] || "皮";
}

function compactNumber(value = 0) {
  const number = Number(value) || 0;
  if (number >= 10000) return `${(number / 10000).toFixed(1)}万`;
  return String(number);
}

function normalizePost(item) {
  const text = apiText(item.content || "");
  const pickCount = item.n_likes || item.n_collects || item.n_picks || (item.is_featured ? 1 : 0);
  const work = extractWork(item);
  return {
    id: String(item.id),
    author: item.user?.nickname || "不存在的用户",
    authorId: item.user?.id || item.user_id || "",
    avatarText: avatarText(item.user?.nickname),
    avatarUrl: proxyMediaUrl(item.user?.avatar_url || ""),
    time: formatDate(item.created_at),
    title: item.title || "无标题",
    body: text.slice(0, 150),
    circle: item.board_name || "PICKCAT 论坛",
    stats: [item.n_views || 0, item.n_replies || item.n_comments || 0, item.n_likes ?? pickCount, item.n_collects ?? 0],
    createdAt: item.created_at || 0,
    isPinned: Boolean(item.is_pinned),
    isAuthorized: Boolean(item.is_authorized),
    images: extractImages(item.content || ""),
    work
  };
}

function extractWork(item) {
  const html = item.content || "";
  const text = stripHtml(html);
  const urlMatch = text.match(/work\/(\d+)/) || html.match(/work\/(\d+)/);
  const id = item.work_id || item.work?.id || urlMatch?.[1];
  if (!id) return null;
  return {
    id: String(id),
    name: item.work?.work_name || item.work_name || item.title || "作品预览",
    preview: item.work?.preview || item.preview || item.cover || item.cover_url || "",
    description: item.work?.description || ""
  };
}

function isKittenNWork(work = {}) {
  const type = String(work.type || work.ide_type || work.work_type || work.ideType || "").toUpperCase();
  return ["NEKO", "KITTENN", "KN"].includes(type) || Number(work.type) === 18;
}

function workEngine(work = {}) {
  const type = String(work.type || work.ide_type || work.work_type || work.ideType || "").toUpperCase();
  const player = String(work.player_url || work.playerUrl || work.player_url_v2 || work.playerUrlV2 || "");
  if (type.includes("MOSS") || player.includes("moss.pickcat")) return "moss";
  if (isKittenNWork(work)) return "kittenN";
  if (type.includes("NEMO") || Number(work.type) === 8 || player.includes("nemo.codemao.cn")) return "nemo";
  if (type.includes("WOOD") || type.includes("TURTLE") || type.includes("PYTHON") || Number(work.type) === 3) return "turtle";
  if (type.includes("KITTEN3") || type.includes("KITTEN2")) return "kitten3";
  if (type.includes("KITTEN4") || type.includes("KITTEN")) return "kitten4";
  return "kitten4";
}

function uniqueUrls(urls = []) {
  const seen = new Set();
  return urls.filter((url) => {
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

function inferPlayerUrl(work = {}, id = "") {
  if (work.player_url || work.playerUrl) return work.player_url || work.playerUrl;
  if (work.player_url_v2 || work.playerUrlV2) return work.player_url_v2 || work.playerUrlV2;
  if (!id) return "";
  const engine = workEngine(work);
  if (engine === "kittenN") return `https://kn.codemao.cn/player?workId=${id}`;
  if (engine === "nemo") return `https://nemo.codemao.cn/w/${id}`;
  if (engine === "turtle") return `https://turtle.codemao.cn/?entry=sharing&channel_type=community&action=open_published_project&work_id=${id}`;
  if (engine === "kitten3") return `https://player.codemao.cn/old/${id}`;
  return `https://player.codemao.cn/new/${id}`;
}

/** MOSS 会话：调用 /moss/sso 用 PICKCAT 会话换 MOSS Cookie（同站反代后 iframe 才拿得到） */
async function ensureMossSession() {
  if (state.mossSso === "ok") return true;
  try {
    const res = await fetch("/moss/sso", { headers: { Accept: "application/json" } });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      state.mossSso = "ok";
      return true;
    }
    state.mossSso = "fail";
    state.mossSsoMessage = data.message || "MOSS 单点登录未完成，请先登录 PICKCAT";
    return false;
  } catch (err) {
    state.mossSso = "fail";
    state.mossSsoMessage = err.message;
    return false;
  }
}
function engineMeta(work = {}, id = "") {
  const engine = workEngine(work);
  const metas = {
    moss: {
      code: "moss",
      label: "MOSS",
      startLabel: "用 MOSS 播放",
      hint: "MOSS 作品由 PICKCAT 官方播放器托管",
      homeUrl: "https://moss.pickcat.dao3.fun/",
      workUrl: id ? `https://pickcat.dao3.fun/works/${id}` : "https://pickcat.dao3.fun/"
    },
    nemo: {
      code: "nemo",
      label: "Nemo",
      startLabel: "用 Nemo 播放",
      hint: "适合积木与社区移动作品",
      homeUrl: "https://nemo.codemao.cn/",
      workUrl: id ? `https://nemo.codemao.cn/w/${id}` : "https://nemo.codemao.cn/"
    },
    kittenN: {
      code: "kittenN",
      label: "KittenN",
      startLabel: "用 KittenN 播放",
      hint: "优先尝试 KittenN 官方播放器",
      homeUrl: "https://kn.codemao.cn/",
      workUrl: id ? `https://kn.codemao.cn/player?workId=${id}` : "https://kn.codemao.cn/"
    },
    kitten3: {
      code: "kitten3",
      label: "Kitten",
      startLabel: "用旧版播放器打开",
      hint: "旧版 Kitten 作品兼容性较弱",
      homeUrl: "https://kitten4.codemao.cn/",
      workUrl: id ? `https://player.codemao.cn/old/${id}` : "https://kitten4.codemao.cn/"
    },
    kitten4: {
      code: "kitten4",
      label: "Kitten",
      startLabel: "用 Kitten 播放",
      hint: "在 PICKCAT 官方播放器中打开",
      homeUrl: "https://kitten4.codemao.cn/",
      workUrl: id ? `https://player.codemao.cn/new/${id}` : "https://kitten4.codemao.cn/"
    },
    turtle: {
      code: "turtle",
      label: "海龟",
      startLabel: "尝试海龟播放器",
      hint: "海龟作品在网页端兼容性有限",
      homeUrl: "",
      workUrl: id ? `https://turtle.codemao.cn/?entry=sharing&channel_type=community&action=open_published_project&work_id=${id}` : ""
    }
  };
  return metas[engine] || metas.kitten4;
}

function editorEntries(work = {}) {
  const meta = engineMeta(work, work.id);
  return [
    { label: `${meta.label} 播放器`, url: work.playerUrls?.[0] || meta.workUrl || "", disabled: !(work.playerUrls?.[0] || meta.workUrl) },
    { label: `${meta.label} 主页`, url: meta.homeUrl || "", disabled: !meta.homeUrl },
    { label: "分享页", url: work.shareUrl || "", disabled: !work.shareUrl },
    { label: "PICKCAT 原站", url: work.originalUrl || "", disabled: !work.originalUrl }
  ];
}

function setNativePlayerMode(active) {
  if (active) syncPlayerAuth();
  setKeyboardOpen(false);
  try {
    window.PickcatAndroid?.setPlayerLandscape?.(Boolean(active));
  } catch {
    // Native bridge is only available inside the Android wrapper.
  }
  document.body.classList.toggle("player-landscape", Boolean(active));
  const stage = $("[data-player-stage]");
  if (!stage) return;
  const existingBtn = $(".player-back-btn", stage);
  if (active && !existingBtn) {
    const btn = document.createElement("button");
    btn.className = "player-back-btn";
    btn.setAttribute("aria-label", "退出全屏");
    btn.innerHTML = `<img src="public/assets/pickcat/imoji_back.png" alt="" />`;
    btn.addEventListener("click", () => {
      setNativePlayerMode(false);
      renderWorkReader();
    });
    stage.appendChild(btn);
  } else if (!active && existingBtn) {
    existingBtn.remove();
  }
}

function nativeBack() {
  if (document.body.classList.contains("tool-fullscreen")) {
    document.body.classList.remove("tool-fullscreen");
    return true;
  }
  const activePlayer = $("[data-player-stage] iframe");
  if (activePlayer && state.currentView === "work") {
    setNativePlayerMode(false);
    renderWorkReader();
    return true;
  }
  if (["search", "publish", "detail", "work", "user", "tool", "login"].includes(state.currentView)) {
    if (location.search && history.length > 1) {
      history.back();
    } else {
      navigateLocal(state.previousView || "home", {}, { direction: "back" });
    }
    return true;
  }
  if (state.currentView !== "home") {
    navigateLocal("home", {}, { direction: "back" });
    return true;
  }
  return false;
}

window.PickcatNative = {
  back: nativeBack
};

function normalizeWork(work) {
  const id = work.id || work.work_id || work.workid;
  const author = work.user_info || work.user || work.author || {};
  const engine = workEngine(work);
  const meta = engineMeta(work, id);
  const playerUrls = uniqueUrls([
    work.player_url,
    work.playerUrl,
    work.player_url_v2,
    work.playerUrlV2,
    work.nemo_player_url,
    work.nemoPlayerUrl,
    inferPlayerUrl(work, id)
  ]);
  const isOfficialWork = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ""));
  const rawPath = work.ideUrl || work.ide_url || work.url || "";
  const originalUrl = isOfficialWork
    ? `https://pickcat.dao3.fun/works/${id}`
    : rawPath
      ? rawPath.startsWith("http")
        ? rawPath
        : `https://shequ.codemao.cn${rawPath.startsWith("/") ? rawPath : `/${rawPath}`}`
      : id
        ? `https://shequ.codemao.cn/work/${id}`
        : "";
  const shareUrl = isOfficialWork ? originalUrl : work.share_url || work.shareUrl || work.unify_share_url || work.unifyShareUrl || originalUrl;
  return {
    id: String(id || ""),
    type: work.type || work.work_type || "",
    ideType: work.ide_type || work.ideType || "",
    engine,
    engineLabel: meta.label,
    playerStartLabel: meta.startLabel,
    playerHint: meta.hint,
    name: work.work_name || work.name || work.title || "未命名作品",
    description: apiText(work.work_introduction || work.description || work.introduction || "暂无介绍"),
    operation: apiText(work.operation_description || ""),
    preview: proxyMediaUrl(work.preview || work.cover || work.cover_url || work.thumbnail || work.screenshot_cover_url || ""),
    views: work.view_times || work.views || work.n_views || 0,
    likes: work.praise_times || work.liked_times || work.likes || work.n_likes || 0,
    collects: work.collect_times || work.collects || work.n_collects || 0,
    forks: work.fork_times || work.forks || work.n_forks || 0,
    shares: work.share_times || work.shares || work.n_shares || 0,
    comments: work.comment_times || work.comment_count || work.n_comments || 0,
    liked: Boolean(work.is_praised || work.is_liked || work.liked || work.abilities?.is_praised),
    collected: Boolean(work.is_collected || work.collected || work.abilities?.is_collected),
    playerUrl: playerUrls[0] || "",
    playerUrls,
    author: {
      id: author.id || work.user_id || "",
      nickname: author.nickname || work.nickname || "",
      avatar: proxyMediaUrl(author.avatar || author.avatar_url || work.avatar_url || work.avatar || ""),
      signature: author.signature || author.description || "",
      followed: resolveFollowedState(author, work) ?? false
    },
    labels: work.work_labels?.items || work.labels || work.work_label_list || [],
    createdAt: work.created_at || work.create_time || work.publish_time || 0,
    originalUrl,
    shareUrl,
    editorEntries: editorEntries({ id: String(id || ""), originalUrl, shareUrl, playerUrls, ...work })
  };
}

function normalizeFeedWork(item) {
  const base = item.work_base || item;
  const author = item.author_info || item.user || {};
  const mix = item.work_mix || item;
  return normalizeWork({
    id: base.id || item.work_id || item.id,
    work_name: base.name || item.work_name || item.name,
    work_introduction: apiText(item.description || base.description || ""),
    preview: base.preview_url || item.preview_url || item.preview,
    view_times: mix.view_times || item.views_count || item.view_times,
    praise_times: mix.like_times || item.likes_count || item.praise_times,
    collect_times: mix.collect_times || item.collect_times,
    publish_time: base.publish_time || item.publish_time,
    user_info: {
      id: author.user_id || item.user_id || author.id,
      nickname: author.nickname || item.nickname,
      avatar: author.avatar || item.avatar_url || author.avatar_url,
      signature: author.description || ""
    },
    work_labels: {
      items: [{ name: item.work_label?.label_name || item.work_recommend_info?.recommend_word || "发现" }]
    }
  });
}

function normalizeDynamicWork(item = {}) {
  if (item.work_base || item.work_mix || item.author_info || item.work_recommend_info) {
    return { ...normalizeFeedWork(item), feedType: "work", feedLabel: "关注动态" };
  }
  const work = item.work || item.work_info || item.data || item;
  const author = item.author_info || item.user_info || item.user || work.user_info || {};
  return {
    ...normalizeWork({
      ...work,
      user_info: {
        ...(work.user_info || {}),
        id: author.user_id || author.id || work.user_id || work.author_id,
        nickname: author.nickname || work.nickname || work.user_name,
        avatar: author.avatar || author.avatar_url || work.avatar || work.avatar_url
      }
    }),
    feedType: "work",
    feedLabel: "关注动态"
  };
}

function firstObject(...items) {
  return items.find((item) => item && typeof item === "object") || {};
}

function resolveFollowedState(...sources) {
  for (const item of sources) {
    if (!item || typeof item !== "object") continue;
    if (item.followed !== undefined) return Boolean(item.followed);
    if (item.isFollowing !== undefined) return Boolean(item.isFollowing);
    if (item.is_followed !== undefined) return Boolean(item.is_followed);
    if (item.is_following !== undefined) return Boolean(item.is_following);
    if (item.is_attention !== undefined) return Boolean(item.is_attention);
  }
  return undefined;
}

function normalizeUserProfile(...sources) {
  const data = firstObject(...sources);
  const info = data.data?.userInfo?.user || data.userInfo?.user || data.user || data;
  const dynamic = sources.find((item) => item?.user_id || item?.user_cover || item?.user_description) || {};
  const tiger = sources.find((item) => item?.avatar_url && (item?.n_followers !== undefined || item?.n_works !== undefined)) || {};
  const metrics = sources.find((item) => item?.n_views !== undefined || item?.n_likes !== undefined || item?.n_re_create !== undefined) || {};
  const followed = resolveFollowedState(info, dynamic, tiger, ...sources);
  const id = info.id || info.user_id || dynamic.user_id || tiger.id || metrics.user_id || "";
  const description = apiText(info.description || dynamic.user_description || tiger.description || "");
  const doing = apiText(info.doing || dynamic.doing || tiger.current_activity || "");
  return {
    id: String(id || ""),
    nickname: info.nickname || dynamic.nickname || tiger.nickname || metrics.nickname || "PICKCAT 用户",
    avatar: proxyMediaUrl(info.avatar || info.avatar_url || dynamic.avatar_url || tiger.avatar_url || metrics.avatar_url || ""),
    cover: proxyMediaUrl(dynamic.user_cover || info.cover || info.user_cover || ""),
    description,
    doing,
    previewWorkId: info.preview_work_id || dynamic.preview_work_id || 0,
    level: info.level || dynamic.author_level || metrics.author_level || 0,
    followed,
    stats: {
      works: tiger.n_works ?? dynamic.nworks ?? 0,
      followers: tiger.n_followers ?? dynamic.nfans ?? 0,
      following: tiger.n_following ?? dynamic.nattention ?? 0,
      views: metrics.n_views ?? dynamic.nblock ?? 0,
      likes: tiger.n_praises ?? metrics.n_likes ?? 0,
      recreates: metrics.n_re_create ?? dynamic.nfork ?? 0
    }
  };
}

function mergeUserProfile(base, ...sources) {
  const incoming = normalizeUserProfile(...sources);
  return cacheUser({
    ...base,
    ...incoming,
    id: incoming.id || base.id,
    nickname: incoming.nickname && incoming.nickname !== "PICKCAT 用户" ? incoming.nickname : base.nickname,
    avatar: incoming.avatar || base.avatar,
    cover: incoming.cover || base.cover || "",
    description: incoming.description || base.description || "",
    doing: incoming.doing || base.doing || "",
    followed: incoming.followed ?? base.followed ?? false,
    stats: { ...(base.stats || {}), ...(incoming.stats || {}) }
  });
}

function cacheUser(user) {
  if (!user?.id) return user;
  sessionStorage.setItem(`pickcat:user:${user.id}`, JSON.stringify(user));
  return user;
}

function normalizeUserListItem(item = {}) {
  const base = normalizeUserProfile(item.user || item.user_info || item.data || item);
  const followed = resolveFollowedState(item, item.user, item.user_info, item.data, base);
  return cacheUser({
    ...base,
    id: String(base.id || item.id || item.user_id || ""),
    nickname: base.nickname || item.nickname || item.name || "PICKCAT 用户",
    avatar: proxyMediaUrl(base.avatar || item.avatar || item.avatar_url || ""),
    description: base.description || item.description || "",
    followed: followed ?? base.followed ?? false,
    stats: {
      ...(base.stats || {}),
      works: base.stats?.works ?? item.n_works ?? 0,
      likes: item.total_likes ?? item.n_praises ?? base.stats?.likes ?? 0
    }
  });
}

function responseItems(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.list)) return result.data.list;
  if (Array.isArray(result?.data?.dynamic)) return result.data.dynamic;
  if (Array.isArray(result?.list)) return result.list;
  if (Array.isArray(result?.work_list)) return result.work_list;
  return [];
}

function responseTotal(result, fallback = 0) {
  const total = result?.total ?? result?.data?.total ?? result?.count ?? result?.data?.count;
  return Number.isFinite(Number(total)) ? Number(total) : fallback;
}

function createUserMiniCard(user, extra = "") {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "fan-mini-card";
  card.innerHTML = `${user.avatar ? `<img src="${user.avatar}" alt="" />` : `<span>${avatarText(user.nickname)}</span>`}<strong>${escapeHtml(user.nickname)}</strong>${extra ? `<em>${escapeHtml(extra)}</em>` : ""}`;
  card.addEventListener("click", () => openUserReader(user));
  return card;
}

function createUserMiniSection(title, users = [], emptyText = "暂时没有读取到用户列表") {
  const section = document.createElement("section");
  section.className = "work-comments-section";
  section.innerHTML = `
    <div class="section-head flush"><h2>${title}</h2><button type="button" class="text-btn">${users.length}</button></div>
    <div class="user-fan-list" data-user-mini-list></div>
  `;
  const list = $("[data-user-mini-list]", section);
  list.replaceChildren(
    ...(users.length
      ? users.map((user) => createUserMiniCard(user, `${compactNumber(user.stats?.works || 0)} 作品 · ${compactNumber(user.stats?.likes || 0)} 赞`))
      : [statusCard(emptyText)])
  );
  return section;
}

function mergeUniqueUsers(users = []) {
  const seen = new Set();
  return users.filter((user) => {
    const key = String(user?.id || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createCollapsibleUserSection(title, users = [], options = {}) {
  const {
    total = users.length,
    emptyText = "暂时没有读取到用户列表",
    loadMore
  } = options;
  const section = document.createElement("section");
  section.className = "work-comments-section";
  section.innerHTML = `
    <div class="section-head flush">
      <h2>${title}</h2>
      <div class="section-head-actions">
        <span class="text-btn text-btn-static">${compactNumber(total)}</span>
        ${total > userListPreviewSize ? '<button type="button" class="text-btn" data-user-toggle>查看全部</button>' : ""}
      </div>
    </div>
    <div class="user-fan-list" data-user-mini-list></div>
    <div class="user-list-actions" data-user-list-actions hidden></div>
  `;
  const list = $("[data-user-mini-list]", section);
  const toggle = $("[data-user-toggle]", section);
  const actions = $("[data-user-list-actions]", section);
  const items = mergeUniqueUsers(users);
  let expanded = false;
  let loading = false;
  let done = items.length >= total;

  const renderActions = () => {
    if (!actions) return;
    actions.hidden = !expanded || done || !loadMore;
    if (actions.hidden) return;
    actions.replaceChildren(
      Object.assign(document.createElement("button"), {
        type: "button",
        className: "text-btn",
        textContent: loading ? `正在加载更多${title}...` : `加载更多${title}`
      })
    );
    $("button", actions)?.addEventListener("click", async () => {
      if (loading) return;
      loading = true;
      renderActions();
      try {
        const next = mergeUniqueUsers(await loadMore(items.length));
        const before = items.length;
        items.push(...next.filter((user) => !items.some((current) => String(current.id) === String(user.id))));
        done = items.length >= total || next.length === 0 || items.length === before;
      } catch (error) {
        actions.replaceChildren(errorCard(`读取${title}失败：${error.message}`, `${title}读取失败`));
        actions.hidden = false;
        loading = false;
        return;
      }
      loading = false;
      render();
    });
  };

  const render = () => {
    const visibleUsers = expanded ? items : items.slice(0, userListPreviewSize);
    list.replaceChildren(
      ...(items.length ? visibleUsers.map((user) => createUserMiniCard(user)) : [statusCard(emptyText)])
    );
    if (toggle) toggle.textContent = expanded ? "收起" : "查看全部";
    renderActions();
  };

  toggle?.addEventListener("click", () => {
    expanded = !expanded;
    render();
  });

  render();
  return section;
}

function readCachedUser(id) {
  try {
    return JSON.parse(sessionStorage.getItem(`pickcat:user:${id}`) || "null");
  } catch {
    return null;
  }
}

function syncFollowState(userId, followed, profile = null) {
  const id = String(userId || "");
  if (!id) return;
  const patch = profile || {};
  const apply = (user) => {
    if (!user || String(user.id || "") !== id) return user;
    return cacheUser({ ...user, ...patch, followed });
  };
  const cached = readCachedUser(id);
  const merged = cacheUser({ ...(cached || {}), ...patch, id, followed });
  state.followingUsers = followed
    ? mergeUniqueUsers([merged, ...state.followingUsers.map(apply)].filter(Boolean))
    : state.followingUsers.map(apply).filter((user) => String(user.id || "") !== id);
  state.mineFollowers = state.mineFollowers.map(apply);
  state.mineFollowingUsers = followed
    ? mergeUniqueUsers([merged, ...state.mineFollowingUsers.map(apply)].filter(Boolean))
    : state.mineFollowingUsers.map(apply).filter((user) => String(user.id || "") !== id);
  state.recommendedUsers = state.recommendedUsers.map(apply);
  state.followingPosts = state.followingPosts.map((item) => {
    const authorId = String(item?.author?.id || item?.authorId || "");
    if (authorId !== id) return item;
    return { ...item, author: { ...(item.author || {}), followed } };
  });
}

function applyFollowChange(user, followed) {
  const nextFollowers = Math.max(0, Number(user?.stats?.followers || 0) + (followed ? 1 : -1));
  user.followed = followed;
  user.stats = { ...(user.stats || {}), followers: nextFollowers };
  syncFollowState(user.id, followed, user);
  return user;
}

function createUserReaderUrl(userId) {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set("view", "user");
  url.searchParams.set("id", userId);
  return url.toString();
}

function createToolReaderUrl(toolId) {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set("view", "tool");
  url.searchParams.set("tool", toolId);
  return url.toString();
}

function createWorkReaderUrl(work) {
  const detail = normalizeWork(work || {});
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set("view", "work");
  if (detail.id) url.searchParams.set("id", detail.id);
  return url.toString();
}

// ---------------------------------------------------------------------------
// 阅读位置记忆：每个视图（首页 / 帖子 / 作品 / 用户 / 搜索…）各自记住滚到哪儿，
// 返回或刷新后自动回到原来的位置，不用重新爬楼。
// ---------------------------------------------------------------------------
const SCROLL_MEMORY_KEY = "pickcat:scroll-memory:v1";
const scrollMemory = (() => {
  try {
    return JSON.parse(localStorage.getItem(SCROLL_MEMORY_KEY) || "{}") || {};
  } catch {
    return {};
  }
})();
let scrollSaveTimer = 0;
let scrollRestoreTimers = [];
let scrollRestoreCancelled = false;

function routeKey(view = state.currentView, params = {}) {
  if (!view) return "home";
  if (view === "home") return `home:${state.feedTab || "recommend"}`;
  const id =
    params.id ||
    (view === "detail"
      ? state.activePostId
      : view === "work"
        ? state.activeWorkId
        : view === "user"
          ? state.activeUserId
          : "");
  if (id) return `${view}:${id}`;
  if (view === "search") {
    const q = params.q || new URLSearchParams(location.search).get("q") || "";
    return q ? `search:${q}` : "search";
  }
  if (view === "tool") return `tool:${state.activeToolId || ""}`;
  return view;
}

function persistScrollMemory() {
  try {
    const keys = Object.keys(scrollMemory);
    if (keys.length > 50) {
      keys.sort((a, b) => (scrollMemory[a].at || 0) - (scrollMemory[b].at || 0));
      keys.slice(0, keys.length - 50).forEach((k) => delete scrollMemory[k]);
    }
    localStorage.setItem(SCROLL_MEMORY_KEY, JSON.stringify(scrollMemory));
  } catch {
    /* 隐私模式忽略 */
  }
}

function saveScrollPosition(key = routeKey()) {
  const y = Math.round(window.scrollY || 0);
  if (y < 40) {
    if (scrollMemory[key]) {
      delete scrollMemory[key];
      persistScrollMemory();
    }
    return;
  }
  scrollMemory[key] = { y, h: document.documentElement.scrollHeight, at: Date.now() };
  persistScrollMemory();
}

function cancelScrollRestore() {
  scrollRestoreCancelled = true;
  scrollRestoreTimers.forEach((id) => clearTimeout(id));
  scrollRestoreTimers = [];
}

function restoreScrollPosition(key = routeKey()) {
  const entry = scrollMemory[key];
  if (!entry || !entry.y) return;
  cancelScrollRestore();
  scrollRestoreCancelled = false;
  const apply = () => {
    if (scrollRestoreCancelled) return;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (max < entry.y - 8) return; // 内容还没渲染够，等下一拍
    const y = Math.min(entry.y, max);
    if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: "auto" });
    else cancelScrollRestore();
  };
  apply();
  [60, 180, 400, 900, 1600, 2600, 4000].forEach((ms) => {
    scrollRestoreTimers.push(setTimeout(apply, ms));
  });
}

function navigateLocal(view, params = {}, options = {}) {
  saveScrollPosition(); // 离开前记住当前位置
  const url = new URL(location.pathname, location.origin);
  ["id", "q", "tool"].forEach((key) => url.searchParams.delete(key));
  url.searchParams.set("view", view);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });
  history.pushState({ view, ...params }, "", url);
  if (view === "work") state.activeWorkId = String(params.id || "");
  if (view === "user") state.activeUserId = String(params.id || "");
  if (view === "detail") state.activePostId = String(params.id || "");
  if (view === "tool") state.activeToolId = String(params.tool || "");
  if (view !== "work") state.activeWorkId = "";
  if (view !== "user") state.activeUserId = "";
  if (view !== "detail") state.activePostId = "";
  if (view !== "tool") state.activeToolId = "";
  setView(view, { direction: resolveViewDirection(state.currentView, view, options.direction) });
  const targetKey = routeKey(view, params);
  if (scrollMemory[targetKey]?.y) restoreScrollPosition(targetKey);
  else window.scrollTo({ top: 0 });
}

function openWorkReader(work) {
  const detail = cacheWorkForReader(work);
  if (detail?.id) navigateLocal("work", { id: detail.id });
}

function openUserReader(user) {
  const detail = cacheUser(user);
  if (detail?.id) navigateLocal("user", { id: detail.id });
}

function openToolRunner(toolId) {
  if (!toolRegistry[toolId]) return;
  navigateLocal("tool", { tool: toolId });
}

function isWorkspaceToolView(view = state.currentView) {
  const tool = view === "tool" ? toolRegistry[state.activeToolId] : null;
  return Boolean(tool?.layout === "workspace");
}

function cacheWorkForReader(work) {
  const detail = normalizeWork(work || {});
  if (!detail.id) return detail;
  sessionStorage.setItem(`pickcat:work:${detail.id}`, JSON.stringify(detail));
  return detail;
}

function readCachedWork(id) {
  try {
    return JSON.parse(sessionStorage.getItem(`pickcat:work:${id}`) || "null");
  } catch {
    return null;
  }
}

function normalizeWorkComment(item) {
  const user = item.user || item.reply_user || {};
  const replies = item.replies?.items || item.reply_items || item.replys || [];
  return {
    id: String(item.id || ""),
    user: {
      id: user.id || user.user_id || "",
      nickname: user.nickname || "PICKCAT 用户",
      avatar: proxyMediaUrl(user.avatar_url || user.avatar || ""),
      workshop: user.work_shop_name || ""
    },
    content: apiText(item.rich_content || item.content || ""),
    likes: item.n_likes || item.likes || item.liked_total || 0,
    liked: Boolean(item.is_liked || item.liked),
    top: Boolean(item.is_top),
    createdAt: item.created_at || item.create_time || 0,
    replies: replies.map(normalizeWorkComment),
    totalReplies: item.replies?.total || item.reply_total || replies.length
  };
}

function createWorkCommentCard(comment, nested = false) {
  const node = document.createElement("article");
  node.className = nested ? "work-comment-card nested" : "work-comment-card";
  node.dataset.commentId = comment.id;
  node.innerHTML = `
    ${comment.user.avatar ? `<img class="mini-avatar-img" src="${comment.user.avatar}" alt="" />` : `<div class="mini-avatar">${avatarText(comment.user.nickname)}</div>`}
    <div class="work-comment-main">
      <div class="work-comment-head">
        ${
          comment.user.id
            ? `<button type="button" class="user-inline-btn" data-open-user="${comment.user.id}"><strong>${escapeHtml(comment.user.nickname)}</strong></button>`
            : `<strong>${escapeHtml(comment.user.nickname)}</strong>`
        }
        ${comment.top ? `<span>置顶</span>` : ""}
      </div>
      ${comment.user.workshop ? `<em>${escapeHtml(comment.user.workshop)}</em>` : ""}
      <p>${escapeHtml(comment.content || " ")}</p>
      <div class="reply-meta">
        <button type="button" class="${comment.liked ? "liked" : ""} ${state.auth?.token ? "" : "disabled"}" data-like-work-comment="${comment.id}">${state.auth?.token ? (comment.liked ? "已赞" : "赞") : "登录后赞"} ${compactNumber(comment.likes)}</button>
        ${!nested ? `<button type="button" class="${state.auth?.token ? "" : "disabled"}" data-open-work-reply="${comment.id}">${state.auth?.token ? "回复" : "登录后回复"}</button>` : ""}
        <span>${formatDate(comment.createdAt)}${comment.totalReplies ? ` · ${compactNumber(comment.totalReplies)} 回复` : ""}</span>
      </div>
      ${
        !nested && comment.replies.length
          ? `<div class="work-comment-replies">${comment.replies
              .slice(0, 3)
              .map(
                (reply) => `
                  <div>
                    ${
                      reply.user.id
                        ? `<button type="button" class="comment-user-link" data-open-user="${reply.user.id}"><strong>${escapeHtml(reply.user.nickname)}</strong></button>`
                        : `<strong>${escapeHtml(reply.user.nickname)}</strong>`
                    }
                    <span>${escapeHtml(reply.content || " ")}</span>
                  </div>
                `
              )
              .join("")}</div>`
          : ""
      }
      ${!nested ? `<form class="nested-reply-form hidden" data-work-comment-reply-form="${comment.id}"><input data-work-comment-reply-input maxlength="300" placeholder="回复 ${escapeHtml(comment.user.nickname)}" /><button type="submit">发送</button></form>` : ""}
    </div>
  `;
  $$("[data-open-user]", node).forEach((button) =>
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openUserReader({
        id: button.dataset.openUser,
        nickname: button.textContent.trim(),
        avatar: comment.user.avatar
      });
    })
  );
  return node;
}

const BOARD_ICON_POOL = [
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

function normalizeBoard(board, index) {
  const meta = boardMeta[String(board.id)] || {};
  const fallbackDesc = board.has_selection ? "保留历史痕迹与精选内容的板块入口" : "PICKCAT 官方论坛板块，点击进入话题流";
  return {
    id: String(board.id),
    name: cleanBoardText(meta.name || board.name, `板块 ${board.id}`),
    desc: cleanBoardText(meta.desc || board.description, fallbackDesc),
    icon: circleIconMap[String(board.id)] || board.icon_url || boardIconFor(String(board.id)),
    count: board.n_posts ? `${compactNumber(board.n_posts)} 帖` : board.is_hot ? "热门" : board.has_selection ? "精选" : "",
    site: meta.site || `https://pickcat.dao3.fun/forum?tag=${encodeURIComponent(board.id)}`,
    tone: index % 2 ? "alt" : "main"
  };
}

function isOfficialPinnedPost(item) {
  const title = item.title || "";
  const workshop = item.user?.work_shop_name || "";
  const author = item.user?.nickname || "";
  const officialAuthor = workshop.includes("编程猫官方") || author.includes("官方") || author.includes("活动喵");
  const officialTitle = /^(【?官方|公告|活动|通知)/.test(title);
  return Boolean(item.is_pinned || item.is_top || (officialAuthor && officialTitle));
}

function cardTitleByTone(tone) {
  if (tone === "loading") return "加载中";
  if (tone === "error") return "读取失败";
  return "提示";
}

function stateCardMarkup(text, { tone = "info", title = "" } = {}) {
  const icon =
    tone === "loading"
      ? '<span class="loading-card-spinner" aria-hidden="true"></span>'
      : `<span class="loading-card-badge" aria-hidden="true">${tone === "error" ? "!" : "i"}</span>`;
  return `${icon}<div class="loading-card-copy"><strong>${escapeHtml(title || cardTitleByTone(tone))}</strong><span>${escapeHtml(text)}</span></div>`;
}

function statusCard(text, options = {}) {
  const tone = options.tone || "info";
  const node = document.createElement("div");
  node.className = `loading-card is-${tone}`;
  node.innerHTML = stateCardMarkup(text, options);
  return node;
}

function createOldsquawToolCard(tool, { compact = false } = {}) {
  const card = document.createElement("button");
  card.className = `oldsquaw-tool-card tone-${tool.tone || "blue"}${compact ? " compact" : ""}`;
  card.type = "button";
  card.innerHTML = `
    <span class="oldsquaw-tool-icon"><img src="${tool.icon}" alt="" /></span>
    <span class="oldsquaw-tool-copy">
      <em>${escapeHtml(tool.tag)}</em>
      <strong>${escapeHtml(tool.name)}</strong>
      <span>${escapeHtml(tool.desc)}</span>
    </span>
  `;
  card.addEventListener("click", () => openToolRunner(tool.id));
  return card;
}

function createOldsquawSpotlight(title = "Oldsquaw 创作工具精选", desc = "Pickcat 与 Oldsquaw 合并合作，Nemo、CoCo、KittenN 和 AI 控件入口会逐步统一。") {
  const section = document.createElement("section");
  section.className = "oldsquaw-spotlight";
  section.innerHTML = `
    <div class="section-head flush">
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(desc)}</p>
      </div>
      <a class="text-btn" href="${oldsquawLinks.org}" target="_blank" rel="noreferrer">组织主页</a>
    </div>
    <div class="oldsquaw-tool-row"></div>
  `;
  $(".oldsquaw-tool-row", section).replaceChildren(...oldsquawTools.map((tool) => createOldsquawToolCard(tool)));
  return section;
}

function loadingCard(text, title = "加载中") {
  return statusCard(text, { tone: "loading", title });
}

function errorCard(text, title = "读取失败") {
  return statusCard(text, { tone: "error", title });
}

function mergePosts(posts) {
  const map = new Map();
  [...state.posts, ...posts].forEach((post) => {
    if (!map.has(post.id)) map.set(post.id, post);
  });
  state.posts = [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
}

const topicFirstPostCache = new Map();

/** 点赞目标是首楼 post，不是 topic；缓存一次免得每次点都多打一个请求 */
async function topicLikeTarget(topicId) {
  const key = String(topicId);
  if (topicFirstPostCache.has(key)) return topicFirstPostCache.get(key);
  const detail = await api.postDetail(topicId);
  const id = detail.first_post_id || "";
  if (id) topicFirstPostCache.set(key, id);
  return id;
}

/** 收藏 / 取消收藏话题（取消要先拿到 bookmarkId） */
async function toggleTopicBookmark(topicId, on) {
  if (on) {
    const res = await api.addTopicBookmark(topicId);
    return (res && res.id) || (await api.topicBookmarkId(topicId));
  }
  const id = await api.topicBookmarkId(topicId);
  if (id) await api.removeBookmark(id);
  return null;
}

function createPost(post) {
  const article = document.createElement("article");
  article.className = "post-card";
  const workPreview = post.work ? createWorkPreviewMarkup(post.work) : "";
  article.innerHTML = `
    <button class="post-hit" type="button" aria-label="打开帖子"></button>
    <div class="author-row">
      ${post.avatarUrl ? `<img class="avatar-img" src="${post.avatarUrl}" alt="" />` : `<div class="avatar">${post.avatarText}</div>`}
      <div><h3>${post.author}</h3><p>${post.time}</p></div>
      <div class="more">...</div>
    </div>
    <div class="post-title">${post.title}</div>
    ${post.body ? `<p class="post-body">${post.body}</p>` : ""}
    ${workPreview}
    ${post.images.length ? `<div class="image-strip">${post.images.slice(0, 3).map((src) => `<img src="${src}" alt="帖子图片" loading="lazy" />`).join("")}</div>` : ""}
    <div class="circle-chip">${post.circle}</div>
    <div class="actions-row">
      <span class="action" title="浏览"><img class="action-img" src="${ASSETS.view}" alt="" />${compactNumber(post.stats[0])}</span>
      <span class="action" title="评论"><img class="action-img" src="${ASSETS.homeComment}" alt="" />${compactNumber(post.stats[1])}</span>
      <button class="action action-btn" type="button" title="点赞" data-feed-like><img class="action-img" src="public/assets/pickcat/ic_home_rec_pick.png" alt="" /><span data-like-count>${compactNumber(post.stats[2])}</span></button>
      <button class="action action-btn" type="button" title="收藏" data-feed-bookmark><img class="action-img" src="${ASSETS.pick}" alt="" /><span data-bookmark-text>收藏</span></button>
    </div>
  `;
  $(".post-hit", article).addEventListener("click", () => openPost(post.id));
  $(".author-row", article).addEventListener("click", (event) => {
    event.stopPropagation();
    if (post.authorId) {
      openUserReader({ id: post.authorId, nickname: post.author, avatar: post.avatarUrl, description: post.circle });
    }
  });
  $(".inline-work-preview", article)?.addEventListener("click", (event) => {
    event.stopPropagation();
    openWorkPreview(post.work);
  });
  $$(".image-strip img", article).forEach((img) => {
    img.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openImageViewer(img.currentSrc || img.src, img.alt || "帖子图片");
    });
  });

  // 点赞 / 收藏（写操作，必须登录）
  const likeBtn = $("[data-feed-like]", article);
  likeBtn?.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!state.auth?.token) {
      statusToast("请先登录再点赞");
      navigateLocal("login");
      return;
    }
    const on = !article.classList.contains("liked");
    const countEl = $("[data-like-count]", likeBtn);
    article.classList.toggle("liked", on);
    likeBtn.classList.toggle("active", on);
    likeBtn.disabled = true;
    post.stats[2] = Math.max(0, (Number(post.stats[2]) || 0) + (on ? 1 : -1));
    if (countEl) countEl.textContent = compactNumber(post.stats[2]);
    try {
      const target = await topicLikeTarget(post.id);
      if (!target) throw new Error("这条内容暂不支持点赞");
      await api.togglePostLike(target, on);
    } catch (error) {
      article.classList.toggle("liked", !on);
      likeBtn.classList.toggle("active", !on);
      post.stats[2] = Math.max(0, (Number(post.stats[2]) || 0) + (on ? -1 : 1));
      if (countEl) countEl.textContent = compactNumber(post.stats[2]);
      statusToast(error.message || "点赞失败");
    } finally {
      likeBtn.disabled = false;
    }
  });

  const bookmarkBtn = $("[data-feed-bookmark]", article);
  bookmarkBtn?.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!state.auth?.token) {
      statusToast("请先登录再收藏");
      navigateLocal("login");
      return;
    }
    const on = !article.classList.contains("bookmarked");
    const textEl = $("[data-bookmark-text]", bookmarkBtn);
    article.classList.toggle("bookmarked", on);
    bookmarkBtn.classList.toggle("active", on);
    bookmarkBtn.disabled = true;
    if (textEl) textEl.textContent = on ? "已收藏" : "收藏";
    try {
      await toggleTopicBookmark(post.id, on);
    } catch (error) {
      article.classList.toggle("bookmarked", !on);
      bookmarkBtn.classList.toggle("active", !on);
      if (textEl) textEl.textContent = !on ? "已收藏" : "收藏";
      statusToast(error.message || "收藏失败");
    } finally {
      bookmarkBtn.disabled = false;
    }
  });

  return article;
}

/** 官方对没有封面的作品会返回纯色占位图（640x360 近似纯色），这里用 canvas 识别后换成品牌占位 */
function judgeCover(img) {
  if (!img || img.dataset.coverJudged === "1") return;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;
    let min = 255;
    let max = 0;
    for (let i = 0; i < data.length; i += 4) {
      const v = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    img.dataset.coverJudged = "1";
    if (max - min < 6) {
      img.closest(".work-cover-wrap")?.classList.add("is-blank");
      if (img.classList.contains("work-reader-cover")) img.closest(".work-reader-stage")?.classList.add("is-blank");
    }
  } catch {
    /* 跨域或解码失败就不处理 */
  }
}

function markPlaceholderCovers(root = document) {
  root.querySelectorAll("img.home-work-cover, img.work-reader-cover").forEach((img) => {
    if (img.complete && img.naturalWidth) judgeCover(img);
  });
}

// 懒加载图片在滚动后才 decode，用捕获阶段监听兜底
document.addEventListener(
  "load",
  (event) => {
    const img = event.target;
    if (img instanceof HTMLImageElement && (img.classList.contains("home-work-cover") || img.classList.contains("work-reader-cover"))) judgeCover(img);
  },
  true,
);
function createHomeWorkCard(work) {
  cacheWorkForReader(work);
  cacheUser(work.author);
  const node = document.createElement("article");
  node.className = "home-work-card";
  node.innerHTML = `
    <button class="home-work-hit" type="button" aria-label="打开作品"></button>
    <div class="work-cover-wrap">
      <img class="home-work-cover" src="${work.preview}" alt="" loading="lazy" onerror="this.classList.add('is-missing')" />
      <span class="play-badge">Play</span>
      <span class="blank-label">PICKCAT 作品</span>
    </div>
    <div class="home-work-content">
      <h3>${escapeHtml(work.name)}</h3>
      <button class="home-work-user" type="button">
        ${work.author.avatar ? `<img src="${work.author.avatar}" alt="" />` : `<span>${avatarText(work.author.nickname)}</span>`}
        <strong>${escapeHtml(work.author.nickname || "PICKCAT 用户")}</strong>
      </button>
      <div class="actions-row compact-actions">
        <span>${compactNumber(work.views)} 浏览</span>
        <span>${compactNumber(work.likes)} 赞</span>
        <span>${compactNumber(work.collects)} 收藏</span>
      </div>
    </div>
  `;
  $(".home-work-hit", node).addEventListener("click", () => {
    openWorkReader(work);
  });
  $(".home-work-user", node).addEventListener("click", (event) => {
    event.stopPropagation();
    if (work.author.id) openUserReader(work.author);
  });
  return node;
}

function createUserRecommendCard(user) {
  cacheUser(user);
  const node = document.createElement("article");
  node.className = "user-recommend-card";
  node.innerHTML = `
    <button class="user-card-hit" type="button" aria-label="打开用户"></button>
    ${user.avatar ? `<img class="profile-avatar-img small" src="${user.avatar}" alt="" />` : `<div class="avatar">${avatarText(user.nickname)}</div>`}
    <div>
      <span>推荐创作者</span>
      <h3>${escapeHtml(user.nickname || "PICKCAT 用户")}</h3>
      <p>${escapeHtml(user.description || "社区优秀创作者")}</p>
    </div>
  `;
  $(".user-card-hit", node).addEventListener("click", () => {
    if (user.id) openUserReader(user);
  });
  return node;
}

function createWorkPreviewMarkup(work) {
  const title = escapeHtml(work.name || "作品预览");
  const preview = work.preview ? `<img src="${work.preview}" alt="" loading="lazy" />` : `<div class="work-thumb-placeholder">▶</div>`;
  return `
    <button class="inline-work-preview" type="button" data-work-id="${work.id}" aria-label="打开作品预览">
      ${preview}
      <span>
        <strong>我发布了《${title}》作品</strong>
        <em>点击查看作品预览</em>
      </span>
    </button>
  `;
}

async function loadCircleData() {
  try {
    const boards = await api.boards();
    const preferred = ["3", "26", "6", "17", "2", "11", "10", "7", "30", "27"];
    state.allBoards = (boards.items || []).map(normalizeBoard);
    const preferredBoards = state.allBoards
      .filter((board) => preferred.includes(board.id))
      .sort((a, b) => preferred.indexOf(a.id) - preferred.indexOf(b.id));
    state.boards = [...preferredBoards, ...state.allBoards.filter((board) => !preferred.includes(board.id))];
  } catch {
    state.allBoards = fallbackBoards.map(normalizeBoard);
    state.boards = state.allBoards;
  }
  renderCircles();
  renderBoardSelect();
}

async function loadHomeData() {
  const feed = $("[data-feed]");
  state.posts = [];
  state.boardPages = {};
  state.boardExhausted = {};
  state.feedDone = false;
  state.homeLoaded = false;
  feed.replaceChildren(loadingCard("正在读取社区帖子和推荐内容...", "首页加载中"));
  try {
    await Promise.all([loadDiscoverWorks(), loadRecommendedUsers()]);
    await loadMoreFeed();
  } finally {
    state.homeLoaded = true;
    renderFeed();
    updateFeedSentinel();
  }
}

async function loadDiscoverWorks() {
  if (state.discoverLoading || state.discoverDone) return;
  state.discoverLoading = true;
  try {
    const offset = state.discoverOffset || 0;
    const [home, discover] = await Promise.all([
      offset === 0 ? api.homeWorks().catch(() => []) : Promise.resolve([]),
      api.discoverWorks(offset, 12).catch(() => ({ items: [] }))
    ]);
    const discoverItems = discover.items || discover.data?.items || discover.data || [];
    const items = [...(Array.isArray(home) ? home : home.recommend_work_list || []), ...discoverItems];
    const seen = new Set(state.discoverWorks.map((work) => work.id));
    const nextWorks = items
      .map(normalizeFeedWork)
      .filter((work) => {
        if (!work.id || seen.has(work.id)) return false;
        seen.add(work.id);
        return true;
      });
    state.discoverWorks.push(...nextWorks);
    state.discoverOffset = offset + 12;
    state.discoverDone = discoverItems.length < 12 || nextWorks.length === 0;
    state.discoverLoaded = true;
  } finally {
    state.discoverLoading = false;
    renderFeed();
  }
}

async function loadRecommendedUsers() {
  try {
    const data = await api.recommendedUsers();
    state.recommendedUsers = (data.items || []).map((user) => ({
      id: user.user_id || user.id,
      nickname: user.nickname,
      avatar: proxyMediaUrl(user.avatar_url),
      description: user.description,
      targetUrl: user.target_url
    }));
  } catch {
    state.recommendedUsers = [];
  }
}

async function loadMoreFeed() {
  if (state.feedLoading || state.feedDone) return;
  state.feedLoading = true;
  updateFeedSentinel();

  try {
    const sourceBoards = (state.allBoards.length ? state.allBoards : state.boards).filter((board) => !state.boardExhausted[board.id]);
    if (!sourceBoards.length) {
      state.feedDone = true;
      renderFeed();
      return;
    }

    const responses = await Promise.all(
      sourceBoards.map((board) =>
        api.boardPosts(board.id, state.boardPages[board.id] || 1, feedPageSize)
          .then((response) => ({ board, items: response.items || [] }))
          .catch(() => ({ board, items: null }))
      )
    );

    responses.forEach(({ board, items }) => {
      if (!items) return;
      const current = state.boardPages[board.id] || 1;
      state.boardPages[board.id] = current + 1;
      if (items.length < feedPageSize) state.boardExhausted[board.id] = true;
    });

    const nextPosts = responses
      .flatMap((response) => (response.items || []).map((item) => ({ ...item, board_name: item.board_name || response.board.name })))
      .filter((item) => !isOfficialPinnedPost(item))
      .map(normalizePost)
      .sort((a, b) => b.createdAt - a.createdAt);

    const before = state.posts.length;
    mergePosts(nextPosts);
    state.feedDone = state.posts.length === before && sourceBoards.every((board) => state.boardExhausted[board.id]);
    renderFeed();
  } catch (error) {
    if (!state.posts.length) $("[data-feed]").replaceChildren(errorCard(`社区流读取失败：${error.message}`, "社区流失败"));
    const sentinel = $("[data-feed-sentinel]");
    if (sentinel) sentinel.textContent = `加载失败：${error.message}`;
  } finally {
    state.feedLoading = false;
    updateFeedSentinel();
  }
}

function renderFeed() {
  if (state.feedTab === "discover") {
    if (!state.discoverLoaded && !state.discoverLoading) loadDiscoverWorks().then(renderFeed);
    const nodes = [];
    nodes.push(...(state.discoverWorks.length
      ? state.discoverWorks.map(createHomeWorkCard)
      : [state.discoverLoading || !state.discoverLoaded ? loadingCard("正在读取发现作品...", "发现加载中") : statusCard("暂时没有发现作品")]));
    $("[data-feed]").replaceChildren(...nodes);
    markPlaceholderCovers($("[data-feed]"));
    updateFeedSentinel();
    renderMineFeed();
    return;
  }
  if (state.feedTab === "following") {
    if (!state.followingLoaded && !state.followingLoading) {
      loadFollowingFeed();
    }
    const data = state.followingPosts.length ? state.followingPosts : [];
    const nodes = [];
    if (state.followingUsers.length) {
      nodes.push(createUserMiniSection("我关注的人", state.followingUsers, "暂时没有读取到关注列表"));
    }
    if ((!state.followingLoaded || state.followingLoading) && !data.length) {
      nodes.push(loadingCard("正在读取关注列表和动态作品...", "关注加载中"));
    } else if (data.length) {
      nodes.push(...data.map((item) => (item.feedType === "work" ? createHomeWorkCard(item) : createPost(item))));
    } else {
      nodes.push(statusCard(state.auth?.token ? "暂时没有读取到关注动态；如果你还没有关注任何人，这里会保持为空。" : "登录后会读取关注列表，再读取关注动态。"));
    }
    $("[data-feed]").replaceChildren(...nodes);
    markPlaceholderCovers($("[data-feed]"));
    updateFeedSentinel();
    renderMineFeed();
    return;
  }
  const data = state.posts;
  const nodes = [];
  const requiredWorks = Math.ceil(data.length / 2);
  if (state.discoverWorks.length < requiredWorks && !state.discoverLoading && !state.discoverDone) {
    loadDiscoverWorks();
  }
  let workCursor = 0;
  data.forEach((post, index) => {
    nodes.push(createPost(post));
    const work = workCursor < state.discoverWorks.length ? state.discoverWorks[workCursor] : null;
    if (work && index % 2 === 0) nodes.push(createHomeWorkCard(work));
    if (work && index % 2 === 0) workCursor += 1;
    const user = state.recommendedUsers[index % Math.max(state.recommendedUsers.length, 1)];
    if (user && index === 1) nodes.push(createUserRecommendCard(user));
  });
  if (!nodes.length) nodes.push(!state.homeLoaded || state.feedLoading ? loadingCard("正在读取社区动态...", "首页加载中") : statusCard("暂时没有返回动态"));
  $("[data-feed]").replaceChildren(...nodes);
  updateFeedSentinel();
  renderMineFeed();
}

function updateFeedSentinel() {
  const sentinel = $("[data-feed-sentinel]");
  if (!sentinel) return;
  sentinel.hidden = state.currentView !== "home";
  if (state.currentView !== "home") return;
  if (state.feedTab === "discover") {
    sentinel.textContent = state.discoverLoading
      ? "\u6b63\u5728\u6574\u7406\u53d1\u73b0\u4f5c\u54c1..."
      : state.discoverDone
        ? "\u53d1\u73b0\u9875\u6ca1\u6709\u66f4\u591a\u4f5c\u54c1\u4e86"
        : `\u7ee7\u7eed\u6ed1\u52a8\u52a0\u8f7d\u53d1\u73b0\u4f5c\u54c1\uff0c\u5df2\u52a0\u8f7d ${state.discoverWorks.length} \u4e2a`;
    return;
  }
  if (state.feedTab === "following") {
    sentinel.textContent = state.followingLoading
      ? "\u6b63\u5728\u52a0\u8f7d\u66f4\u591a\u5173\u6ce8\u52a8\u6001..."
      : state.followingDone
        ? "\u5173\u6ce8\u9875\u6ca1\u6709\u66f4\u591a\u5185\u5bb9\u4e86"
        : `\u7ee7\u7eed\u6ed1\u52a8\u52a0\u8f7d\u5173\u6ce8\u52a8\u6001\uff0c\u5df2\u52a0\u8f7d ${state.followingPosts.length} \u6761`;
    return;
  }
  sentinel.textContent = state.feedLoading ? "\u6b63\u5728\u52a0\u8f7d\u66f4\u591a\u793e\u533a\u5e16\u5b50..." : state.feedDone ? "\u6ca1\u6709\u66f4\u591a\u793e\u533a\u5e16\u5b50\u4e86" : "\u7ee7\u7eed\u6ed1\u52a8\u52a0\u8f7d\u793e\u533a\u5185\u5bb9";
}

async function loadFollowingFeed() {
  if (state.followingLoading || state.followingDone) return;
  state.followingLoading = true;
  renderFeed();
  try {
    if (!state.user?.id) throw new Error("\u672a\u767b\u5f55");
    if (!state.followingNames.length) {
      const [following, followingLegacy] = await Promise.all([
        api.following(state.user.id, 30).catch(() => ({ items: [] })),
        api.followingLegacy(state.user.id, 30).catch(() => ({ items: [] }))
      ]);
      const users = [...responseItems(following), ...responseItems(followingLegacy)];
      const seenUsers = new Set();
      state.followingUsers = users
        .map(normalizeUserListItem)
        .filter((user) => {
          if (!user.id || seenUsers.has(user.id)) return false;
          seenUsers.add(user.id);
          return true;
        });
      state.followingNames = state.followingUsers
        .map((item) => item.nickname || item.user?.nickname || item.user_info?.nickname || item.name)
        .filter(Boolean);
      state.followingDynamicOffset = 0;
      state.followingDynamicDone = !state.auth?.token;
      state.followingNameOffset = 0;
      if (!state.followingNames.length) state.followingDone = true;
    }
    let appended = 0;
    if (state.auth?.token && !state.followingDynamicDone) {
      let attempts = 0;
      while (!appended && !state.followingDynamicDone && attempts < 3) {
        const result = await api.activityWorks(state.followingDynamicOffset, 18).catch(() => null);
        if (!result) {
          state.followingDynamicDone = true;
          break;
        }
        const items = responseItems(result);
        if (!items.length) {
          state.followingDynamicDone = true;
          break;
        }
        state.followingDynamicOffset += items.length;
        if (items.length < 18) state.followingDynamicDone = true;
        const followIds = new Set(state.followingUsers.map((item) => String(item.id || "")).filter(Boolean));
        const followNames = new Set(state.followingNames.map((item) => String(item).trim()).filter(Boolean));
        const seen = new Set(state.followingPosts.map((item) => `${item.feedType || "post"}:${item.id}`));
        const works = items
          .map(normalizeDynamicWork)
          .filter((work) => {
            const authorId = String(work.author?.id || "");
            const authorName = String(work.author?.nickname || "").trim();
            const key = `work:${work.id}`;
            if (!work.id || seen.has(key)) return false;
            if ((authorId && followIds.has(authorId)) || (authorName && followNames.has(authorName))) {
              seen.add(key);
              return true;
            }
            return false;
          });
        if (works.length) {
          state.followingPosts.push(...works);
          appended += works.length;
        }
        attempts += 1;
      }
    }
    if (!appended && state.followingNameOffset < state.followingNames.length) {
      const names = state.followingNames.slice(state.followingNameOffset, state.followingNameOffset + 5);
      const results = await Promise.all(names.map((name) => api.searchPosts(name, 10).catch(() => ({ items: [] }))));
      const seen = new Set(state.followingPosts.map((item) => `${item.feedType || "post"}:${item.id}`));
      const nextPosts = results
        .flatMap((result) => (result.items || []).map(normalizePost))
        .filter((post) => {
          const key = `post:${post.id}`;
          if (!post.id || seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((post) => ({ ...post, feedType: "post" }));
      state.followingPosts.push(...nextPosts);
      state.followingNameOffset += names.length;
    }
    state.followingDone = state.followingDynamicDone && state.followingNameOffset >= state.followingNames.length;
    state.followingLoaded = true;
  } catch {
    state.followingLoaded = true;
    state.followingDone = true;
  } finally {
    state.followingLoading = false;
    renderFeed();
  }
}

function renderMineFeed() {
  if (state.currentView !== "mine" || state.auth?.token) return;
  const root = $("[data-mine-feed]");
  if (root && state.posts.length) root.replaceChildren(...state.posts.slice(0, 4).map(createPost));
}

function boardById(id) {
  return state.boards.find((board) => board.id === String(id)) || state.allBoards.find((board) => board.id === String(id));
}

function renderCircleBoard(board) {
  const root = $("[data-circle-feed]");
  if (!root || !board) return;
  const nodes = [statusCard(`当前对应 PICKCAT 官方板块：${board.name}（board ${board.id}）`)];
  if (state.circleBoardPosts.length) {
    nodes.push(...state.circleBoardPosts.map(createPost));
  } else if (state.circleBoardLoading) {
    nodes.push(loadingCard(`正在读取${board.name}板块...`, "板块加载中"));
  } else {
    nodes.push(statusCard("这个板块暂时没有读取到帖子"));
  }
  if (!state.circleBoardDone) {
    const more = state.circleBoardLoading
      ? loadingCard("正在加载更多帖子...", "继续加载中")
      : statusCard("继续下滑加载更多帖子");
    more.classList.add("circle-load-sentinel");
    more.dataset.circleSentinel = "true";
    nodes.push(more);
  }
  root.replaceChildren(...nodes);
  observeCircleSentinel(board);
}

function observeCircleSentinel(board) {
  if (state.circleObserver) {
    state.circleObserver.disconnect();
    state.circleObserver = null;
  }
  const sentinel = $("[data-circle-sentinel]");
  if (!sentinel || state.circleBoardDone) return;
  state.circleObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || state.currentView !== "circle") return;
      openCircleBoard(board, { append: true });
    },
    { rootMargin: "360px" }
  );
  state.circleObserver.observe(sentinel);
}

function maybeLoadCircleFromScroll() {
  if (state.currentView !== "circle" || state.circleBoardLoading || state.circleBoardDone) return;
  const sentinel = $("[data-circle-sentinel]");
  if (!sentinel) return;
  const rect = sentinel.getBoundingClientRect();
  if (rect.top > window.innerHeight + 420) return;
  const board = boardById(state.activeCircleBoardId);
  if (board) openCircleBoard(board, { append: true });
}

function scrollToPageTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTopbarCollapsed(false);
}

function setTopbarCollapsed(collapsed) {
  const topbar = $("[data-topbar]");
  if (!topbar) return;
  state.topbarCollapsed = Boolean(collapsed);
  topbar.classList.toggle("collapsed", state.topbarCollapsed);
}

function syncHomeTopbarVisibility({ force = false } = {}) {
  const topbar = $("[data-topbar]");
  if (!topbar) return;
  const isHome = state.currentView === "home";
  topbar.classList.toggle("home-topbar", isHome);
  document.body.classList.toggle("home-viewing", isHome);
  if (!isHome) {
    setTopbarCollapsed(false);
    return;
  }
  const current = window.scrollY || 0;
  const delta = current - state.lastScrollY;
  if (force || current < 24) {
    setTopbarCollapsed(false);
  } else if (delta > 8 && current > 120) {
    setTopbarCollapsed(true);
  } else if (delta < -8) {
    setTopbarCollapsed(false);
  }
  state.lastScrollY = current;
}

async function openCircleBoard(board, { append = false } = {}) {
  const root = $("[data-circle-feed]");
  if (!root || !board || state.circleBoardLoading) return;
  const boardChanged = String(state.activeCircleBoardId) !== String(board.id);
  if (!append || boardChanged) {
    state.activeCircleBoardId = String(board.id);
    state.circleBoardPage = 1;
    state.circleBoardDone = false;
    state.circleBoardPosts = [];
  }
  state.circleBoardLoading = true;
  renderCircleBoard(board);
  if (!append) {
    requestAnimationFrame(() => {
      const top = window.scrollY + root.getBoundingClientRect().top - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }
  try {
    const response = await api.boardPosts(board.id, state.circleBoardPage, 10);
    const posts = (response.items || []).map((item) => normalizePost({ ...item, board_name: board.name, board_id: board.id }));
    const seen = new Set(state.circleBoardPosts.map((post) => post.id));
    const uniquePosts = posts.filter((post) => !seen.has(post.id));
    state.circleBoardPosts.push(...uniquePosts);
    state.circleBoardPage += 1;
    state.circleBoardDone = posts.length < 10 || uniquePosts.length === 0;
  } catch (error) {
    root.replaceChildren(statusCard(`读取${board.name}失败：${error.message}`));
    state.circleBoardDone = true;
  } finally {
    state.circleBoardLoading = false;
    renderCircleBoard(board);
  }
}

function renderCircles() {
  const shortcutIds = (state.boards.length ? state.boards : state.allBoards).slice(0, 3).map((board) => board.id);
  const shortcuts = shortcutIds
    .map((id) => boardById(id) || normalizeBoard({ id, name: id }, shortcutIds.indexOf(id)))
    .filter(Boolean);

  $("[data-circle-shortcuts]").replaceChildren(
    ...shortcuts.map((circle) => {
      const item = document.createElement("button");
      item.className = "circle-entry";
      item.type = "button";
      item.innerHTML = `<img src="${circle.icon}" alt="" /><span>${circle.name}</span>`;
      item.addEventListener("click", () => openCircleBoard(circle));
      return item;
    })
  );

  const oldsquawZone = $("[data-oldsquaw-zone]");
  if (oldsquawZone) oldsquawZone.replaceChildren();

  $("[data-circles]").replaceChildren(
    ...(state.circleExpanded ? state.boards : state.boards.slice(0, 4)).map((circle) => {
      const card = document.createElement("article");
      card.className = "circle-card";
      card.innerHTML = `
        <div class="circle-cover ${circle.tone === "alt" ? "alt" : ""}">
          <img src="${circle.icon}" alt="" />
          <span class="circle-count">${circle.count}</span>
        </div>
        <div class="circle-body">
          <h3>${circle.name}</h3>
          <p>${circle.desc}</p>
          <button class="join-btn" type="button" data-open-board>\u52a0\u5165</button>
        </div>
      `;
      $("[data-open-board]", card).addEventListener("click", () => openCircleBoard(circle));
      return card;
    })
  );

  const moreBtn = $("[data-circle-more]");
  if (moreBtn) {
    moreBtn.textContent = state.circleExpanded ? "收起 <" : "查看更多 >";
    moreBtn.onclick = () => {
      state.circleExpanded = !state.circleExpanded;
      renderCircles();
    };
  }

  // 不再自动打开第一个板块：等用户点「加入」再看帖子流（原版喵圈页就是纯列表）
  if (!state.activeCircleBoardId) {
    $("[data-circle-feed]")?.replaceChildren();
  }
}

function renderBoardSelect() {
  const select = $("[data-compose-board]");
  select.replaceChildren(
    ...state.boards.map((board) => {
      const option = document.createElement("option");
      option.value = board.id;
      option.textContent = board.name;
      return option;
    })
  );
}

function updateTopbar(view) {
  const titles = { home: "PICKCAT", circle: "喵圈", publish: "发布", message: "消息", mine: "我的", search: "", detail: "帖子详情", work: "作品阅览", user: "用户预览", tool: toolRegistry[state.activeToolId]?.name || "创作工具", login: "登录" };
  const title = $("[data-title]");
  title.innerHTML = view === "home" ? `<img src="${ASSETS.logo}" alt="PICKCAT" />` : titles[view];
  title.classList.toggle("is-scroll-top", view === "home");
  title.setAttribute("role", view === "home" ? "button" : "heading");
  title.setAttribute("tabindex", view === "home" ? "0" : "-1");
  title.setAttribute("aria-label", view === "home" ? "回到顶部" : titles[view]);
  syncHomeTopbarVisibility({ force: true });
  $(".bottom-nav")?.classList.toggle("hidden", isSecondaryView(view));
  renderTopActions(view);
}

function renderTopActions(view) {
  const actions = $(".top-actions");
  const hidden = ["mine", "search", "publish", "detail", "work", "user", "tool", "login"].includes(view);
  actions.classList.toggle("hidden", hidden);
  if (hidden) return;
  actions.innerHTML = `
    <button class="icon-btn" type="button" data-search aria-label="搜索"><img class="top-action-img" src="${ASSETS.search}" alt="" /></button>
  `;
  $("[data-search]", actions)?.addEventListener("click", () => navigateLocal("search"));
  return;
}

function setView(view, options = {}) {
  runTransition(() => {
    closeCreateSheet();
    const fromView = state.currentView;
    if (fromView !== view) state.previousView = fromView;
    state.currentView = view;
    setKeyboardOpen(false);
    document.body.classList.toggle("tool-workspace-view", isWorkspaceToolView(view));
    animateViewChange(fromView, view, options);
    $$(".nav-item").forEach((item) => {
      const active = item.dataset.nav === view;
      item.classList.toggle("active", active);
      const img = $("img", item);
      if (img) img.src = active ? img.dataset.iconActive : img.dataset.iconNormal;
    });
    $(".bottom-nav")?.classList.toggle("hidden", isSecondaryView(view));
    document.body.classList.toggle("show-back-btn", ["detail", "work", "user", "tool", "login", "publish"].includes(view));
    updateTopbar(view);
    if (view !== "work") setNativePlayerMode(false);
    if (view !== "tool") document.body.classList.remove("tool-fullscreen");
    updateFeedSentinel();
    if (view === "login") mountPasswordLogin();
    if (view === "mine") renderMinePage();
    if (view === "message") renderMessagesReadable();
    if (view === "work") renderWorkReader();
    if (view === "user") renderUserReader();
    if (view === "tool") renderToolRunner();
    if (view === "detail" && state.activePostId) renderPostDetail(state.activePostId);
    // 前进/后退（popstate）也回到原来的阅读位置
    const memoryKey = routeKey();
    if (scrollMemory[memoryKey]?.y) restoreScrollPosition(memoryKey);
  });
}

function routeFromLocation({ replace = false, direction = "none", immediate = false } = {}) {
  const params = new URLSearchParams(location.search);
  const view = params.get("view");
  const id = params.get("id") || "";
  if (view === "work" && id) {
    state.activeWorkId = id;
    if (replace) history.replaceState({ view, id }, "", location.href);
    setView("work", { direction, immediate });
    return true;
  }
  if (view === "user" && id) {
    state.activeUserId = id;
    if (replace) history.replaceState({ view, id }, "", location.href);
    setView("user", { direction, immediate });
    return true;
  }
  if (view === "detail" && id) {
    state.activePostId = id;
    if (replace) history.replaceState({ view, id }, "", location.href);
    setView("detail", { direction, immediate });
    return true;
  }
  if (view === "tool" && params.get("tool")) {
    state.activeToolId = params.get("tool") || "";
    if (replace) history.replaceState({ view, tool: state.activeToolId }, "", location.href);
    setView("tool", { direction, immediate });
    return true;
  }
  if (["home", "circle", "publish", "message", "mine", "search", "login"].includes(view)) {
    if (replace) history.replaceState({ view }, "", location.href);
    setView(view, { direction, immediate });
    return true;
  }
  if (replace) history.replaceState({ view: state.currentView }, "", location.href);
  return false;
}

function openCreateSheet() {
  const sheet = $("[data-create-sheet]");
  sheet?.classList.remove("hidden");
  sheet?.setAttribute("aria-hidden", "false");
}

function closeCreateSheet() {
  const sheet = $("[data-create-sheet]");
  sheet?.classList.add("hidden");
  sheet?.setAttribute("aria-hidden", "true");
}

function openMineMenu() {
  const sheet = $("[data-mine-menu-sheet]");
  sheet?.classList.remove("hidden");
  sheet?.setAttribute("aria-hidden", "false");
}

function closeMineMenu() {
  const sheet = $("[data-mine-menu-sheet]");
  sheet?.classList.add("hidden");
  sheet?.setAttribute("aria-hidden", "true");
}

function handleMineAction(action) {
  closeMineMenu();
  switch (action) {
    case "works":
      navigateLocal("mine");
      break;
    case "favorites":
      navigateLocal("mine");
      break;
    case "pick":
      navigateLocal("mine");
      break;
    case "feedback":
      window.open("https://github.com/CodeManTeam/Pickcat-Reborn/issues", "_blank", "noreferrer");
      break;
    case "settings":
      break;
    case "logout":
      handleLogout();
      break;
    case "about":
      $(".mine-footer")?.scrollIntoView({ behavior: "smooth" });
      break;
  }
}

/** 退出登录：清浏览器 Cookie + 本地缓存，回到首页 */
async function handleLogout() {
  try {
    if (window.PickcatAuth) await window.PickcatAuth.logout();
    else await fetch("/__session", { method: "DELETE" });
  } catch {
    /* ignore */
  }
  state.auth = null;
  state.user = null;
  state.mineWorks = [];
  state.mineFollowers = [];
  state.mineFollowingUsers = [];
  localStorage.removeItem("pickcat:auth");
  localStorage.removeItem("pickcat:user");
  localStorage.removeItem("pickcat:session");
  renderMineShell(null);
  renderMineLoggedOut();
  navigateLocal("home");
  statusToast("已退出登录");
}

function statusToast(text) {
  const node = document.createElement("div");
  node.className = "app-toast";
  node.textContent = text;
  document.body.appendChild(node);
  setTimeout(() => node.classList.add("visible"), 10);
  setTimeout(() => {
    node.classList.remove("visible");
    setTimeout(() => node.remove(), 240);
  }, 1800);
}

function choosePublishType(type) {
  navigateLocal("publish");
  const labels = type === "video" ? ["视频"] : ["动态", "图文"];
  $$(".compose-tools .chip").forEach((chip) => chip.classList.toggle("active", labels.includes(chip.textContent.trim())));
}

function renderToolRunner() {
  const root = $("[data-tool-runner]");
  const tool = toolRegistry[state.activeToolId] || toolRegistry.nemo;
  if (!root || !tool) return;
  const tipByIntegration = {
    "local-static": ["本地部署中", "这个工具已经随 Pickcat 打包，当前页面直接从软件资源目录加载。"],
    adapter: ["适配器入口", "这个项目不是单页工具，Pickcat 会按它的实际结构继续做 workspace 级接入。"]
  };
  const tip = tipByIntegration[tool.integration] || ["内置运行中", "如果页面禁止内嵌或登录跳转受限，点右上角“新窗口”继续使用。"];
  root.classList.remove("tool-loaded");
  root.innerHTML = `
    <section class="tool-runner-head">
      <span class="tool-runner-icon"><img src="${tool.icon}" alt="" /></span>
      <div>
        <em>${escapeHtml(tool.tag || "创作工具")}</em>
        <h2>${escapeHtml(tool.name)}</h2>
        <p>${escapeHtml(tool.desc || "在 Pickcat 内直接使用这个工具。")}</p>
      </div>
      <div class="tool-runner-actions">
        ${tool.updateUrl ? `<a class="text-btn" href="${tool.updateUrl}" target="_blank" rel="noreferrer">检查更新</a>` : ""}
        <a class="text-btn" href="${tool.fallbackUrl || tool.url}" target="_blank" rel="noreferrer">新窗口</a>
      </div>
    </section>
    <section class="tool-runner-frame-wrap">
      <iframe
        class="tool-runner-frame"
        title="${escapeHtml(tool.name)}"
        src="${tool.url}"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera; autoplay; gamepad; midi"
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-downloads"
      ></iframe>
      <button class="tool-fullscreen-btn" type="button" data-tool-fullscreen aria-label="全屏">
        <span class="fs-expand"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg></span>
        <span class="fs-shrink"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l-3 3M12 4l3 3M4 12l-3-3M12 12l3-3"/></svg></span>
      </button>
      <div class="tool-runner-tip">
        <strong>${escapeHtml(tip[0])}</strong>
        <span>${escapeHtml(tip[1])}</span>
      </div>
    </section>
  `;
  const frame = $(".tool-runner-frame", root);
  frame?.addEventListener("load", () => {
    root.classList.add("tool-loaded");
  });
  $("[data-tool-fullscreen]", root)?.addEventListener("click", () => {
    document.body.classList.toggle("tool-fullscreen");
  });
}

function renderHistory() {
  $("[data-history]").replaceChildren(
    ...state.history.map((word) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = word;
      chip.addEventListener("click", () => runSearch(word));
      return chip;
    })
  );
}

function matchesKeyword(value, keyword) {
  return String(value || "").toLowerCase().includes(String(keyword || "").toLowerCase());
}

function createSearchSection(title, count, nodes = [], emptyText = "没有结果") {
  const section = document.createElement("section");
  section.className = "work-comments-section";
  section.innerHTML = `
    <div class="section-head flush">
      <h2>${title}</h2>
      <span class="text-btn text-btn-static">${compactNumber(count)}</span>
    </div>
  `;
  section.append(...(nodes.length ? nodes : [statusCard(emptyText)]));
  return section;
}

async function searchWorks(keyword) {
  const [home, discover0, discover1, discover2] = await Promise.all([
    api.homeWorks().catch(() => []),
    api.discoverWorks(0, 12).catch(() => ({ items: [] })),
    api.discoverWorks(12, 12).catch(() => ({ items: [] })),
    api.discoverWorks(24, 12).catch(() => ({ items: [] }))
  ]);
  const discoverItems = [
    ...(Array.isArray(home) ? home : home.recommend_work_list || []),
    ...(discover0.items || discover0.data?.items || discover0.data || []),
    ...(discover1.items || discover1.data?.items || discover1.data || []),
    ...(discover2.items || discover2.data?.items || discover2.data || []),
    ...state.discoverWorks
  ];
  const seen = new Set();
  return discoverItems
    .map((item) => (item?.engineLabel ? item : normalizeFeedWork(item)))
    .filter((work) => {
      if (!work?.id || seen.has(work.id)) return false;
      seen.add(work.id);
      const haystack = [
        work.name,
        work.description,
        work.author?.nickname,
        ...(work.labels || []).map((label) => label.name || label.label_name || label)
      ].join(" ");
      return matchesKeyword(haystack, keyword);
    });
}

async function runSearch(keyword) {
  const value = keyword.trim();
  if (!value) return;
  state.history = [value, ...state.history.filter((item) => item !== value)].slice(0, 8);
  renderHistory();
  navigateLocal("search", { q: value });
  $("[data-search-input]").value = value;
  $("[data-search-tabs]")?.classList.add("hidden");
  const postsRoot = $("[data-search-results-posts]");
  const worksRoot = $("[data-search-results-works]");
  postsRoot.classList.remove("hidden");
  worksRoot.classList.add("hidden");
  $$("[data-search-tab]").forEach((t) => t.classList.toggle("active", t.dataset.searchTab === "posts"));
  postsRoot.replaceChildren(loadingCard(`正在搜索：${value}`, "搜索中"));
  worksRoot.replaceChildren(loadingCard(`正在搜索：${value}`, "搜索中"));
  try {
    const [postResult, works] = await Promise.all([api.searchPosts(value, 20), searchWorks(value)]);
    const posts = (postResult.items || []).map(normalizePost);
    postsRoot.replaceChildren(
      ...(posts.length ? posts.map(createPost) : [statusCard("没有找到相关帖子")])
    );
    worksRoot.replaceChildren(
      ...(works.length ? works.map(createHomeWorkCard) : [statusCard("没有找到相关作品")])
    );
    $("[data-search-tabs]")?.classList.toggle("hidden", !posts.length && !works.length);
  } catch (error) {
    postsRoot.replaceChildren(errorCard(`搜索失败：${error.message}`, "搜索失败"));
    worksRoot.replaceChildren();
  }
}

function openPost(id) {
  state.activePostId = String(id);
  navigateLocal("detail", { id });
}

async function renderPostDetail(id) {
  const root = $("[data-detail]");
  root.replaceChildren(loadingCard(`正在读取帖子 ${id}...`, "帖子加载中"));
  try {
    const detail = await api.postDetail(id);
    const detailUser = {
      id: detail.user?.id || detail.user_id || "",
      nickname: detail.user?.nickname || "不存在的用户",
      avatar: proxyMediaUrl(detail.user?.avatar_url || "")
    };
    root.innerHTML = `
      <h2>${detail.title}</h2>
      <div class="detail-meta">
        ${
          detailUser.avatar
            ? `<img class="avatar-img clickable-avatar" data-detail-user="${detailUser.id}" src="${detailUser.avatar}" alt="" />`
            : `<button type="button" class="mini-avatar user-avatar-btn" data-detail-user="${detailUser.id}">${avatarText(detailUser.nickname)}</button>`
        }
        ${
          detailUser.id
            ? `<button type="button" class="user-inline-btn" data-detail-user="${detailUser.id}">${escapeHtml(detailUser.nickname)}</button>`
            : `<span>${escapeHtml(detailUser.nickname)}</span>`
        }
        <span>${detail.board_name || "社区"}</span>
        <span>${formatDate(detail.created_at)}</span>
      </div>
      <div class="detail-stats"><span>${compactNumber(detail.n_views)} 浏览</span><span>${compactNumber(detail.n_replies)} 回帖</span><span>${compactNumber(detail.n_comments)} 评论</span></div>
      <div class="detail-actions">
        <button class="action-btn ${detail.liked ? "active" : ""}" type="button" data-detail-like>
          <img class="action-img" src="public/assets/pickcat/ic_home_rec_pick.png" alt="" />
          <span data-detail-like-count>${compactNumber(detail.n_likes)}</span>
        </button>
        <button class="action-btn ${detail.bookmark_id ? "active" : ""}" type="button" data-detail-bookmark>
          <img class="action-img" src="${ASSETS.pick}" alt="" />
          <span data-detail-bookmark-text>${detail.bookmark_id ? "已收藏" : "收藏"}</span>
        </button>
      </div>
      <div class="detail-content">${sanitizeHtml(detail.content)}</div>
      <section class="detail-replies">
        <div class="section-head">
          <h2>评论与回帖</h2>
          <button class="text-btn" type="button" data-refresh-replies>刷新</button>
        </div>
        <form class="detail-reply-form" data-reply-form>
          <textarea data-reply-input maxlength="500" placeholder="写下你的评论"></textarea>
          <button class="primary-btn" type="submit">${state.auth?.token ? "发送评论" : "登录后评论"}</button>
        </form>
        <div class="reply-list" data-reply-list>
          <div class="loading-card is-loading">${stateCardMarkup("正在读取回帖...", { tone: "loading", title: "评论加载中" })}</div>
        </div>
      </section>
    `;
    $$("[data-detail-user]", root).forEach((button) =>
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (detailUser.id) openUserReader(detailUser);
      })
    );
    bindImageViewer($(".detail-content", root));

    const detailLikeBtn = $("[data-detail-like]", root);
    detailLikeBtn?.addEventListener("click", async () => {
      if (!state.auth?.token) {
        statusToast("请先登录再点赞");
        navigateLocal("login");
        return;
      }
      if (!detail.first_post_id) {
        statusToast("这条内容暂不支持点赞");
        return;
      }
      const on = !detail.liked;
      const countEl = $("[data-detail-like-count]", detailLikeBtn);
      detail.liked = on;
      detail.n_likes = Math.max(0, (Number(detail.n_likes) || 0) + (on ? 1 : -1));
      detailLikeBtn.classList.toggle("active", on);
      detailLikeBtn.disabled = true;
      if (countEl) countEl.textContent = compactNumber(detail.n_likes);
      try {
        await api.togglePostLike(detail.first_post_id, on);
      } catch (error) {
        detail.liked = !on;
        detail.n_likes = Math.max(0, (Number(detail.n_likes) || 0) + (on ? -1 : 1));
        detailLikeBtn.classList.toggle("active", !on);
        if (countEl) countEl.textContent = compactNumber(detail.n_likes);
        statusToast(error.message || "点赞失败");
      } finally {
        detailLikeBtn.disabled = false;
      }
    });

    const detailBookmarkBtn = $("[data-detail-bookmark]", root);
    detailBookmarkBtn?.addEventListener("click", async () => {
      if (!state.auth?.token) {
        statusToast("请先登录再收藏");
        navigateLocal("login");
        return;
      }
      const on = !detail.bookmark_id;
      const textEl = $("[data-detail-bookmark-text]", detailBookmarkBtn);
      detailBookmarkBtn.disabled = true;
      try {
        const id = await toggleTopicBookmark(detail.id, on);
        detail.bookmark_id = on ? id || "pending" : null;
        detailBookmarkBtn.classList.toggle("active", on);
        if (textEl) textEl.textContent = on ? "已收藏" : "收藏";
      } catch (error) {
        statusToast(error.message || "收藏失败");
      } finally {
        detailBookmarkBtn.disabled = false;
      }
    });

    bindDetailReplyEvents(id);
    await loadPostReplies(id);
  } catch (error) {
    root.replaceChildren(errorCard(`帖子读取失败：${error.message}`, "帖子读取失败"));
  }
}

function normalizeReply(item) {
  const user = item.user || item.author || {};
  return {
    id: item.id,
    authorId: user.id || user.user_id || item.user_id || "",
    author: user.nickname || item.nickname || "社区用户",
    avatar: proxyMediaUrl(user.avatar_url || item.avatar_url || ""),
    avatarText: avatarText(user.nickname || item.nickname),
    createdAt: item.created_at || item.create_time || 0,
    content: item.content || item.comment || item.reply || "",
    nLikes: item.n_likes || item.liked_total || item.like_count || 0,
    liked: Boolean(item.is_liked || item.liked),
    nComments: item.n_comments || item.comments_total || item.comment_count || 0,
    comments: item.comments || item.earliest_comments || []
  };
}

function createReplyCard(reply) {
  const node = document.createElement("article");
  node.className = "reply-card";
  node.dataset.replyId = reply.id;
  node.innerHTML = `
    ${reply.avatar ? `<img class="mini-avatar-img" src="${reply.avatar}" alt="" />` : `<div class="mini-avatar">${reply.avatarText}</div>`}
    <div class="reply-main">
      <div class="reply-head">
        ${
          reply.authorId
            ? `<button type="button" class="user-inline-btn" data-open-user="${reply.authorId}"><strong>${escapeHtml(reply.author)}</strong></button>`
            : `<strong>${escapeHtml(reply.author)}</strong>`
        }
        <span>${formatDate(reply.createdAt)}</span>
      </div>
      <div class="reply-content">${sanitizeHtml(reply.content)}</div>
      <div class="reply-meta">
        <button type="button" class="${reply.liked ? "liked" : ""}" data-like-reply>${reply.liked ? "已赞" : "赞"} ${compactNumber(reply.nLikes)}</button>
        <button type="button" data-open-reply>回复 ${compactNumber(reply.nComments)}</button>
      </div>
      ${
        reply.comments?.length
          ? `<div class="nested-comments">${reply.comments
              .slice(0, 3)
              .map((comment) => {
                const user = comment.user || {};
                const author = escapeHtml(user.nickname || "社区用户");
                const content = escapeHtml(apiText(comment.content || comment.comment || ""));
                return `<p>${user.id || user.user_id ? `<button type="button" class="comment-user-link" data-open-user="${user.id || user.user_id}"><strong>${author}</strong></button>` : `<strong>${author}</strong>`}：${content}</p>`;
              })
              .join("")}</div>`
          : ""
      }
      <form class="nested-reply-form hidden" data-nested-reply-form>
        <input data-nested-reply-input maxlength="300" placeholder="回复 ${escapeHtml(reply.author)}" />
        <button type="submit">发送</button>
      </form>
    </div>
  `;
  $$("[data-open-user]", node).forEach((button) =>
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openUserReader({ id: button.dataset.openUser, nickname: button.textContent.trim(), avatar: reply.avatar });
    })
  );
  $("[data-like-reply]", node)?.addEventListener("click", async (event) => {
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const button = event.currentTarget;
    const previousLiked = reply.liked;
    const previousLikes = reply.nLikes;
    const nextLiked = !reply.liked;
    reply.liked = nextLiked;
    reply.nLikes = Math.max(0, reply.nLikes + (nextLiked ? 1 : -1));
    button.classList.toggle("liked", nextLiked);
    button.textContent = `${nextLiked ? "已赞" : "赞"} ${compactNumber(reply.nLikes)}`;
    button.disabled = true;
    try {
      await api.toggleReplyLike(reply.id, nextLiked);
    } catch (error) {
      reply.liked = previousLiked;
      reply.nLikes = previousLikes;
      button.classList.toggle("liked", previousLiked);
      button.textContent = `${previousLiked ? "已赞" : "赞"} ${compactNumber(previousLikes)}`;
      button.title = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $("[data-open-reply]", node)?.addEventListener("click", () => {
    $("[data-nested-reply-form]", node)?.classList.toggle("hidden");
  });
  $("[data-nested-reply-form]", node)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const input = $("[data-nested-reply-input]", node);
    const content = input.value.trim();
    if (!content) return;
    const button = event.currentTarget.querySelector("button");
    button.disabled = true;
    button.textContent = "发送中";
    try {
      await api.createReplyComment(reply.id, `<p>${escapeHtml(content)}</p>`);
      input.value = "";
      event.currentTarget.classList.add("hidden");
    } catch (error) {
      button.title = error.message;
    } finally {
      button.disabled = false;
      button.textContent = "发送";
    }
  });
  bindImageViewer($(".reply-content", node));
  return node;
}

async function loadPostReplies(postId) {
  const list = $("[data-reply-list]");
  if (!list) return;
  list.replaceChildren(loadingCard("正在读取回帖...", "评论加载中"));
  try {
    const result = await api.postReplies(postId, 1, 10);
    const replies = (result.items || []).map(normalizeReply);
    list.replaceChildren(...(replies.length ? replies.map(createReplyCard) : [statusCard("还没有评论，来坐第一排")]));
    if (state.pendingPostReplyId) {
      const card = list.querySelector(`.reply-card[data-reply-id="${state.pendingPostReplyId}"]`);
      card?.scrollIntoView({ block: "center", behavior: "smooth" });
      card?.classList.add("focus-flash");
      setTimeout(() => card?.classList.remove("focus-flash"), 1800);
      state.pendingPostReplyId = "";
    }
  } catch (error) {
    list.replaceChildren(errorCard(`回帖读取失败：${error.message}`, "评论读取失败"));
  }
}

function bindDetailReplyEvents(postId) {
  $("[data-refresh-replies]")?.addEventListener("click", () => loadPostReplies(postId));
  $("[data-reply-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const input = $("[data-reply-input]");
    const content = input.value.trim();
    if (!content) return;
    const button = event.currentTarget.querySelector("button");
    button.disabled = true;
    button.textContent = "发送中...";
    try {
      await api.createPostReply(postId, `<p>${escapeHtml(content)}</p>`);
      input.value = "";
      await loadPostReplies(postId);
    } catch (error) {
      const list = $("[data-reply-list]");
      list?.prepend(statusCard(`评论发送失败：${error.message}`));
    } finally {
      button.disabled = false;
      button.textContent = "发送评论";
    }
  });
}

function renderMineShell(user) {
  const name = user?.nickname || "未登录";
  const desc = user?.description || "Pickcat 复刻计划 · 前端多端原型";
  const avatar = proxyMediaUrl(user?.avatar_url || user?.avatar);
  const logoutItem = $("[data-mine-action='logout']");
  if (logoutItem) logoutItem.hidden = !state.auth?.token;
  const following = user?.stats?.following ?? (state.mineFollowingUsers.length || 0);
  const followers = user?.stats?.followers ?? (state.mineFollowers.length || 0);
  $(".profile-card").innerHTML = `
    ${avatar ? `<img class="profile-avatar-img" src="${avatar}" alt="" />` : `<div class="avatar">皮</div>`}
    <div class="profile-main">
      <h2>${name}<span class="name-edit" aria-hidden="true">✎</span></h2>
      <div class="profile-follow-row"><span>关注 <b>${following}</b></span><span>粉丝 <b>${followers}</b></span></div>
      <p class="profile-bio">${escapeHtml(desc)}</p>
    </div>
  `;
}

async function renderMinePage() {
  renderMineShell(state.user);
  updateProfileTabs();
  if (!state.auth?.token) {
    renderMineLoggedOut();
    return;
  }
  const root = $("[data-mine-feed]");
  root.replaceChildren(loadingCard("正在读取个人信息和作品列表...", "个人页加载中"));
  try {
    const me = await api.me();
    const [profile, legacy, dynamic, metrics, tiger, centerWorks, published, fanData, following, followingLegacy] = await Promise.all([
      api.userProfile(me.id).catch(() => null),
      api.userProfileLegacy(me.id).catch(() => null),
      api.userDynamicInfo(me.id).catch(() => null),
      api.userBusinessTotal(me.id).catch(() => null),
      api.userTiger(me.id).catch(() => null),
      api.workList(me.id).catch(() => ({ items: [] })),
      api.publishedWorks(me.id).catch(() => ({ data: { works: [] } })),
      api.userFans(me.id, 12).catch(() => ({ items: [] })),
      api.following(me.id, 12).catch(() => ({ items: [] })),
      api.followingLegacy(me.id, 12).catch(() => ({ items: [] }))
    ]);
    const mergedUser = mergeUserProfile(me, profile, legacy, dynamic, metrics, tiger);
    state.user = mergedUser;
    localStorage.setItem("pickcat:user", JSON.stringify(mergedUser));
    const followingUsers = [...responseItems(following), ...responseItems(followingLegacy)];
    state.mineFollowers = responseItems(fanData).map(normalizeUserListItem).filter((item) => item.id);
    state.mineFollowingUsers = followingUsers
      .map(normalizeUserListItem)
      .filter((item, index, list) => item.id && list.findIndex((user) => user.id === item.id) === index);
    state.mineFollowerOffset = responseItems(fanData).length;
    state.mineFollowingOffset = responseItems(following).length;
    mergedUser.stats = {
      ...(mergedUser.stats || {}),
      followers: responseTotal(fanData, state.mineFollowers.length),
      following: responseTotal(following, state.mineFollowingUsers.length)
    };
    const publishedItems = published.data?.works || published.works || published.items || [];
    const centerItems = centerWorks.items || centerWorks.data?.works || [];
    const merged = [...publishedItems, ...centerItems];
    const seen = new Set();
    state.mineWorks = merged
      .map(normalizeWork)
      .filter((work) => {
        const key = work.id || work.name;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    mergedUser.stats = {
      ...(mergedUser.stats || {}),
      works: responseTotal(centerWorks, state.mineWorks.length || mergedUser.stats?.works || 0)
    };
    cacheUser(mergedUser);
    renderMineShell(mergedUser);
    renderMineContent(mergedUser, { total: state.mineWorks.length, items: state.mineWorks });
  } catch (error) {
    root.replaceChildren(errorCard(`登录态不可用：${error.message}`, "登录状态失效"), loginPrompt("重新登录"));
  }
}

function renderMineLoggedOut() {
  const root = $("[data-mine-feed]");
  if (state.mineTab === "activity") {
    root.replaceChildren(loginPrompt("登录后读取个人动态、作品列表和消息"));
  } else if (state.mineTab === "works") {
    root.replaceChildren(statusCard("作品预览需要登录后读取；帖子里识别到作品链接时也会显示预览卡。"));
  } else {
    root.replaceChildren(statusCard("喵圈信息需要登录后读取。"));
  }
}

function renderMineContent(user, worksRaw = { items: [] }) {
  const root = $("[data-mine-feed]");
  const followerTotal = Number(user?.stats?.followers || state.mineFollowers.length);
  const followingTotal = Number(user?.stats?.following || state.mineFollowingUsers.length);
  if (state.mineTab === "activity") {
    const activities = [];
    if (state.mineWorks.length) activities.push(...state.mineWorks.map(createMineActivityCard));
    if (!activities.length) activities.push(statusCard("还没有读取到个人动态"));
    root.replaceChildren(...activities);
  } else if (state.mineTab === "works") {
    root.replaceChildren(...(state.mineWorks.length ? state.mineWorks.map(createWorkCard) : [statusCard("还没有读取到公开作品")]));
  } else {
    root.replaceChildren(
      createCollapsibleUserSection("我的关注", state.mineFollowingUsers, {
        total: followingTotal,
        emptyText: "暂时没有读取到关注列表",
        loadMore: async () => {
          const result = await api.following(user.id, 30, state.mineFollowingOffset);
          const items = responseItems(result);
          state.mineFollowingOffset += items.length;
          return items.map(normalizeUserListItem).filter((item) => item.id);
        }
      }),
      createCollapsibleUserSection("我的粉丝", state.mineFollowers, {
        total: followerTotal,
        emptyText: "暂时没有读取到粉丝列表",
        loadMore: async () => {
          const result = await api.userFans(user.id, 30, state.mineFollowerOffset);
          const items = responseItems(result);
          state.mineFollowerOffset += items.length;
          return items.map(normalizeUserListItem).filter((item) => item.id);
        }
      })
    );
  }
}

function updateProfileTabs() {
  const keys = ["activity", "works", "circles"];
  $$("#mine-view .profile-tabs .tab").forEach((tab, index) => {
    tab.classList.toggle("active", state.mineTab === keys[index]);
  });
}

function createWorkCard(work) {
  const node = document.createElement("article");
  node.className = "work-list-card";
  node.innerHTML = `
    ${work.preview ? `<img src="${work.preview}" alt="" />` : ""}
    <div>
      <h3>${escapeHtml(work.name || "未命名作品")}</h3>
      <p>${escapeHtml(work.description || "暂无介绍")}</p>
      <span>${compactNumber(work.views)} 浏览 · ${compactNumber(work.likes)} 赞 · ${compactNumber(work.forks)} 再创作</span>
    </div>
  `;
  node.addEventListener("click", () => openWorkPreview(work));
  return node;
}

function createMineActivityCard(work) {
  const node = document.createElement("article");
  node.className = "mine-activity-card";
  const activityTime = work.createdAt ? formatDate(work.createdAt) : "已发布";
  node.innerHTML = `
    <div class="activity-dot"></div>
    <div>
      <p>我发布了《${escapeHtml(work.name)}》作品</p>
      <span>${activityTime}</span>
      ${createWorkPreviewMarkup(work)}
    </div>
  `;
  $(".inline-work-preview", node)?.addEventListener("click", () => openWorkPreview(work));
  return node;
}

async function openWorkPreview(work) {
  const base = normalizeWork(work || {});
  let detail = base;
  if (base.id) {
    try {
      detail = normalizeWork(await api.workDetail(base.id));
    } catch {
      detail = base;
    }
  }
  const overlay = document.createElement("div");
  overlay.className = "work-preview-modal";
  cacheWorkForReader(detail);
  overlay.innerHTML = `
    <button class="modal-backdrop" type="button" aria-label="关闭作品预览"></button>
    <article class="work-preview-panel">
      ${detail.preview ? `<img src="${detail.preview}" alt="" />` : `<div class="work-preview-empty">作品预览</div>`}
      <h2>${escapeHtml(detail.name)}</h2>
      <p>${escapeHtml(detail.description || "暂无介绍")}</p>
      <div class="work-preview-stats">
        <span>${compactNumber(detail.views)} 浏览</span>
        <span>${compactNumber(detail.likes)} 赞</span>
        <span>${compactNumber(detail.forks)} 再创作</span>
      </div>
      <div class="work-editor-links">
        ${detail.editorEntries
          .map((entry) =>
            entry.disabled
              ? `<span class="disabled">${entry.label}</span>`
              : entry.tool
                ? `<button type="button" data-open-tool="${entry.tool}">${entry.label}</button>`
                : `<a href="${entry.url}" target="_blank" rel="noreferrer">${entry.label}</a>`
          )
          .join("")}
      </div>
      ${detail.id ? `<a class="primary-link" href="${createWorkReaderUrl(detail)}">打开阅览页</a>` : ""}
    </article>
  `;
  $(".modal-backdrop", overlay).addEventListener("click", () => overlay.remove());
  $(".primary-link", overlay)?.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.remove();
    openWorkReader(detail);
  });
  $$("[data-open-tool]", overlay).forEach((button) => {
    button.addEventListener("click", () => {
      overlay.remove();
      openToolRunner(button.dataset.openTool);
    });
  });
  document.body.appendChild(overlay);
}

function openImageViewer(src, alt = "帖子图片") {
  if (!src) return;
  const safeSrc = escapeHtml(src);
  const originalSrc = escapeHtml(src.startsWith(`${location.origin}/proxy/media?url=`) ? new URL(src).searchParams.get("url") || src : src);
  const overlay = document.createElement("div");
  overlay.className = "image-viewer-modal";
  overlay.innerHTML = `
    <button class="modal-backdrop" type="button" aria-label="关闭图片"></button>
    <figure class="image-viewer-panel">
      <img src="${safeSrc}" alt="${escapeHtml(alt)}" />
      <figcaption>
        <button type="button" class="image-viewer-close">关闭</button>
        <a href="${originalSrc}" target="_blank" rel="noreferrer">打开原图</a>
      </figcaption>
    </figure>
  `;
  const close = () => overlay.remove();
  $(".modal-backdrop", overlay).addEventListener("click", close);
  $(".image-viewer-close", overlay).addEventListener("click", close);
  document.body.appendChild(overlay);
}

function bindImageViewer(root) {
  $$("img", root).forEach((img) => {
    if (!img.src || img.dataset.imageViewerBound) return;
    img.dataset.imageViewerBound = "true";
    img.classList.add("clickable-image");
    img.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openImageViewer(img.dataset.originSrc || img.currentSrc || img.src, img.alt || "帖子图片");
    });
  });
}

function uniqueWorks(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const work = normalizeWork(item);
    const key = work.id || work.name;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createWorkSection(title, items = [], emptyText = "暂时没有内容") {
  const section = document.createElement("section");
  section.className = "work-comments-section";
  const list = items.length ? items.map((item) => createHomeWorkCard(normalizeWork(item))) : [statusCard(emptyText)];
  section.innerHTML = `
    <div class="section-head flush">
      <h2>${title}</h2>
      <button type="button" class="text-btn">${items.length}</button>
    </div>
    <div class="user-work-grid" data-work-section-list></div>
  `;
  $("[data-work-section-list]", section).replaceChildren(...list);
  return section;
}

async function renderWorkReader() {
  const root = $("[data-work-reader]");
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || state.activeWorkId || "";
  if (!id) {
    root.innerHTML = `<div class="work-reader-empty">没有找到作品 ID</div>`;
    return;
  }

  root.replaceChildren(loadingCard("正在读取作品详情和评论...", "作品加载中"));
  let detail = readCachedWork(id) || normalizeWork({ id });
  let comments = [];
  let totalComments = 0;
  let labels = [];
  let relatedWorks = [];
  let authorWorks = [];
  try {
    const [creationDetail, nemoDetail] = await Promise.all([
      api.workDetail(id).catch(() => ({})),
      api.nemoWorkDetail(id).catch(() => ({}))
    ]);
    detail = cacheWorkForReader(
      normalizeWork({
        ...detail,
        ...nemoDetail,
        ...creationDetail,
        player_url_v2: creationDetail.player_url_v2 || nemoDetail.player_url_v2,
        nemo_player_url: nemoDetail.player_url
      })
    );
  } catch {
    detail = cacheWorkForReader(detail);
  }
  try {
    const [commentData, labelData, relatedData] = await Promise.all([
      api.workComments(id).catch(() => ({ items: [] })),
      api.workLabels(id).catch(() => ({ items: [] })),
      api.workRecommended(id).catch(() => ({ items: [] }))
    ]);
    comments = (commentData.items || commentData.data?.items || []).map(normalizeWorkComment);
    totalComments = commentData.total || commentData.data?.total || detail.comments || comments.length;
    labels = Array.isArray(labelData) ? labelData : labelData.items || labelData.data?.items || labelData.data || [];
    relatedWorks = uniqueWorks(Array.isArray(relatedData) ? relatedData : relatedData.items || relatedData.data?.items || relatedData.list || []);
  } catch {
    comments = [];
  }
  if (detail.author.id) {
    try {
      const [published, center] = await Promise.all([
        api.publishedWorks(detail.author.id, 6).catch(() => ({ data: { works: [] } })),
        api.workList(detail.author.id).catch(() => ({ items: [] }))
      ]);
      authorWorks = uniqueWorks([...(published.data?.works || published.works || []), ...(center.items || center.data?.works || [])]).filter(
        (item) => String(normalizeWork(item).id) !== String(id)
      );
    } catch {
      authorWorks = [];
    }
  }
  if (labels.length) {
    detail = cacheWorkForReader({
      ...detail,
      labels: labels.map((label) => ({ name: label.label_name || label.name || label }))
    });
  }

  root.innerHTML = `
    <section class="work-reader-hero">
      <div class="work-reader-stage" data-player-stage>
        ${detail.preview ? `<img class="work-reader-cover" src="${detail.preview}" alt="" />` : `<div class="work-reader-cover work-reader-empty">作品预览</div>`}
        ${
          detail.playerUrl
            ? `<button class="play-badge play-start" type="button" data-start-player aria-label="播放作品">Play</button>`
            : `<span class="play-badge is-off">无法内嵌</span>`
        }
      </div>
      <div class="work-reader-title">
        <h2>${escapeHtml(detail.name)}</h2>
        <span>${detail.labels.map((label) => escapeHtml(label.name || label)).join(" · ") || detail.engineLabel || "作品"}${detail.createdAt ? ` · ${formatDate(detail.createdAt)} 发布` : ""}</span>
      </div>
    </section>

    <section class="work-author-card">
      ${detail.author.avatar ? `<img class="avatar-img" src="${detail.author.avatar}" alt="" />` : `<div class="avatar">${avatarText(detail.author.nickname)}</div>`}
      <div>
        ${
          detail.author.id
            ? `<button type="button" class="user-inline-btn" data-work-user="${detail.author.id}"><strong>${escapeHtml(detail.author.nickname || "PICKCAT 用户")}</strong></button>`
            : `<strong>${escapeHtml(detail.author.nickname || "PICKCAT 用户")}</strong>`
        }
        <p>${escapeHtml(detail.author.signature || " ")}</p>
      </div>
      ${
        detail.author.id
          ? `<button type="button" class="follow-chip ${detail.author.followed ? "active" : ""} ${state.auth?.token ? "" : "disabled"}" data-follow-author>${state.auth?.token ? (detail.author.followed ? "已关注" : "关注") : "登录后关注"}</button>`
          : ""
      }
    </section>

    <section class="work-reader-panel">
      <div class="work-action-row icon-actions">
        <span class="action" title="浏览"><img class="action-img" src="${ASSETS.view}" alt="" />${compactNumber(detail.views)}</span>
        <button type="button" class="action ${detail.liked ? "active" : ""} ${state.auth?.token ? "" : "disabled"}" title="点赞" data-work-like><img class="action-img" src="public/assets/pickcat/ic_home_rec_pick.png" alt="" />${compactNumber(detail.likes)}</button>
        <button type="button" class="action ${detail.collected ? "active" : ""} ${state.auth?.token ? "" : "disabled"}" title="收藏" data-work-collect><img class="action-img" src="${ASSETS.pick}" alt="" />${compactNumber(detail.collects)}</button>
        <button type="button" class="action ${state.auth?.token ? "" : "disabled"}" title="评论" data-focus-comment><img class="action-img" src="${ASSETS.homeComment}" alt="" />${compactNumber(detail.comments || totalComments)}</button>
        <button type="button" class="action" title="分享" data-work-share><img class="action-img" src="${ASSETS.share}" alt="" />分享</button>
      </div>
      <div class="work-ext-links">
        ${detail.playerUrl ? `<a class="work-ext-link" href="${detail.playerUrl}" target="_blank" rel="noreferrer">在 ${escapeHtml(detail.engineLabel || "官方")} 播放器中打开</a>` : ""}
        <a class="work-ext-link ghost" href="${detail.originalUrl || "https://pickcat.dao3.fun/"}" target="_blank" rel="noreferrer">查看 PICKCAT 官方页</a>
      </div>
      <h3>作品简介</h3>
      <p>${escapeHtml(detail.description || "暂无介绍")}</p>
      ${detail.operation?.trim() ? `<h3>操作说明</h3><p>${escapeHtml(detail.operation)}</p>` : ""}
    </section>

    <section class="work-comments-section">
      <div class="section-head flush">
        <h2>评论</h2>
        <button type="button" class="text-btn">${compactNumber(totalComments || detail.comments)} 条</button>
      </div>
      <form class="work-comment-composer" data-work-comment-form>
        <textarea name="content" placeholder="写下你的评论，和作者聊聊吧"></textarea>
        <div class="composer-actions">
          <span>${state.auth?.token ? "将以当前账号发表评论" : "登录后可发表评论"}</span>
          <button type="submit">${state.auth?.token ? "发送评论" : "去登录"}</button>
        </div>
      </form>
      <div class="work-comments-list" data-work-comments></div>
    </section>
  `;
  markPlaceholderCovers(root);
  $("[data-work-user]", root)?.addEventListener("click", (event) => {
    event.stopPropagation();
    openUserReader(detail.author);
  });
  $("[data-start-player]", root)?.addEventListener("click", async () => {
    const stage = $("[data-player-stage]", root);
    setNativePlayerMode(true);
    const src = detail.playerUrls?.[0] || detail.playerUrl;

    // MOSS 作品需要先换取 MOSS 会话（服务端用 PICKCAT 会话走一次 OIDC）
    if (detail.engine === "moss") {
      const ok = await ensureMossSession();
      if (!ok) {
        stage.innerHTML = `
          <div class="player-sso-fail">
            <p>${escapeHtml(state.mossSsoMessage || "MOSS 会话未就绪")}</p>
            <div class="player-sso-actions">
              <button type="button" data-sso-login>重新登录 PICKCAT</button>
              <a href="${detail.originalUrl || "https://pickcat.dao3.fun/"}" target="_blank" rel="noreferrer">打开官方页</a>
              <button type="button" data-sso-back>返回作品页</button>
            </div>
          </div>`;
        $("[data-sso-login]", stage)?.addEventListener("click", () => {
          setNativePlayerMode(false);
          navigateLocal("login");
        });
        $("[data-sso-back]", stage)?.addEventListener("click", () => {
          setNativePlayerMode(false);
          renderWorkReader();
        });
        return;
      }
    }
    stage.innerHTML = `<button class="player-back-btn" type="button" aria-label="退出全屏"><img src="public/assets/pickcat/imoji_back.png" alt="" /></button>` +
      `<iframe title="${escapeHtml(detail.name)}" src="${src}" loading="lazy" allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"></iframe>` +
      `<div class="player-fallback"><span>提示需要登录 / 画面空白？</span><a href="${src}" target="_blank" rel="noreferrer">新窗口打开播放器</a><a href="${detail.originalUrl || "https://pickcat.dao3.fun/"}" target="_blank" rel="noreferrer">PICKCAT 官方页</a></div>`;
    const backBtn = $(".player-back-btn", stage);
    backBtn?.addEventListener("click", () => {
      setNativePlayerMode(false);
      renderWorkReader();
    });
  });
  $("[data-work-fullscreen-toggle]", root)?.addEventListener("click", () => {
    const isFullscreen = document.body.classList.contains("player-landscape");
    if (isFullscreen) {
      setNativePlayerMode(false);
      renderWorkReader();
    } else {
      const startBtn = $("[data-start-player]", root);
      if (startBtn) startBtn.click();
    }
  });
  $("[data-focus-comment]", root)?.addEventListener("click", () => {
    const textarea = $("textarea[name='content']", root);
    textarea?.focus();
  });
  $("[data-work-share]", root)?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const shareUrl = detail.shareUrl || detail.originalUrl || (detail.id ? createWorkReaderUrl(detail) : location.href);
    if (!shareUrl) return;
    const title = detail.name || "Pickcat 作品";
    const reset = (text = "分享作品") => {
      button.disabled = false;
      button.textContent = text;
    };
    button.disabled = true;
    button.textContent = "分享中...";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} · Pickcat`, url: shareUrl });
        reset("已调用分享");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        reset("链接已复制");
      } else {
        window.open(shareUrl, "_blank", "noopener,noreferrer");
        reset("已打开分享页");
      }
    } catch {
      reset("分享失败");
    }
    setTimeout(() => reset(), 1600);
  });
  $$("[data-open-tool]", root).forEach((button) => {
    button.addEventListener("click", () => openToolRunner(button.dataset.openTool));
  });
  $("[data-follow-author]", root)?.addEventListener("click", async (event) => {
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const button = event.currentTarget;
    const next = !detail.author.followed;
    const prevFollowers = Number(detail.author.stats?.followers || 0);
    button.disabled = true;
    button.classList.toggle("active", next);
    button.textContent = next ? "已关注" : "关注";
    applyFollowChange(detail.author, next);
    try {
      await api.toggleFollowUser(detail.author.id, next);
    } catch (error) {
      detail.author.stats = { ...(detail.author.stats || {}), followers: prevFollowers };
      applyFollowChange(detail.author, !next);
      button.classList.toggle("active", !next);
      button.textContent = !next ? "已关注" : "关注";
      button.title = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $("[data-work-like]", root)?.addEventListener("click", async (event) => {
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const button = event.currentTarget;
    const next = !detail.liked;
    const prevLikes = detail.likes;
    detail.liked = next;
    detail.likes = Math.max(0, detail.likes + (next ? 1 : -1));
    button.classList.toggle("active", next);
    button.textContent = `${next ? "已点赞" : "点赞"} ${compactNumber(detail.likes)}`;
    button.disabled = true;
    try {
      await api.toggleWorkLike(id, next);
    } catch (error) {
      detail.liked = !next;
      detail.likes = prevLikes;
      button.classList.toggle("active", !next);
      button.textContent = `${!next ? "已点赞" : "点赞"} ${compactNumber(prevLikes)}`;
      button.title = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $("[data-work-collect]", root)?.addEventListener("click", async (event) => {
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const button = event.currentTarget;
    const next = !detail.collected;
    const prevCollects = detail.collects;
    detail.collected = next;
    detail.collects = Math.max(0, detail.collects + (next ? 1 : -1));
    button.classList.toggle("active", next);
    button.textContent = `${next ? "已收藏" : "收藏"} ${compactNumber(detail.collects)}`;
    button.disabled = true;
    try {
      await api.toggleWorkCollection(id, next);
    } catch (error) {
      detail.collected = !next;
      detail.collects = prevCollects;
      button.classList.toggle("active", !next);
      button.textContent = `${!next ? "已收藏" : "收藏"} ${compactNumber(prevCollects)}`;
      button.title = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $("[data-work-comment-form]", root)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const form = event.currentTarget;
    const textarea = $("textarea[name='content']", form);
    const button = $("button[type='submit']", form);
    const content = textarea?.value.trim();
    if (!content) return;
    button.disabled = true;
    button.textContent = "发送中...";
    try {
      await api.createWorkComment(id, content);
      textarea.value = "";
      await renderWorkReader();
    } catch (error) {
      button.title = error.message;
      button.textContent = "发送失败";
      setTimeout(() => {
        button.textContent = "发送评论";
      }, 1200);
    } finally {
      button.disabled = false;
      if (button.textContent !== "发送失败") button.textContent = "发送评论";
    }
  });
  const list = $("[data-work-comments]", root);
  const loadedComments = [...comments];
  const bindCommentLikes = () => {
    $$("[data-like-work-comment]", list).forEach((button) => {
      button.addEventListener("click", async (event) => {
        if (!state.auth?.token) {
          navigateLocal("login");
          return;
        }
        const current = loadedComments.find((comment) => String(comment.id) === String(button.dataset.likeWorkComment));
        if (!current) return;
        const target = event.currentTarget;
        const next = !current.liked;
        const prev = current.likes;
        current.liked = next;
        current.likes = Math.max(0, current.likes + (next ? 1 : -1));
        target.classList.toggle("liked", next);
        target.textContent = `${next ? "已赞" : "赞"} ${compactNumber(current.likes)}`;
        target.disabled = true;
        try {
          await api.toggleWorkCommentLike(id, current.id, next);
        } catch (error) {
          current.liked = !next;
          current.likes = prev;
          target.classList.toggle("liked", !next);
          target.textContent = `${!next ? "已赞" : "赞"} ${compactNumber(prev)}`;
          target.title = error.message;
        } finally {
          target.disabled = false;
        }
      });
    });
  };
  const bindCommentReplies = () => {
    $$("[data-open-work-reply]", list).forEach((button) => {
      button.addEventListener("click", () => {
        list.querySelector(`[data-work-comment-reply-form="${button.dataset.openWorkReply}"]`)?.classList.toggle("hidden");
      });
    });
    $$("[data-work-comment-reply-form]", list).forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!state.auth?.token) {
          navigateLocal("login");
          return;
        }
        const commentId = form.dataset.workCommentReplyForm;
        const input = $("[data-work-comment-reply-input]", form);
        const button = $("button", form);
        const content = input?.value.trim();
        if (!commentId || !content) return;
        button.disabled = true;
        button.textContent = "发送中";
        try {
          await api.createWorkCommentReply(id, commentId, content);
          state.pendingWorkCommentId = String(commentId);
          await renderWorkReader();
        } catch (error) {
          button.title = error.message;
        } finally {
          button.disabled = false;
          button.textContent = "发送";
        }
      });
    });
  };
  const renderLoadedComments = () => {
    const cards = loadedComments.length ? loadedComments.map((comment) => createWorkCommentCard(comment)) : [statusCard("暂时没有读取到评论")];
    list.replaceChildren(...cards);
    if (loadedComments.length && loadedComments.length < (totalComments || detail.comments || 0)) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "load-more-btn";
      more.textContent = "加载更多";
      more.addEventListener("click", async () => {
        more.disabled = true;
        more.textContent = "加载中...";
        try {
          const nextData = await api.workComments(id, loadedComments.length, 10);
          const nextComments = (nextData.items || nextData.data?.items || []).map(normalizeWorkComment);
          totalComments = nextData.total || nextData.data?.total || totalComments;
          loadedComments.push(...nextComments.filter((nextComment) => !loadedComments.some((item) => item.id === nextComment.id)));
          renderLoadedComments();
        } catch (error) {
          more.textContent = "加载失败";
          more.title = error.message;
          more.disabled = false;
        }
      });
      list.appendChild(more);
    }
    bindCommentLikes();
    bindCommentReplies();
    if (state.pendingWorkCommentId) {
      const card = list.querySelector(`.work-comment-card[data-comment-id="${state.pendingWorkCommentId}"]`);
      card?.scrollIntoView({ block: "center", behavior: "smooth" });
      card?.classList.add("focus-flash");
      setTimeout(() => card?.classList.remove("focus-flash"), 1800);
      state.pendingWorkCommentId = "";
    }
  };
  renderLoadedComments();
  root.append(createWorkSection("TA 的更多作品", authorWorks.slice(0, 4), "作者公开作品暂时没有读取到"));
  root.append(createWorkSection("推荐作品", relatedWorks.slice(0, 4), "暂时没有读取到推荐作品"));
}

async function renderUserReader() {
  const root = $("[data-user-reader]");
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || state.activeUserId || "";
  if (!id) {
    root.replaceChildren(errorCard("没有找到用户 ID", "用户读取失败"));
    return;
  }
  root.replaceChildren(loadingCard("正在读取用户主页...", "用户页加载中"));
  let user = readCachedUser(id) || { id, nickname: "PICKCAT 用户", avatar: "", description: "", stats: {} };
  let works = [];
  let fans = [];
  let followingUsers = [];
  let fanOffset = 0;
  let followingOffset = 0;
  try {
    const [profile, legacy, dynamic, metrics, tiger, centerWorks, oldCenterWorks, published, fanData, following, followingLegacy] = await Promise.all([
      api.userProfile(id).catch(() => null),
      api.userProfileLegacy(id).catch(() => null),
      api.userDynamicInfo(id).catch(() => null),
      api.userBusinessTotal(id).catch(() => null),
      api.userTiger(id).catch(() => null),
      api.userCenterWorks(id, 12).catch(() => ({ items: [] })),
      api.workList(id).catch(() => ({ items: [] })),
      api.publishedWorks(id, 12).catch(() => ({ data: { works: [] } })),
      api.userFans(id, 30).catch(() => ({ items: [] })),
      api.following(id, 30).catch(() => ({ items: [] })),
      api.followingLegacy(id, 30).catch(() => ({ items: [] }))
    ]);
    user = mergeUserProfile(user, profile, legacy, dynamic, metrics, tiger);
    const publishedItems = published.data?.works || published.works || [];
    const centerItems = centerWorks.items || centerWorks.data?.works || [];
    const oldCenterItems = oldCenterWorks.items || oldCenterWorks.data?.works || [];
    works = uniqueWorks([...centerItems, ...oldCenterItems, ...publishedItems]).map((item) => {
      const work = normalizeWork(item);
      work.author = {
        ...work.author,
        id: work.author.id || user.id,
        nickname: work.author.nickname || user.nickname,
        avatar: work.author.avatar || user.avatar
      };
      cacheWorkForReader(work);
      return work;
    });
    const fanItems = responseItems(fanData);
    const followingItems = responseItems(following);
    const legacyFollowingItems = responseItems(followingLegacy);
    fanOffset = fanItems.length;
    followingOffset = followingItems.length;
    fans = fanItems.map(normalizeUserListItem).filter((item) => item.id);
    followingUsers = [...followingItems, ...legacyFollowingItems]
      .map(normalizeUserListItem)
      .filter((item, index, list) => item.id && list.findIndex((userItem) => userItem.id === item.id) === index);
    user = cacheUser({
      ...user,
      stats: {
        ...(user.stats || {}),
        followers: responseTotal(fanData, fans.length),
        following: responseTotal(following, followingUsers.length),
        works: responseTotal(centerWorks, works.length || user.stats?.works || 0)
      }
    });
    if (works[0]?.id) {
      const detail = normalizeWork(await api.workDetail(works[0].id));
      user = cacheUser({
        ...user,
        nickname: detail.author.nickname || works[0].author.nickname || user.nickname,
        avatar: detail.author.avatar || works[0].author.avatar || user.avatar,
        description: detail.author.signature || user.description || `${works.length} 个公开作品`
      });
    }
  } catch (error) {
    user = cacheUser(user);
    root.replaceChildren(errorCard(`用户资料读取不完整：${error.message}`, "用户资料读取失败"));
  }
  root.innerHTML = `
    <section class="user-reader-hero ${user.cover ? "has-cover" : ""}">
      ${user.cover ? `<img class="user-reader-cover" src="${user.cover}" alt="" />` : ""}
      <div class="user-reader-profile">
        ${user.avatar ? `<img class="user-reader-avatar" src="${user.avatar}" alt="" />` : `<div class="avatar user-reader-avatar-fallback">${avatarText(user.nickname)}</div>`}
        <h2>${escapeHtml(user.nickname || "PICKCAT 用户")}</h2>
        <p>${escapeHtml(user.description || "这个用户还没有留下签名")}</p>
        ${user.doing ? `<div class="user-doing">${escapeHtml(user.doing)}</div>` : ""}
        <div class="user-reader-links">
          <button type="button" class="follow-chip ${user.followed ? "active" : ""} ${state.auth?.token ? "" : "disabled"}" data-follow-reader>${state.auth?.token ? (user.followed ? "已关注" : "关注") : "登录后关注"}</button>
          <a class="secondary-link" href="https://pickcat.dao3.fun/profile/${id}" target="_blank" rel="noreferrer">打开官方主页</a>
        </div>
      </div>
    </section>
    <section class="user-stat-strip">
      <span><strong>${compactNumber(user.stats?.works || works.length)}</strong><em>作品</em></span>
      <span><strong>${compactNumber(user.stats?.followers)}</strong><em>粉丝</em></span>
      <span><strong>${compactNumber(user.stats?.following)}</strong><em>关注</em></span>
      <span><strong>${compactNumber(user.stats?.likes)}</strong><em>获赞</em></span>
    </section>
    <section class="work-comments-section">
      <div class="section-head flush"><h2>作品</h2><button type="button" class="text-btn">${works.length} 个</button></div>
      <div class="user-work-grid" data-user-works></div>
    </section>
    <div data-user-fans-section></div>
    <div data-user-following-section></div>
  `;
  const list = $("[data-user-works]", root);
  list.replaceChildren(...(works.length ? works.map(createHomeWorkCard) : [statusCard("暂时没有读取到公开作品")]));
  $("[data-user-fans-section]", root)?.replaceWith(
    createCollapsibleUserSection("粉丝", fans, {
      total: Number(user.stats?.followers || fans.length),
      emptyText: "暂时没有读取到粉丝列表",
      loadMore: async () => {
        const result = await api.userFans(id, 30, fanOffset);
        const items = responseItems(result);
        fanOffset += items.length;
        return items.map(normalizeUserListItem).filter((item) => item.id);
      }
    })
  );
  $("[data-user-following-section]", root)?.replaceWith(
    createCollapsibleUserSection("关注", followingUsers, {
      total: Number(user.stats?.following || followingUsers.length),
      emptyText: "暂时没有读取到关注列表",
      loadMore: async () => {
        const result = await api.following(id, 30, followingOffset);
        const items = responseItems(result);
        followingOffset += items.length;
        return items.map(normalizeUserListItem).filter((item) => item.id);
      }
    })
  );
  $("[data-follow-reader]", root)?.addEventListener("click", async (event) => {
    if (!state.auth?.token) {
      navigateLocal("login");
      return;
    }
    const button = event.currentTarget;
    const next = !user.followed;
    const prevFollowers = Number(user.stats?.followers || 0);
    const followerCount = root.querySelector(".user-stat-strip span:nth-child(2) strong");
    applyFollowChange(user, next);
    if (followerCount) followerCount.textContent = compactNumber(user.stats?.followers);
    button.classList.toggle("active", next);
    button.textContent = next ? "已关注" : "关注";
    button.disabled = true;
    try {
      await api.toggleFollowUser(id, next);
    } catch (error) {
      user.stats = { ...(user.stats || {}), followers: prevFollowers };
      applyFollowChange(user, !next);
      if (followerCount) followerCount.textContent = compactNumber(user.stats?.followers);
      button.classList.toggle("active", !next);
      button.textContent = !next ? "已关注" : "关注";
      button.title = error.message;
    } finally {
      button.disabled = false;
    }
  });
}

function loginPrompt(text) {
  const node = document.createElement("button");
  node.type = "button";
  node.className = "loading-card login-prompt";
  node.textContent = text;
  node.addEventListener("click", () => navigateLocal("login"));
  return node;
}

function parseRecordContent(content) {
  if (!content) return {};
  if (typeof content === "object") {
    return content;
  }
  const text = String(content).trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function parsePossibleJson(value) {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (typeof current !== "string") return current;
    const text = current.trim();
    if (!text) return "";
    if (!/^[{["]/.test(text)) return text;
    try {
      current = JSON.parse(text);
    } catch {
      return text;
    }
  }
  return current;
}

function messageTypeLabel(type = "") {
  const labels = {
    COMMENT_REPLY: "回复",
    POST_REPLY_AUTHOR: "帖子回复",
    POST_COMMENT: "评论",
    POST_REPLY: "回帖",
    WORK_COMMENT: "作品评论",
    WORK_REPLY: "作品回复",
    REPLY_COMMENT: "评论回复",
    LIKE_FORK: "点赞",
    WORK_LIKE: "作品点赞",
    COMMENT_LIKE: "评论点赞",
    REPLY_LIKE: "回复点赞",
    post_liked: "帖子被赞",
    post_unliked: "取消赞",
    user_followed: "新增关注",
    topic_reply: "话题回复",
    reply_created: "收到回复",
    comment_created: "收到评论",
    work_liked: "作品被赞",
    work_commented: "作品评论",
    badge_granted: "获得徽章",
    mention: "被提及",
    WORK_COLLECT: "收藏",
    FOLLOW: "关注",
    SYSTEM: "系统",
    system: "系统",
    comment: "评论",
    reply: "回复"
  };
  return labels[type] || type.replaceAll("_", " ").toLowerCase();
}

function readableMessageText(value) {
  const data = parsePossibleJson(value);
  if (typeof data === "string") return apiText(data);
  if (!data || typeof data !== "object") return "";

  const message = parsePossibleJson(data.message);
  const candidates = [
    data.comment,
    data.reply,
    data.content,
    data.text,
    data.body,
    data.summary,
    data.reason,
    message && typeof message === "object" ? message.comment : "",
    message && typeof message === "object" ? message.reply : "",
    message && typeof message === "object" ? message.content : "",
    message && typeof message === "object" ? message.text : "",
    message && typeof message === "object" ? message.summary : "",
    message && typeof message === "object" ? message.reason : ""
  ];

  for (const candidate of candidates) {
    const parsed = parsePossibleJson(candidate);
    if (typeof parsed === "string" && parsed.trim()) return apiText(parsed);
    if (parsed && typeof parsed === "object") {
      const nested = readableMessageText(parsed);
      if (nested) return nested;
    }
  }

  if (message && typeof message === "object") return message.business_name || message.work_name || message.post_title || "";
  return data.business_name || data.work_name || data.post_title || data.title || "";
}

function messageSender(content, item) {
  const message = parsePossibleJson(content.message);
  return content.sender || (message && typeof message === "object" ? message.sender : null) || item.sender || {};
}

function messageTitle(content, item) {
  const message = parsePossibleJson(content.message);
  const nestedTitle =
    message && typeof message === "object"
      ? message.business_name || message.work_name || message.post_title || message.title
      : "";
  return content.business_name || content.work_name || content.post_title || content.title || nestedTitle || item.business_name || messageTypeLabel(item.type);
}

function readMessageId(candidates = []) {
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null || candidate === "") continue;
    const source = typeof candidate === "object" ? candidate.id || candidate.work_id || candidate.post_id : candidate;
    const match = String(source).match(/\d+/);
    if (match) return match[0];
  }
  return "";
}

function readMessageUrl(candidates = []) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (typeof candidate === "string" && /^https?:\/\//.test(candidate)) return candidate;
  }
  return "";
}

function messageTarget(content, item) {
  const message = parsePossibleJson(content.message);
  const type = String(item.type || "");
  const url = readMessageUrl([item.target_url, item.source_url, content.target_url, content.source_url, message?.target_url, message?.source_url]);
  const postId =
    readMessageId([item.post_id, item.target_id, item.resource_id, content.post_id, content.target_id, content.business_id, content.resource_id, message?.post_id, message?.business_id, message?.target_id]) ||
    readMessageId([url.match(/post\/(\d+)/)?.[1], url.match(/community\/(\d+)/)?.[1]]);
  const workId =
    readMessageId([item.work_id, item.target_id, item.resource_id, content.work_id, content.business_id, content.source_id, content.resource_id, message?.work_id, message?.business_id, message?.source_id, message?.target_id]) ||
    readMessageId([url.match(/work\/(\d+)/)?.[1]]);
  const replyId = readMessageId([item.reply_id, item.comment_id, content.reply_id, content.comment_id, content.source_id, message?.reply_id, message?.comment_id, message?.source_id]);
  const userId =
    readMessageId([item.user_id, item.target_user_id, content.user_id, content.target_user_id, content.sender?.id, message?.user_id, message?.target_user_id, message?.sender?.id]) ||
    readMessageId([url.match(/user\/(\d+)/)?.[1]]);

  if (type.includes("WORK") && workId) return { view: "work", id: workId, anchorId: replyId };
  if ((type.includes("POST") || type.includes("REPLY") || type.includes("COMMENT")) && postId) return { view: "detail", id: postId, anchorId: replyId };
  if (workId) return { view: "work", id: workId, anchorId: replyId };
  if (postId) return { view: "detail", id: postId, anchorId: replyId };
  if (userId) return { view: "user", id: userId };
  if (url) return { view: "external", url };
  return null;
}

function createMessageCard(item) {
  let content = parseRecordContent(item.content);
  if (content.text) {
    const parsedText = parsePossibleJson(content.text);
    if (parsedText && typeof parsedText === "object") content = parsedText;
  }
  const sender = messageSender(content, item);
  const title = messageTitle(content, item);
  const body = readableMessageText(content) || apiText(item.summary || "");
  const avatar = proxyMediaUrl(sender.avatar_url || sender.avatar || "");
  const nickname = sender.nickname || sender.name || "社区消息";
  const senderId = sender.id || sender.user_id || item.user_id || "";
  const date = formatDate(item.created_at || item.create_time || content.created_at);
  const target = messageTarget(content, item);
  const card = document.createElement("article");
  card.className = "message-card";
  card.innerHTML = `
    ${avatar ? `<img class="mini-avatar-img" src="${avatar}" alt="" />` : `<div class="mini-avatar">${avatarText(nickname)}</div>`}
    <div class="message-main">
      <div class="message-head">${senderId ? `<button type="button" class="user-inline-btn" data-message-user="${senderId}"><strong>${nickname}</strong></button>` : `<strong>${nickname}</strong>`}<span>${messageTypeLabel(item.type)}</span></div>
      <p>${apiText(body || "暂无消息内容")}</p>
      <div class="message-meta">${title}${date ? ` · ${date}` : ""}${target ? ` · ${target.view === "external" ? "打开原链接" : "点击查看原文"}` : ""}</div>
    </div>
  `;
  $("[data-message-user]", card)?.addEventListener("click", (event) => {
    event.stopPropagation();
    openUserReader({ id: senderId, nickname, avatar });
  });
  if (target) {
    card.classList.add("clickable");
    card.addEventListener("click", () => {
      if (target.view === "detail") {
        state.pendingPostReplyId = target.anchorId || "";
        openPost(target.id);
        return;
      }
      if (target.view === "work") {
        state.pendingWorkCommentId = target.anchorId || "";
        openWorkReader({ id: target.id });
        return;
      }
      if (target.view === "user") {
        openUserReader({ id: target.id });
        return;
      }
      if (target.view === "external" && target.url) {
        window.open(target.url, "_blank", "noopener,noreferrer");
      }
    });
  }
  cleanRenderedMessageCard(card, item);
  return card;
}

function cleanRenderedMessageCard(card, item) {
  const paragraph = $("p", card);
  const raw = paragraph?.textContent?.trim() || "";
  if (!raw.includes("sender") || !raw.includes("message")) return;

  let parsed = parsePossibleJson(raw);
  if (typeof parsed === "string") parsed = parsePossibleJson(parsed);
  if (!parsed || typeof parsed !== "object") return;

  const message = parsePossibleJson(parsed.message);
  const sender = parsed.sender || {};
  const body =
    (message && typeof message === "object" && (message.comment || message.reply || message.content || message.text)) ||
    parsed.comment ||
    parsed.reply ||
    "";
  const title =
    (message && typeof message === "object" && (message.business_name || message.work_name || message.post_title || message.title)) ||
    parsed.business_name ||
    messageTypeLabel(item.type);

  const headName = $(".message-head strong", card);
  const meta = $(".message-meta", card);
  const avatar = card.firstElementChild;
  if (headName && sender.nickname) headName.textContent = sender.nickname;
  if (paragraph) paragraph.textContent = apiText(body || title || "暂无消息内容");
  if (meta) meta.textContent = `${title}${formatDate(item.created_at || item.create_time) ? ` · ${formatDate(item.created_at || item.create_time)}` : ""}`;
  if (sender.avatar_url && avatar?.tagName === "DIV") {
    const img = document.createElement("img");
    img.className = "mini-avatar-img";
    img.src = proxyMediaUrl(sender.avatar_url);
    img.alt = "";
    avatar.replaceWith(img);
  }
}

const MSG_TABS = [
  { key: "all", types: null },
  { key: "reply", types: ["REPLY_CREATED", "WORK_COMMENT_CREATED", "WORK_COMMENT_REPLY_CREATED"] },
  { key: "like", types: ["POST_LIKED", "WORK_LIKED", "WORK_COMMENT_LIKED"] },
  { key: "mention", types: ["USER_MENTIONED", "WORK_COMMENT_MENTIONED"] },
  {
    key: "system",
    types: [
      "MANAGEMENT_ACTION",
      "TOPIC_EVENT",
      "LEVEL_CERTIFICATION",
      "USER_FOLLOWED",
      "TAKEDOWN_APPEAL_DECIDED",
      "QUESTION_DUPLICATE_REQUEST_DECIDED"
    ]
  }
];

function msgTime(seconds) {
  if (!seconds) return "";
  const diff = Date.now() / 1000 - seconds;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} 天前`;
  return formatDate(seconds);
}

function msgTabTypes(key) {
  return MSG_TABS.find((tab) => tab.key === key)?.types || null;
}

function createMessageNode(item) {
  const node = document.createElement("article");
  node.className = "msg-card" + (item.unread ? " unread" : "");
  node.dataset.msgId = item.id;
  node.dataset.group = item.group;
  node.innerHTML = `
    ${
      item.actor.avatar
        ? `<img class="msg-avatar" src="${item.actor.avatar}" alt="" loading="lazy" />`
        : `<div class="msg-avatar msg-avatar-fallback">${avatarText(item.actor.nickname)}</div>`
    }
    <div class="msg-main">
      <div class="msg-title">
        <strong>${escapeHtml(item.actor.nickname || "PICKCAT")}</strong>
        <span>${escapeHtml(item.summary)}</span>
        <em>${escapeHtml(msgTime(item.time))}</em>
      </div>
      ${item.title ? `<div class="msg-target">${escapeHtml(item.title)}</div>` : ""}
      ${item.excerpt ? `<p class="msg-excerpt">${escapeHtml(item.excerpt)}</p>` : ""}
    </div>
    ${item.unread ? `<span class="msg-dot" aria-label="未读"></span>` : ""}
  `;
  node.addEventListener("click", () => {
    const target = item.target;
    if (!target) return;
    if (target.kind === "work" && target.workId) {
      openWorkReader({ id: target.workId });
      return;
    }
    if (target.kind === "topic" && target.topicId) {
      state.pendingPostReplyId = target.postNumber && target.postNumber > 1 ? String(target.postNumber) : "";
      openPost(target.topicId);
    }
  });
  return node;
}

async function loadMessageList({ append = false } = {}) {
  const list = $("[data-msg-list]");
  if (!list) return;
  const more = $("[data-msg-more]");
  if (!append) {
    list.replaceChildren(loadingCard("正在读取消息...", "消息加载中"));
    state.msgCursor = undefined;
  }
  try {
    const result = await api.notifications.list({
      types: msgTabTypes(state.msgTab),
      cursor: append ? state.msgCursor : undefined,
      limit: 20
    });
    const items = result.items || [];
    state.msgCursor = result.pageInfo && result.pageInfo.nextCursor ? result.pageInfo.nextCursor : null;
    const nodes = items.map(createMessageNode);
    if (append) list.append(...nodes);
    else list.replaceChildren(...(nodes.length ? nodes : [statusCard("这里还没有消息")]));
    if (more) {
      more.parentElement.hidden = !state.msgCursor;
    }
    const unread = items.filter((item) => item.unread).length;
    const status = $("[data-msg-count]");
    if (status) status.textContent = unread ? `${unread} 条未读` : "";
  } catch (error) {
    list.replaceChildren(errorCard(`消息读取失败：${error.message}`, "消息读取失败"));
  }
}

async function renderMessagesReadable() {
  const root = $("#message-view");
  if (!state.auth?.token) {
    root.innerHTML = `<div class="empty-state"><div class="bubble-mark">...</div><h2>消息</h2><p>登录后读取回复、点赞、关注和系统通知。</p></div>`;
    root.appendChild(loginPrompt("去登录"));
    return;
  }
  if (!root.querySelector("[data-msg-list]")) {
    root.innerHTML = `<div class="msg-shell">
      <div class="msg-head">
        <div class="msg-tabs" data-msg-tabs>
          ${MSG_TABS.map(
            (tab) =>
              `<button class="tab ${tab.key === state.msgTab ? "active" : ""}" type="button" data-msg-tab="${tab.key}">${
                { all: "全部", reply: "回复", like: "赞", mention: "@我", system: "系统" }[tab.key]
              }</button>`
          ).join("")}
        </div>
        <button class="text-btn" type="button" data-msg-readall>全部已读</button>
      </div>
      <div class="msg-list" data-msg-list></div>
      <div class="msg-more" hidden><button class="text-btn" type="button" data-msg-more>加载更多</button></div>
    </div>`;
    $$("[data-msg-tab]", root).forEach((tab) =>
      tab.addEventListener("click", () => {
        state.msgTab = tab.dataset.msgTab;
        $$("[data-msg-tab]", root).forEach((item) => item.classList.toggle("active", item === tab));
        loadMessageList();
      })
    );
    $("[data-msg-readall]", root)?.addEventListener("click", async () => {
      try {
        await api.notifications.markAllRead(msgTabTypes(state.msgTab));
        statusToast("已全部标记为已读");
        loadMessageList();
      } catch (error) {
        statusToast("操作失败：" + error.message);
      }
    });
    $("[data-msg-more]", root)?.addEventListener("click", () => loadMessageList({ append: true }));
  }
  await loadMessageList();
}
async function submitLogin(event) {
  if (event) event.preventDefault();
  const form = event?.currentTarget || document.querySelector("[data-login-form]");
  const status = $("[data-login-status]");
  const cookieValue = String(form?.elements?.cookie?.value || "").trim();
  if (!cookieValue) {
    // 账号密码：触发验证码按钮（SDK 已绑定 click）
    const btn = $("#pickcat-login-btn");
    if (!state.loginMounted) {
      if (status) status.textContent = "登录组件加载中，请稍候…";
      return;
    }
    btn?.click();
    return;
  }
  const submitButton = $("[data-cookie-submit]");
  if (status) status.textContent = "正在校验会话…";
  if (submitButton) submitButton.disabled = true;
  try {
    const loginResult = await api.loginV1("", cookieValue);
    completeLogin(loginResult.data.user_info);
    if (status) status.textContent = "会话已连接，正在进入我的页面。";
  } catch (error) {
    if (status) status.textContent = "连接失败：" + error.message;
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

/** 登录成功后统一收口（Cookie 模式 / 密码模式都走这里） */
function completeLogin(userInfo) {
  const profile = userInfo && userInfo.nickname ? userInfo : window.PickcatOfficialApi.toUserProfile(userInfo || {});
  state.user = profile;
  state.auth = { token: "pickcat_session", cookie: "", method: "session" };
  localStorage.setItem("pickcat:user", JSON.stringify(profile));
  localStorage.setItem("pickcat:auth", JSON.stringify(state.auth));
  syncPlayerAuth();
  renderMineShell(profile);
  const status = $("[data-login-status]");
  if (status) status.textContent = "登录成功";
  navigateLocal("mine");
}

/**
 * 挂载账号密码登录（阿里云验证码 2.0）
 */
async function mountPasswordLogin() {
  if (state.loginMounted || !window.PickcatLogin) return;
  try {
    await window.PickcatLogin.mount();
    state.loginMounted = true;
  } catch {
    state.loginMounted = false;
  }
}
/** 读取客户端登录态（Cookie 存在浏览器，见 web/auth.js） */
async function hydrateOfficialSession() {
  try {
    const session = await window.PickcatOfficialApi.sessionState();
    if (session && session.connected && session.user) {
      const profile = window.PickcatOfficialApi.toUserProfile(session.user);
      state.user = profile;
      state.auth = { token: "pickcat_session", cookie: "", method: "session" };
      localStorage.setItem("pickcat:user", JSON.stringify(profile));
      localStorage.setItem("pickcat:auth", JSON.stringify(state.auth));
    } else {
      clearSavedSession();
      state.auth = null;
      state.user = null;
      localStorage.removeItem("pickcat:auth");
      localStorage.removeItem("pickcat:user");
    }
  } catch {
    state.auth = null;
    state.user = null;
  }
}

async function publishPost() {
  if (!state.auth?.token) {
    navigateLocal("login");
    return;
  }
  const boardId = $("[data-compose-board]").value || "17";
  const title = $("[data-compose-title]").value.trim();
  const body = $("[data-compose-body]").value.trim();
  if (!title || !body) return;
  try {
    const safeBody = body.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const result = await api.publishPost(boardId, title, `<p>${safeBody}</p>`);
    if (result.pending) {
      statusToast("已提交审核，通过后会出现在社区");
      navigateLocal("home");
      return;
    }
    await openPost(result.id);
  } catch (error) {
    alert(`发布失败：${error.message}`);
  }
}

function normalizeStaticLabels() {
  const feedLabels = { recommend: "推荐", discover: "发现", following: "关注" };
  $$("[data-feed-tab]").forEach((tab) => {
    tab.textContent = feedLabels[tab.dataset.feedTab] || tab.textContent;
  });
  $("[data-home-tabs]")?.setAttribute("aria-label", "首页分类");
  $("[data-search]")?.setAttribute("aria-label", "搜索");
}

function bindEvents() {
  normalizeStaticLabels();
  // 阅读位置：滚动时节流保存，离开页面时立刻保存
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(() => saveScrollPosition(), 250);
    },
    { passive: true }
  );
  window.addEventListener("pagehide", () => saveScrollPosition());
  // 用户一旦自己滚动，就取消还没执行完的恢复，别把人拽回去
  ["wheel", "touchstart", "keydown"].forEach((type) => {
    window.addEventListener(type, cancelScrollRestore, { passive: true });
  });
  $$("[data-nav]").forEach((button) => button.addEventListener("click", () => navigateLocal(button.dataset.nav)));
  $("[data-create-open]")?.addEventListener("click", openCreateSheet);
  $$("[data-create-close]").forEach((button) => button.addEventListener("click", closeCreateSheet));
  $("[data-mine-menu]")?.addEventListener("click", openMineMenu);
  $$("[data-mine-menu-close]").forEach((button) => button.addEventListener("click", closeMineMenu));
  $$("[data-mine-action]").forEach((button) => {
    button.addEventListener("click", () => handleMineAction(button.dataset.mineAction));
  });
  $$("[data-create-publish]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      choosePublishType(link.dataset.createPublish);
    });
  });
  $$("[data-open-tool]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeCreateSheet();
      openToolRunner(link.dataset.openTool);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCreateSheet();
      closeMineMenu();
      if (document.body.classList.contains("tool-fullscreen")) {
        document.body.classList.remove("tool-fullscreen");
      }
    }
  });
  document.addEventListener("focusin", (event) => {
    if (isTextEntryTarget(event.target)) setKeyboardOpen(true);
  });
  document.addEventListener("focusout", () => {
    setTimeout(() => setKeyboardOpen(isTextEntryTarget(document.activeElement)), 120);
  });
  $$("[data-feed-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      saveScrollPosition(routeKey("home")); // 记住旧标签的位置
      state.feedTab = tab.dataset.feedTab;
      $$("[data-feed-tab]").forEach((item) => item.classList.toggle("active", item === tab));
      renderFeed();
      const key = routeKey("home");
      if (scrollMemory[key]?.y) restoreScrollPosition(key);
      else window.scrollTo({ top: 0 });
    });
  });
  $$("[data-search-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$("[data-search-tab]").forEach((item) => item.classList.toggle("active", item === tab));
      $("[data-search-results-posts]")?.classList.toggle("hidden", tab.dataset.searchTab !== "posts");
      $("[data-search-results-works]")?.classList.toggle("hidden", tab.dataset.searchTab !== "works");
    });
  });
  const mineTabKeys = ["activity", "works", "circles"];
  $$("#mine-view .profile-tabs .tab").forEach((tab, index) => {
    tab.addEventListener("click", () => {
      state.mineTab = mineTabKeys[index];
      updateProfileTabs();
      if (state.auth?.token) {
        renderMineContent(state.user, { items: state.mineWorks });
      } else {
        renderMineLoggedOut();
      }
    });
  });
  $("[data-view-back]")?.addEventListener("click", () => nativeBack());
  $("[data-search]").addEventListener("click", () => navigateLocal("search"));
  $("[data-cancel-search]").addEventListener("click", () => navigateLocal("home"));
  $("[data-title]").addEventListener("click", () => {
    if (state.currentView === "home") scrollToPageTop();
  });
  $("[data-title]").addEventListener("keydown", (event) => {
    if (state.currentView !== "home" || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    scrollToPageTop();
  });
  $("[data-clear-search]").addEventListener("click", () => {
    state.history = [];
    renderHistory();
    $("[data-search-results-posts]").replaceChildren();
    $("[data-search-results-works]").replaceChildren();
    $("[data-search-tabs]")?.classList.add("hidden");
  });
  $("[data-search-input]").addEventListener("keydown", (event) => {
    if (event.key === "Enter") runSearch(event.currentTarget.value);
  });
  $("[data-login-form]").addEventListener("submit", submitLogin);
  $("[data-cookie-submit]")?.addEventListener("click", submitLogin);
  $("[data-login-toggle-cookie]")?.addEventListener("click", () => {
    $("[data-login-cookie]")?.classList.toggle("hidden");
  });
  window.addEventListener("pickcat:login", (event) => {
    completeLogin(event.detail?.user || {});
  });
  hydrateLoginForm();
  $("[data-post]").addEventListener("click", publishPost);
  window.addEventListener("popstate", () => {
    if (!routeFromLocation({ direction: "back" })) setView("home", { direction: "back" });
  });
  window.addEventListener(
    "scroll",
    () => {
      syncHomeTopbarVisibility();
      maybeLoadCircleFromScroll();
    },
    { passive: true }
  );
  const sentinel = $("[data-feed-sentinel]");
  if (sentinel) {
    new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || state.currentView !== "home") return;
        if (state.feedTab === "recommend") loadMoreFeed();
        if (state.feedTab === "discover") loadDiscoverWorks();
        if (state.feedTab === "following") loadFollowingFeed();
      },
      { rootMargin: "300px" }
    ).observe(sentinel);
  }
}

async function init() {
  applyRuntimeShellMode();
  hydrateNativeSession();
  await hydrateOfficialSession();
  syncPlayerAuth();
  bindEvents();
  renderHistory();
  renderMineShell(state.user);
  const splash = $("[data-splash]");
  if (sessionStorage.getItem("pickcat:splash-seen")) {
    splash.classList.add("done");
  } else {
    sessionStorage.setItem("pickcat:splash-seen", "1");
    setTimeout(() => splash.classList.add("done"), 500);
  }
  routeFromLocation({ replace: true, immediate: true });
  syncHomeTopbarVisibility({ force: true });
  await loadCircleData();
  await loadHomeData();
  // 刷新后回到上次看到的位置（首屏数据已就绪再恢复）
  if (state.currentView === "home" && scrollMemory[routeKey()]?.y) {
    restoreScrollPosition(routeKey());
  }
  syncHomeTopbarVisibility({ force: true });
  window.matchMedia("(orientation: landscape)").addEventListener("change", (e) => {
    if (state.currentView !== "work") return;
    if (e.matches) {
      const startBtn = $("[data-start-player]");
      if (startBtn) startBtn.click();
    } else {
      if (document.body.classList.contains("player-landscape")) {
        setNativePlayerMode(false);
        renderWorkReader();
      }
    }
  });
}

if (window.__PICKCAT_GATE_LOCKED__) {
  // 入口门禁（gate.js）未签署：先不启动 App，签署完成后由门禁调用。
  let started = false;
  window.__pickcatStartApp = () => {
    if (started) return;
    started = true;
    init();
  };
} else {
  init();
}
