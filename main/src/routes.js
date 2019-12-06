import VueRouter from 'vue-router';
import * as service from 'app/utils/serviceAccess/serviceAccess';

let routes = [{
  path: '/index',
  name: 'index',
  meta: {
    title: '首页',
    showTab: true,
    needLogin: true
  },
  component: require('app/pages/home/Index.vue').default
}];

const router = new VueRouter({
  routes: [
    ...routes,
    // 不同路由默认跳转链接不同
    {
      path: '*',
      async beforeEnter(to, from, next) {
        // 业务线拦截
        let isService = await service.handle(to, from, next);

        // 非业务线页面，走默认处理
        if(!isService) {
          next('/index');
        }

      }
    }
  ]
});

window.router = router;
export default router;
