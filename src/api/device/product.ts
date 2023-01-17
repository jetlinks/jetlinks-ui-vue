import server from '@/utils/request'
import { DeviceMetadata, ProductItem } from '@/views/device/Product/typings'

/**
 * 根据条件查询产品（不带翻页）
 * @param data 查询条件
 * @returns 
 */
export const queryNoPagingPost = (data: any) => server.post(`/device-product/_query/no-paging?paging=false`, data)

/**
 * 导入第三方物模型
 * @param direction from|to
 * @param type 物模型类型
 * @param data 物模型数据
 * @returns 
 */
export const convertMetadata = (direction: 'from' | 'to', type: string, data: any) => server.post<DeviceMetadata>(`/device/product/metadata/convert-${direction}/${type}`, data)

/**
 * 修改产品
 * @param id 产品ID
 * @param data 产品数据
 * @returns 
 */
export const modify = (id: string, data: any) => server.put(`/device-product/${id}`, data)

/**
 * 
 * @returns 
 */
export const getCodecs = () => server.get<{id: string, name: string}>('/device/product/metadata/codecs')

/**
 * 根据产品ID获取产品详情
 * @param id 产品ID
 * @returns 
 */
export const detail = (id: string) => server.get<ProductItem>(`/device-product/${id}`)

/**
 * 产品分类
 * @param data
 */
export const category = (data: any) => server.post('/device/category/_tree', data)