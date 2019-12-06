import * as tickUtil from 'app/tick/util';

import { Utils, getSimpleData, setTickParams } from 'app/utils/Mixins';
import { doTick, plusMinusSpm, purchaseSpm, feedbackSpm, searchSpm, pageSpm} from 'app/utils/ticker';

let ssuOperatingPurchase = function(parents, type) {

  let skuvm = parents['vm$purchaseSkuContainer'];
  let classvm = parents['vm$purchaseClassItem'] || parents['vm$purchaseClassItemTrial'];
  if(!skuvm || !classvm) {
    tickUtil.error();
    return;
  }

  let ssu = this.ssu;
  let ssuPos = this.ssuPos;
  let sku = skuvm.containerInfo;
  let skuPos = skuvm.skuPos;
  let classItem = classvm.classItem;
  let classPos = classvm.navIndex;

  let key = 'purchase';
  let params = {};
  const subKey = type === 'plus' ? '0' : '1';
  if (ssu.activity_type == 6) {
    params = {
      combined_id: ssu.unique_id,
      act_type: ssu.activity_type,
      goods_json: JSON.stringify(getSimpleData(ssu.suits_ssu_list))
    };

    if (this.$route.name === 'index') {
      key += 'Index';
      params = {
        combined_id: ssu.unique_id,
        act_type: ssu.activity_type,
        goods_json: JSON.stringify(getSimpleData(ssu.suits_ssu_list))
      };
    }
  } else {
    params = {
      'from': skuvm.ifOpen ? 'after' : 'before',
      'promote_type': ssu.promote_type.join(',')
    };

    if (this.$route.name === 'index') {
      key += 'Index';
      params = {
        'from': skuvm.ifOpen ? 'after' : 'before',
        'promote_type': ssu.promote_type.join(',')
      };
    }

    // 惊爆商品等 type
    if (ssu.extension_types) {
      params['type'] = ssu.extension_types.join(',');
    }
  }

  let strategys = [];
  sku.isTrialRecommend?
    strategys.push('rec'): strategys.push('norm');
  ssu.is_most_buy && strategys.push('often_buy');
  ssu.is_minimum_price && strategys.push('cheap');

  Object.assign(params, {
    strategy: strategys.join(','), // 4个枚举 rec norm often_buy cheap
    big_activity_id: ssu.big_activity_id,
    sku_id: sku.sku_id,
    ssu_id: ssu.unique_id,
    class_id: classItem.id,
    class_pos: classPos,
    sku_pos: skuPos,
    ssu_pos: ssuPos
  });

  doTick(plusMinusSpm[key + subKey] + ssu.ssu_id, tickUtil.obj2str(params));

};
let ssuOperatingSearchResult = function(parents, type) {
  let skuvm = parents['vm$purchaseSkuContainer'];
  let searchResultVm = parents['vm$purchaseSearchResult'];
  if(!skuvm || !searchResultVm) {
    tickUtil.error();
    return;
  }
  let ssu = this.ssu;
  let ssuPos = this.ssuPos;
  let sku = skuvm.containerInfo;
  let skuPos = skuvm.skuPos;

  let key = 'purchaseSearch';
  let subKey = type === 'plus' ? '0' : '1';
  let params = {};
  if (ssu.activity_type == 6) {
    params = {
      combined_id: ssu.unique_id,
      act_type: ssu.activity_type,
      goods_json: JSON.stringify(getSimpleData(ssu.suits_ssu_list))
    };
  } else {
    params = {
      id: ssu.ssu_id,
      promote_type: ssu.promote_type.join(','),
      tag: ssu.tag
    };

    if (ssu.extension_types) {
      params['type'] = ssu.extension_types.join(',');
    }
  }
  let strategy = sku.isTrialRecommend? 'rec': 'norm';
  Object.assign(params, {
    strategy,
    sku_id: sku.sku_id,
    class_id: 0,
    class_pos: 0,
    sku_pos: skuPos,
    ssu_pos: ssuPos,
    ssu_id: ssu.unique_id,
    keyword: encodeURIComponent(searchResultVm.keyword),
    source_id: searchResultVm.searchResultSource
  });

  doTick(plusMinusSpm[key + subKey] + ssu.ssu_id, tickUtil.obj2str(params));

};

// 加减号
export const ssuOperating = function({type}) {
  let vm = this;
  let parents = tickUtil.parentsMap(vm);

  // 常用清单， 首页， cms二级页
  if(parents['vm$purchaseGoodsList']) {
    ssuOperatingPurchase.call(vm, parents, type);
  }

  // 搜索结果页
  else if(parents['vm$purchaseSearchResult']) {
    ssuOperatingSearchResult.call(vm, parents, type);
  }

};

// 跳转商详页 sku
export const handleGoDetailSku = function() {
  let vm = this;
  let parents = tickUtil.parentsMap(vm);
  let sku = this.skuItem;

  let params = {
    sku_id: this.posInfo.skuId,
    class_id: this.posInfo.classId,
    class_pos: this.posInfo.classPos,
    sku_pos: this.posInfo.skuPos
  };

  let skuId = sku.sku_id;

  let strategys = [];
  sku.isTrialRecommend?
    strategys.push('rec'): strategys.push('norm');
  Object.assign(params, {
    strategy: strategys.join(',')
  });

  // 搜索结果页
  if(parents['vm$purchaseSearchResult']) {
    let searchResultVm = parents['vm$purchaseSearchResult'];
    Object.assign(params, {
      keyword: encodeURIComponent(searchResultVm.keyword),
      source_id: searchResultVm.searchResultSource
    });
    doTick(searchSpm[2] + skuId, tickUtil.obj2str(params), true);
  }
  // 常用清单页进详情
  else if (this.$route.name === 'purchase') {
    doTick(purchaseSpm[16] + skuId, tickUtil.obj2str(params), true);
  }
  // 首页进详情
  else {
    doTick(pageSpm[1] + skuId, tickUtil.obj2str(params), true);
  }

};

// 跳转商详页 ssu
export const handleGoDetailSsu = function(data = {}) {
  let vm = this;
  let parents = tickUtil.parentsMap(vm);
  let sku = this.sku;
  let ssu = this.ssu;
  let sku_id = data.sku_id || sku.sku_id;

  let params = {
    promote_type: ssu.promote_type.join(','),
    big_activity_id: ssu.big_activity_id,
    sku_id: sku_id,
    class_id: this.posInfo.classId,
    class_pos: this.posInfo.classPos,
    sku_pos: this.posInfo.skuPos,
    ssu_pos: this.ssuPos,
    ssu_id: ssu.unique_id
  };

  let strategys = [];
  sku.isTrialRecommend?
    strategys.push('rec'): strategys.push('norm');
  ssu.is_most_buy && strategys.push('often_buy');
  ssu.is_minimum_price && strategys.push('cheap');
  Object.assign(params, {
    strategy: strategys.join(',')
  });

  // 搜索结果页
  if(parents['vm$purchaseSearchResult']) {
    let searchResultVm = parents['vm$purchaseSearchResult'];
    Object.assign(params, {
      tag: ssu.tag,
      keyword: encodeURIComponent(searchResultVm.keyword),
      source_id: searchResultVm.searchResultSource
    });
    doTick(searchSpm[2] + sku_id, tickUtil.obj2str(params), true);
  }
  // 常用清单页进详情
  else if (this.$route.name === 'purchase') {
    doTick(purchaseSpm[36] + sku_id, tickUtil.obj2str(params), true);
  }
  // 首页进详情
  else {
    doTick(pageSpm[1] + sku_id, tickUtil.obj2str(params), true);
  }

};

