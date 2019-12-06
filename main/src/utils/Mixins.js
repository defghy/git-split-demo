import { $_platform } from 'app/utils/global';

export const UrlParams = (testUrl = location.href) => {
  const res = {};
  function str2query(url) {
    if (url.indexOf("?") > -1) {
      let str = url.substr(url.indexOf("?") + 1);
      if (str.indexOf("&") != -1) {
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          res[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
      } else {
        res[str.split("=")[0]] = decodeURIComponent(str.split("=")[1]);
      }
    }
  }
  let urls = testUrl.split('#');
  urls[0] && str2query(urls[0]);
  urls[1] && str2query(urls[1]);
  return res;
}

export const query2str = (params = {}) => {
  let res = Object.keys(params).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  });

  return res.join('&');
};

// link追加参数
export const urlAppendParams = (link, params) => {
  link = link || '';

  let [href, hash] = link && link.split('#');
  let path = href && href.split('?')[0];
  // 合并参数
  let search = Object.assign({}, UrlParams(href), params);
  search = query2str(search);
  search = search? '?'+ search: '';
  hash = hash? '#'+ hash: '';
  return path+ search+ hash;
};

// 判断当前页面是否是首页
export const isHome = () => {
  return window.location.hash.startsWith('#/index') || UrlParams().isHome;
}

// 返回上一页，没有上一页时返回首页
export const goBack = () => {
  if(window.appMethod) {
    history.length>1? history.go(-1): appMethod.closeWebPage();
  } else if(window.router) {
    history.length>1? window.router.back(): window.router.replace('index');
  } else { // 浏览器打开mapp
    history.length>1? history.go(-1): (window.location.href = '/entry/index#/index');
  }
};

export const handleLogin = (url = '') => {
  if (appMethod && appMethod.login) {
    appMethod.login();
  } else {
    const location = window.location;
    if (url === '') {
      if (location.hash) {
        url = location.pathname + location.search + location.hash;
      } else if (location.search) {
        url = location.pathname + location.search;
      } else {
        url = location.href;
      }
    }
    location.href = `/account/login?sucurl=${encodeURIComponent(url)}`;
    // 有时会跳转失败，1s后判定如果跳转失败重新跳转
    setTimeout(() => {
      location.href = `/account/login?sucurl=${encodeURIComponent(url)}`;
    }, 1000);
  }
}

export const wxLinkRemoveMapp = (wxlink = '') => {
  // 也能防止运营配置错误
  return wxlink.replace('/mapp/cms/index', '/entry/index#/cms');
}

export const wxLinkCheck = (wxlink = '') => {
  if (window.router) {
    if (wxlink.indexOf('#/cms') > 0) {
      return 'cms';
    } else if (wxlink.indexOf('#/information-list') > 0) {
      return 'information-list';
    } else {
      return false;
    }
  }
  return false;
}

