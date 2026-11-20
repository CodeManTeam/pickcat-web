/**
 * 官方 PICKCAT API 路由清单（自动生成，勿手改）
 *
 * 来源：https://pickcat.dao3.fun 的 Nuxt 客户端 SDK chunk 静态抽取
 * 生成命令：node scripts/gen-endpoints.mjs
 * 共 119 条 method + path 组合，全部挂在 /api/v1 之下。
 */
export const API_BASE = '/api/v1';

export const ROUTES = [
  {
    "method": "GET",
    "path": "/avatar-presets"
  },
  {
    "method": "GET",
    "path": "/bookmark-folder-memberships/{targetType}/{targetId}"
  },
  {
    "method": "PUT",
    "path": "/bookmark-folder-memberships/{targetType}/{targetId}"
  },
  {
    "method": "GET",
    "path": "/bookmark-folders"
  },
  {
    "method": "POST",
    "path": "/bookmark-folders"
  },
  {
    "method": "DELETE",
    "path": "/bookmark-folders/{folderId}"
  },
  {
    "method": "PATCH",
    "path": "/bookmark-folders/{folderId}"
  },
  {
    "method": "GET",
    "path": "/bookmark-folders/{folderId}/items"
  },
  {
    "method": "POST",
    "path": "/bookmarks"
  },
  {
    "method": "DELETE",
    "path": "/bookmarks/{bookmarkId}"
  },
  {
    "method": "GET",
    "path": "/captcha-config"
  },
  {
    "method": "GET",
    "path": "/content-length-limit"
  },
  {
    "method": "GET",
    "path": "/featured-works"
  },
  {
    "method": "PUT",
    "path": "/featured-works"
  },
  {
    "method": "GET",
    "path": "/like-notification-groups"
  },
  {
    "method": "GET",
    "path": "/like-notification-groups/{groupKey}"
  },
  {
    "method": "GET",
    "path": "/like-notification-groups/{groupKey}/likers"
  },
  {
    "method": "GET",
    "path": "/notification-summary"
  },
  {
    "method": "GET",
    "path": "/notifications"
  },
  {
    "method": "PATCH",
    "path": "/notifications"
  },
  {
    "method": "POST",
    "path": "/password-resets"
  },
  {
    "method": "POST",
    "path": "/password-resets/completions"
  },
  {
    "method": "GET",
    "path": "/post-submissions"
  },
  {
    "method": "GET",
    "path": "/post-submissions/{submissionId}"
  },
  {
    "method": "POST",
    "path": "/posts"
  },
  {
    "method": "DELETE",
    "path": "/posts/{postId}"
  },
  {
    "method": "GET",
    "path": "/posts/{postId}"
  },
  {
    "method": "PATCH",
    "path": "/posts/{postId}"
  },
  {
    "method": "DELETE",
    "path": "/posts/{postId}/like"
  },
  {
    "method": "PUT",
    "path": "/posts/{postId}/like"
  },
  {
    "method": "DELETE",
    "path": "/posts/{postId}/pin"
  },
  {
    "method": "PUT",
    "path": "/posts/{postId}/pin"
  },
  {
    "method": "POST",
    "path": "/posts/{postId}/reports"
  },
  {
    "method": "DELETE",
    "path": "/questions/{topicId}/duplicate"
  },
  {
    "method": "PUT",
    "path": "/questions/{topicId}/duplicate"
  },
  {
    "method": "POST",
    "path": "/questions/{topicId}/duplicate-requests"
  },
  {
    "method": "DELETE",
    "path": "/questions/{topicId}/selected-answer"
  },
  {
    "method": "PUT",
    "path": "/questions/{topicId}/selected-answer"
  },
  {
    "method": "POST",
    "path": "/registrations"
  },
  {
    "method": "PATCH",
    "path": "/registrations/{registrationId}"
  },
  {
    "method": "GET",
    "path": "/search/users"
  },
  {
    "method": "GET",
    "path": "/search/works"
  },
  {
    "method": "POST",
    "path": "/security-flows"
  },
  {
    "method": "POST",
    "path": "/security-flows/{flowId}/confirmation"
  },
  {
    "method": "POST",
    "path": "/security-flows/{flowId}/contact"
  },
  {
    "method": "POST",
    "path": "/security-flows/{flowId}/proofs"
  },
  {
    "method": "DELETE",
    "path": "/session"
  },
  {
    "method": "GET",
    "path": "/session"
  },
  {
    "method": "POST",
    "path": "/session"
  },
  {
    "method": "POST",
    "path": "/session/activity"
  },
  {
    "method": "DELETE",
    "path": "/session/management-write-authorization"
  },
  {
    "method": "GET",
    "path": "/session/management-write-authorization"
  },
  {
    "method": "GET",
    "path": "/topic-recommendations"
  },
  {
    "method": "GET",
    "path": "/topics"
  },
  {
    "method": "GET",
    "path": "/topics/{topicId}"
  },
  {
    "method": "PATCH",
    "path": "/topics/{topicId}"
  },
  {
    "method": "DELETE",
    "path": "/topics/{topicId}/closure"
  },
  {
    "method": "PUT",
    "path": "/topics/{topicId}/closure"
  },
  {
    "method": "GET",
    "path": "/topics/{topicId}/duplicate-candidates"
  },
  {
    "method": "DELETE",
    "path": "/topics/{topicId}/pin"
  },
  {
    "method": "PUT",
    "path": "/topics/{topicId}/pin"
  },
  {
    "method": "GET",
    "path": "/topics/{topicId}/posts"
  },
  {
    "method": "GET",
    "path": "/topics/{topicId}/posts/{postNumber}/context"
  },
  {
    "method": "GET",
    "path": "/users/{userId}"
  },
  {
    "method": "PATCH",
    "path": "/users/{userId}"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/avatar"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/avatar"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/background"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/email"
  },
  {
    "method": "POST",
    "path": "/users/{userId}/email-changes"
  },
  {
    "method": "PATCH",
    "path": "/users/{userId}/email-changes/{emailChangeId}"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/featured-topics"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/featured-topics"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/featured-works"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/featured-works"
  },
  {
    "method": "DELETE",
    "path": "/users/{userId}/follow"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/follow"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/followers"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/following"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/level-contributions/{year}"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/login-second-factor"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/phone"
  },
  {
    "method": "POST",
    "path": "/users/{userId}/phone-changes"
  },
  {
    "method": "PATCH",
    "path": "/users/{userId}/phone-changes/{phoneChangeId}"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/posts"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/profile-activities"
  },
  {
    "method": "PUT",
    "path": "/users/{userId}/real-name-verification"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/security"
  },
  {
    "method": "DELETE",
    "path": "/users/{userId}/sessions"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/sessions"
  },
  {
    "method": "DELETE",
    "path": "/users/{userId}/sessions/{sessionId}"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/topics"
  },
  {
    "method": "POST",
    "path": "/users/{userId}/username-changes"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/username-changes/{usernameChangeId}"
  },
  {
    "method": "PATCH",
    "path": "/users/{userId}/username-changes/{usernameChangeId}"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/work-comments"
  },
  {
    "method": "GET",
    "path": "/users/{userId}/works"
  },
  {
    "method": "GET",
    "path": "/work-favorites"
  },
  {
    "method": "GET",
    "path": "/work-recommendations"
  },
  {
    "method": "GET",
    "path": "/works/{workId}"
  },
  {
    "method": "PATCH",
    "path": "/works/{workId}"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/coins"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/comment-reads"
  },
  {
    "method": "GET",
    "path": "/works/{workId}/comments"
  },
  {
    "method": "POST",
    "path": "/works/{workId}/comments"
  },
  {
    "method": "DELETE",
    "path": "/works/{workId}/comments/{commentNumber}"
  },
  {
    "method": "GET",
    "path": "/works/{workId}/comments/{commentNumber}"
  },
  {
    "method": "PATCH",
    "path": "/works/{workId}/comments/{commentNumber}"
  },
  {
    "method": "DELETE",
    "path": "/works/{workId}/comments/{commentNumber}/like"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/comments/{commentNumber}/like"
  },
  {
    "method": "DELETE",
    "path": "/works/{workId}/comments/{commentNumber}/pin"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/comments/{commentNumber}/pin"
  },
  {
    "method": "GET",
    "path": "/works/{workId}/comments/{commentNumber}/revisions"
  },
  {
    "method": "DELETE",
    "path": "/works/{workId}/favorite"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/favorite"
  },
  {
    "method": "DELETE",
    "path": "/works/{workId}/like"
  },
  {
    "method": "PUT",
    "path": "/works/{workId}/like"
  },
  {
    "method": "GET",
    "path": "/works/{workId}/stats"
  },
  {
    "method": "POST",
    "path": "/works/{workId}/sync"
  }
];

