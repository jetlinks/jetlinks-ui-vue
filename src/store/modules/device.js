import apis from '@/api/index'
import getters from '../getters/device'
import Vue from 'vue'
// import { HandleProductList } from './service'

const device = {
  namespaced: true,
  state: {
    productAllList: [],
    deviceCount: {},
    unitsData: [],
    deviceDetail: {},
    deviceNotifierType: []
  },
  getters,
  actions: {
    getProductAllList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        apis.deviceProduct.GetProductList(payload).then(res => {
          if (res.status === 200) {
            commit('SET_PRODUCT_ALLLIST', res.result.data || [])
            resolve(true)
          }
        }).catch((err) => {
          console.log('getProductAllList_error', err)
        })
      })
    },
    getDeviceCount ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        const deviceCount = {}
        const initData = state.productAllList
        for (let index = 0; index < initData.length; index++) {
          if (initData[index].id) {
            // const res = await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': initData[index].id } })
            // deviceCount[initData[index].id] = res.result
            await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': initData[index].id } })
             .then(res => {
               if (res.status === 200) {
                 deviceCount[initData[index].id] = res.result
                //  return res.result
               } else {
                 deviceCount[initData[index].id] = '/'
               }
             })
            //  .catch()
          }
        }
        // state.productAllList.map(async (item) => {
        //   // const res = await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': item.id } })
        //   // deviceCount[item.id] = res.result
        //   await apis.deviceProduct.GetDeviceNum({ terms: { 'productId': item.id } }).then(res => {
        //     if (res.status === 200) {
        //       deviceCount[item.id] = res.result
        //      //  return res.result
        //     } else {
        //       deviceCount[item.id] = '/'
        //     }
        //   }).catch((err) => {
        //     console.log('GetDeviceNum_error', err)
        //   })
        // })
        // console.log('deviceCount', deviceCount['test'])
        commit('SET_DEVICE_NUM', deviceCount)
        resolve(true)
      })
    },
    getUnits ({ commit }) {
      return new Promise((resolve, reject) => {
        apis.deviceProduct.getUnits()
          .then(res => {
            if (res.status === 200) {
              commit('SET_PROTOCOL_UNITS', res.result)
              this.unitData = res.result
            }
        })
      })
    },
    getDeviceDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        apis.deviceInstance.getDeviceDetail(id)
        .then(res => {
          if (res.status === 200) {
            commit('SET_DEVICE_DETAIL', res.result)
            resolve(true)
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false)
          }
        })
      })
    },
    getNotifierType ({ commit }) {
      return new Promise((resolve, reject) => {
        apis.deviceInstance.getDeviceNotifierType()
        .then(res => {
          if (res.status === 200) {
            commit('SET_NOTIFIER_TYPE', res.result)
            resolve(true)
          }
        })
      })
    }
  },
  mutations: {
    SET_PRODUCT_ALLLIST: (state, Lists) => {
      state.productAllList = [...state.productAllList, ...Lists]
    },
    SET_DEVICE_NUM: (state, data) => {
      state.deviceCount = data
    },
    SET_PROTOCOL_UNITS: (state, data) => {
      state.unitsData = data
    },
    EDIT_PRODUCT_LIST: (state, data) => {
      state.productAllList.forEach((ele, inx) => {
        if (ele.id === data.id) {
          Vue.set(state.productAllList, inx, data)
        }
      })
    },
    SET_DEVICE_DETAIL: (state, data) => {
      state.deviceDetail = data
    },
    SET_NOTIFIER_TYPE: (state, data) => {
      state.deviceNotifierType = data
    }
  }

}

export default device
