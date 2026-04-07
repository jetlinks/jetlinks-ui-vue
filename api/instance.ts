import { request, ndJson } from '@jetlinks-web/core'
import {getToken} from '@jetlinks-web/utils'
import {TOKEN_KEY_URL} from '@jetlinks-web/constants'
import type { DeviceInstance } from '../views/device/Instance/typings'
import type { DeviceMetadata, UnitType } from '../views/device/Product/typings';
import {getBaseApi} from "@jetlinks-web-core/utils";

/**
 * 重置设备继承产品的物模型规则
 * @param deviceId 设备ID
 * @param productId 产品ID
 */
export const resetRule = (productId:string,deviceId:string,data:any) => request.remove(`/virtual/property/product/${productId}/${deviceId}/_batch`,{},{data})

/**
 * 删除设备物模型
 * @param deviceId 设备ID
 * @returns
 */
export const deleteMetadata = (deviceId: string) => request.remove(`/device-instance/${deviceId}/metadata`)

/**
 * 保存设备物模型
 * @param id 设备ID
 * @param data 物模型
 * @returns
 */
export const saveMetadata = (id: string, data: DeviceMetadata) => request.put(`/device/instance/${id}/metadata`, data)

/**
 * 根据设备ID获取设备详情
 * @param id 设备ID
 * @returns 设备详情
 */
export const detail = (id: string, hiddenError?: any) => request.get<DeviceInstance>(`/device-instance/${id}/detail`, {}, { hiddenError})

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns
 */
export const query = (data?: Record<string, any>) => request.post('/device-instance/_query', data)

/**
 * 不分页查询设备
 * @param data
 * @returns
 */
export const queryNoPagingPost = (data?: Record<string, any>) => request.post('/device-instance/_query/no-paging?paging=false', data)

/**
 * 删除设备
 * @param id 设备ID
 * @returns
 */
export const _delete = (id: string) => request.remove(`/device-instance/${id}`)

/**
 * 启用设备
 * @param id 设备ID
 * @param data
 * @returns
 */
export const _deploy = (id: string, data?: any) => request.post(`/device-instance/${id}/deploy`, data)

/**
 * 禁用设备
 * @param id 设备ID
 * @returns
 */
export const _undeploy = (id: string) => request.post(`/device-instance/${id}/undeploy`)

/**
 * 批量激活设备
 * @param data 设备id数组
 * @returns
 */
export const batchDeployDevice = (data: string[]) => request.put(`/device-instance/batch/_deploy`, data)

/**
 * 批量注销设备
 * @param data 设备id数组
 * @returns
 */
export const batchUndeployDevice = (data: string[]) => request.put(`/device-instance/batch/_unDeploy`, data)

/**
 * 批量删除
 * @param data 设备id数组
 * @returns
 */
export const batchDeleteDevice = (data: string[]) => request.put(`/device-instance/batch/_delete`, data)

/**
 * 下载设备模板
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const deviceTemplateDownload = (productId: string, type: string) => `${getBaseApi()}/device-instance/${productId}/template.${type}`

export const templateDownload = (productId: string, type: string) => request.get(`/device-instance/${productId}/template.${type}`, {}, { responseType: 'blob' })
/**
 * 设备导入
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const deviceImport = (productId: string, fileUrl: string, autoDeploy: boolean) => `${getBaseApi()}/device-instance/${productId}/import/_withlog?fileUrl=${fileUrl}&autoDeploy=${autoDeploy}&${TOKEN_KEY_URL}=${getToken()}`

/**
 * 插件设备导入
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const pluginDeviceImport = (productId: string, fileUrl: string, autoDeploy: boolean) => `${getBaseApi()}/device/instance/plugin/${productId}/import/_withlog?fileUrl=${fileUrl}&autoDeploy=${autoDeploy}&${TOKEN_KEY_URL}=${getToken()}`

/**
 * 设备导出
 * @param productId 产品id
 * @param type 文件类型
 * @returns
 */
export const deviceExport = (productId: string, type: string, params?: any) => request.get(`/device-instance${!!productId ? `/${productId}` : ''}/export.${type}`, params, {responseType: 'blob'})
export const deviceExportPath = (productId: string, type: string) => (`${getBaseApi()}/device-instance${!!productId ? `/${productId}` : ''}/export.${type}`)
/**
 * 验证设备ID是否重复
 * @param id 设备id
 * @returns
 */
export const isExists = (id: string) => request.get(`/device-instance/${id}/exists`)

