import { LocalStore } from '@/utils/comm'
import server from '@/utils/request'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable'
import { DeviceInstance } from '@/views/device/Instance/typings'
import { UnitType } from '@/views/device/Product/typings';

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
 * 修改设备信息
 * @param id 设备id
 * @param data 设备信息
 * @returns 
 */
export const modify = (id: string, data: Partial<DeviceInstance>) => server.put(`/device-instance/${id}`, data)

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

/**
 * 查询事件详情列表
 * @param deviceId 设备id
 * @param eventId 事件id
 * @param data 
 * @returns 
 */
export const getEventList = (deviceId: string, eventId: string, data: Record<string, any>) => server.post(`/device-instance/${deviceId}/event/${eventId}?format=true`, data)

/**
 * 设置属性至设备
 * @param deviceId 设备id
 * @param data 
 * @returns 
 */
export const setProperty = (deviceId: string, data: Record<string, any>) => server.put(`/device-instance/${deviceId}/property`, data)

/**
 * 获取最新属性值
 * @param deviceId 设备id
 * @param type 属性id
 * @returns 
 */
export const getProperty = (deviceId: string, type: string) => server.get(`/device/standard/${deviceId}/property/${type}`)

/**
 * 查询设备的物模型指标
 * @param deviceId 设备id
 * @param propertyId 属性id
 * @returns 
 */
export const queryMetric = (deviceId: string, propertyId: string) => server.get(`/device-instance/${deviceId}/metric/property/${propertyId}`)

/**
 * 保存设备的物模型指标
 * @param deviceId 设备id
 * @param propertyId 属性id
 * @param data 
 * @returns 
 */
export const saveMetric = (deviceId: string, propertyId: string, data: Record<string, any>) => server.patch(`/device-instance/${deviceId}/metric/property/${propertyId}`, data)

/**
 * 解绑子设备
 * @param deviceId 设备id
 * @param childrenId 子设备id
 * @param data 
 * @returns 
 */
export const unbindDevice = (deviceId: string, childrenId: string, data: Record<string, any>) => server.post(`/device/gateway/${deviceId}/unbind/${childrenId}`, data)

/**
 * 批量解绑子设备
 * @param deviceId 设备id
 * @param data 
 * @returns 
 */
export const unbindBatchDevice = (deviceId: string, data: Record<string, any>) => server.post(`/device/gateway/${deviceId}/unbind`, data)

/**
 * 子设备绑定
 * @param deviceId 设备id
 * @param data 
 * @returns 
 */
export const bindDevice = (deviceId: string, data: Record<string, any>) => server.post(`/device/gateway/${deviceId}/bind`, data)

/**
 * 设备接入网关状态
 * @param id 设备接入网关id
 * @returns 
 */
export const queryGatewayState = (id: string) => server.get(`/gateway/device/${id}/detail`)

/**
 * 网络组件状态
 * @param id 网络组件id
 * @returns 
 */
export const queryNetworkState = (id: string) => server.get(`/network/config/${id}`)

/**
 * 产品状态
 * @param id 产品id
 * @returns 
 */
export const queryProductState = (id: string) => server.get(`/device/product/${id}`)

/**
 * 产品配置
 * @param id 产品id
 * @returns 
 */
export const queryProductConfig = (id: string) => server.get(`/device/product/${id}/config-metadata`)

/**
 * 设备配置
 * @param id 设备id
 * @returns 
 */
export const queryDeviceConfig = (id: string) => server.get(`/device-instance/${id}/config-metadata`)

/**
 * 查询协议
 * @param type 
 * @param transport 
 * @returns 
 */
export const queryProtocolDetail = (type: string, transport: string) => server.get(`/protocol/${type}/transport/${transport}`)

/**
 * 网络组件启用
 * @param id 网络组件ID
 * @returns 
 */
export const startNetwork = (id: string) => server.post(`/network/config/${id}/_start`)

/**
 * 启用网关
 * @param id 网关id
 * @returns 
 */
export const startGateway = (id: string) => server.post(`/gateway/device/${id}/_startup`)

/**
 * 网关详情
 * @param id 网关id
 * @returns 
 */
export const getGatewayDetail = (id: string) => server.get(`/gateway/device/${id}`)


/*
 * 获取单位列表
 * @returns 单位列表
 */
export const getUnit = () => server.get<UnitType[]>(`/protocol/units`)

/**
 * 执行功能
 * @param deviceId 设备id
 * @param functionId 功能id
 * @param data 
 * @returns 
 */
export const executeFunctions = (deviceId: string, functionId: string, data: any) => server.post(`/device/invoked/${deviceId}/function/${functionId}`, data)

/**
 * 读取属性
 * @param deviceId 设备id
 * @param data 
 * @returns 
 */
export const readProperties = (deviceId: string, data: any) => server.post(`/device/instance/${deviceId}/properties/_read`, data)

/**
 * 设置属性
 * @param deviceId 设备id
 * @param data 
 * @returns 
 */
export const settingProperties = (deviceId: string, data: any) => server.put(`/device/instance/${deviceId}/property`, data)

/**
 * 设备功能-执行
 * @param id 设备id
 * @param action 
 * @param data 
 * @returns 
 */
 export const execute = (id: string, action: string, data: any) => server.post(`/device/invoked/${id}/function/${action}`, data)
