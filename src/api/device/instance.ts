import server from '@/utils/request'
import { DeviceInstance } from '@/views/device/instance/typings'

/**
 * 删除设备物模型
 * @param deviceId 设备ID
 * @returns 
 */
export const deleteMetadata = (deviceId: string) => server.remove(`/device-instance/${deviceId}/metadata`)

/**
 * 保存设备物模型
 * @param id 设备ID
 * @param data 物模型
 * @returns 
 */
export const saveMetadata = (id: string, data: string) => server.put(`/device/instance/${id}/metadata`, data)

/**
 * 根据设备ID获取设备详情
 * @param id 设备ID
 * @returns 设备详情
 */
export const detail = (id: string) => server.get<DeviceInstance>(`/device-instance/${id}/detail`)