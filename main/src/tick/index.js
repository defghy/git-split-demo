import Vue from 'vue';

import common from './common';

let tickFuns = {
  common
};

Vue.prototype.$tick = function(tickRoute, ...args) {
  if(!tickRoute) {
    return;
  }
  let tickNames = tickRoute.split('.');

  let tickFun = tickNames.reduce((data, name) => {
    return data && data[name];
  }, tickFuns);

  if(tickFun) {
    return tickFun.apply(this, args);
  }

};
