import server from '@/utils/request';
/**
 * 获取所有的关系对象类型
 */
export const queryTypes = () => server.get('/relation/types')

/**
 * 查询关系
 */
export const queryRelation = (data:any) => server.post('/relation/_query',data)