export const Utils = {
  hjump: function(wxlink) {
    if (!wxlink || wxlink === '') {
      return;
    }
    let data = UrlParams();
    let params = '';
    for (let i in data) {
      if (i !== 'id') {
        params = params + '&' + i + '=' + data[i]
      }
    }
    if (wxlink.indexOf('?') == -1) {
      window.location.href = wxlink + '?1=1' + params;
    } else {
      window.location.href = wxlink + params;
    }
  },

  jumpLogic: function({ wxlink, applink, ssuid, isGoods = false, spm = '', isInSuits = false }) {
    // 暂时保留，方便本段时间线上 debug
    console.table([
      { name: 'platform', value: $_platform },
      { name: 'wxlink', value: wxlink },
      { name: 'applink', value: applink },
      { name: 'ssuid', value: ssuid },
      { name: 'isGoods', value: isGoods },
      { name: 'spm', value: spm },
      { name: 'suits', value: isInSuits }
    ]);

    if ($_platform === 'weixin' || $_platform === 'pc') {
      if (wxlink && wxlink !== '') {
        // pc端打开分享的页面
        if (!window.router) {
          window.location.href = wxlink;
          return;
        }
        // 商品逻辑占据大多数，提前走掉
        if (isGoods && ssuid) {
          window.router.push({
            name: 'goodsdetail',
            params: {
              skuOrSsu: 'ssu',
              id: ssuid,
              spm
            }
          });
          return;
        }
        // 普通 cms 的逻辑提前过滤
        let checkLink = wxLinkCheck(wxlink);
        if (checkLink) {
          window.router.push({
            name: checkLink,
            query: Object.assign({}, UrlParams(wxlink), {
              spm
            })
          });
          return;
        }

        // 电话逻辑提前过滤
        if (wxlink.toLowerCase().indexOf('tel:') == 0) {
          window.location.href = wxlink;
          return;
        }

        // 没有被过滤的普通逻辑
        if (isInSuits) {    // 组合售卖的列表中的ssu
          wxlink = wxlink.replace(/ssu\/(\d*(_\d)?)/g, `ssu/${ssuid}`);
        }
        wxlink = wxLinkRemoveMapp(wxlink);
        window.location.href = wxlink + (/\?/.test(wxlink) ? '&' : '?') + 'spm=' + spm;
      }
    } else {  // APP的页面跳转
      if (!isGoods && /goods\/detail/.test(applink)) {
        ssuid = applink.split('?id=')[1]; // 很不健壮
        isGoods = true;
      }

      if (isGoods) {   // 如果是商品页跳转
        if (ssuid) {
          if (appMethod.jump2Page) {
            this.jump2Page(3, spm, {
              cid: ssuid + ''
            });
          } else {
            appMethod.gotoDetail(ssuid);
          }
        } else {
          console.log('缺少ssuid');
        }
      } else {    // 非商品页现在按照applink来跳转
        this.jumpToApp(applink, wxlink, spm)
      }
    }
  },

  jump2Page: function(key, spm, extraInfo = {}) {
    let info = {
      ...extraInfo,
      'h5_context': {
        spm
      }
    };
    return appMethod.jump2Page(key, JSON.stringify(info));
  },

  jumpToApp: function(applink, wxlink, spm) {
    // 首页
    if (/mall:\/\/index/gi.test(applink)) {
      return this.jump2Page(10, spm);
    }
    // 个人中心页
    if (/mall:\/\/profile/gi.test(applink)) {
      return this.jump2Page(11, spm);
    }
    // 搜索页
    if (/mall:\/\/goods\/search/gi.test(applink)) {
      return this.jump2Page(19, spm);
    }
    // 购物车页
    if (/mall:\/\/shopcart/gi.test(applink)) {
      return this.jump2Page(18, spm);
    }
    // 优惠券页
    if (/mall:\/\/coupon\/mine/gi.test(applink)) {
      return this.jump2Page(12, spm);
    }
    // 订单列表页
    if (/mall:\/\/order\/index/gi.test(applink)) {
      return this.jump2Page(13, spm);
    }
    // 消息中心页
    if (/mall:\/\/message\/center/gi.test(applink)) {
      return this.jump2Page(20, spm);
    }
    // 提交新品需求
    if (/mall:\/\/user\/need\/upload/gi.test(applink)) {
      return this.jump2Page(16, spm);
    }
    // 服务中心页
    if (/mall:\/\/user\/service/gi.test(applink)) {
      return this.jump2Page(17, spm);
    }
    // 首页清单
    if (/mall:\/\/purchase-list/gi.test(applink)) {
      return this.jump2Page(26, spm);
    }
    // 常用清单
    if (/mall:\/\/purchase$/gi.test(applink)) {
      return this.jump2Page(23, spm);
    }
    // 商品列表页
    if (/mall:\/\/market/gi.test(applink)) {
      return this.jump2Page(4, spm);
    }
    // 商品详情
    if (/mall:\/\/goods\/detail/gi.test(applink)) {
      let search = applink.indexOf('?') > -1 ? applink.replace(/.*\?/, '?') : '';
      let param = search ? UrlParams(search) : {};
      if (param && param['id']) {
        return this.jump2Page(3, spm, {
          'cid': param['id']
        });
      }
    }
    // 订单详情
    if (/mall:\/\/order\/detail/gi.test(applink)) {
      let search = applink.indexOf('?') > -1 ? applink.replace(/.*\?/, '?') : '';
      let param = search ? UrlParams(search) : {};
      if (param && param['id']) {
        return this.jump2Page(8, spm, {
          'orderId': param['id']
        });
      }
    }

    // 在线客服（智齿）
    if (/mall:\/\/user\/sobot/gi.test(applink)) {
      return this.jump2Page(15, spm);
    }

    // 我的发票
    if (/mall:\/\/user\/invoice/gi.test(applink) && /https?:\/\//gi.test(wxlink)) {
      this.hjump(wxlink);
    }

    // 我的钱包
    if (/mall:\/\/user\/wallet/gi.test(applink)) {
      return this.jump2Page(5, spm);
    }

    // 电话号码
    if (/tel:\/\//gi.test(applink)) {
      location.href = applink
      return;
    }

    // 如果又是另外一个h5链接  注意：这儿判断的是applink, 并且是符合http或者https协议的applink
    if (/https?:\/\//gi.test(applink)) {
      this.hjump(applink);
    }
    // 只有path，拼接为完整地址
    else if(applink && applink[0] == '/') {
      let origin = location.origin || `${location.protocol}//${location.host}`;
      this.hjump(origin+ applink);
    }
  }
}

// 过滤简单 ssu 数据
export const getSimpleData = (list) => {
  return list.map(item => {
    return {
      ssu_id: item.ssu_id,
      sku_id: item.sku_id,
      num: item.num,
    };
  })
}

// 目前 cms 在使用
export const getSimpleSpmData = (data) => {
  let d = {
    ssu_id: data.ssu_id,
    sku_id: data.sku_id,
    promote_type: data.promote_type ? data.promote_type.join(',') : '',
    big_activity_id: data.big_activity_id
  };
  return Object.keys(d).map(key => `${key}:${d[key]}`).join('$');
}

export const setTickParams = (data) => {
  let res = [];
  let paramArr = ['ad_position', 'ad_info_id', 'ad_tag', 'tag', 'ssu_pos'];
  paramArr.forEach(item => {
    if (item in data && (data[item]+'').length) {
      res.push(`$${item}:${data[item]}`);
    }
  });
  return res.join('');
}
