const getters = {
  /**
   * @description 所有产品信息
   */
  productAllList: state => state.productAllList,
    /**
   * @description 返回所以产品的id信息
   */
  productAllId: state => state.productAllList.map(v => v.id),
    /**
   * @description 产品所绑定的设备数量
   */
  deviceCount: state => state.deviceCount,
  /**
   * @description 根据id 获取产品信息
   * @param {*} id 产品id
   */
  productDetailData: state => (id) => {
    return state.productAllList.filter(v => v.id === id)
  },
  /**
   * @description 单位信息
   */
  unitsData: state => state.unitsData,
    /**
   * @description 一个设备详情
   */
  deviceDetailData: state => state.deviceDetail,
  /**
   * @description 设置报警时，通知类型
   */
  notifierType: state => state.deviceNotifierType
}
export default getters
