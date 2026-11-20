# 官方 PICKCAT API 路由清单

> 自动生成：`node scripts/gen-inventory.mjs`，核对用 `GET /__routes`。

共 **119** 条 `method + path` 组合，全部挂在 `https://pickcat.dao3.fun/api/v1` 之下。

## 通用（7）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/avatar-presets` | `api.call('GET', '/avatar-presets')` |
| GET | `/captcha-config` | `api.call('GET', '/captcha-config')` |
| GET | `/content-length-limit` | `api.call('GET', '/content-length-limit')` |
| GET | `/featured-works` | `api.call('GET', '/featured-works')` |
| PUT | `/featured-works` | `api.call('PUT', '/featured-works')` |
| GET | `/notification-summary` | `api.call('GET', '/notification-summary')` |
| GET | `/topic-recommendations` | `api.call('GET', '/topic-recommendations')` |

## 收藏夹（9）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/bookmark-folder-memberships/{targetType}/{targetId}` | `api.call('GET', '/bookmark-folder-memberships/{targetType}/{targetId}')` |
| PUT | `/bookmark-folder-memberships/{targetType}/{targetId}` | `api.call('PUT', '/bookmark-folder-memberships/{targetType}/{targetId}')` |
| GET | `/bookmark-folders` | `api.call('GET', '/bookmark-folders')` |
| POST | `/bookmark-folders` | `api.call('POST', '/bookmark-folders')` |
| DELETE | `/bookmark-folders/{folderId}` | `api.call('DELETE', '/bookmark-folders/{folderId}')` |
| PATCH | `/bookmark-folders/{folderId}` | `api.call('PATCH', '/bookmark-folders/{folderId}')` |
| GET | `/bookmark-folders/{folderId}/items` | `api.call('GET', '/bookmark-folders/{folderId}/items')` |
| POST | `/bookmarks` | `api.call('POST', '/bookmarks')` |
| DELETE | `/bookmarks/{bookmarkId}` | `api.call('DELETE', '/bookmarks/{bookmarkId}')` |

## 通知（5）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/like-notification-groups` | `api.call('GET', '/like-notification-groups')` |
| GET | `/like-notification-groups/{groupKey}` | `api.call('GET', '/like-notification-groups/{groupKey}')` |
| GET | `/like-notification-groups/{groupKey}/likers` | `api.call('GET', '/like-notification-groups/{groupKey}/likers')` |
| GET | `/notifications` | `api.call('GET', '/notifications')` |
| PATCH | `/notifications` | `api.call('PATCH', '/notifications')` |

## 认证与会话（14）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| POST | `/password-resets` | `api.call('POST', '/password-resets')` |
| POST | `/password-resets/completions` | `api.call('POST', '/password-resets/completions')` |
| POST | `/registrations` | `api.call('POST', '/registrations')` |
| PATCH | `/registrations/{registrationId}` | `api.call('PATCH', '/registrations/{registrationId}')` |
| POST | `/security-flows` | `api.call('POST', '/security-flows')` |
| POST | `/security-flows/{flowId}/confirmation` | `api.call('POST', '/security-flows/{flowId}/confirmation')` |
| POST | `/security-flows/{flowId}/contact` | `api.call('POST', '/security-flows/{flowId}/contact')` |
| POST | `/security-flows/{flowId}/proofs` | `api.call('POST', '/security-flows/{flowId}/proofs')` |
| DELETE | `/session` | `api.call('DELETE', '/session')` |
| GET | `/session` | `api.call('GET', '/session')` |
| POST | `/session` | `api.call('POST', '/session')` |
| POST | `/session/activity` | `api.call('POST', '/session/activity')` |
| DELETE | `/session/management-write-authorization` | `api.call('DELETE', '/session/management-write-authorization')` |
| GET | `/session/management-write-authorization` | `api.call('GET', '/session/management-write-authorization')` |

## 帖子回复（11）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/post-submissions` | `api.call('GET', '/post-submissions')` |
| GET | `/post-submissions/{submissionId}` | `api.call('GET', '/post-submissions/{submissionId}')` |
| POST | `/posts` | `api.call('POST', '/posts')` |
| DELETE | `/posts/{postId}` | `api.call('DELETE', '/posts/{postId}')` |
| GET | `/posts/{postId}` | `api.call('GET', '/posts/{postId}')` |
| PATCH | `/posts/{postId}` | `api.call('PATCH', '/posts/{postId}')` |
| DELETE | `/posts/{postId}/like` | `api.call('DELETE', '/posts/{postId}/like')` |
| PUT | `/posts/{postId}/like` | `api.call('PUT', '/posts/{postId}/like')` |
| DELETE | `/posts/{postId}/pin` | `api.call('DELETE', '/posts/{postId}/pin')` |
| PUT | `/posts/{postId}/pin` | `api.call('PUT', '/posts/{postId}/pin')` |
| POST | `/posts/{postId}/reports` | `api.call('POST', '/posts/{postId}/reports')` |

