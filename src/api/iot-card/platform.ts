import server from '@/utils/request'

/**
 * 分页查询平台接入列表
 * @param data
 */
export const queryList = (data: any) => server.post(`/network/card/platform/_query`, data)

/**
 * 根据id查询详情
 * @param id
 */
export const queryById = (id: any) => server.get(`/network/card/platform/${id}`)

/**
 * 新增
 * @param data
 */
export const save = (data: any) => server.post(`/network/card/platform`, data)

/**
 * 编辑
 * @param data
 */
export const update = (data: any) => server.patch(`/network/card/platform`, data)

/**
 * 删除
 * @param id
 */
export const del = (id: string) => server.remove(`/network/card/platform/${id}`)