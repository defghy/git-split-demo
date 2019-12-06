/**
 * 主要针对 iOS WKWebview 有 Back Forward Cache 机制，跳转到新页面后返回本页面不会刷新数据的问题。
 */

export default {
  methods: {
    $redirect(url, pageshowCallback) {
      if (pageshowCallback && typeof pageshowCallback === 'function') {
        const pageshowHandler = e => {
          if (e.persisted) {
            pageshowCallback();
          }
          window.removeEventListener('pageshow', pageshowHandler);
        };
        window.addEventListener('pageshow', pageshowHandler);
      }
      window.location.href = url;
    }
  }
};
