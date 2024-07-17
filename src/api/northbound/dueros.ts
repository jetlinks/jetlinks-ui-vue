import server from '@/utils/request'

/**
 * 查询数据
 * @param data 分页搜索数据
 * @returns 
 */
export const query = (data: Record<string, any>) => server.post('/dueros/product/_query', data)

/**
 * 查询数据不分页
 */
export const queryPaginateNot = (data:any) => server.post('/dueros/product/_query/no-paging',data)

/**
 * 查询产品列表
 * @param id 
 * @returns 
 */
export const queryProductList = (id?: string) => server.post('/device-product/_query/no-paging', {
    paging: false,
    terms: id ? [{
        column: 'id$dueros-product$not',
        value: 1,
      },
      { column: 'id', type: 'or', value: id }
    ] : [{
        column: 'id$dueros-product$not',
        value: 1,
    }],
    sorts: [{ name: 'createTime', order: 'desc' }],
})

/**
 * 查询类型
 * @returns 
 */
export const queryTypes = () => server.get('/dueros/product/types')

/**
 * 保存数据
 * @param data dueros
 * @returns 
 */
export const savePatch = (data: Record<string, any>) => server.patch(`/dueros/product`, data)

/**
 * 根据duerosID获取dueros详情
 * @param id duerosID
 * @returns dueros详情
 */
export const detail = (id: string) => server.get(`/dueros/product/${id}`)

/**
 * 删除dueros
 * @param id duerosID
 * @returns 
 */
export const _delete = (id: string) => server.remove(`/dueros/product/${id}`)

/**
 * 启用dueros
 * @param id duerosID
 * @param data 
 * @returns 
 */
export const _deploy = (id: string) => server.post(`/dueros/product/${id}/_enable`)

/**
 * 禁用dueros
 * @param id duerosID
 * @param data 
 * @returns 
 */
export const _undeploy = (id: string) => server.post(`/dueros/product/${id}/_disable`)

