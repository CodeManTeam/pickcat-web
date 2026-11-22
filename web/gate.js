/* ==========================================================================
   pickcat-web 入口门禁
   - 未签署本机声明时，先挡住整个 App，任何页面（含深链接）都先看到「您走错了」
   - 必须逐字输入声明才能进入
   - 签署结果保存在 localStorage，之后不再询问
   ========================================================================== */
(() => {
  "use strict";

  const CONSENT_KEY = "pickcat:thirdparty-consent:v1";
  const REQUIRED_TEXT = "这个项目非官方，随时关闭，账号存储不安全";
  const OFFICIAL_URL = "https://pickcat.dao3.fun";

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // 声明文案升级时 version / text 不匹配，自动要求重新签署
      const valid =
        parsed &&
        parsed.accepted === true &&
        parsed.version === 1 &&
        parsed.text === REQUIRED_TEXT;
      return valid ? parsed : null;
    } catch (err) {
      return null; // 损坏或被禁用 localStorage 时按未签署处理
    }
  }

  function writeConsent() {
    const payload = {
      accepted: true,
      text: REQUIRED_TEXT,
      version: 1,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
    } catch (err) {
      /* 隐私模式下写不进去也不阻断本次进入 */
    }
    return payload;
  }

  const consent = readConsent();
  window.__PICKCAT_GATE__ = {
    key: CONSENT_KEY,
    requiredText: REQUIRED_TEXT,
    officialUrl: OFFICIAL_URL,
    consent,
  };

  /* ---- 匿名访客计数（随机 id 去重，不涉及账号；每 30 分钟最多一次）---- */
  (() => {
    try {
      const ID_KEY = "pickcat:visitor-id";
      const PING_KEY = "pickcat:visitor-ping";
      let id = localStorage.getItem(ID_KEY);
      if (!id || !/^[a-z0-9-]{8,64}$/.test(id)) {
        id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `v${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
        localStorage.setItem(ID_KEY, id);
      }
      const now = Date.now();
      const last = Number(localStorage.getItem(PING_KEY) || 0);
      if (now - last < 30 * 60 * 1000) return;
      localStorage.setItem(PING_KEY, String(now));

      const payload = JSON.stringify({
        id,
        path: location.pathname + location.search,
        ref: document.referrer || "",
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/__visit", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/__visit", {
          method: "POST",
          body: payload,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    } catch (err) {
      /* 统计失败不影响进入 */
    }
  })();

  if (consent) return;

  /* ---- 未签署：立刻锁住 App，避免任何内容先于门禁出现 ---- */
  window.__PICKCAT_GATE_LOCKED__ = true;
  document.documentElement.classList.add("gate-locked");

  const lockStyle = document.createElement("style");
  lockStyle.textContent =
    "html.gate-locked .phone-shell{visibility:hidden!important;pointer-events:none!important}";
  (document.head || document.documentElement).appendChild(lockStyle);

  const template = (requiredText, officialUrl) => `
    <div class="pc-gate" role="dialog" aria-modal="true" aria-labelledby="pc-gate-title" aria-describedby="pc-gate-warn">
      <div class="pc-gate__card">
        <span class="pc-gate__eyebrow">第三方测试站 · 非官方</span>
        <h1 class="pc-gate__title" id="pc-gate-title">您走错了</h1>
        <p class="pc-gate__subtitle">这里不是 PICKCAT 官方站点，而是一个随时会关闭的第三方仿冒测试站。</p>

        <div class="pc-gate__warn" id="pc-gate-warn">
          <p><strong>这不是 PICKCAT 官方站。</strong>本站为第三方仿冒测试，与 PICKCAT / 编程猫官方没有任何关系，随时可能关闭、清空数据或直接无法访问。</p>
          <p>你的登录态（<code>pickcat_session</code> 等）只保存在本机浏览器 Cookie 与 localStorage 中，<strong>本站不做任何安全保护</strong>，同源脚本可随时读取，请勿使用主账号或重要密码登录。</p>
          <p>如果你要找的是官方站，请立即离开，并使用下方链接。</p>
        </div>

        <a class="pc-gate__official" href="${officialUrl}" target="_blank" rel="noopener noreferrer">
          <span class="pc-gate__official-main">
            <span class="pc-gate__official-label">前往官方 PICKCAT</span>
            <span class="pc-gate__official-url">pickcat.dao3.fun</span>
          </span>
          <span class="pc-gate__official-arrow" aria-hidden="true">→</span>
        </a>

        <p class="pc-gate__sign-label">
          必须签署才能进入
          <span>逐字输入下方这句话</span>
        </p>
        <p class="pc-gate__statement" id="pc-gate-statement">${requiredText}</p>

        <label class="pc-gate__visually-hidden" for="pc-gate-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">声明内容</label>
        <input
          class="pc-gate__input"
          id="pc-gate-input"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint="done"
          placeholder="请在这里逐字输入上面这句话"
        />

        <div class="pc-gate__meta">
          <span class="pc-gate__count" data-count>已输入 0 / ${requiredText.length} 字</span>
          <span data-hint>内容需完全一致</span>
        </div>

        <button class="pc-gate__enter" type="button" data-enter disabled>我已理解，进入本站</button>

        <div class="pc-gate__foot">
          <span>同意记录只保存在本机 <code>localStorage</code>，不上传；再次访问不再询问。</span>
          <button class="pc-gate__reset" type="button" data-reset>清除记录</button>
        </div>
      </div>
    </div>
  `;

  function mount() {
    const holder = document.createElement("div");
    holder.innerHTML = template(REQUIRED_TEXT, OFFICIAL_URL).trim();
    const gate = holder.firstElementChild;
    (document.body || document.documentElement).appendChild(gate);

    const input = gate.querySelector("#pc-gate-input");
    const enter = gate.querySelector("[data-enter]");
    const count = gate.querySelector("[data-count]");
    const hint = gate.querySelector("[data-hint]");
    const reset = gate.querySelector("[data-reset]");

    gate.__pickcatGate = { input, enter, gate };

    let signed = false;

    const validate = () => {
      const value = input.value.trim();
      const ok = value === REQUIRED_TEXT;
      enter.disabled = !ok;
      input.dataset.state = ok ? "ok" : "";
      count.textContent = ok
        ? `已完整签署（${REQUIRED_TEXT.length} / ${REQUIRED_TEXT.length} 字）`
        : `已输入 ${value.length} / ${REQUIRED_TEXT.length} 字`;
      count.dataset.state = ok ? "ok" : "";
      hint.textContent = ok ? "可以进入" : "内容需完全一致";
    };

    const accept = () => {
      if (signed) return;
      if (input.value.trim() !== REQUIRED_TEXT) return;
      signed = true;

      const payload = writeConsent();
      window.__PICKCAT_GATE__.consent = payload;
      window.__PICKCAT_GATE_LOCKED__ = false;
      document.documentElement.classList.remove("gate-locked");

      gate.classList.add("is-leaving");
      window.setTimeout(() => {
        gate.remove();
        if (typeof window.__pickcatStartApp === "function") {
          window.__pickcatStartApp();
        } else {
          window.location.reload();
        }
      }, 240);

      document.dispatchEvent(new CustomEvent("pickcat:consent", { detail: payload }));
    };

    input.addEventListener("input", validate);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!enter.disabled) accept();
      }
    });
    enter.addEventListener("click", accept);

    reset.addEventListener("click", () => {
      try {
        localStorage.removeItem(CONSENT_KEY);
      } catch (err) {
        /* ignore */
      }
      input.value = "";
      validate();
      input.focus();
    });

    validate();
    window.setTimeout(() => input.focus({ preventScroll: true }), 60);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }

  /* 供调试/控制台使用：清除本机签署记录后刷新即重新出现门禁 */
  window.PickcatThirdPartyGate = {
    key: CONSENT_KEY,
    requiredText: REQUIRED_TEXT,
    officialUrl: OFFICIAL_URL,
    state() {
      return readConsent();
    },
    reset() {
      try {
        localStorage.removeItem(CONSENT_KEY);
      } catch (err) {
        /* ignore */
      }
    },
  };
})();
