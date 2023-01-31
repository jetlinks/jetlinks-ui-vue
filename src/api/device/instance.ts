import { LocalStore } from '@/utils/comm'
import server from '@/utils/request'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable'
import { DeviceInstance } from '@/views/device/Instance/typings'

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

/**
 * 验证设备ID是否重复
 * @param id 设备id
 * @returns 
 */
export const isExists = (id: string) => server.get(`/device-instance/${id}/exists`)

/**
 * 修改设备信息
 * @param data 设备信息
 * @returns 
 */
export const update = (data: Partial<DeviceInstance>) => data.id ? server.patch(`/device-instance`, data) : server.post(`/device-instance`, data)

/**
 * 获取配置信息
 * @param id 设备id
 * @returns 
 */
export const getConfigMetadata = (id: string) => server.get(`/device-instance/${id}/config-metadata`)

/**
 * 断开连接
 * @param id 设备id
 * @returns 
 */
export const _disconnect = (id: string) => server.post(`/device-instance/${id}/disconnect`)

/**
 * 查询用户列表
 * @returns 
 */
export const queryUserListNoPaging = () => server.post(`/user/_query/no-paging`, {
  paging: false,
  sorts: [{name: 'name', order: "asc"}]
})

/**
 * 保存设备关系
 * @param id 设备id
 * @param data 
 * @returns 
 */
export const saveRelations = (id: string, data: Record<string, any>) => server.patch(`/device/instance/${id}/relations`, data)

/**
 * 修改标签
 * @param id 设备id
 * @param data 
 * @returns 
 */
export const saveTags = (id: string, data: Record<string, any>) => server.patch(`/device/instance/${id}/tag`, data)

/**
 * 删除标签
 * @param deviceId 设备id
 * @param id 标签id
 * @returns 
 */
export const delTags = (deviceId: string, id: string) => server.remove(`/device/instance/${deviceId}/tag/${id}`)

/**
 * 恢复默认配置
 * @param deviceId 设备id
 * @returns 
 */
export const configurationReset = (deviceId: string) => server.put(`/device-instance/${deviceId}/configuration/_reset`)