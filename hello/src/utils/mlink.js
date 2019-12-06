import { promiseDefer } from 'app/utils/lang';

/*
  打开app方法集合
*/

var inited = false;
const MLINK_URL = 'https://static.mlinks.cc/scripts/dist/mlink.min.js';

// 能否使用验证码功能
export default {
  promise: null,
  init() {
    if(inited) {
      return;
    }
    inited = true;
    let defer = promiseDefer();
    this.promise = defer.promise;

    // 引入js文件
    var script = document.createElement('script');
    script.src = MLINK_URL;
    script.async = true;
    script.onerror = function() {
      inited = false;
    };
    script.onload = function() {
      defer.resolve(window.Mlink);
    };
    (document.head || document.body).appendChild(script);
  }
};