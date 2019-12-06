import api from 'app/api/index';
import './env';

// 业务线接入
let config = null;
let configDefer = null; /*{
  'hello': {
    src: [
      'http://local.yunshanmeicai.com:7000/dist/dev/js/hellomanifest.js',
      'http://local.yunshanmeicai.com:7000/dist/dev/js/hellobundle.js'],
    loaded: false
  }
};*/

// 加载业务线配置
const loadConfig = () => {
  return api.fetchServiceLineConfig().then(res => {
    let services = res.body || {};
    Object.values(services).forEach(service => {
      service.loaded = false;
    });
    // 初始化业务线配置
    config = services;
    return services;
  });
};
// 进入页面直接加载业务线配置
configDefer = loadConfig();

const loadScript = (src) => {
  return new Promise(function(resolve, reject){
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = function() {
      reject();
    };
    script.onload = function() {
      resolve(window.wx);
    };
    (document.head || document.body).appendChild(script);
  });
};

// 业务线接入处理
export const handle = async (to, from, next) => {
  let path = to.path || "";
  let paths = path.split('/');
  let serviceName = paths[1];

  // 加载业务线配置
  if(!config) {
    await configDefer;
  }

  let cfg = config[serviceName];

  // 非业务线路由
  if(!cfg) {
    return false;
  }

  // 该业务线已经加载
  if(cfg.loaded) {
    next();
    return true;
  }

  for(var i=0; i<cfg.src.length; i++) {
    await loadScript(cfg.src[i]);
  }
  cfg.loaded = true;
  next(to);  // 继续请求页面
  return true;
}
