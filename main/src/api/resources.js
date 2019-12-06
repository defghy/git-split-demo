import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.options.emulateJSON = false;
Vue.http.options.responseType = 'json';
// 添加一个后端过滤 headers 字段用于流量过滤
Vue.http.headers.custom['Cache-Control'] = 'no-cache';

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    return response;
  });
});

// 工具api
export const WXResource = Vue.resource('/mall/api/weixin/{action}');

// 财务
export const InvoiceCreateResource = Vue.resource('/fi_invoice/api/planCreate/{action}');
