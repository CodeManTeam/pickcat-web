/**
 * PICKCAT 正式网页版 API 客户端
 *
 * 设计原则：
 *  1. 官方 API 全量可达 —— 任何一条 ROUTES 都能用 `call('GET', '/works/{workId}', { params })` 调通；
 *  2. 高频业务再包一层语义化方法（works.get / topics.reply ...），页面只写业务语义；
 *  3. 所有请求走同源 `/api/v1`，由 server.mjs 反代到 https://pickcat.dao3.fun，
 *     从而绕开 CORS 并把会话 Cookie 收在服务端。
 */
import { API_BASE, ROUTES, fillPath } from './api-endpoints.js';

export { API_BASE, ROUTES, fillPath };

export class ApiError extends Error {
  constructor(status, body, method, path) {
    const message =
      (body && (body.message || body.error || body.code)) ||
      (status === 401 ? '需要登录' : `请求失败 (${status})`);
    super(String(message));
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.method = method;
    this.path = path;
  }

  get needsAuth() {
    return this.status === 401;
  }
}

const JSON_HEADERS = { Accept: 'application/json' };

function buildQuery(query) {
  if (!query) return '';
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? '?' + s : '';
}

/**
 * 底层请求：任何官方路由都可以直接用。
 * @param {string} method GET/POST/PUT/PATCH/DELETE
 * @param {string} template 形如 `/works/{workId}/comments`
 * @param {{params?: object, query?: object, body?: any, headers?: object, signal?: AbortSignal}} opts
 */
export async function call(method, template, opts = {}) {
  const { params, query, body, headers = {}, signal } = opts;
  const path = fillPath(template, params || {});
  const url = API_BASE + path + buildQuery(query);
  const init = { method, signal, headers: { ...JSON_HEADERS, ...headers }, credentials: 'same-origin' };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) throw new ApiError(res.status, data, method, path);
  return data;
}

export const get = (t, o) => call('GET', t, o);
export const post = (t, o) => call('POST', t, o);
export const put = (t, o) => call('PUT', t, o);
export const patch = (t, o) => call('PATCH', t, o);
export const del = (t, o) => call('DELETE', t, o);