## 话题问答（15）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| DELETE | `/questions/{topicId}/duplicate` | `api.call('DELETE', '/questions/{topicId}/duplicate')` |
| PUT | `/questions/{topicId}/duplicate` | `api.call('PUT', '/questions/{topicId}/duplicate')` |
| POST | `/questions/{topicId}/duplicate-requests` | `api.call('POST', '/questions/{topicId}/duplicate-requests')` |
| DELETE | `/questions/{topicId}/selected-answer` | `api.call('DELETE', '/questions/{topicId}/selected-answer')` |
| PUT | `/questions/{topicId}/selected-answer` | `api.call('PUT', '/questions/{topicId}/selected-answer')` |
| GET | `/topics` | `api.call('GET', '/topics')` |
| GET | `/topics/{topicId}` | `api.call('GET', '/topics/{topicId}')` |
| PATCH | `/topics/{topicId}` | `api.call('PATCH', '/topics/{topicId}')` |
| DELETE | `/topics/{topicId}/closure` | `api.call('DELETE', '/topics/{topicId}/closure')` |
| PUT | `/topics/{topicId}/closure` | `api.call('PUT', '/topics/{topicId}/closure')` |
| GET | `/topics/{topicId}/duplicate-candidates` | `api.call('GET', '/topics/{topicId}/duplicate-candidates')` |
| DELETE | `/topics/{topicId}/pin` | `api.call('DELETE', '/topics/{topicId}/pin')` |
| PUT | `/topics/{topicId}/pin` | `api.call('PUT', '/topics/{topicId}/pin')` |
| GET | `/topics/{topicId}/posts` | `api.call('GET', '/topics/{topicId}/posts')` |
| GET | `/topics/{topicId}/posts/{postNumber}/context` | `api.call('GET', '/topics/{topicId}/posts/{postNumber}/context')` |

## 搜索（2）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/search/users` | `api.call('GET', '/search/users')` |
| GET | `/search/works` | `api.call('GET', '/search/works')` |

## 用户（34）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/users/{userId}` | `api.call('GET', '/users/{userId}')` |
| PATCH | `/users/{userId}` | `api.call('PATCH', '/users/{userId}')` |
| GET | `/users/{userId}/avatar` | `api.call('GET', '/users/{userId}/avatar')` |
| PUT | `/users/{userId}/avatar` | `api.call('PUT', '/users/{userId}/avatar')` |
| PUT | `/users/{userId}/background` | `api.call('PUT', '/users/{userId}/background')` |
| GET | `/users/{userId}/email` | `api.call('GET', '/users/{userId}/email')` |
| POST | `/users/{userId}/email-changes` | `api.call('POST', '/users/{userId}/email-changes')` |
| PATCH | `/users/{userId}/email-changes/{emailChangeId}` | `api.call('PATCH', '/users/{userId}/email-changes/{emailChangeId}')` |
| GET | `/users/{userId}/featured-topics` | `api.call('GET', '/users/{userId}/featured-topics')` |
| PUT | `/users/{userId}/featured-topics` | `api.call('PUT', '/users/{userId}/featured-topics')` |
| GET | `/users/{userId}/featured-works` | `api.call('GET', '/users/{userId}/featured-works')` |
| PUT | `/users/{userId}/featured-works` | `api.call('PUT', '/users/{userId}/featured-works')` |
| DELETE | `/users/{userId}/follow` | `api.call('DELETE', '/users/{userId}/follow')` |
| PUT | `/users/{userId}/follow` | `api.call('PUT', '/users/{userId}/follow')` |
| GET | `/users/{userId}/followers` | `api.call('GET', '/users/{userId}/followers')` |
| GET | `/users/{userId}/following` | `api.call('GET', '/users/{userId}/following')` |
| GET | `/users/{userId}/level-contributions/{year}` | `api.call('GET', '/users/{userId}/level-contributions/{year}')` |
| PUT | `/users/{userId}/login-second-factor` | `api.call('PUT', '/users/{userId}/login-second-factor')` |
| GET | `/users/{userId}/phone` | `api.call('GET', '/users/{userId}/phone')` |
| POST | `/users/{userId}/phone-changes` | `api.call('POST', '/users/{userId}/phone-changes')` |
| PATCH | `/users/{userId}/phone-changes/{phoneChangeId}` | `api.call('PATCH', '/users/{userId}/phone-changes/{phoneChangeId}')` |
| GET | `/users/{userId}/posts` | `api.call('GET', '/users/{userId}/posts')` |
| GET | `/users/{userId}/profile-activities` | `api.call('GET', '/users/{userId}/profile-activities')` |
| PUT | `/users/{userId}/real-name-verification` | `api.call('PUT', '/users/{userId}/real-name-verification')` |
| GET | `/users/{userId}/security` | `api.call('GET', '/users/{userId}/security')` |
| DELETE | `/users/{userId}/sessions` | `api.call('DELETE', '/users/{userId}/sessions')` |
| GET | `/users/{userId}/sessions` | `api.call('GET', '/users/{userId}/sessions')` |
| DELETE | `/users/{userId}/sessions/{sessionId}` | `api.call('DELETE', '/users/{userId}/sessions/{sessionId}')` |
| GET | `/users/{userId}/topics` | `api.call('GET', '/users/{userId}/topics')` |
| POST | `/users/{userId}/username-changes` | `api.call('POST', '/users/{userId}/username-changes')` |
| GET | `/users/{userId}/username-changes/{usernameChangeId}` | `api.call('GET', '/users/{userId}/username-changes/{usernameChangeId}')` |
| PATCH | `/users/{userId}/username-changes/{usernameChangeId}` | `api.call('PATCH', '/users/{userId}/username-changes/{usernameChangeId}')` |
| GET | `/users/{userId}/work-comments` | `api.call('GET', '/users/{userId}/work-comments')` |
| GET | `/users/{userId}/works` | `api.call('GET', '/users/{userId}/works')` |

