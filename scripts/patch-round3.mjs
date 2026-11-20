// 第三轮：按原版社区截图（403032 / 384098 / 419825）还原 UI 细节
import { readFileSync, writeFileSync } from 'node:fs';

const appFile = 'web/app.js';
let src = readFileSync(appFile, 'utf8');

function swap(from, to, label) {
  if (!src.includes(from)) throw new Error('定位失败: ' + label);
  src = src.replace(from, to);
  console.log('patched:', label);
}

// 1) 首页/发现的作品卡：改成原版的「封面 + Play 角标」紧凑卡
swap(
  `    <img class="home-work-cover" src="\${work.preview}" alt="" loading="lazy" onerror="this.classList.add('is-missing')" />
    <div class="home-work-content">
      <div class="home-work-kicker">\${escapeHtml(work.feedLabel || "发现作品")}</div>
      <h3>\${escapeHtml(work.name)}</h3>
      <p>\${escapeHtml(work.description || " ")}</p>`,
  `    <div class="work-cover-wrap">
      <img class="home-work-cover" src="\${work.preview}" alt="" loading="lazy" onerror="this.classList.add('is-missing')" />
      <span class="play-badge">Play</span>
    </div>
    <div class="home-work-content">
      <h3>\${escapeHtml(work.name)}</h3>`,
  'home work card cover',
);

// 2) 帖子动作行：分享 / 评论 / 点赞 / 收藏（原版四个图标）
swap(
  `      <span class="action" title="分享"><img class="action-img" src="\${ASSETS.share}" alt="" />\${compactNumber(post.stats[0])}</span>
      <span class="action" title="评论"><img class="action-img" src="\${ASSETS.homeComment}" alt="" />\${compactNumber(post.stats[1])}</span>
      <span class="action" title="再创作"><img class="action-img" src="\${ASSETS.recreate}" alt="" />\${compactNumber(post.stats[2])}</span>
      <span class="action" title="收藏"><img class="action-img" src="\${ASSETS.pick}" alt="" />\${compactNumber(post.stats[3])}</span>`,
  `      <span class="action" title="浏览"><img class="action-img" src="\${ASSETS.view}" alt="" />\${compactNumber(post.stats[0])}</span>
      <span class="action" title="评论"><img class="action-img" src="\${ASSETS.homeComment}" alt="" />\${compactNumber(post.stats[1])}</span>
      <span class="action" title="点赞"><img class="action-img" src="public/assets/pickcat/ic_home_rec_pick.png" alt="" />\${compactNumber(post.stats[2])}</span>
      <span class="action" title="收藏"><img class="action-img" src="\${ASSETS.pick}" alt="" />\${compactNumber(post.stats[3])}</span>`,
  'post action row',
);

// 3) 喵圈卡片：原版结构（封面 + N 话题浮层、居中标题/简介、单个「加入」按钮）
swap(
  `      card.innerHTML = \`
        <div class="circle-cover \${circle.tone === "alt" ? "alt" : ""}">
          <img src="\${circle.icon}" alt="" />
          <span class="circle-count">\${circle.count}</span>
        </div>
        <div class="circle-body">
          <h3>\${circle.name}</h3>
          <p>\${circle.desc}</p>
          <div class="circle-actions">
            <button class="join-btn" type="button" data-open-board>进入板块</button>
            <a class="circle-site" href="\${circle.site}" target="_blank" rel="noreferrer">原站</a>
          </div>
        </div>
      \`;`,
  `      card.innerHTML = \`
        <div class="circle-cover \${circle.tone === "alt" ? "alt" : ""}">
          <img src="\${circle.icon}" alt="" />
          <span class="circle-count">\${circle.count}</span>
        </div>
        <div class="circle-body">
          <h3>\${circle.name}</h3>
          <p>\${circle.desc}</p>
          <button class="join-btn" type="button" data-open-board>\u52a0\u5165</button>
        </div>
      \`;`,
  'circle card',
);

// 4) 我的：关注 / 粉丝 平铺文字 + 昵称旁编辑铅笔
swap(
  `  const stats = [
    { label: "ID", value: user?.id || "--" },
    { label: "作品", value: user?.stats?.works ?? (state.mineWorks.length || 0) },
    { label: "粉丝", value: user?.stats?.followers ?? (state.mineFollowers.length || 0) },
    { label: "关注", value: user?.stats?.following ?? (state.mineFollowingUsers.length || 0) }
  ];
  $(".profile-card").innerHTML = \`
    \${avatar ? \`<img class="profile-avatar-img" src="\${avatar}" alt="" />\` : \`<div class="avatar">皮</div>\`}
    <div class="profile-main">
      <h2>\${name}</h2>
      <p>\${desc}</p>
      <div class="profile-meta">\${stats.map((item) => \`<span>\${item.label} \${item.value}</span>\`).join("")}</div>
    </div>
  \`;`,
  `  const following = user?.stats?.following ?? (state.mineFollowingUsers.length || 0);
  const followers = user?.stats?.followers ?? (state.mineFollowers.length || 0);
  $(".profile-card").innerHTML = \`
    \${avatar ? \`<img class="profile-avatar-img" src="\${avatar}" alt="" />\` : \`<div class="avatar">皮</div>\`}
    <div class="profile-main">
      <h2>\${name}<span class="name-edit" aria-hidden="true">✎</span></h2>
      <div class="profile-follow-row"><span>关注 <b>\${following}</b></span><span>粉丝 <b>\${followers}</b></span></div>
      <p class="profile-bio">\${escapeHtml(desc)}</p>
    </div>
  \`;`,
  'mine shell',
);

writeFileSync(appFile, src, 'utf8');
console.log('app.js patched');

// 5) 发布页标题/文案对齐原版
const htmlFile = 'web/index.html';
let html = readFileSync(htmlFile, 'utf8');
html = html.replace('<h2>发布动态</h2>', '<h2>发布作品</h2>');
html = html.replace('placeholder="分享作品、想法或喵圈内容"', 'placeholder="介绍一下你的作品，让更多人看到～"');
html = html.replace('<option value="">选择喵圈</option>', '<option value="">选择喵圈</option>');
writeFileSync(htmlFile, html, 'utf8');
console.log('index.html patched');

