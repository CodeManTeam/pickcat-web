/**
 * PICKCAT 正式网页版 —— 官方 API 适配层
 *
 * 作用：把 Pickcat-Reborn 的数据层（原本指向编程猫旧社区 `/web/forums/*`、
 * `creation-tools/*`、`nemo/*` 等）整体替换成 https://pickcat.dao3.fun 的官方
 * `/api/v1` 接口，并把官方响应映射回 Reborn 页面期望的字段结构。
 *
 * 因此 UI / 视觉 / 交互（index.html + styles.css + app.js）保持 Reborn 原样，
 * 只换数据源。所有请求经同源 `/api/v1` 由 server.mjs 反代，会话 Cookie 收在服务端。
 */
(function () {
  'use strict';

  const BASE = '/api/v1';

  // ---------------------------------------------------------------------
  // HTTP
  // ---------------------------------------------------------------------

  async function request(path, { method = 'GET', query, body, headers = {}, signal } = {}) {
    const url = new URL(BASE + path, location.origin);
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(k, String(item)));
      else url.searchParams.set(k, String(v));
    });
    const init = { method, signal, headers: { Accept: 'application/json', ...headers } };
    if (body !== undefined) {
      init.headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    const response = await fetch(url, init);
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    }
    if (!response.ok) {
      const message =
        (data && (data.message || data.code)) || `${path} ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = data;
      throw error;
    }
    return data;
  }

  const get = (p, query, opts) => request(p, { ...opts, query });

  // ---------------------------------------------------------------------
  // 小工具
  // ---------------------------------------------------------------------

  const secs = (iso) => {
    if (!iso) return 0;
    if (typeof iso === 'number') return iso > 1e12 ? Math.floor(iso / 1000) : iso;
    const t = new Date(iso).getTime();
    return Number.isNaN(t) ? 0 : Math.floor(t / 1000);
  };

  const avatarOf = (a) => (a && (a.url || a.avatar_url)) || '';
  const stripTags = (html) =>
    String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();

  // 官方头像/文件是相对 /api/v1 路径，同源直出即可；封面 CDN 交给 /proxy/media
  function media(url) {
    if (!url) return '';
    if (/^\/api\/v1\//.test(url)) return url;
    return url;
  }

  // ---------------------------------------------------------------------
  // 结构映射：官方 → Reborn 期望的字段
  // ---------------------------------------------------------------------

  const MOSS_ORIGIN = 'https://moss.pickcat.dao3.fun';
  const MOSS_PROXY = '/moss';
  let mossEntryCache = { at: 0, byWork: new Map(), bySource: new Map() };

  /** MOSS 的播放地址只在推荐流里下发（带签名 token），这里缓存一份 */
  async function loadMossEntries() {
    if (Date.now() - mossEntryCache.at < 120000) return mossEntryCache;
    try {
      const res = await get('/work-recommendations');
      const byWork = new Map();
      const bySource = new Map();
      (res.items || []).forEach((w) => {
        const url = w.player && w.player.entryUrl;
        if (!url) return;
        byWork.set(String(w.id), url);
        bySource.set(String(w.sourceWorkId), url);
      });
      mossEntryCache = { at: Date.now(), byWork, bySource };
    } catch {
      /* 取不到就保持旧缓存 */
    }
    return mossEntryCache;
  }

  /** 把 MOSS 播放地址换成本站反代路径，iframe 才能拿到会话并绕过 Origin 校验 */
  function toMossProxy(url) {
    if (!url) return '';
    if (url.startsWith(MOSS_ORIGIN)) return MOSS_PROXY + url.slice(MOSS_ORIGIN.length);
    return url;
  }

  /** 官方播放器按「源站数字 id + 引擎类型」拼地址（和官网 play 逻辑一致） */
  const PLAYER_URLS = {
    KITTEN3: (id) => `https://player.codemao.cn/old/${id}`,
    KITTEN4: (id) => `https://player.codemao.cn/new/${id}`,
    NEKO: (id) => `https://kn.codemao.cn/player?type=2&workId=${id}`,
    NEMO: (id) => `https://nemo.codemao.cn/w/${id}`,
    COCO: (id) => `https://coco.codemao.cn/editor/player/${id}?channel=h5`,
    WOOD: (id) => `https://turtle.codemao.cn/player/h5/${id}`,
    PYTHON: (id) => `https://turtle.codemao.cn/player/h5/${id}`,
  };

  function resolvePlayerUrl(w = {}) {
    if (w.player && w.player.entryUrl) return toMossProxy(w.player.entryUrl);
    const type = String(w.type || '').toUpperCase();
    const sourceId = String(w.sourceWorkId || '');
    const build = PLAYER_URLS[type];
    if (build && /^[1-9]\d*$/.test(sourceId)) return build(sourceId);
    return '';
  }

  function toWork(w = {}) {
    const author = w.author || {};
    const playerUrl = resolvePlayerUrl(w);
    return {
      id: String(w.id || ''),
      work_name: w.workName || '未命名作品',
      work_introduction: stripTags(w.description || w.operation || ''),
      preview: media(w.screenshotCoverUrl || w.preview || ''),
      view_times: w.viewCount || 0,
      praise_times: w.likeCount || 0,
      collect_times: w.favoriteCount || 0,
      comment_times: w.commentCount || 0,
      created_at: secs(w.createdAt),
      type: w.type || '',
      source_id: w.sourceWorkId || '',
      player_url: playerUrl,
      player_url_v2: playerUrl,
      user_info: {
        id: author.id || w.sourceUserId || '',
        nickname: author.username || '未知作者',
        avatar: media(avatarOf(author.avatar)),
      },
      original_id: w.sourceWorkId || '',
      is_liked: Boolean(w.liked),
      is_collected: Boolean(w.favorited),
    };
  }

  /** normalizeFeedWork 认这些字段（work_base / mix 结构），这里直接拍平成同义键 */
  function toFeedWork(w = {}) {
    const author = w.author || {};
    return {
      id: String(w.id || ''),
      name: w.workName || '未命名作品',
      work_name: w.workName || '未命名作品',
      description: stripTags(w.description || ''),
      preview_url: media(w.screenshotCoverUrl || w.preview || ''),
      preview: media(w.screenshotCoverUrl || w.preview || ''),
      views_count: w.viewCount || 0,
      likes_count: w.likeCount || 0,
      collect_times: w.favoriteCount || 0,
      publish_time: secs(w.createdAt),
      created_at: secs(w.createdAt),
      user_id: author.id || '',
      nickname: author.username || '未知作者',
      avatar_url: media(avatarOf(author.avatar)),
      type: w.type || '',
      source_id: w.sourceWorkId || '',
      player_url: resolvePlayerUrl(w),
      work_label: { label_name: w.type || '发现' },
    };
  }

  function toPost(t = {}, fallbackBoardName = '') {
    const author = t.author || {};
    const tag = (t.tags && t.tags[0]) || {};
    return {
      id: String(t.id || ''),
      title: t.title || '无标题',
      content: `<p>${escapeInner(t.excerpt || '')}</p>`,
      user: {
        id: author.id || '',
        nickname: author.username || '不存在的用户',
        avatar_url: media(avatarOf(author.avatar)),
        work_shop_name: '',
      },
      created_at: secs(t.lastActivityAt || t.createdAt),
      n_views: t.viewCount || 0,
      n_replies: t.replyCount || 0,
      n_likes: t.likeCount || 0,
      n_collects: t.bookmarkCount || 0,
      board_name: tag.name || fallbackBoardName,
      is_pinned: Boolean(t.pinned),
      board_slug: tag.slug || '',
    };
  }

  function escapeInner(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function toReply(p = {}) {
    const author = p.author || {};
    return {
      id: String(p.id || ''),
      content: p.deleted ? '<p>该回复已删除</p>' : p.cookedHtml || escapeInner(p.plainText || ''),
      user: {
        id: author.id || '',
        nickname: author.username || '社区用户',
        avatar_url: media(avatarOf(author.avatar)),
      },
      created_at: secs(p.createdAt),
      n_likes: p.likeCount || 0,
      is_liked: Boolean(p.viewerState && p.viewerState.liked),
      post_number: p.postNumber || 0,
      n_comments: (p.children || []).length,
      comments: (p.children || []).map((c) => ({
        user: {
          id: (c.author && c.author.id) || '',
          nickname: (c.author && c.author.username) || '社区用户',
        },
        content: c.deleted ? '该回复已删除' : stripTags(c.cookedHtml || c.plainText || ''),
      })),
    };
  }

  function toWorkComment(c = {}) {
    const author = c.author || {};
    return {
      id: String(c.id || ''),
      user: {
        id: author.id || '',
        nickname: author.username || '社区用户',
        avatar_url: media(avatarOf(author.avatar)),
        work_shop_name: '',
      },
      rich_content: c.deleted ? '该评论已删除' : c.cookedHtml || escapeInner(c.plainText || ''),
      content: c.deleted ? '该评论已删除' : stripTags(c.cookedHtml || c.plainText || ''),
      n_likes: c.likeCount || 0,
      is_liked: Boolean(c.viewerState && c.viewerState.liked),
      is_top: Boolean(c.pinned),
      created_at: secs(c.createdAt),
      replies: {
        items: (c.children || []).map(toWorkComment),
        total: (c.children || []).length,
      },
      reply_total: (c.children || []).length,
    };
  }

  function toUserProfile(u = {}) {
    const stats = u.stats || {};
    const level = u.level && typeof u.level === 'object' ? u.level.current : u.level;
    return {
      id: String(u.id || ''),
      nickname: u.username || '未登录',
      avatar: media(avatarOf(u.avatar)),
      avatar_url: media(avatarOf(u.avatar)),
      cover: '',
      description: stripTags(u.bio || ''),
      doing: '',
      level: level || 0,
      followed: Boolean(u.viewerState && u.viewerState.following),
      is_followed: Boolean(u.viewerState && u.viewerState.following),
      n_followers: stats.followers || 0,
      n_following: stats.following || 0,
      n_works: 0,
      n_praises: 0,
      created_at: secs(u.createdAt),
      region: u.region || '',
    };
  }

  function toUserListItem(item = {}) {
    const u = item.user || item;
    return {
      user_id: String(u.id || ''),
      nickname: u.username || '社区用户',
      avatar_url: media(avatarOf(u.avatar)),
      description: stripTags(u.bio || ''),
      n_works: 0,
      total_likes: 0,
    };
  }

/** 官方 tag 没有官方简介，这里按已知 slug 补一句（拿不到就用通用文案） */
const BOARD_DESC = {
  'interest-plaza': '闲聊、求助、分享，想到什么发什么',
  creation: '发布作品、创作花絮和心得',
  tutorial: '教程、素材与技巧合集',
  chat: '灌水聊天、日常吐槽集中地',
  activity: '社区活动、赛事与投稿入口',
  question: '有问题就问，总会有人答',
  feedback: '对 PICKCAT 的建议与反馈',
  library: '图书与阅读相关讨论',
};
  const NOTIFY_KIND = {
    USER_MENTIONED: "提到了你",
    WORK_COMMENT_MENTIONED: "在评论中提到了你",
    REPLY_CREATED: "回复了你",
    WORK_COMMENT_CREATED: "评论了你的作品",
    WORK_COMMENT_REPLY_CREATED: "回复了你的评论",
    POST_LIKED: "赞了你的帖子",
    WORK_LIKED: "赞了你的作品",
    WORK_COMMENT_LIKED: "赞了你的评论",
    USER_FOLLOWED: "关注了你",
    LEVEL_CERTIFICATION: "等级 / 认证变更",
    MANAGEMENT_ACTION: "社区管理通知",
    TOPIC_EVENT: "话题动态",
    TAKEDOWN_APPEAL_DECIDED: "下架申诉已处理",
    QUESTION_DUPLICATE_REQUEST_DECIDED: "重复提问申请已处理",
  };

  const NOTIFY_GROUP = {
    USER_MENTIONED: "mention",
    WORK_COMMENT_MENTIONED: "mention",
    REPLY_CREATED: "reply",
    WORK_COMMENT_CREATED: "reply",
    WORK_COMMENT_REPLY_CREATED: "reply",
    POST_LIKED: "like",
    WORK_LIKED: "like",
    WORK_COMMENT_LIKED: "like",
    USER_FOLLOWED: "system",
    LEVEL_CERTIFICATION: "system",
    MANAGEMENT_ACTION: "system",
    TOPIC_EVENT: "system",
    TAKEDOWN_APPEAL_DECIDED: "system",
    QUESTION_DUPLICATE_REQUEST_DECIDED: "system",
  };

  /** 官方通知 → 消息中心的统一结构 */
  function toNotification(n = {}) {
    const d = n.details || {};
    const actor = d.actor || {};
    const topic = d.topic || null;
    const post = d.post || null;
    const work = d.work || null;
    const comment = d.comment || null;
    const type = n.type || '';
    const isWork = /^WORK_/.test(type);
    const summary = NOTIFY_KIND[type] || '有新动态';
    const title = work ? work.workName : topic ? topic.title || '' : '';
    const excerpt = d.excerpt || d.reasonDetail || d.publicReasonDetail || '';
    return {
      id: String(n.id || ''),
      type,
      group: NOTIFY_GROUP[type] || 'system',
      actor: {
        id: actor.id || '',
        nickname: actor.username || actor.nickname || 'PICKCAT',
        avatar: media(avatarOf(actor.avatar)),
      },
      summary,
      title,
      excerpt: stripTags(excerpt),
      time: secs(n.createdAt),
      unread: n.readAt === null || n.readAt === undefined,
      target: isWork || work
        ? { kind: 'work', workId: work ? work.id : '', commentNumber: comment ? comment.commentNumber : 0 }
        : topic
          ? { kind: 'topic', topicId: topic.id, postNumber: post ? post.postNumber : 0 }
          : null,
    };
  }
  // ---------------------------------------------------------------------
  // 游标缓存
  // ---------------------------------------------------------------------

  const boardCursors = new Map();
  const replyTopic = new Map(); // postId -> topicId
  const commentNumbers = new Map(); // commentId -> commentNumber
  const tagIdBySlug = new Map(); // 板块 slug -> 官方 tag id（发帖要传 tagIds）
  const workIdByFeedId = new Map();
  let discoverCache = { items: [], cursor: undefined, done: false };

  // ---------------------------------------------------------------------
  // API 实现（键名与 Reborn 原 api 对象一致）
  // ---------------------------------------------------------------------

  const api = {
    // ---- 会话 ----------------------------------------------------------
    async me() {
      const session = await request('/session');
      const user = (session && (session.user || session.data || session)) || {};
      if (!user.id) throw new Error('登录态无效，请重新连接账号');
      return toUserProfile(user);
    },

    // 登录态在客户端管理（web/auth.js）：这里只是把粘贴的 Cookie 交给它校验并写入浏览器
    async loginV1(identity, password) {
      const cookie = String(password || identity || '').trim();
      if (!cookie) throw new Error('请粘贴 pickcat_session 的值');
      const auth = window.PickcatAuth;
      if (!auth) throw new Error('客户端登录模块未加载');
      const result = await auth.importCookie(cookie);
      const user = toUserProfile(result.user || {});
      return {
        data: { user_info: user, auth: { token: 'pickcat_session', user } },
        response: { headers: { get: () => '' } },
      };
    },

    async loginV2(identity, password) {
      return api.loginV1(identity, password);
    },

    currentTime: async () => ({ data: Date.now() }),
    captchaRule: async () => {
      throw new Error('官方登录需在 pickcat.dao3.fun 完成滑块验证码，请改用 Cookie 导入');
    },

    // ---- 论坛：板块 / 帖子 ----------------------------------------------
    async boards() {
      const page = await get('/topics', { limit: 50, sort: 'latest' });
      const map = new Map();
      (page.items || []).forEach((t) => {
        (t.tags || []).forEach((tag) => {
          if (tag && tag.slug && !map.has(tag.slug)) map.set(tag.slug, { id: tag.slug, name: tag.name || tag.slug });
          if (tag && tag.slug && tag.id) tagIdBySlug.set(tag.slug, tag.id);
        });
      });
      // 官方 tag 里存在同名不同 slug 的板块，按名字去重，避免重复卡片
      const seenName = new Set();
      const items = [];
      for (const board of map.values()) {
        const key = String(board.name).trim();
        if (seenName.has(key)) continue;
        seenName.add(key);
        items.push({ ...board, description: BOARD_DESC[board.id] || 'PICKCAT 官方论坛板块，点进来看看大家都在聊什么' });
      }
      if (items.length) return { items };
      // 官方接口异常时退回内置板块
      return {
        items: [
          { id: 'interest-plaza', name: '兴趣广场', description: BOARD_DESC['interest-plaza'] },
          { id: 'creation', name: '创作与作品', description: BOARD_DESC.creation },
          { id: 'chat', name: '闲聊灌水', description: BOARD_DESC.chat },
        ],
      };
    },

    async boardPosts(boardId, page = 1, limit = 10) {
      const key = String(boardId);
      const cursor = page <= 1 ? undefined : boardCursors.get(key);
      if (page > 1 && !cursor) return { items: [], total: 0 };
      const res = await get('/topics', { tag: key, sort: 'latest', limit, cursor });
      const next = res.pageInfo && res.pageInfo.nextCursor;
      boardCursors.set(key, next || undefined);
      const items = (res.items || []).map((t) => toPost(t));
      return { items, total: res.pageInfo && res.pageInfo.hasNextPage ? limit * (page + 1) : items.length };
    },

    async searchPosts(title, limit = 20) {
      const keyword = String(title || '').trim();
      if (!keyword) return { items: [], total: 0 };
      // 官方没有话题搜索接口（只有 /search/works 与 /search/users），
      // 降级：拉一页最新话题（limit 上限 50）做本地标题匹配。
      const page = await get('/topics', { sort: 'latest', limit: 50 });
      const items = (page.items || [])
        .filter((t) => (t.title || '').toLowerCase().includes(keyword.toLowerCase()))
        .slice(0, limit)
        .map((t) => toPost(t));
      return { items, total: items.length };
    },

    async postDetail(id) {
      const t = await get(`/topics/${encodeURIComponent(id)}`);
      const author = t.author || {};
      const tag = (t.tags && t.tags[0]) || {};
      const first = t.firstPost || {};
      const viewerState = t.viewerState || {};
      const firstViewer = first.viewerState || {};
      return {
        id: String(t.id),
        title: t.title || '无标题',
        content: first.cookedHtml || `<p>${escapeInner(t.excerpt || '')}</p>`,
        user: {
          id: author.id || '',
          nickname: author.username || '不存在的用户',
          avatar_url: media(avatarOf(author.avatar)),
        },
        board_name: tag.name || 'PICKCAT 论坛',
        created_at: secs(t.createdAt),
        n_views: t.viewCount || 0,
        n_replies: t.replyCount || 0,
        n_comments: t.replyCount || 0,
        // 写操作需要：点赞挂在首楼 post 上，收藏挂在 topic 上
        first_post_id: first.id ? String(first.id) : '',
        first_post_number: first.postNumber || 1,
        n_likes: first.likeCount || 0,
        liked: Boolean(firstViewer.liked),
        bookmark_id: viewerState.bookmarkId || null,
        kind: t.kind || 'DISCUSSION',
        can_delete: Boolean((t.viewerCapabilities || {}).canDelete || (first.viewerCapabilities || {}).canDelete),
        can_report: Boolean((t.viewerCapabilities || {}).canReport || (first.viewerCapabilities || {}).canReport),
        can_select_answer: Boolean((t.viewerCapabilities || {}).canSelectAnswer),
      };
    },

    async postReplies(postId, page = 1, limit = 10) {
      const cursor = page <= 1 ? undefined : undefined;
      const res = await get(`/topics/${encodeURIComponent(postId)}/posts`, { limit, cursor });
      const items = (res.items || []).map((p) => {
        replyTopic.set(String(p.id), String(postId));
        return toReply(p);
      });
      return { items, total: (res.pageInfo && res.pageInfo.nextCursor ? items.length + 1 : items.length) };
    },

    async replyComments() {
      return { items: [] };
    },

    async createPostReply(postId, content) {
      const res = await request('/posts', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: { topicId: postId, markdown: stripTags(content) },
      });
      return res;
    },

    async createReplyComment(replyId, content) {
      const topicId = replyTopic.get(String(replyId));
      if (!topicId) throw new Error('找不到该回复所属话题');
      return request('/posts', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: { topicId, markdown: stripTags(content) },
      });
    },

    async toggleReplyLike(replyId, liked = true) {
      const path = `/posts/${encodeURIComponent(replyId)}/like`;
      return liked ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    /** 话题（帖子）点赞：官方把我们叫「post」，首楼 id 才是点赞目标 */
    async togglePostLike(postId, liked = true) {
      const path = `/posts/${encodeURIComponent(postId)}/like`;
      return liked ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    /** 收藏话题：POST /bookmarks { bookmarkableType, bookmarkableId } */
    async addTopicBookmark(topicId) {
      return request('/bookmarks', {
        method: 'POST',
        body: { bookmarkableType: 'TOPIC', bookmarkableId: String(topicId) },
      });
    },

    async removeBookmark(bookmarkId) {
      return request(`/bookmarks/${encodeURIComponent(bookmarkId)}`, { method: 'DELETE' });
    },

    /** 拿话题当前的收藏 id（收藏态存在 topics 详情的 viewerState.bookmarkId） */
    async topicBookmarkId(topicId) {
      const t = await get(`/topics/${encodeURIComponent(topicId)}`);
      return (t.viewerState && t.viewerState.bookmarkId) || null;
    },

    // ---- 收藏（作品 / 帖子 / 收藏夹）-------------------------------------
    async favoriteWorks(limit = 20) {
      const res = await get('/work-favorites', { limit });
      return { items: (res.items || []).map(toFeedWork), pageInfo: res.pageInfo || null };
    },

    async bookmarkFolders() {
      const res = await get('/bookmark-folders');
      return res;
    },

    async bookmarkFolderItems(folderId, limit = 50) {
      return get(`/bookmark-folders/${encodeURIComponent(folderId)}/items`, { limit });
    },

    // ---- 举报 -------------------------------------------------------------
    async reportPost({ postId, targetKind = 'POST', reasonCode, detail = '' }) {
      const body = { targetKind, reasonCode };
      if (detail) body.detail = detail;
      return request(`/posts/${encodeURIComponent(postId)}/reports`, { method: 'POST', body });
    },

    // ---- 自己的内容：删除 / 置顶 ------------------------------------------
    async deletePost(postId) {
      return request(`/posts/${encodeURIComponent(postId)}`, { method: 'DELETE' });
    },

    async pinPost(postId, pinned = true) {
      const path = `/posts/${encodeURIComponent(postId)}/pin`;
      return pinned ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    // ---- 问答：选为答案 ---------------------------------------------------
    async selectAnswer(topicId, postNumber) {
      return request(`/questions/${encodeURIComponent(topicId)}/selected-answer`, {
        method: 'PUT',
        body: { answerPostNumber: Number(postNumber) },
      });
    },

    // ---- 作品：统计 / 投币 / 精选 -----------------------------------------
    async workStats(workId) {
      return get(`/works/${encodeURIComponent(workId)}/stats`);
    },

    async coinWork(workId, amount = 1) {
      return request(`/works/${encodeURIComponent(workId)}/coins`, { method: 'PUT', body: { amount: Number(amount) } });
    },

    async featuredWorks() {
      const res = await get('/featured-works');
      return { items: (res.items || []).map(toFeedWork) };
    },

    async featuredTopics(userId) {
      return get(`/users/${encodeURIComponent(userId)}/featured-topics`);
    },

    // ---- 账号设置 ---------------------------------------------------------
    async avatarPresets() {
      return get('/avatar-presets');
    },

    async updateProfile(userId, patch) {
      return request(`/users/${encodeURIComponent(userId)}`, { method: 'PATCH', body: patch });
    },

    async setAvatarPreset(userId, presetId) {
      return request(`/users/${encodeURIComponent(userId)}/avatar`, {
        method: 'PUT',
        body: { type: 'PRESET', presetId: Number(presetId) },
      });
    },

    async publishPost(boardId, title, content) {
      // 官方要求 tagIds（数组，元素是 tag 的 UUID），不是 slug
      const slug = String(boardId || '');
      const tagId = tagIdBySlug.get(slug) || (/^[0-9a-f-]{36}$/i.test(slug) ? slug : '');
      const body = { title, markdown: stripTags(content) };
      if (tagId) body.tagIds = [tagId];
      const res = await request('/posts', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body,
      });
      const id = (res && (res.topicId || res.id || res.submissionId)) || '';
      const status = String((res && (res.status || res.state)) || '').toUpperCase();
      return { id, pending: !id || status.includes('PENDING') || status.includes('REVIEW') };
    },

    // ---- 作品 -----------------------------------------------------------
    async homeWorks() {
      const res = await get('/work-recommendations');
      return { items: (res.items || []).map(toFeedWork) };
    },

    async discoverWorks(offset = 0, limit = 12) {
      if (offset === 0 && !discoverCache.items.length) {
        const res = await get('/works', { limit: Math.max(limit, 24) });
        discoverCache = {
          items: (res.items || []).map(toFeedWork),
          cursor: (res.pageInfo && res.pageInfo.nextCursor) || undefined,
          done: !(res.pageInfo && res.pageInfo.hasNextPage),
        };
      }
      const slice = discoverCache.items.slice(offset, offset + limit);
      return { items: slice, total: discoverCache.items.length };
    },

    async activityWorks(offset = 0, limit = 18) {
      const res = await get('/works', { limit });
      return { items: (res.items || []).map(toFeedWork) };
    },

    async workDetail(workId) {
      const w = await get(`/works/${encodeURIComponent(workId)}`);
      const base = toWork(w);
      // MOSS 作品：播放地址只从推荐流下发（带签名），这里补一次
      if (!base.player_url && String(w.type || '').toUpperCase() === 'MOSS') {
        const entries = await loadMossEntries();
        const hit = entries.byWork.get(String(w.id)) || entries.bySource.get(String(w.sourceWorkId));
        if (hit) base.player_url = toMossProxy(hit);
      }
      base.playerUrls = base.player_url ? [base.player_url] : [];
      base.work_labels = { items: [{ name: w.type || '作品' }] };
      base.operation_description = stripTags(w.operation || '');
      base.is_praised = Boolean(w.liked);
      base.is_collected = Boolean(w.favorited);
      return base;
    },

    async nemoWorkDetail(workId) {
      return api.workDetail(workId);
    },

    async workList(userId) {
      const res = await get(`/users/${encodeURIComponent(userId)}/works`, { limit: 20 });
      return { items: (res.items || []).map(toFeedWork), total: (res.items || []).length };
    },

    async userCenterWorks(userId, limit = 10) {
      const res = await get(`/users/${encodeURIComponent(userId)}/works`, { limit });
      return { items: (res.items || []).map(toFeedWork) };
    },

    async publishedWorks(userId, limit = 10) {
      const res = await get(`/users/${encodeURIComponent(userId)}/works`, { limit });
      return { items: (res.items || []).map(toFeedWork) };
    },

    async workComments(workId, offset = 0, limit = 10) {
      const res = await get(`/works/${encodeURIComponent(workId)}/comments`, { limit });
      const items = (res.items || []).map((c) => {
        commentNumbers.set(String(c.id), c.commentNumber);
        return toWorkComment(c);
      });
      return { items, total: items.length };
    },

    async createWorkComment(workId, content) {
      return request(`/works/${encodeURIComponent(workId)}/comments`, {
        method: 'POST',
        body: { markdown: stripTags(content) },
      });
    },

    async createWorkCommentReply(workId, commentId, content) {
      return request(`/works/${encodeURIComponent(workId)}/comments`, {
        method: 'POST',
        body: { markdown: stripTags(content), replyToCommentNumber: commentNumbers.get(String(commentId)) || null },
      });
    },

    async toggleWorkCommentLike(workId, commentId, liked = true) {
      const number = commentNumbers.get(String(commentId));
      if (!number) throw new Error('找不到该评论楼层');
      const path = `/works/${encodeURIComponent(workId)}/comments/${number}/like`;
      return liked ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    async toggleWorkLike(workId, liked = true) {
      const path = `/works/${encodeURIComponent(workId)}/like`;
      return liked ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    async toggleWorkCollection(workId, collected = true) {
      const path = `/works/${encodeURIComponent(workId)}/favorite`;
      return collected ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    async workLabels() {
      return { items: [] };
    },

    async workRecommended() {
      return { items: [] };
    },

    // ---- 用户 -----------------------------------------------------------
    async userProfile(userId) {
      const u = await get(`/users/${encodeURIComponent(userId)}`);
      return toUserProfile(u);
    },

    async userProfileLegacy(userId) {
      return api.userProfile(userId);
    },

    async userTiger(userId) {
      return api.userProfile(userId);
    },

    async userDynamicInfo(userId) {
      return api.userProfile(userId);
    },

    async userBusinessTotal() {
      return { n_views: 0, n_likes: 0, n_re_create: 0 };
    },

    async userFans(userId, limit = 12) {
      try {
        const res = await get(`/users/${encodeURIComponent(userId)}/followers`, { limit });
        const items = (res.items || []).map(toUserListItem);
        return { items, total: items.length };
      } catch {
        return { items: [], total: 0 };
      }
    },

    async following(userId, limit = 15) {
      try {
        const res = await get(`/users/${encodeURIComponent(userId)}/following`, { limit });
        const items = (res.items || []).map(toUserListItem);
        return { items, total: items.length };
      } catch {
        return { items: [], total: 0 };
      }
    },

    async followingLegacy(userId, limit = 15) {
      return api.following(userId, limit);
    },

    async toggleFollowUser(userId, followed = true) {
      const path = `/users/${encodeURIComponent(userId)}/follow`;
      return followed ? request(path, { method: 'PUT' }) : request(path, { method: 'DELETE' });
    },

    async recommendedUsers() {
      const page = await get('/topics', { limit: 20, sort: 'latest' });
      const seen = new Set();
      const items = [];
      (page.items || []).forEach((t) => {
        const a = t.author;
        if (!a || !a.id || seen.has(a.id)) return;
        seen.add(a.id);
        items.push({
          user_id: a.id,
          nickname: a.username,
          avatar_url: media(avatarOf(a.avatar)),
          description: '',
        });
      });
      return { items: items.slice(0, 8) };
    },

    // ---- 消息 -----------------------------------------------------------
    /** 消息中心：官方通知接口（GET /notifications、PATCH /notifications、/notification-summary） */
    notifications: {
      async list({ types, cursor, limit = 20 } = {}) {
        const res = await get('/notifications', { query: { type: types && types.length ? types : undefined, cursor, limit } });
        const items = (res.items || []).map(toNotification);
        return { items, pageInfo: res.pageInfo || null };
      },

      async summary() {
        return get('/notification-summary');
      },

      /** 全部已读；传 types 只清对应分类 */
      async markAllRead(types) {
        return request('/notifications', {
          method: 'PATCH',
          query: types && types.length ? { type: types } : {},
          body: { read: true },
        });
      },

      async likeGroups({ before, beforeId, limit = 20 } = {}) {
        return get('/like-notification-groups', { query: { before, beforeKey: beforeId, limit } });
      },
    },

    // ---- 旧消息接口（保留兼容，内部转成通知） ----
    async messageCount() {
      try {
        const summary = await get('/notification-summary');
        const total = (summary && (summary.unreadCount ?? summary.total ?? 0)) || 0;
        return [{ query_type: 'SYSTEM', count: total }];
      } catch {
        return [{ query_type: 'SYSTEM', count: 0 }];
      }
    },

    async messageRecord(queryType, limit = 20) {
      const res = await api.notifications.list({ limit });
      return { items: res.items };
    },
  };

  // ---------------------------------------------------------------------
  // 对外：会话桥 + 覆盖请求头
  // ---------------------------------------------------------------------

  async function sessionState() {
    try {
      if (window.PickcatAuth) return await window.PickcatAuth.status();
      const res = await fetch('/__session');
      if (!res.ok) return { connected: false };
      return res.json();
    } catch {
      return { connected: false };
    }
  }

  async function disconnect() {
    if (window.PickcatAuth) return window.PickcatAuth.logout();
    await fetch('/__session', { method: 'DELETE' });
  }

  window.PickcatOfficialApi = api;
  window.PickcatOfficialApi.sessionState = sessionState;
  window.PickcatOfficialApi.disconnect = disconnect;
  window.PickcatOfficialApi.toUserProfile = toUserProfile;
  window.PickcatOfficialApi.strips = stripTags;
})();
