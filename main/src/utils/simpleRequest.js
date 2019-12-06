// 到货提醒
import Vue from 'vue';
import Toast from 'app/components/widget/Toast';
import Loading from 'app/components/widget/Loading';
import api from 'app/api/index';
import { doTick, cartSpm } from 'app/utils/ticker';

//到货提醒
export const sendAvailableRemind = (uniqueId) => {
  doTick(cartSpm[23], `ssu_id:${uniqueId}`);
  let message = '如果7天内到货，会在第一时间告诉您';

  Loading();
  return api.stockoutRemind({ssu_id: uniqueId}).then(res => {
    Loading.hide();
    let { data } = res;
    if (data.ret && data.data) {
      message = data.data;
      return Promise.resolve(message);
    } else {
      return Promise.reject(data.error ? (data.error.msg || '网络异常，请稍候再试'): '网络异常，请稍候再试');
    }
  }, err => {
    console.log(err);
    Loading.hide();
    return Promise.reject('网络异常，请稍候再试');
  });
}

//秒杀提醒
export const sendSeckillRemind = (ssuid, activityid, sbuname) => {
  let message = '设置成功，将于活动开始前5分钟提示您'

  Loading();
  api.seckillRemind({ssu_id: ssuid, activity_id: activityid, sbu_name: sbuname}).then(res => {
    Loading.hide();
    let { data } = res;
    if (!data.ret) {
      message = data.error.msg;
    }
    if (data.ret && data.data) {
      message = data.data.msg;
    }
    Toast({
      message,
      hasIcon: data.ret ? true : false
    });
  }, err => {
    console.log(err);
    Loading.hide();
    Toast({
      message: '网络异常，请稍候再试'
    });
  });
}

export const sendSmartCoupon = (objId) => {
  Loading();
  api.sendSmartCoupon({delivery_id : objId}).then(res => {
    let { data } = res;
    let msg = '领取失败，请稍候再试';
    if (data.ret == 1 && data.data) {
      msg = '优惠券领取成功';
    } else if (data.error) {
      msg = data.error.msg;
    }
    Loading.hide();
    Toast({
      message: msg
    });
  }, err => {
    console.log(err);
    Loading.hide();
    Toast({
      message: '网络异常，请稍候再试'
    });
  });
}

export const selectCompany = (companyId, backurl) => {
  let url = `/account/afterSelectCompany?company_id=${companyId}`;
  if (backurl) {
    url = `${url}&path=${encodeURIComponent(backurl)}`
  }
  window.location.href = url; 
}
