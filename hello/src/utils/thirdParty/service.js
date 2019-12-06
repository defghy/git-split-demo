/*
 * 调用方式示意
 * 未登录状态下到首页调整 gps 的逻辑现在无用，暂时注释
import { getLocation } from 'app/utils/service.js';
import { $_city_id, $_company_id } from 'app/utils/global';
if ($_company_id == '0') {
  const self = this;
  // 未登录状态下，发送一个请求
  getLocation(function(poi) {
    self.$http.get('/entry/cityByGps', {
      'latitude': poi.latitude,
      'longitude': poi.longitude,
      'cityId': $_city_id
    }).then(function(res) {
      const { data } = res;
      if (!data.status) {
        window.location.reload();
      }
    }, function(err) {
      console.log(err);
    });
  });
}
*/

if (wx) {
  wx.ready(function() {
    wx.isReady = true;
  });
}

export function getLocation(successCB, failCB) {
  getLocationCombo((pos) => {
    successCB && successCB(pos);
  }, () => {
    failCB && failCB();
  });
}

export function getLocationCombo(successCB, failCB) {
  let wxLocateFun = function() {
    getLocationByWx(successCB, function() {
      getLocationByH5Api(successCB, failCB);
    });
  }
  if (wx) {
    wx.isReady === true ? wxLocateFun() : wx.ready(wxLocateFun);
  } else {
    getLocationByH5Api(successCB, failCB);
  }
}

/**
 * 根据h5 api定位.
 */
export function getLocationByH5Api(successCB, failCB) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(h5Pos) {
      successCB(h5Pos.coords);
    }, failCB, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 10 * 60 * 1000	// 10 分钟cache.
    });
  } else {
    failCB();
  }
}

/**
 * 根据微信api定位.
 */
export function getLocationByWx(successCB, failCB) {
  wx.getLocation({
    type: 'wgs84',
    success: successCB,
    fail: failCB
  });
}