/**
 * 修改设备信息
 * @param data 设备信息
 * @returns
 */
export const update = (data: Partial<DeviceInstance>) => data.id ? request.patch(`/device-instance`, data) : request.post(`/device-instance`, data)

/**
 * 修改设备信息
 * @param id 设备id
 * @param data 设备信息
 * @returns
 */
export const modify = (id: string, data: Partial<DeviceInstance>) => request.put(`/device-instance/${id}`, data)

/**
 * 获取配置信息
 * @param id 设备id
 * @returns
 */
export const getConfigMetadata = (id: string) => request.get(`/device-instance/${id}/config-metadata`)

/**
 * 断开连接
 * @param id 设备id
 * @returns
 */
export const _disconnect = (id: string) => request.post(`/device-instance/${id}/disconnect`)

/**
 * 保存设备关系
 * @param id 设备id
 * @param data
 * @returns
 */
export const saveRelations = (id: string, data: Record<string, any>) => request.patch(`/device/instance/${id}/relations`, data)

/**
 * 修改标签
 * @param id 设备id
 * @param data
 * @returns
 */
export const saveTags = (id: string, data: Record<string, any>) => request.patch(`/device/instance/${id}/tag`, data)

/**
 * 删除标签
 * @param deviceId 设备id
 * @param id 标签id
 * @returns
 */
export const delTags = (deviceId: string, id: string) => request.remove(`/device/instance/${deviceId}/tag/${id}`)

/**
 * 恢复默认配置
 * @param deviceId 设备id
 * @returns
 */
export const configurationReset = (deviceId: string) => request.put(`/device-instance/${deviceId}/configuration/_reset`)

/**
 * 查询事件详情列表
 * @param deviceId 设备id
 * @param eventId 事件id
 * @param data
 * @returns
 */
export const getEventList = (deviceId: string, eventId: string, data: Record<string, any>) => request.post(`/device-instance/${deviceId}/event/${eventId}?format=true`, data)

/**
 * 设置属性至设备
 * @param deviceId 设备id
 * @param data
 * @returns
 */
export const setProperty = (deviceId: string, data: Record<string, any>) => request.put(`/device-instance/${deviceId}/property`, data)

/**
 * 获取最新属性值
 * @param deviceId 设备id
 * @param type 属性id
 * @returns
 */
export const getProperty = (deviceId: string, type: string) => request.get(`/device/standard/${deviceId}/property/${type}`)

/**
 * 查询设备的物模型指标
 * @param deviceId 设备id
 * @param propertyId 属性id
 * @returns
 */
export const queryMetric = (deviceId: string, propertyId: string) => request.get(`/device-instance/${deviceId}/metric/property/${propertyId}`)

/**
 * 保存设备的物模型指标
 * @param deviceId 设备id
 * @param propertyId 属性id
 * @param data
 * @returns
 */
export const saveMetric = (deviceId: string, propertyId: string, data: Record<string, any>) => request.patch(`/device-instance/${deviceId}/metric/property/${propertyId}`, data)

/**
 * 解绑子设备
 * @param deviceId 设备id
 * @param childrenId 子设备id
 * @param data
 * @returns
 */
export const unbindDevice = (deviceId: string, childrenId: string, data: Record<string, any>) => request.post(`/device/gateway/${deviceId}/unbind/${childrenId}`, data)

/**
 * 批量解绑子设备
 * @param deviceId 设备id
 * @param data
 * @returns
 */
export const unbindBatchDevice = (deviceId: string, data: Record<string, any>) => request.post(`/device/gateway/${deviceId}/unbind`, data)

/**
 * 子设备绑定
 * @param deviceId 设备id
 * @param data
 * @returns
 */
export const bindDevice = (deviceId: string, data: Record<string, any>) => request.post(`/device/gateway/${deviceId}/bind`, data)

/**
 * 云端批量禁用设备-云边协同
 * @param gatewayId 网关设备ID
 * @param data 云端子设备ID集合
 * @param params
 * @returns
 */
export const _undeployCloud = (gatewayId: string, data: Record<string, any>,params?:any) => request.post(`/edge/action-sync/${gatewayId}/_undeploy`, data, {params})

/**
 * 云端批量启用设备-云边协同
 * @param gatewayId 网关设备ID
 * @param data 云端子设备ID集合
 * @param params
 * @returns
 */
export const _deployCloud = (gatewayId: string, data: Record<string, any>,params?:any) => request.post(`/edge/action-sync/${gatewayId}/_deploy`, data, {params})

