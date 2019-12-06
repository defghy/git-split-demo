import Vue from 'vue';
import Toast from 'app/components/widget/Toast';
import api from 'app/api/index';
import { $_platform_ios } from 'app/utils/global';
import DEFAULT_IMG from 'app/image/lazy/good_default.png';

/**
 * [商品图片加载失败]
 * @param  {Object} e
 * @return  {string} src
 */
export const imgLoadFail = (e, defaultImg) => {

  if(defaultImg === 'HIDE') {
    e.target.style.display = 'none';
    return;
  }

  defaultImg = defaultImg || DEFAULT_IMG;
  if (e.target.src != defaultImg) {
    e.target.src = defaultImg;
  }
}

/*
 * 阿里云规则
 * https://help.aliyun.com/document_detail/50039.html?spm=5176.doc44687.2.13.yTDYWa
 */
export const imgFormatFilter = (src, imgWidth = 0, imgHeight = 0) => {
  if (src.indexOf('oss') > 0) { // 阿里云:前端主动添加size、format属性
    const formatList = [];
    if (imgWidth !== 0 || imgHeight !== 0) {
      formatList.push(`/resize,m_fixed,w_${parseInt(imgWidth)},h_${parseInt(imgHeight)}`);
    }
    if (!$_platform_ios) {
      formatList.push('/format,webp');
    }
    if (src.indexOf('watermark') > 0) {
      if (src.indexOf('stage') > 0) {
        formatList.push('/watermark,image_b3NzL3Rlc3QvMjdkNDc3ZWQ4NjYwNWQ2ZjJiM2JmNmIzNzc1MGNhNDUucG5n,g_center')
      }else {
        formatList.push('/watermark,image_b3NzL2RlZmF1bHQvYzA3YmI4ODIzNmYxNjEzMDViMWRkOGI0ZmE0NGZiMzgucG5n,g_center')
      }
    }
    return src.split('?')[0] + '?x-oss-process=image' + formatList.join('');
  }
  return src;
}

export const imgUpload = (file, callBack, data) => {
  if (("jpg|jpeg|gif|bmp|png").indexOf(file.type.substring(file.type.lastIndexOf('/') + 1).toLowerCase()) < 0) {
    Toast({
      message: '抱歉只能上传图片文件'
    });
    return;
  }

  api.getUploadKey(data).then(res => {
    let { data } = res;
    if (data.ret == 1 && data.data) {
      onLoad(data.data, file, callBack);
    } else {
      Toast({
        message: `图片上传失败, ${data.error && data.error.msg}`
      });
    }
  }, err => {
    console.log(err);
  });
}

export const onLoad = (key, file, callBack) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('object', new Date().getTime() + encodeURIComponent(file.name));

  Vue.http.post(key['oss_upload_url'] + '/api/oss/uploadFile', formData, {
    headers: {
      'Oss-Auth': key['oss_auth'],
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    let { data } = res;
    if (data.data) {
      callBack()(data);
    } else {
      Toast({
        message: '图片上传失败，请稍候再试'
      });
    }
  }, err => {
    console.log(err);
    Toast({
      message: '图片上传失败，请稍候再试'
    });
  });
}

export const imgUploadP = (file, data) => {
  if (("jpg|jpeg|gif|bmp|png").indexOf(file.type.substring(file.type.lastIndexOf('/') + 1).toLowerCase()) < 0) {
    Toast('抱歉只能上传图片文件')
    return Promise.reject('抱歉只能上传图片文件')
  }
  return api.getUploadKey(data).then(res => {
    let { data } = res
    if (data.ret == 1 && data.data) {
      return onLoadP(data.data, file)
    } else {
      return Promise.reject({ message: `图片上传失败, ${data.error && data.error.msg}` })
    }
  }).catch(err => {
    console.log(err)
    if (err instanceof Error) {
      Toast(`图片上传失败，${err.message}`)
    }else if (err.message) {
      Toast(err.message)
    }else if (err.native_type === 'xhr_error') {
      Toast('图片上传失败，网络不给力，请换个网络再试')
    }
    return Promise.reject(err)
  })
}

export const onLoadP = (key, file) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('object', new Date().getTime() + encodeURIComponent(file.name));

  return Vue.http.post(key['oss_upload_url'] + '/api/oss/uploadFile', formData, {
    headers: {
      'Oss-Auth': key['oss_auth'],
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    let { data } = res;
    if (data.data) {
      return Promise.resolve(data)
    } else {
      return Promise.reject({ message: '图片上传失败，请稍候再试'})
    }
  }).catch(err => {
    return Promise.reject(err)
  })
}

