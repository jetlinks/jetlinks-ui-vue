import server from '@/utils/request';

/**
 * 分页查询AI模型资源
 */
export const queryPage = (data: any) => server.post('/entity/template/_query', data)

/**
 * 保存AI模型资源
 */
export const save = (data: any) => server.patch('/entity/template', data);

/**
 * 删除AI模型资源
 * @params id 模型id
 */
export const remove = (id: string) => server.remove(`/entity/template/${id}`);

/**
 * 更新AI模型资源
 * @params id 模型id
 * @params data 模型实体
 */
export const update = (id: string, data: any) => server.put(`/entity/template/${id}`, data);

/**
 * AI模型资源详情
 * @params id 模型id
 */
export const detail = (id: string) => server.get(`/entity/template/${id}`);