/** 游标翻页小工具：把 pageInfo.nextCursor 串起来 */
export async function paginate(fn, { limit = 20, pages = 3 } = {}) {
  const out = [];
  let cursor = null;
  for (let i = 0; i < pages; i++) {
    const page = await fn({ cursor, limit });
    const items = page.items || [];
    out.push(...items);
    const next = page.pageInfo && page.pageInfo.nextCursor;
    if (!next || !page.pageInfo.hasNextPage) break;
    cursor = next;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 语义化业务方法（覆盖前端用到的全部官方接口）
// ---------------------------------------------------------------------------

export const session = {
  /** 当前会话（401 表示未登录） */
  get: () => get('/session'),
  /** 官方登录：body = { account, password, captchaVerifyParam } */
  login: (body) => post('/session', { body }),
  /** 二次验证流程登录：body = { flowId } */
  completeFlow: (flowId) => post('/session', { body: { flowId } }),
  logout: () => del('/session'),
  activity: (body) => post('/session/activity', { body }),
  managementWriteAuthorization: () => get('/session/management-write-authorization'),
  revokeManagementWriteAuthorization: () => del('/session/management-write-authorization'),
  captchaConfig: (purpose = 'login') => get('/captcha-config', { query: { purpose } }),
  contentLengthLimit: () => get('/content-length-limit'),
};

export const works = {
  list: (query = {}) => get('/works', { query }),
  get: (workId) => get('/works/{workId}', { params: { workId } }),
  update: (workId, body) => patch('/works/{workId}', { params: { workId }, body }),
  stats: (workId) => get('/works/{workId}/stats', { params: { workId } }),
  sync: (workId) => post('/works/{workId}/sync', { params: { workId } }),
  coins: (workId, body) => put('/works/{workId}/coins', { params: { workId }, body }),
  like: (workId, liked) =>
    liked
      ? put('/works/{workId}/like', { params: { workId } })
      : del('/works/{workId}/like', { params: { workId } }),
  favorite: (workId, on) =>
    on
      ? put('/works/{workId}/favorite', { params: { workId } })
      : del('/works/{workId}/favorite', { params: { workId } }),
  favorites: (query = {}) => get('/work-favorites', { query }),
  recommendations: (query = {}) => get('/work-recommendations', { query }),
  featured: (query = {}) => get('/featured-works', { query }),
  setFeatured: (workIds) => put('/featured-works', { body: { workIds } }),
  /** 作品精选：需要管理权限 */
  featuredManaged: () => get('/featured-works'),
  comments: (workId, query = {}) => get('/works/{workId}/comments', { params: { workId }, query }),
  comment: (workId, commentNumber) =>
    get('/works/{workId}/comments/{commentNumber}', { params: { workId, commentNumber } }),
  commentRevisions: (workId, commentNumber) =>
    get('/works/{workId}/comments/{commentNumber}/revisions', { params: { workId, commentNumber } }),
  createComment: (workId, body) => post('/works/{workId}/comments', { params: { workId }, body }),
  editComment: (workId, commentNumber, body) =>
    patch('/works/{workId}/comments/{commentNumber}', { params: { workId, commentNumber }, body }),
  deleteComment: (workId, commentNumber) =>
    del('/works/{workId}/comments/{commentNumber}', { params: { workId, commentNumber } }),
  likeComment: (workId, commentNumber, liked) =>
    liked
      ? put('/works/{workId}/comments/{commentNumber}/like', { params: { workId, commentNumber } })
      : del('/works/{workId}/comments/{commentNumber}/like', { params: { workId, commentNumber } }),
  pinComment: (workId, commentNumber, pinned) =>
    pinned
      ? put('/works/{workId}/comments/{commentNumber}/pin', { params: { workId, commentNumber } })
      : del('/works/{workId}/comments/{commentNumber}/pin', { params: { workId, commentNumber } }),
  readComments: (workId, body) => put('/works/{workId}/comment-reads', { params: { workId }, body }),
};

export const users = {
  get: (userId) => get('/users/{userId}', { params: { userId } }),
  update: (userId, body) => patch('/users/{userId}', { params: { userId }, body }),
  avatar: (userId) => get('/users/{userId}/avatar', { params: { userId } }),
  setAvatar: (userId, body) => put('/users/{userId}/avatar', { params: { userId }, body }),
  background: (userId) => get('/users/{userId}/background', { params: { userId } }),
  setBackground: (userId, body) => put('/users/{userId}/background', { params: { userId }, body }),
  works: (userId, query = {}) => get('/users/{userId}/works', { params: { userId }, query }),
  topics: (userId, query = {}) => get('/users/{userId}/topics', { params: { userId }, query }),
  posts: (userId, query = {}) => get('/users/{userId}/posts', { params: { userId }, query }),
  workComments: (userId, query = {}) => get('/users/{userId}/work-comments', { params: { userId }, query }),
  followers: (userId, query = {}) => get('/users/{userId}/followers', { params: { userId }, query }),
  following: (userId, query = {}) => get('/users/{userId}/following', { params: { userId }, query }),
  follow: (userId, on) =>
    on
      ? put('/users/{userId}/follow', { params: { userId } })
      : del('/users/{userId}/follow', { params: { userId } }),
  featuredWorks: (userId) => get('/users/{userId}/featured-works', { params: { userId } }),
  setFeaturedWorks: (userId, workIds) =>
    put('/users/{userId}/featured-works', { params: { userId }, body: { workIds } }),
  featuredTopics: (userId) => get('/users/{userId}/featured-topics', { params: { userId } }),
  setFeaturedTopics: (userId, topicIds) =>
    put('/users/{userId}/featured-topics', { params: { userId }, body: { topicIds } }),
  profileActivities: (userId, query = {}) =>
    get('/users/{userId}/profile-activities', { params: { userId }, query }),
  levelContributions: (userId, year) =>
    get('/users/{userId}/level-contributions/{year}', { params: { userId, year } }),
  sessions: (userId) => get('/users/{userId}/sessions', { params: { userId } }),
  revokeSession: (userId, sessionId) =>
    del('/users/{userId}/sessions/{sessionId}', { params: { userId, sessionId } }),
  revokeAllSessions: (userId) => del('/users/{userId}/sessions', { params: { userId } }),
  security: (userId) => get('/users/{userId}/security', { params: { userId } }),
  realName: (userId, body) => put('/users/{userId}/real-name-verification', { params: { userId }, body }),
  secondFactor: (userId, body) => put('/users/{userId}/login-second-factor', { params: { userId }, body }),
  email: (userId) => get('/users/{userId}/email', { params: { userId } }),
  requestEmailChange: (userId, body) => post('/users/{userId}/email-changes', { params: { userId }, body }),
  confirmEmailChange: (userId, changeId, body) =>
    patch('/users/{userId}/email-changes/{emailChangeId}', { params: { userId, emailChangeId: changeId }, body }),
  phone: (userId) => get('/users/{userId}/phone', { params: { userId } }),
  requestPhoneChange: (userId, body) => post('/users/{userId}/phone-changes', { params: { userId }, body }),
  confirmPhoneChange: (userId, changeId, body) =>
    patch('/users/{userId}/phone-changes/{phoneChangeId}', { params: { userId, phoneChangeId: changeId }, body }),
  usernameChanges: (userId) => get('/users/{userId}/username-changes', { params: { userId } }),
  requestUsernameChange: (userId, body) => post('/users/{userId}/username-changes', { params: { userId }, body }),
  confirmUsernameChange: (userId, changeId, body) =>
    patch('/users/{userId}/username-changes/{usernameChangeId}', {
      params: { userId, usernameChangeId: changeId },
      body,
    }),
  avatarPresets: () => get('/avatar-presets'),
};

export const topics = {
  list: (query = {}) => get('/topics', { query }),
  recommendations: (query = {}) => get('/topic-recommendations', { query }),
  get: (topicId) => get('/topics/{topicId}', { params: { topicId } }),
  update: (topicId, body) => patch('/topics/{topicId}', { params: { topicId }, body }),
  posts: (topicId, { cursor, sort, limit } = {}) =>
    get('/topics/{topicId}/posts', { params: { topicId }, query: { cursor, sort, limit } }),
  postContext: (topicId, postNumber) =>
    get('/topics/{topicId}/posts/{postNumber}/context', { params: { topicId, postNumber } }),
  reply: (topicId, body) => post('/topics/{topicId}/posts', { params: { topicId }, body }),
  close: (topicId, reason) =>
    put('/topics/{topicId}/closure', { params: { topicId }, body: reason ? { publicExplanation: reason } : {} }),
  reopen: (topicId) => del('/topics/{topicId}/closure', { params: { topicId } }),
  pin: (topicId, on) =>
    on ? put('/topics/{topicId}/pin', { params: { topicId } }) : del('/topics/{topicId}/pin', { params: { topicId } }),
  duplicateCandidates: (topicId, query = {}) =>
    get('/topics/{topicId}/duplicate-candidates', { params: { topicId }, query }),
};

export const posts = {
  get: (postId) => get('/posts/{postId}', { params: { postId } }),
  create: (body, idempotencyKey) =>
    post('/posts', { body, headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} }),
  edit: (postId, body, idempotencyKey) =>
    patch('/posts/{postId}', {
      params: { postId },
      body,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    }),
  remove: (postId) => del('/posts/{postId}', { params: { postId } }),
  restore: (postId) => patch('/posts/{postId}', { params: { postId }, body: { deleted: false } }),
  like: (postId, on) =>
    on ? put('/posts/{postId}/like', { params: { postId } }) : del('/posts/{postId}/like', { params: { postId } }),
  pin: (postId, on) =>
    on ? put('/posts/{postId}/pin', { params: { postId } }) : del('/posts/{postId}/pin', { params: { postId } }),
  report: (postId, body) => post('/posts/{postId}/reports', { params: { postId }, body }),
  submissions: (query = {}) => get('/post-submissions', { query }),
  submission: (submissionId) => get('/post-submissions/{submissionId}', { params: { submissionId } }),
};

export const search = {
  works: (q, { cursor, limit = 20, signal } = {}) =>
    get('/search/works', { query: { q, cursor, limit }, signal }),
  users: (q, { cursor, limit = 20, signal } = {}) =>
    get('/search/users', { query: { q, cursor, limit }, signal }),
};

export const notifications = {
  summary: () => get('/notification-summary'),
  list: (query = {}) => get('/notifications', { query }),
  markRead: (body) => patch('/notifications', { body }),
  likeGroups: (query = {}) => get('/like-notification-groups', { query }),
  likeGroup: (groupKey) => get('/like-notification-groups/{groupKey}', { params: { groupKey } }),
  likeGroupLikers: (groupKey, query = {}) =>
    get('/like-notification-groups/{groupKey}/likers', { params: { groupKey }, query }),
};

export const bookmarks = {
  folders: () => get('/bookmark-folders'),
  createFolder: (body) => post('/bookmark-folders', { body }),
  updateFolder: (folderId, body) => patch('/bookmark-folders/{folderId}', { params: { folderId }, body }),
  removeFolder: (folderId) => del('/bookmark-folders/{folderId}', { params: { folderId } }),
  folderItems: (folderId, query = {}) =>
    get('/bookmark-folders/{folderId}/items', { params: { folderId }, query }),
  membership: (targetType, targetId) =>
    get('/bookmark-folder-memberships/{targetType}/{targetId}', {
      params: { targetType, targetId },
    }),
  setMembership: (targetType, targetId, body) =>
    put('/bookmark-folder-memberships/{targetType}/{targetId}', {
      params: { targetType, targetId },
      body,
    }),
  create: (body) => post('/bookmarks', { body }),
  remove: (bookmarkId) => del('/bookmarks/{bookmarkId}', { params: { bookmarkId } }),
};

export const auth = {
  register: (body) => post('/registrations', { body }),
  registration: (registrationId) => get('/registrations/{registrationId}', { params: { registrationId } }),
  verifyRegistration: (registrationId, body) =>
    patch('/registrations/{registrationId}', { params: { registrationId }, body }),
  requestPasswordReset: (body) => post('/password-resets', { body }),
  completePasswordReset: (body) => post('/password-resets/completions', { body }),
  startSecurityFlow: (body) => post('/security-flows', { body }),
  securityFlowContact: (flowId, body) => post('/security-flows/{flowId}/contact', { params: { flowId }, body }),
  securityFlowProofs: (flowId, body) => post('/security-flows/{flowId}/proofs', { params: { flowId }, body }),
  securityFlowConfirm: (flowId, body) => post('/security-flows/{flowId}/confirmation', { params: { flowId }, body }),
};

export const questions = {
  duplicateCandidates: (topicId, query = {}) =>
    get('/topics/{topicId}/duplicate-candidates', { params: { topicId }, query }),
  requestDuplicate: (topicId, body) =>
    post('/questions/{topicId}/duplicate-requests', { params: { topicId }, body }),
  setDuplicate: (topicId, body) => put('/questions/{topicId}/duplicate', { params: { topicId }, body }),
  clearDuplicate: (topicId) => del('/questions/{topicId}/duplicate', { params: { topicId } }),
  selectAnswer: (topicId, body) => put('/questions/{topicId}/selected-answer', { params: { topicId }, body }),
  clearAnswer: (topicId) => del('/questions/{topicId}/selected-answer', { params: { topicId } }),
};

// ---------------------------------------------------------------------------
// 会话桥：把浏览器端的 pickcat_session Cookie 交给本地服务端保管
// ---------------------------------------------------------------------------

export const bridge = {
  async status() {
    const res = await fetch('/__session', { headers: JSON_HEADERS });
    return res.json();
  },
  async connect(cookie) {
    const res = await fetch('/__session', {
      method: 'PUT',
      headers: { ...JSON_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookie }),
    });
    const data = await res.json();
    if (!res.ok) throw new ApiError(res.status, data, 'PUT', '/__session');
    return data;
  },
  async disconnect() {
    const res = await fetch('/__session', { method: 'DELETE', headers: JSON_HEADERS });
    return res.json();
  },
};

export const api = {
  call,
  get,
  post,
  put,
  patch,
  del,
  paginate,
  session,
  works,
  users,
  topics,
  posts,
  search,
  notifications,
  bookmarks,
  auth,
  questions,
  bridge,
};

export default api;