/**
 * 云端批量解绑设备-云边协同
 * @param gatewayId 网关设备ID
 * @param data 云端子设备ID集合
 * @param params
 * @returns
 */
export const _unbindCloud = (gatewayId: string, data: Record<string, any>,params?:any) => request.post(`/edge/action-sync/${gatewayId}/_unbind`, data, {params})

/**
 * 云端批量删除设备-云边协同
 * @param gatewayId 网关设备ID
 * @param data 云端子设备ID集合
 * @param params
 * @returns
 */
export const _deleteCloud = (gatewayId: string, data: Record<string, any>,params?:any) => request.post(`/edge/action-sync/${gatewayId}/_delete`, data, {params})

/**
 * 查询是否存在云端映射设备
 */
export const queryDeviceMapping = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/device-mapping-list/invoke`, data)

/**
 * 批量保存云端映射设备
 */
export const saveDeviceMapping = (deviceId: string, data: any) => request.post(`/edge/operations/${deviceId}/device-mapping-save-batch/invoke`, data)

/**
 *批量删除云端映射设备
 */
export const deleteDeviceMapping = (deviceId: string, data:any) => request.post(`/edge/operations/${deviceId}/device-mapping-delete-by-deviceid/invoke`, data)

/**
 * 获取产品列表
 * @param data
 */
export const getProductListNoPage = (data: any) => request.post('/device/product/_query/no-paging?paging=false', data)

/**
 * 修改设备
 */
export const editDevice = (params: any) => request.patch('/device-instance', params)

/**
 * 新增设备
 */
export const addDevice = (params: any) => request.post("/device-instance", params)

/**
 * 设备接入网关状态
 * @param id 设备接入网关id
 * @returns
 */
export const queryGatewayState = (id: string) => request.get(`/gateway/device/${id}/detail`)

/**
 * 网络组件状态
 * @param id 网络组件id
 * @returns
 */
export const queryNetworkState = (id: string) => request.get(`/network/config/${id}`)

/**
 * 产品状态
 * @param id 产品id
 * @returns
 */
export const queryProductState = (id: string) => request.get(`/device/product/${id}`)

/**
 * 产品配置
 * @param id 产品id
 * @returns
 */
export const queryProductConfig = (id: string) => request.get(`/device/product/${id}/config-metadata`)

/**
 * 设备配置
 * @param id 设备id
 * @returns
 */
export const queryDeviceConfig = (id: string) => request.get(`/device-instance/${id}/config-metadata`)

/**
 * 查询协议
 * @param type
 * @param transport
 * @returns
 */
export const queryProtocolDetail = (type: string, transport: string) => request.get(`/protocol/${type}/transport/${transport}`)

/**
 * 网络组件启用
 * @param id 网络组件ID
 * @returns
 */
export const startNetwork = (id: string) => request.post(`/network/config/${id}/_start`)

/**
 * 启用网关
 * @param id 网关id
 * @returns
 */
export const startGateway = (id: string) => request.post(`/gateway/device/${id}/_startup`)

/**
 * 网关详情
 * @param id 网关id
 * @returns
 */
export const getGatewayDetail = (id: string) => request.get(`/gateway/device/${id}`)


/*
 * 获取单位列表
 * @returns 单位列表
 */
export const getUnit = () => request.get<UnitType[]>(`/protocol/units`)

/**
 * 执行功能
 * @param deviceId 设备id
 * @param functionId 功能id
 * @param data
 * @returns
 */
export const executeFunctions = (deviceId: string, functionId: string, data: any) => request.post(`/device/invoked/${deviceId}/function/${functionId}`, data)

/**
 * 读取属性
 * @param deviceId 设备id
 * @param data
 * @returns
 */
export const readProperties = (deviceId: string, data: any) => request.post(`/device/instance/${deviceId}/properties/_read`, data)

/**
 * 设置属性
 * @param deviceId 设备id
 * @param data
 * @returns
 */
export const settingProperties = (deviceId: string, data: any) => request.put(`/device/instance/${deviceId}/property`, data)

/**
 * 设备功能-执行
 * @param id 设备id
 * @param action
 * @param data
 * @returns
 */
export const execute = (id: string, action: string, data: any) => request.post(`/device/invoked/${id}/function/${action}`, data)

/**
 * 查询通道列表不分页
 * @param data
 * @returns
 */
export const queryChannelNoPaging = (data: any) => request.post(`data-collect/channel/_query/no-paging`, data)

/**
 * 查询采集器列表不分页
 * @param data
 * @returns
 */
export const queryCollectorNoPaging = (data: any) => request.post(`/data-collect/collector/_query/no-paging`, data)

/**
 * 查询点位列表不分页
 * @param data
 * @returns
 */
export const queryPointNoPaging = (data: any) => request.post(`/data-collect/point/_query/no-paging`, data)

/**
 * 查询映射列表
 * @param thingType
 * @param thingId
 * @param params
 * @returns
 */
export const queryMapping = (thingType: string, thingId: any, params?: any) => request.get(`/things/collector/${thingType}/${thingId}/_query`, params)

/**
 * 删除映射
 * @param thingType
 * @param thingId
 * @param data
 * @returns
 */
export const removeMapping = (thingType: string, thingId: any, data?: any) => request.post(`/things/collector/${thingType}/${thingId}/_delete`, data)

/**
 * 映射树
 * @param data
 * @returns
 */
export const treeMapping = (data?: any) => request.post(`/data-collect/channel/_all/tree`, data)

/**
 * 保存映射
 * @param thingId
 * @param provider
 * @param data
 * @returns
 */
export const saveMapping = (thingId: any, provider: string, data?: any) => request.patch(`/things/collector/device/${thingId}/${provider}`, data)

/**
 * 查询边缘网关通道
 * @param deviceId
 * @param data
 * @returns
 */
export const edgeChannel = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/data-collector-channel-list/invoke`, data)

