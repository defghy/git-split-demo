export const parentsMap = (vm) => {
  let parents = {};

  while(vm) {
    if(vm.$data && vm.$data.$tickId) {
      parents[vm.$data.$tickId] = vm;
    }
    vm = vm.$parent;
  }

  return parents;
};

export const obj2str = (params) => {
  params = params || {};

  let paramsStr = Object.keys(params).map(key => {
    return `${key}:${params[key]}`;
  }).join('$');

  return paramsStr? `$${paramsStr}`: '';
};

// 错误信息暴露
export const error = (msg) => {
  console.error(new Error(msg || 'tick data undefined!!'));
};