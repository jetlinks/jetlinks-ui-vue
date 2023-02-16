import server from '@/utils/request'

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns 
 */
export const query = (data: Record<string, any>) => server.post('/device/aliyun/bridge/_query', data)

/**
 * 查询产品列表
 * @param data 
 * @returns 
 */
export const queryProductList = (data?: Record<string, any>) => server.post('/device-product/_query/no-paging', data)

/**
 * 保存数据
 * @param data 阿里云
 * @returns 
 */
export const savePatch = (data: Record<string, any>) => server.patch(`/device/aliyun/bridge`, data)

/**
 * 根据阿里云ID获取阿里云详情
 * @param id 阿里云ID
 * @returns 阿里云详情
 */
export const detail = (id: string) => server.get(`/device/aliyun/bridge/${id}`)

/**
 * 删除阿里云
 * @param id 阿里云ID
 * @returns 
 */
export const _delete = (id: string) => server.remove(`/device/aliyun/bridge/${id}`)

/**
 * 启用阿里云
 * @param id 阿里云ID
 * @param data 
 * @returns 
 */
export const _deploy = (id: string) => server.post(`/device/aliyun/bridge/${id}/enable`)

/**
 * 禁用阿里云
 * @param id 阿里云ID
 * @param data 
 * @returns 
 */
export const _undeploy = (id: string) => server.post(`/device/aliyun/bridge/${id}/disable`)

/**
 * 获取服务地址的下拉列表
 * @param params 
 * @returns 
 */
export const getRegionsList = (params?: Record<string, any>) => server.get(`/device/aliyun/bridge/regions`, params)

/**
 * 产品映射中的阿里云产品下拉列表
 * @param data 
 * @returns 
 */
export const getAliyunProductsList = (data?: Record<string, any>) => server.post(`/device/aliyun/bridge/products/_query`, data)