/**
 * 查询边缘网关采集器
 * @param deviceId
 * @param data
 * @returns
 */
export const edgeCollector = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/data-collector-list/invoke`, data)

/**
 * 查询边缘网关点位
 * @param deviceId
 * @param data
 * @returns
 */
export const edgePoint = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/data-collector-point-list/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const getEdgeMap = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/device-collector-list/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const removeEdgeMap = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/device-collector-delete/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const treeEdgeMap = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/data-collector-channel-tree/invoke`, data)

/**
 *
 * @param deviceId
 * @param data
 * @returns
 */
export const saveEdgeMap = (deviceId: string, data?: any) => request.post(`/edge/operations/${deviceId}/device-collector-save/invoke`, data)

/**
 * 查询属性详情
 * @param deviceId
 * @param params
 * @returns
 */
export const getPropertyData = (deviceId: string,property:string, params: Record<string, unknown>) => request.post(`/device/instance/${deviceId}/property/${property}/_query`, params)

/**
 * 聚合查询设备属性
 * @param deviceId
 * @param data
 * @returns
 */
export const getPropertiesInfo = (deviceId: string, data: Record<string, unknown>) => request.post(`/device-instance/${deviceId}/agg/_query`, data)

/**
 * 聚合查询设备属性
 * @param deviceId
 * @param data
 * @returns
 */
export const getPropertiesList = (deviceId: string, property: string, data: Record<string, unknown>) => request.post(`/device-instance/${deviceId}/property/${property}/_query/no-paging`, data)

/**
 * 获取指定协议
 * @param id
 * @param transport
 * @returns
 */
export const getProtocal = (id: string, transport: string) => request.get(`/protocol/${id}/transport/${transport}`)

/**
 * 获取产品解析规则
 * @param productId
 * @returns
 */
export const productCode = (productId: string) => request.get(`/device/transparent-codec/${productId}`)
/**
 * 保存产品解析规则
 * @param productId
 * @returns
 */
export const saveProductCode = (productId: string, data: Record<string, unknown>) => request.post(`/device/transparent-codec/${productId}`, data)
/**
 * 获取设备解析规则
 * @param productId
 * @param deviceId
 * @returns
 */
export const deviceCode = (productId: string, deviceId: string) => request.get(`/device/transparent-codec/${productId}/${deviceId}`)
/**
 * 保存设备解析规则
 * @param productId
 * 查询设备日志
 * @param deviceId
 * @param data
 * @returns
 */
export const saveDeviceCode = (productId: string, deviceId: string, data: Record<string, unknown>) => request.post(`/device/transparent-codec/${productId}/${deviceId}`, data)
/**
 * 编码测试
 * @param data
 * @returns
 */
export const testCode = (data: Record<string, unknown>) => request.post(`/device/transparent-codec/decode-test`, data)
/**
 * 删除设备解析规则
 * @param productId
 * @param deviceId
 * @returns
 */
export const delDeviceCode = (productId: string, deviceId: string) => request.remove(`/device/transparent-codec/${productId}/${deviceId}`)
/**
 * 删除产品解析规则
 * @param productId
 * @returns
 */
