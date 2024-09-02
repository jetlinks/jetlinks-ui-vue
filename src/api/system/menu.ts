import { request } from '@jetlinks-web/core'

/**
 * 获取当前用户可访问菜单
 * @param data 
 * @returns 
 */
export const getMenuTree = (data: any) => request.post(`/menu/_all/tree`, data);

/**
 * 获取当前用户可访问菜单 包含权限
 * @param data 
 * @returns 
 */
export const getOwnMenuThree = (data: any) => request.post<any>('/menu/user-own/tree', data)
/**
 * 校验编码唯一性
 * @param data 
 */
export const validMenuCode = (data: any) => request.get(`/menu/code/_validate`,data);

/**
 * 获取资产类型
 * @returns 
 */
export const getAssetsType = () => request.get(`/asset/types`);

/**
 * 获取菜单详情
 * @returns 
 */
export const getMenuInfo = (id: string) => request.get(`/menu/${id}`);

/**
 * 编辑菜单信息
 * @returns 
 */
export const updateMenu = (data: any) => request.patch(`/menu`, data);

/**
 * 新增菜单信息
 * @returns 
 */
export const addMenu = (data: any) => request.post(`/menu`, data);

/**
 * 删除菜单信息
 * @returns 
 */
export const delMenu = (id: string) => request.remove(`/menu/${id}`);
