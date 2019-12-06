import App from 'app/pages/Hello.vue'; // 路由器根实例
import {APP_NAME} from 'app/utils/global';
import store from 'app/vuex/index';

let router = [{
  path: `/${APP_NAME}`,
  name: 'hello',
  meta: {
    title: '页面测试',
    needLogin: true
  },
  component: App,
  children: [
    {
      path: 'index',
      name: 'hello-index',
      meta: {
        title: '商品列表'
      },
      component: resolve => require.ensure([], () => resolve(require('app/pages/goods/Goods.vue').default), 'hello-goods')
    },
    {
      path: 'newreq',
      name: 'hello-newreq',
      meta: {
        title: '新品页面'
      },
      component: resolve => require.ensure([], () => resolve(require('app/pages/newreq/List.vue').default), 'hello-newreq')
    },
  ]
}]

window.bapp && bapp.util.registerApp(APP_NAME, {router, store});