## 作品（22）

| 方法 | 路径 | 客户端方法 |
| --- | --- | --- |
| GET | `/work-favorites` | `api.call('GET', '/work-favorites')` |
| GET | `/work-recommendations` | `api.call('GET', '/work-recommendations')` |
| GET | `/works/{workId}` | `api.call('GET', '/works/{workId}')` |
| PATCH | `/works/{workId}` | `api.call('PATCH', '/works/{workId}')` |
| PUT | `/works/{workId}/coins` | `api.call('PUT', '/works/{workId}/coins')` |
| PUT | `/works/{workId}/comment-reads` | `api.call('PUT', '/works/{workId}/comment-reads')` |
| GET | `/works/{workId}/comments` | `api.call('GET', '/works/{workId}/comments')` |
| POST | `/works/{workId}/comments` | `api.call('POST', '/works/{workId}/comments')` |
| DELETE | `/works/{workId}/comments/{commentNumber}` | `api.call('DELETE', '/works/{workId}/comments/{commentNumber}')` |
| GET | `/works/{workId}/comments/{commentNumber}` | `api.call('GET', '/works/{workId}/comments/{commentNumber}')` |
| PATCH | `/works/{workId}/comments/{commentNumber}` | `api.call('PATCH', '/works/{workId}/comments/{commentNumber}')` |
| DELETE | `/works/{workId}/comments/{commentNumber}/like` | `api.call('DELETE', '/works/{workId}/comments/{commentNumber}/like')` |
| PUT | `/works/{workId}/comments/{commentNumber}/like` | `api.call('PUT', '/works/{workId}/comments/{commentNumber}/like')` |
| DELETE | `/works/{workId}/comments/{commentNumber}/pin` | `api.call('DELETE', '/works/{workId}/comments/{commentNumber}/pin')` |
| PUT | `/works/{workId}/comments/{commentNumber}/pin` | `api.call('PUT', '/works/{workId}/comments/{commentNumber}/pin')` |
| GET | `/works/{workId}/comments/{commentNumber}/revisions` | `api.call('GET', '/works/{workId}/comments/{commentNumber}/revisions')` |
| DELETE | `/works/{workId}/favorite` | `api.call('DELETE', '/works/{workId}/favorite')` |
| PUT | `/works/{workId}/favorite` | `api.call('PUT', '/works/{workId}/favorite')` |
| DELETE | `/works/{workId}/like` | `api.call('DELETE', '/works/{workId}/like')` |
| PUT | `/works/{workId}/like` | `api.call('PUT', '/works/{workId}/like')` |
| GET | `/works/{workId}/stats` | `api.call('GET', '/works/{workId}/stats')` |
| POST | `/works/{workId}/sync` | `api.call('POST', '/works/{workId}/sync')` |
