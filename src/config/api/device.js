/**
 * @description 设备管理api
 * @param {*} ProductList 产品---产品列表
 * @param {*} protocolSupport 产品---消息协议列表
 * @param {*} deviceCategory 产品---新建产品 --- 所属品类
 * @param {*} organizationList 产品---新建产品 --- 所属机构
 * @param {*} protocolTransports 产品---新建产品 ---传输协议 (消息协议id确定)
 * @param {*} addProduct 产品---新建产品 ---新建产品
 * @param {*} deviceCount 产品---产品下的设备数
 * @param {*} configuration 产品---产品详情下的配置
 * @param {*} units 产品---物模型 --- 数据类型单位
 * @param {*} deviceProductId 设备 --- 产品id列表
 * @param {*} deviceList 设备 --- 产品的设备列表
 * @param {*} deviceStatus 设备 --- 在线设备数|离线设备数|未启用设备数
 * @param {*} delDevice 设备 --- 删除设备
 * @param {*} deviceDetail 设备 --- 设备详情
 * @param {*} deviceConfiguration 设备 --- 配置选项
 * @param {*} deviceAlarmList 设备 --- 设备报警列表（get）
 * @param {*} addDeviceAlarmInfo 设备 --- 设备报警列表（patch）
 */
export const DeviceManageApi = {
  productList: '/device-product/_query?',
  protocolSupport: '/protocol/supports',
  deviceCategory: '/device/category/_tree',
  organizationList: '/organization/_all',
  protocolTransports: (id) => `/protocol/${id}/transports`,
  addProduct: `/device-product`,
  deviceCount: `/device-instance/_count`,
  configuration: (id) => `/device/product/${id}/config-metadata`,
  units: `protocol/units`,
  deviceProductId: `/device-product/_query/no-paging`,
  deviceList: `/device-instance/_query`,
  deviceStatus: `/device-instance/_count`,
  delDevice: (id) => `/device-instance/${id}`,
  deviceDetail: (id) => `/device/instance/${id}/detail`,
  deviceConfiguration: (protocol, transport) => `/protocol/${protocol}/${transport}/configuration`,
  deviceAlarmList: (target, targetId) => `/device/alarm/${target}/${targetId}`,
  addDeviceAlarmInfo: (target, targetId) => `/device/alarm/${target}/${targetId}`,
  DeviceNotifierType: `/notifier/config/types`
}