/** 路由分组：按业务域归类，便于 SDK 与文档引用 */
export const ROUTE_GROUPS = (() => {
  const groups = {};
  const pick = (p) => {
    if (p.startsWith('/manage')) return '后台管理';
    if (p.startsWith('/session') || p.startsWith('/registrations') || p.startsWith('/password-resets') || p.startsWith('/security-flows') || p.startsWith('/account-recovery')) return '认证与会话';
    if (p.startsWith('/works') || p.includes('/works/') || p.startsWith('/work-')) return '作品';
    if (p.startsWith('/posts') || p.startsWith('/post-submissions')) return '帖子回复';
    if (p.startsWith('/topics') || p.startsWith('/questions')) return '话题问答';
    if (p.startsWith('/users')) return '用户';
    if (p.startsWith('/search')) return '搜索';
    if (p.startsWith('/notifications') || p.startsWith('/like-notification-groups')) return '通知';
    if (p.startsWith('/bookmark')) return '收藏夹';
    return '通用';
  };
  for (const r of ROUTES) {
    const g = pick(r.path);
    (groups[g] ||= []).push(r);
  }
  return groups;
})();

/** 把 `/works/{workId}` 这类模板替换成真实路径 */
export function fillPath(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = params[key];
    if (v === undefined || v === null || v === '') throw new Error('缺少路径参数 ' + key + ' 于 ' + template);
    return encodeURIComponent(String(v));
  });
}
