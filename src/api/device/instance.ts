import { LocalStore } from '@/utils/comm'
import server from '@/utils/request'
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable'
import { DeviceInstance } from '@/views/device/Instance/typings'
import { DeviceMetadata, UnitType } from '@/views/device/Product/typings';

/**
 * 重置设备继承产品的物模型规则
 * @param deviceId 设备ID
 * @param productId 产品ID
 */
export const resetRule = (productId:string,deviceId:string,data:any) => server.remove(`/virtual/property/product/${productId}/${deviceId}/_batch`,{},{data})

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
export const saveMetadata = (id: string, data: DeviceMetadata) => server.put(`/device/instance/${id}/metadata`, data)

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
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryNoPagingPost = (data?: Record<string, any>) => server.post('/device-instance/_query/no-paging?paging=false', data)

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

export const templateDownload = (productId: string, type: string) => server.get(`/device-instance/${productId}/template.${type}`, {}, { responseType: 'blob' })
/**
 * 设备导入
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const deviceImport = (productId: string, fileUrl: string, autoDeploy: boolean) => `${BASE_API_PATH}/device-instance/${productId}/import/_withlog?fileUrl=${fileUrl}&autoDeploy=${autoDeploy}&:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`

/**
 * 设备导出
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const deviceExport = (productId: string, type: string, params?: any) => server.get(`/device-instance${!!productId ? `/${productId}` : ''}/export.${type}`, params, {responseType: 'blob'})
export const deviceExportPath = (productId: string, type: string) => (`${BASE_API_PATH}/device-instance${!!productId ? `/${productId}` : ''}/export.${type}`)
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
  sorts: [{ name: 'name', order: "asc" }]
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
 * 查询是否存在云端映射设备
 */
export const queryDeviceMapping = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/device-mapping-list/invoke`, data)

/**
 * 批量保存云端映射设备
 */
export const saveDeviceMapping = (deviceId: string, data: any) => server.post(`/edge/operations/${deviceId}/device-mapping-save-batch/invoke`, data)

/**
 *批量删除云端映射设备
 */
export const deleteDeviceMapping = (deviceId: string, data:any) => server.post(`/edge/operations/${deviceId}/device-mapping-delete-by-deviceid/invoke`, data)

/**
 * 获取产品列表
 * @param data
 */
export const getProductListNoPage = (data: any) => server.post('/device/product/_query/no-paging?paging=false', data)

/**
 * 修改设备
 */
export const editDevice = (params: any) => server.patch('/device-instance', params)

/**
 * 新增设备
 */
export const addDevice = (params: any) => server.post("/device-instance", params)

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

/**
 * 查询通道列表不分页
 * @param data
 * @returns
 */
export const queryChannelNoPaging = (data: any) => server.post(`data-collect/channel/_query/no-paging`, data)

/**
 * 查询采集器列表不分页
 * @param data
 * @returns
 */
export const queryCollectorNoPaging = (data: any) => server.post(`/data-collect/collector/_query/no-paging`, data)

/**
 * 查询点位列表不分页
 * @param data
 * @returns
 */
export const queryPointNoPaging = (data: any) => server.post(`/data-collect/point/_query/no-paging`, data)

/**
 * 查询映射列表
 * @param thingType
 * @param thingId
 * @param params
 * @returns
 */
export const queryMapping = (thingType: string, thingId: any, params?: any) => server.get(`/things/collector/${thingType}/${thingId}/_query`, params)

/**
 * 删除映射
 * @param thingType
 * @param thingId
 * @param data
 * @returns
 */
export const removeMapping = (thingType: string, thingId: any, data?: any) => server.post(`/things/collector/${thingType}/${thingId}/_delete`, data)

/**
 * 映射树
 * @param data
 * @returns
 */
export const treeMapping = (data?: any) => server.post(`/data-collect/channel/_all/tree`, data)

/**
 * 保存映射
 * @param thingId
 * @param provider
 * @param data
 * @returns
 */
export const saveMapping = (thingId: any, provider: string, data?: any) => server.patch(`/things/collector/device/${thingId}/${provider}`, data)

/**
 * 查询边缘网关通道
 * @param deviceId
 * @param data
 * @returns
 */
export const edgeChannel = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/data-collector-channel-list/invoke`, data)

/**
 * 查询边缘网关采集器
 * @param deviceId
 * @param data
 * @returns
 */
