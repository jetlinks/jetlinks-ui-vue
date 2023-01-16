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

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns 
 */
export const query = (data?: Record<string, any>) => server.post('/device-instance/_query', data)

/**
 * 删除设备
 * @param id 设备ID
 * @returns 
 */
export const _delete = (id: string) => server.remove(`/device-instance/${id}`)

/**
 * 启用设备
 * @param id 设备ID
 * @param data 
 * @returns 
 */
export const _deploy = (id: string) => server.post(`/device-instance/${id}/deploy`)

/**
 * 禁用设备
 * @param id 设备ID
 * @param data 
 * @returns 
 */
 export const _undeploy = (id: string) => server.post(`/device-instance/${id}/undeploy`)