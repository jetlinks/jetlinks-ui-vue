// 产品分类
import server from '@/utils/request'
import { CategoryItem } from '@/views/device/Category/typings'
/**
 * 查询产品分类树形数据
 */
 
export const queryTree = (params?: Record<string, any>) => server.post<CategoryItem>('/device/category/_tree', params)

/**
 * 保存树形数据
 */
 export const saveTree = (data: any) =>server.post('/device/category', data)
 

 /**
  * 根据Id修改
  */
 export const updateTree = (data: any, id:string) => server.put(`/device/category/${id}`, data)

 /**
  * 根据Id删除数据
  */
  
 export const deleteTree = (id:string) => server.remove(`/device/category/${id}`)