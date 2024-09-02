import { request } from '@jetlinks-web/core'

// 获取权限列表
export const getPermission_api = (data: any) => request.post(`/permission/_query/`, data);
// 新增时校验标识id是否可用
export const checkId_api = (data: any) => request.get(`/permission/id/_validate`, data);
// 修改权限 | 导入文件内容
export const editPermission_api = (data: any) => request.patch(`/permission`, data);
// 添加权限
export const addPermission_api = (data: any) => request.post(`/permission`, data);
// 删除权限
export const delPermission_api = (id: string) => request.remove(`/permission/${id}`);

// 导出权限数据
export const exportPermission_api = (data: any) => request.post(`/permission/_query/no-paging`, data);
