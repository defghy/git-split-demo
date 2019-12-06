// 为 pop 方提供的 js 工具，需要时常维护

window.goShopCart = () => {
  window.location.href = '/entry/index#/cart';
};

window.goGoodsDetail = (ssuId) => {
  if (!ssuId) {
    return false;
  }
  window.location.href = '/entry/index#/goods-detail/ssu/' + ssuId;
};
