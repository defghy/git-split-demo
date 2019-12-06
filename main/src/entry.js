import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import router from 'app/routes.js';
import store from 'app/vuex/index.js';
import App from 'app/pages/App.vue'; // 路由器根实例

import { setEnv } from 'app/utils/serviceAccess/env.js'
setEnv({router});

const debug = process.env.NODE_ENV !== 'production';

Vue.config.silent = !debug;
Vue.config.devtools = debug;
Vue.config.performance = debug;
Vue.config.productionTip = debug;

if (debug) {
  window.Vue = Vue;
  window.store = store
}

Vue.use(VueRouter);
Vue.use(VueResource);

// 创建根实例
const rootVue = new Vue({
  // el: '.app-wrap',
  router,
  store,
  template: '<app></app>',
  components: { App }
});
rootVue.$mount('.app-wrap')
