import server from '@/utils/request'
import type { DeviceMetadata } from '@/views/device/Product/typings'

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