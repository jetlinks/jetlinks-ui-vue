import request from '@/utils/request'
import { DeviceManageApi } from '@/config/api/device'
import encodeQueryParam from '@/utils/encodeParam'

/**
 * @description 设备 --- 产品id列表
 */
export function getDeviceProductId (params) {
  return request({
    url: DeviceManageApi.deviceProductId,
    method: 'GET',
    params
  })
}
/**
 * @description 设备 --- 设备列表
 */
export function getDeviceListData (params) {
  return request({
    url: DeviceManageApi.deviceList,
    method: 'GET',
    params: encodeQueryParam(params)
  })
}
/**
 * @description 设备 --- 设备状态的情况
 */
export function getDeviceStatus (params) {
  return request({
    url: DeviceManageApi.deviceStatus,
    method: 'GET',
    params: encodeQueryParam(params)
  })
}

/**
 * @description 设备 --- 删除设备
 */
export function delDevice (id) {
  return request({
    url: DeviceManageApi.delDevice(id),
    method: 'DELETE'
  })
}

/**
 * @description 设备 --- 设备详情
 */
export function getDeviceDetail (id) {
  return request({
    url: DeviceManageApi.deviceDetail(id),
    method: 'GET'
  })
}

/**
 * @description 设备 --- 配置详情
 */
export function getDeviceConfig (protocol, transport) {
  return request({
    url: DeviceManageApi.deviceConfiguration(protocol, transport),
    method: 'GET'
  })
}
/**
 * @description 设备 --- 设备报警列表
 */
export function getDeviceAlarmList (target, targetId) {
  return request({
    url: DeviceManageApi.deviceAlarmList(target, targetId),
    method: 'GET'
  })
}
/**
 * @description 设备 --- 设备报警列表
 */
export function addDeviceAlarmInfo (target, targetId, data) {
  return request({
    url: DeviceManageApi.addDeviceAlarmInfo(target, targetId),
    method: 'PATCH',
    data
  })
}
/**
 * @description 设备 --- 新增告警 --- 通知类型
 */
export function getDeviceNotifierType () {
  return request({
    url: DeviceManageApi.DeviceNotifierType,
    method: 'GET'
  })
}
