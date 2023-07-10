import server from '@/utils/request';


// 获取应用管理列表
export const getApplyList_api = (data: any) => server.post(`/application/_query/`, data)
// 修改应用状态
export const changeApplyStatus_api = (id: string, data: any) => server.put(`/application/${id}`, data)
// 删除应用
export const delApply_api = (id: string) => server.remove(`/application/${id}`)

export const queryType = () => server.get(`/application/providers`)

// 获取组织列表
export const getDepartmentList_api = (params: any) => server.get(`/organization/_all/tree`, params);
// 获取应用详情
export const getAppInfo_api = (id: string) => server.get<any>(`/application/${id}`);
// 新增应用
export const addApp_api = (data: object) => server.post(`/application`, data);
// 更新应用
export const updateApp_api = (id: string, data: object) => server.put(`/application/${id}`, data);


// ---------集成菜单-----------

// 获取所属系统
export const getOwner_api = (data: object) => server.post(`/menu/owner`, data);
export const getOwnerStandalone_api = (appId: string, data: object) => server.post(`/application/${appId}/_/api/menu/owner`, data);

// 获取对应系统菜单树
export const getOwnerTree_api = (owner: string) => server.post(`/menu/owner/tree/${owner}`, {});
export const getOwnerTreeStandalone_api = (appId: string, owner: string) => server.post(`/application/${appId}/_/api/menu/owner/tree/${owner}`, {});
// 保存集成菜单
export const saveOwnerMenu_api = (owner: string, appId: string, data: object) => server.patch(`/menu/owner/${owner}/${appId}/_all`, data);
