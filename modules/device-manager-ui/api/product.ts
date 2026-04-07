import { request, ndJson } from '@jetlinks-web/core'
import type { DeviceMetadata, ProductItem, DepartmentItem, MetadataType  } from '../views/device/Product/typings'
import type { OperatorItem } from '../components/FRuleEditor/Operator/typings'
import {getBaseApi} from "@jetlinks-web-core/utils";

/**
 * 根据条件查询产品（不带翻页）
 * @param data 查询条件
 * @returns
 */
export const queryNoPagingPost = (data: any) => request.post(`/device-product/_query/no-paging?paging=false`, data)

/**
 * 导入第三方物模型
 * @param direction from|to
 * @param type 物模型类型
 * @param data 物模型数据
 * @returns
 */
export const convertMetadata = (direction: 'from' | 'to', type: string, data: any) => request.post<DeviceMetadata>(`/device/product/metadata/convert-${direction}/${type}`, data)

/**
 * 修改产品
 * @param id 产品ID
 * @param data 产品数据
 * @returns
 */
export const modify = (id: string, data: any) => request.put(`/device-product/${id}`, data)

/**
 *
 * @returns
 */
export const getCodecs = () => request.get<{id: string, name: string}>('/device/product/metadata/codecs')

/**
 * 根据产品ID获取产品详情
 * @param id 产品ID
 * @returns
 */
export const detail = (id: string) => request.get<ProductItem>(`/device-product/${id}`)
export const queryDetailList = (data) => request.post(`/device-product/detail/_query`, data)

/**
 * 产品分类
 * @param data 查询条件
 */
export const category = (data: any) => request.get('/device/category/_tree?paging=false', data)

/**
 * 获取网关类型
 */
 export const getProviders = (terms?:any) => request.get('/gateway/device/providers',terms)

 /**
  * 查询所属部门
  * @param params 查询条件
  */
 export const queryOrgThree = (params?: Record<string, any>) => request.post<DepartmentItem>('/organization/_all/tree', params)

 /**
  * 获取接入方式
  * @param data 查询条件
  */
 const defaultGatewayData = {
  paging: false,
  sorts: [
   {
    name: 'createTime',
    order: 'desc',
   },
  ],
 }
 export const queryGatewayList = (data: any = defaultGatewayData) => request.post('/gateway/device/_query/no-paging', data)

 /**
  * 查询产品列表(分页)
  * @param data 查询条件
  */
 export const queryProductList = (data: any) => request.post('/device-product/_query', data)

 /**
 * 启用产品
 * @param productId 产品ID
 * @param data
 * @returns
 */
export const _deploy = (productId: string) => request.post(`/device-product/${productId}/deploy`)

/**
 * 禁用产品
 * @param productId 产品ID
 * @param data
 * @returns
 */
export const _undeploy = (productId: string) => request.post(`/device-product/${productId}/undeploy`)

/**
 * 新增产品
 * @param data
 * @returns
 */
export const addProduct = (data:any) => request.post('/device-product',data)

/**
 * 修改产品
 * @param id 产品ID
 * @param data
 * @returns
 */
export const editProduct = (data: any) => request.put(`/device-product/${data.id}`, data)

/**
 * 删除产品
 * @param id 产品ID
 */
export const deleteProduct = (id: string) => request.remove(`/device-product/${id}`)

/**
 * 检测产品Id唯一性
 * @param id 产品ID
 */
 export const queryProductId = (id: string) => request.get(`/device-product/${id}/exists`)
/**
 * 保存产品
 * @param data 产品信息
 * @returns
 */
export const saveProductMetadata = (data: Record<string, unknown>) => request.patch('/device-product', data)

/**
 * 获取设备数量
 * @param data 查询条件
 * @returns
 */
export const getDeviceNumber = (params:any) => request.get<number>('/device-instance/_count', params)

/**
 * 获取协议详情
 *  @param id 协议ID
 */
export const getProtocolDetail = (id:string) => request.post(`/protocol/${id}/detail`, id)

/**
 * 查询设备列表
 */
export const queryList = (data: any) => request.post(`/gateway/device/detail/_query`, data)

/**
 * 查询协议数据
 */
export const getConfigView = (id: string, transport: string) => request.get(`/protocol/${id}/transport/${transport}`)

/**
 * 获取配置数据
 */
export const getConfigMetadata = (id: string) => request.get(`/device/product/${id}/config-metadata`)
/**
 * 引导页是否需要提示
 */
export const productGuide = () => request.get(`/user/settings/product/guide`)
/**
 * 保存引导页修改值
 */
export const productGuideSave = (data: any) => request.patch('/user/settings/product/guide', data)

/**
 * 存储策略
 */
export const getStoragList = () => request.get('/device/product/storage/policies')

/**
 * 保存设备(设备接入)
 */
export const saveDevice = (data:any) => request.post('/device-product',data)

/**
 * 更新选择设备(设备接入)
 */
export const updateDevice = (data:any) => request.patch('/device-product',data)

/**
 * 获取操作符
 */
export const getOperator = () => request.get<OperatorItem[]>('/property-calculate-rule/description')

/**
 * 获取聚合函数列表
 */
export const getStreamingAggType = () => request.get<Record<string, string>[]>('/dictionary/streaming-agg-type/items')

/**
 * 根据指定的接入方式获取产品需要的配置信息
 * @pId 产品id
 * @accessId 设备接入id
 */
export const getAccessConfig = (pId: string, accessId: string) => request.get(`/device-product/${pId}/${accessId}/config-metadata`)

export const getMetadataConfig = (params: {
  deviceId: string;
  metadata: {
    type: MetadataType | 'property';
    id: string;
    dataType: string;
  };
}) => request.get<Record<any, any>[]>(`/device/product/${params.deviceId}/config-metadata/${params.metadata.type}/${params.metadata.id}/${params.metadata.dataType}`)

export const getMetadataDeviceConfig = (params: {
  deviceId: string;
  metadata: {
    type: MetadataType | 'property';
    id: string;
    dataType: string;
  };
}) => request.get<Record<any, any>[]>(`/device/instance/${params.deviceId}/config-metadata/${params.metadata.type}/${params.metadata.id}/${params.metadata.dataType}`)

/**
 * 规则属性
 */
export const saveProductVirtualProperty = (productId: string, data: any[]) => request.patch(`/virtual/property/product/${productId}/_batch`, data)

export const queryProductVirtualProperty = (productId: string, propertyId: string) => request.get(`/virtual/property/product/${productId}/${propertyId}`)

export const getTemplate = (id: string, format: string) => `${getBaseApi()}/device/product/${id}/property-metadata/template.${format}`

export const getFileType = () => request.get(`/file/media/types`)

/**
 * 同步产品缓存
 * @returns
 */
export const syncProductCache = () => ndJson.post('/device/product/batch/_deploy')

/**
 * 获取产品数量
 */
export const getProductCount = (data: any) => request.post('/device/product/_count', data)

//查询北向连接列表不分页
export const queryNorthList = (data:Object) => request.post(`/edge/master/detail/_query/no-paging`,data)

/**
 * 查询云端产品列表
 */
export const queryCloudsProduct = (masterId:string,data:any) => request.post(`/edge/master/${masterId}/command/deviceService:product/QueryPager`,data)
