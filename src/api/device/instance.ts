import server from '@/utils/request'
import { BASE_API_PATH } from '@/utils/variable'
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

/**
 * 批量激活设备
 * @param data 设备id数组
 * @returns 
 */
export const batchDeployDevice = (data: string[]) => server.put(`/device-instance/batch/_deploy`, data)

/**
 * 批量注销设备
 * @param data 设备id数组
 * @returns 
 */
export const batchUndeployDevice = (data: string[]) => server.put(`/device-instance/batch/_unDeploy`, data)

/**
 * 批量删除
 * @param data 设备id数组
 * @returns 
 */
export const batchDeleteDevice = (data: string[]) => server.put(`/device-instance/batch/_delete`, data)

/**
 * 下载设备模板
 * @param productId 产品id
 * @param type 文件类型
 * @returns 
 */
 export const deviceTemplateDownload = (productId: string, type: string) => `${BASE_API_PATH}/device-instance/${productId}/template.${type}`

 /**
  * 设备导入
  * @param productId 产品id
  * @param type 文件类型
  * @returns 
  */
 export const deviceImport = (productId: string, fileUrl: string, autoDeploy: boolean) => `${BASE_API_PATH}/device-instance/${productId}/import?fileUrl=${fileUrl}&autoDeploy=${autoDeploy}&:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`
 
 /**
  * 设备导出
  * @param productId 产品id
  * @param type 文件类型
  * @returns 
  */
  export const deviceExport = (productId: string, type: string) => `${BASE_API_PATH}/device-instance${!!productId ? '/' + productId : ''}/export.${type}`
 
