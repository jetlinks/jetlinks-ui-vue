import { request } from '@jetlinks-web/core'

// 获取关系配置列表
export const getRelationshipList_api = (data: object) => request.post(`/relation/_query/`, data);

// 获取关联方列表
export const getObjectList_api = () => request.get(`/relation/types`);
// 新增关系
export const addRelation_api = (data: object) => request.post(`/relation`, data);
// 保存关系
export const editRelation_api = (data: object) => request.patch(`/relation`, data);
// 删除关系
export const delRelation_api = (id: string) => request.remove(`/relation/${id}`);

// 验证标识唯一性
export const validateField = (params: any) => request.get<any>(`/relation/_validate`, params);