export const edgeCollector = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/data-collector-list/invoke`, data)

/**
 * 查询边缘网关点位
 * @param deviceId
 * @param data
 * @returns
 */
export const edgePoint = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/data-collector-point-list/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const getEdgeMap = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/device-collector-list/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const removeEdgeMap = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/device-collector-delete/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const treeEdgeMap = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/data-collector-channel-tree/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const saveEdgeMap = (deviceId: string, data?: any) => server.post(`/edge/operations/${deviceId}/device-collector-save/invoke`, data)

/**
 * 查询属性详情
 * @param deviceId
 * @param params
 * @returns
 */
export const getPropertyData = (deviceId: string, params: Record<string, unknown>) => server.get(`/device-instance/${deviceId}/properties/_query`, params)

/**
 * 聚合查询设备属性
 * @param deviceId
 * @param data
 * @returns
 */
export const getPropertiesInfo = (deviceId: string, data: Record<string, unknown>) => server.post(`/device-instance/${deviceId}/agg/_query`, data)

/**
 * 聚合查询设备属性
 * @param deviceId
 * @param data
 * @returns
 */
export const getPropertiesList = (deviceId: string, property: string, data: Record<string, unknown>) => server.post(`/device-instance/${deviceId}/property/${property}/_query/no-paging`, data)

/**
 * 获取指定协议
 * @param id
 * @param transport
 * @returns
 */
export const getProtocal = (id: string, transport: string) => server.get(`/protocol/${id}/transport/${transport}`)

/**
 * 获取产品解析规则
 * @param productId
 * @returns
 */
export const productCode = (productId: string) => server.get(`/device/transparent-codec/${productId}`)
/**
 * 保存产品解析规则
 * @param productId
 * @returns
 */
export const saveProductCode = (productId: string, data: Record<string, unknown>) => server.post(`/device/transparent-codec/${productId}`, data)
/**
 * 获取设备解析规则
 * @param productId
 * @param deviceId
 * @returns
 */
export const deviceCode = (productId: string, deviceId: string) => server.get(`device/transparent-codec/${productId}/${deviceId}`)
/**
 * 保存设备解析规则
 * @param productId
 * 查询设备日志
 * @param deviceId
 * @param data
 * @returns
 */
export const saveDeviceCode = (productId: string, deviceId: string, data: Record<string, unknown>) => server.post(`/device/transparent-codec/${productId}/${deviceId}`, data)
/**
 * 编码测试
 * @param data
 * @returns
 */
export const testCode = (data: Record<string, unknown>) => server.post(`/device/transparent-codec/decode-test`, data)
/**
 * 删除设备解析规则
 * @param productId
 * @param deviceId
 * @returns
 */
export const delDeviceCode = (productId: string, deviceId: string) => server.remove(`/device/transparent-codec/${productId}/${deviceId}`)
/**
 * 删除产品解析规则
 * @param productId
 * @returns
 */
export const delProductCode = (productId: string) => server.remove(`/device/transparent-codec/${productId}`)
export const queryLog = (deviceId: string, data: Record<string, unknown>) => server.post(`/device-instance/${deviceId}/logs`, data)

/**
 * 查询设备日志类型
 * @returns
 */
export const queryLogsType = () => server.get(`/dictionary/device-log-type/items`)

export const getDeviceNumber = (data?:any) => server.post<number>('/device-instance/_count', data)

/**
 * 导入映射设备
 * @param productId
 * @param data/
 */
export const importDeviceByPlugin = (productId: string, data: any[]) => server.post(`/device/instance/plugin/${productId}/import`, data)

export const metadataMapById = (type: 'device' | 'product', productId: string, data: any[]) => server.patch(`/device/metadata/mapping/${type}/${productId}`, data)

export const getMetadataMapById = (type: 'device' | 'product', productId: string) => server.get(`/device/metadata/mapping/${type}/${productId}`)

export const getInkingDevices = (data: string[],accessId:any) => server.post(`/plugin/mapping/device/${accessId}/_all`, data)

export const getProtocolMetadata = (id: string, transport: string) => server.get(`/protocol/${id}/${transport}/metadata`)

/**
 * 规则属性
 */
export const saveDeviceVirtualProperty = (productId: string, deviceId: string, data: any[]) => server.patch(`/virtual/property/product/${productId}/${deviceId}/_batch`, data)

export const queryDeviceVirtualProperty = (productId: string, deviceId: string, propertyId: string) => server.get(`/virtual/property/device/${productId}/${deviceId}/${propertyId}`)

export const queryByParent = (deviceId: string) => server.get(`/device/gateway/${deviceId}/parent`)

export const queryCodeTips = (productId: string, deviceId: string) => server.get(`/device/transparent-codec/${productId}/${deviceId}.d.ts`)
export const queryProductCodeTips = (productId: string) => server.get(`/device/transparent-codec/${productId}.d.ts`)

/**
 * 获取设备物模型规则TS
 * @param deviceId 设备ID
 * @returns
 */
export const queryTypescript = (deviceId:string) => server.get(`/device/${deviceId}/virtual-property.d.ts`)

/**
 * 获取产品物模型规则TS
 * @param productId 产品ID
 * @returns
 */
export const queryProductTs = (productId:string) => server.get(`/product/${productId}/virtual-property.d.ts`)

/**
 * 阈值限制-新增/修改-产品
 * @param data
 */
export const updateProductThreshold = (productId:string,propertyId:string,data: any) => server.put(`/message/preprocessor/product/${productId}/property/${propertyId}`, data)

/**
 * 阈值限制-新增/修改-设备
 * @param data
 */
export const updateDeviceThreshold = (productId:string,deviceId:string,propertyId:string,data: any) => server.put(`/message/preprocessor/device/${productId}/${deviceId}/property/${propertyId}`, data)

/**
 * 阈值限制-设备物模型阈值限制
 * @param productId
 * @param deviceId
 * @param propertyId
 */
export const queryDeviceThreshold = (productId: string, deviceId: string,  propertyId: string) => server.get(`/message/preprocessor/device/${productId}/${deviceId}/property/${propertyId}`)

/**
 * 阈值限制-产品物模型阈值限制
 * @param productId
 * @param propertyId
 */
export const queryProductThreshold = (productId: string, propertyId: string) => server.get(`/message/preprocessor/product/${productId}/property/${propertyId}`)

/**
 * 阈值限制-重置设备物继承产品的模型阈值
 * @param deviceId
 * @param data
 */
export const resetDeviceThreshold = (deviceId: string,  data: string) => server.remove(`/threshold/property/device/${deviceId}/_batch`, {}, { data })

export const getTemplate = (id: string, format: string) => `${BASE_API_PATH}/device/instance/${id}/property-metadata/template.${format}`

export const analyzeMetadata = (id: string, url: string) => server.get(`/device/instance/property-metadata/file/analyze?fileUrl=${url}`)
