/**
 * PICKCAT 站内账号密码登录（阿里云验证码 2.0）
 *
 * 流程与官方登录页一致：
 *   GET  /api/v1/captcha-config?purpose=login   → { provider, region, prefix, sceneId }
 *   加载 https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js
 *   initAliyunCaptcha({ SceneId, prefix, mode:'popup', button, captchaVerifyCallback })
 *   用户拖动滑块 → 回调拿到 captchaVerifyParam
 *   POST /api/v1/session { account, password, captchaVerifyParam }
 *   官方回 201 + Set-Cookie → server.mjs 把 Cookie 转写成本机同源 Cookie → 客户端登录态成立
 */
(function () {
  'use strict';

  const SDK_URL = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
  let sdkPromise = null;
  let initPromise = null;
  let instance = null;
  let config = null;

  function statusEl() {
    return document.querySelector('[data-login-status]');
  }

  function setStatus(text) {
    const el = statusEl();
    if (el) el.textContent = text;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('验证码组件加载失败，检查网络后重试'));
      document.head.appendChild(s);
    });
  }

  async function fetchConfig() {
    const res = await fetch('/api/v1/captcha-config?purpose=login', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('无法获取验证码配置');
    const data = await res.json();
    if (!data || !data.sceneId || !data.prefix) throw new Error('验证码配置不完整');
    return data;
  }

  /** 进入登录页时调用：拉配置 + 载入 SDK + 初始化（只做一次） */
  function mount() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      config = await fetchConfig();
      window.AliyunCaptchaConfig = { region: config.region || 'cn', prefix: config.prefix };
      await loadScript(SDK_URL);
      if (typeof window.initAliyunCaptcha !== 'function') throw new Error('验证码 SDK 未就绪');
      await window.initAliyunCaptcha({
        SceneId: config.sceneId,
        region: config.region || 'cn',
        prefix: config.prefix,
        mode: 'popup',
        element: '#aliyun-captcha-anchor',
        button: '#pickcat-login-btn',
        language: 'cn',
        showErrorTip: true,
        captchaVerifyCallback: async (captchaVerifyParam) => {
          const account = String(document.querySelector('[data-login-form] [name="account"]')?.value || '').trim();
          const password = String(document.querySelector('[data-login-form] [name="password"]')?.value || '').trim();
          if (!account || !password) {
            setStatus('请先填写账号和密码');
            return { captchaResult: false };
          }
          setStatus('正在登录…');
          try {
            const user = await window.PickcatAuth.loginWithPassword({ account, password, captchaVerifyParam });
            setStatus('登录成功，正在进入我的页面…');
            window.dispatchEvent(new CustomEvent('pickcat:login', { detail: { user } }));
            return { captchaResult: true, bizResult: true };
          } catch (err) {
            setStatus('登录失败：' + (err.message || '未知错误'));
            return { captchaResult: true, bizResult: false };
          }
        },
        onBizResultCallback: (ok) => {
          if (ok) return;
          const current = (statusEl() || {}).textContent || '';
          // 业务失败时保留具体原因（账号密码错误等），只有验证本身失败才提示重试
          if (!/^登录失败/.test(current)) setStatus('人机验证未通过，请重试');
        },
        getInstance: (captchaInstance) => {
          instance = captchaInstance;
        },
        slideStyle: { width: 320 },
      });
      setStatus('已就绪：输入账号密码后点「登录」，按提示拖动滑块');
      return true;
    })().catch((err) => {
      initPromise = null;
      setStatus('登录组件初始化失败：' + err.message + '（可改用下方 Cookie 登录）');
      throw err;
    });
    return initPromise;
  }

  window.PickcatLogin = {
    mount,
    isReady: () => Boolean(instance),
    getInstance: () => instance,
    config: () => config,
  };
})();
