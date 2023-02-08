import server from '@/utils/request';

// 获取关系配置列表
export const getRelationshipList_api = (data: object) => server.post(`/relation/_query/`, data);

// 获取关联方列表
export const getObjectList_api = () => server.get(`/relation/types`);
// 新增关系
export const addRelation_api = (data: object) => server.post(`/relation`, data);
// 保存关系
export const editRelation_api = (data: object) => server.patch(`/relation`, data);
// 删除关系
export const delRelation_api = (id: string) => server.remove(`/relation/${id}`);