export const delProductCode = (productId: string) => request.remove(`/device/transparent-codec/${productId}`)
export const queryLog = (deviceId: string, data: Record<string, unknown>) => request.post(`/device-instance/${deviceId}/logs`, data)

/**
 * 查询设备日志类型
 * @returns
 */
export const queryLogsType = () => request.get(`/dictionary/device-log-type/items`)

export const getDeviceNumber = (data?:any) => request.post<number>('/device-instance/_count', data)

/**
 * 导入映射设备
 * @param productId
 * @param data/
 */
export const importDeviceByPlugin = (productId: string, data: any[]) => request.post(`/device/instance/plugin/${productId}/import`, data)

export const metadataMapById = (type: 'device' | 'product', productId: string, data: any[]) => request.patch(`/device/metadata/mapping/${type}/${productId}`, data)

export const getMetadataMapById = (type: 'device' | 'product', productId: string) => request.get(`/device/metadata/mapping/${type}/${productId}`)

export const getInkingDevices = (data: string[],accessId:any) => request.post(`/plugin/mapping/device/${accessId}/_all`, data)

export const getProtocolMetadata = (id: string, transport: string) => request.get(`/protocol/${id}/${transport}/metadata`)

/**
 * 规则属性
 */
export const saveDeviceVirtualProperty = (productId: string, deviceId: string, data: any[]) => request.patch(`/virtual/property/product/${productId}/${deviceId}/_batch`, data)

export const queryDeviceVirtualProperty = (productId: string, deviceId: string, propertyId: string) => request.get(`/virtual/property/device/${productId}/${deviceId}/${propertyId}`)

export const queryByParent = (deviceId: string) => request.get(`/device/gateway/${deviceId}/parent`)

export const queryCodeTips = (productId: string, deviceId: string) => request.get(`/device/transparent-codec/${productId}/${deviceId}.d.ts`)
export const queryProductCodeTips = (productId: string) => request.get(`/device/transparent-codec/${productId}.d.ts`)

/**
 * 获取设备物模型规则TS
 * @param deviceId 设备ID
 * @returns
 */
export const queryTypescript = (deviceId:string) => request.get(`/device/${deviceId}/virtual-property.d.ts`)

/**
 * 获取产品物模型规则TS
 * @param productId 产品ID
 * @returns
 */
export const queryProductTs = (productId:string) => request.get(`/product/${productId}/virtual-property.d.ts`)

/**
 * 阈值限制-新增/修改-产品
 * @param data
 */
export const updateProductThreshold = (productId:string,propertyId:string,data: any) => request.put(`/message/preprocessor/product/${productId}/property/${propertyId}`, data)

/**
 * 阈值限制-新增/修改-设备
 * @param data
 */
export const updateDeviceThreshold = (productId:string,deviceId:string,propertyId:string,data: any) => request.put(`/message/preprocessor/device/${productId}/${deviceId}/property/${propertyId}`, data)

/**
 * 阈值限制-设备物模型阈值限制
 * @param productId
 * @param deviceId
 * @param propertyId
 */
export const queryDeviceThreshold = (productId: string, deviceId: string,  propertyId: string) => request.get(`/message/preprocessor/device/${productId}/${deviceId}/property/${propertyId}`)

/**
 * 阈值限制-产品物模型阈值限制
 * @param productId
 * @param propertyId
 */
export const queryProductThreshold = (productId: string, propertyId: string,hiddenError:boolean) => request.get(`/message/preprocessor/product/${productId}/property/${propertyId}`,{},{ hiddenError })

/**
 * 阈值限制-删除产品物模型的阈值
 * @param productId
 * @param propertyId
 * @returns
 */
export const deleteProductThreshold = (productId:string,propertyId:string,data:any) => request.remove(`/message/preprocessor/product/${productId}/property/${propertyId}`,data)

/**
 * 阈值限制-删除产品物模型的阈值
 * @param productId
 * @param propertyId
 * @returns
 */
export const deleteDeviceThreshold = (productId:string,deviceId:string,propertyId:string,data:any) => request.remove(`/message/preprocessor/device/${productId}/${deviceId}/property/${propertyId}`,data)

export const getTemplate = (id: string, format: string) => `${getBaseApi()}/device/instance/${id}/property-metadata/template.${format}`

export const uploadAnalyzeMetadata = (productId:string,data: any) => request.post(`/device/instance/${productId}/property-metadata/file/analyze`, data)

/**
 * 设备影子-获取数据
 * @param id 设备ID
 */
