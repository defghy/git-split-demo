import api from 'app/api/index'
import { dateTimeFormater } from 'app/utils/cms/timeOperator.js'

const state = {
  name: '反馈测试'
}

const mutations = {
  newGoods (state, data) {
    state.name = data;
  }
}

const actions = {

  getNewGoodReqList({ commit }, params) {
    return api.getNewGoodReqList(params).then(res => {
      let { data } = res

      if (data && data.ret == 1) {
        data = data.data
        return {
          list: (data.list || []).map(item => {
            return {
              name: item.commodity_name,
              dateStr: dateTimeFormater(
                new Date(item.c_t * 1000),
                'YYYY.MM.DD HH:mm:ss'
              ),
              demandId: item.demand_id,
              status: item.status,
              statusDesc: item.status_desc
            }
          })
        }
      }

      return Promise.reject(data);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
