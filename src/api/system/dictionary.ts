import server, { request } from '@/utils/request';

/**
 * 查询字典列表
 */
export const getDicList = (data:any) => request.post('/dictionary/_query/no-paging',data)

/**
 * 查询字典ID是否重复
 */
export const verifyId = (id:string) => request.post(`/dictionary/_exists`,{where:`id is ${id}`})

/**
 * 保存字典
 */
export const addDictionary = (data:any) => request.patch('/dictionary',data)

/**
 * 删除字典
 */
export const deleteDictionary =(id:string) => request.delete(`/dictionary/${id}`)