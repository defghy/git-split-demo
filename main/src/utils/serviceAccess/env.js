// 业务线接入环境设置
import Vue from 'vue';
let globalRouter; // 有h5和mapp 2个需要动态赋值
import { default as globalStore } from 'app/vuex/index.js';
import Vuex from 'vuex'

import * as resources from 'app/api/resources';
import { applyMallTicket } from 'app/api';

// 挂载业务线数据
function registerApp(appName, {
  store,
  router
}) {
  if(router) {
    globalRouter.addRoutes(router);
  }
  if(store) {
    globalStore.registerModule(appName, Object.assign(store, {
      namespaced: true
    }));
  }
}

window.bapp = Object.assign(window.bapp || {}, {
  Vue,
  Vuex,
  router: globalRouter,
  store: globalStore,
  resources,
  util: {
    registerApp,
    applyMallTicket
  }
});

export const setEnv = ({router}) => {
  if(router) {
    globalRouter = router;
  }
}

export default bapp;
