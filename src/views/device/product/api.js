import request from '@/utils/request'
import { DeviceManageApi } from '@/config/api/device'
import encodeQueryParam from '@/utils/encodeParam'

/**
 * @description 现有产品列表
 */
export function GetProductList (params) {
  return request({
    url: DeviceManageApi.productList,
    method: 'GET',
    params: encodeQueryParam(params)
  })
}

/**
 * @description 产品---品类
 */
export function GetCategoryList (params) {
  return request({
    url: DeviceManageApi.deviceCategory,
    method: 'GET',
    params
  })
}

/**
 * @description 产品---消息协议
 */
export function GetMessageList () {
  return request({
    url: DeviceManageApi.protocolSupport,
    method: 'GET'
  })
}

/**
 * @description 产品---传输协议
 */
export function GetProtocolTransports (messageType) {
  return request({
    url: DeviceManageApi.protocolTransports(messageType),
    method: 'GET'
  })
}

/**
 * @description 产品---新建产品
 */
export function SaveProduct (data) {
  return request({
    url: DeviceManageApi.addProduct,
    method: 'POST',
    data
  })
}

/**
 * @description 产品---新建产品
 */
export function GetDeviceNum (params) {
  return request({
    url: DeviceManageApi.deviceCount,
    method: 'GET',
    params: encodeQueryParam(params)
  })
}

/**
 * @description 产品详情 --- 认证配置
 */
export function GetConfiguration (id) {
  return request({
    url: DeviceManageApi.configuration(id),
    method: 'GET'
  })
}

/**
 * @description 物模型 --- 数据类型单位
 */
export function getUnits () {
  return request({
    url: DeviceManageApi.units,
    method: 'GET'
  })
}
/**
 * @description 物模型 --- 保存产品物模型 属性定义（PATCH）
 */
export function editProduct (data) {
  return request({
    url: DeviceManageApi.addProduct,
    method: 'PATCH',
    data
  })
}
