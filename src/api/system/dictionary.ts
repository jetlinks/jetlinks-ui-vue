import { request } from '@jetlinks-web/core'

/**
 * 查询字典列表
 */
export const getDicList = (data:any) => request.post('/dictionary/_query/no-paging',data)

/**
 * 查询字典分页
 */
export const getDic_page = (data:any) => request.post('/dictionary/_query',data)
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
export const deleteDictionary =(id:string) => request.remove(`/dictionary/${id}`)

/**
 * 查询字典项
 */
export const queryDicItem = (data:any)=>request.post('/dictionary-item/_query',data)

/**
 * 查询字典项不分页
 */
export const queryDicItemNoPage = (data:any) => request.post('/dictionary-item/_query/no-paging',data)

/**
 * 保存字典项
 */
export const saveDicItem = (data:any) => request.patch('/dictionary-item',data)

/**
 * 删除字典项
 */
export const deleteDicItem = (id:string) => request.remove(`/dictionary-item/${id}`)

/**
 * 校验字典项value唯一
 */
export const  verifyValue = (data:any) => request.post('/dictionary-item/_exists',data)

/**
 * 下载字典
 */
export const downDic = (data:any) => request.post('/dictionary/detail/_query',data)
