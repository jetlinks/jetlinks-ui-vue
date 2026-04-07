// 产品分类
import { request } from '@jetlinks-web/core'
import type { CategoryItem } from '../views/device/Category/typings'
/**
 * 查询产品分类树形数据
 */

export const queryTree = (params?: Record<string, any>) => request.post<CategoryItem>('/device/category/_tree', params)

/**
 * 保存树形数据
 */
 export const saveTree = (data: any) => request.post('/device/category', data)


 /**
  * 根据Id修改
  */
 export const updateTree = (id:string,data: any,) => request.put(`/device/category/${id}`, data)

 /**
  * 根据Id删除数据
  */

 export const deleteTree = (id:string) => request.remove(`/device/category/${id}`)