export const getDeviceShadow = (id: string) => request.get(`/device/shadow/${id}`)

/**
 * 物模型事件图片地址代理
 */
export const proxyUrl = (deviceId: string, url: string) => request.get(`/edge/device/${deviceId}/_proxy?url=${url}`, {}, { responseType: 'blob' })

export const tagsList = () => request.get('/device-instance/tags/key')

export const getRemoteProxyUrl = (deviceId: string) => request.post(`/edge/device/${deviceId}/_proxy/_start?timeoutMinute=10`)

export const getRemoteToken = (deviceId: string, data: any) => request.post(`/edge/device/${deviceId}/token`, data)

export const getRemoteSystem = (deviceId: string, data: any) => request.post(`/edge/device/${deviceId}/_/system/config/scopes`, data)

/**
 * 访问边端设备列表
 * @param thingId 边缘网关ID
 * @param internalId 连接id
 * @param data
 */
export const _queryByEdge = (thingId: string,data:any) => request.post(`/edge/device/${thingId}/_/edge/command/QueryBindInfoList/_execute`,data)

/**
 * 绑定子设备命令
 * @param thingId 边缘网关ID
 * @param commandId 命令ID{BindMasterDevice:绑定单个,BatchBindDevice:批量绑定,UnbindDevice:解绑}
 * @param data
 */
export const _commandByEdge = (thingId: string,commandId:string,data:any) => request.post(`/edge/device/${thingId}/_/edge/command/${commandId}/_execute`,data)

/**
 * 获取关系用户
 * @param data
 * @returns
 */
export const getRelationUsers = (data: any) => request.post(`/relation/_query/no-paging`, data)

/**
 * 获取不分页组织列表
 */
export const getOrgList = (data: any) => request.post(`/organization/_query/no-paging`, data)

/**
 * 绑定设备到组织
 */
export const bindDeviceToOrg = (data: any) => request.post(`/assets/bind/device`, data)
export const bindDeviceToOrgAll = (assetType: string, assetId: string, targetType: string, data: any) => request.post(`/assets/bind/${assetType}/${assetId}/${targetType}/_all`, data)

/**
 * 获取资产所绑定的组织列表权限
 * @param assetType 资产类型
 * @param assetId 资产ID
 * @param targetType 目标类型
 */
export const getBindOrgAuthList = (assetType: string, assetId: string, targetType: string, data: string[] = []) => request.post(`/assets/bindings/${assetType}/${assetId}/${targetType}/target/_query`, data)

/**
 * 下载数采映射导入模版
 * @param format 文件格式
 */
export const downloadAnalyzeMetadataTemplate = (format: string) => request.get(`/device/instance/download/point/mapping/template.${format}`, {}, { responseType: 'blob' })

/**
 * 导入物模型映射
 * @param deviceId 设备ID
 * @param fileUrl 文件URL
 * @param autoCreate 是否自动创建
 */
export const importAnalyzeMetadata = (deviceId: string, fileUrl: string, autoCreate: boolean) => ndJson.get(`/device/instance/${deviceId}/property/point/import?fileUrl=${fileUrl}&autoCreate=${autoCreate}`)
export const queryPropertyMetric = (deviceId: string, data: any) => request.post(`/device-instance/${deviceId}/metric/properties`, data)

/**
 * 获取设备接入身份信息
 * @param deviceId 设备ID
 * @returns 设备身份信息列表
 */
export const getDevicePrincipal = (deviceId: string) => request.get<Array<{
    id: string;
    deviceId: string;
    metadata?: {
        name?: string;
        description?: string;
        type?: string;
    };
    identity: {
        type: string;
        identifier: string;
        name?: string;
    };
    credential: {
        type: 'token' | 'password';
        content: {
            token?: string;
            username?: string;
            password?: string;
        };
    };
}>>(`/device/principal/${deviceId}`)

/**
 * 是否支持设备接入身份
 * @returns boolean
 */
export const existsDevicePrincipalSupport = () =>
  request.get<boolean>(`/command-supports/service/deviceService:principal/exists`)

/**
 * 重置设备接入身份
 * @param deviceId 设备ID
 * @returns
 */
export const resetDevicePrincipal = (deviceId: string) => request.post(`/device/principal/${deviceId}/_reset`)

/**
 * 创建云端设备（边缘接入绑定）
 * @param data 请求参数
 */
export const deviceCloudSave = (data: any) =>
  request.post(`/edge/command/BindMasterDevice/_execute`, data)

