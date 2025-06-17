import {request} from '@jetlinks-web/core';


// 获取应用管理列表
export const getApplyList_api = (data: any) => request.post(`/application/_query/`, data)
// 修改应用状态
export const changeApplyStatus_api = (id: string, data: any) => request.put(`/application/${id}`, data)
// 删除应用
export const delApply_api = (id: string) => request.remove(`/application/${id}`)

export const queryType = () => request.get(`/application/providers`)

// 获取组织列表
export const getDepartmentList_api = (params: any) => request.get(`/organization/_all/tree`, params);
// 获取应用详情
export const getAppInfo_api = (id: string) => request.get<any>(`/application/${id}`);
// 新增应用
export const addApp_api = (data: object) => request.post(`/application`, data);
// 更新应用
export const updateApp_api = (id: string, data: object) => request.put(`/application/${id}`, data);


// ---------集成菜单-----------

// 获取所属系统
export const getOwner_api = (data: object) => request.post(`/menu/owner`, data);
export const getOwnerStandalone_api = (appId: string, data: object) => request.post(`/application/${appId}/_/api/menu/owner`, data);

// 获取对应系统菜单树
export const getOwnerTree_api = (owner: string) => request.post(`/menu/owner/tree/${owner}`, {});
export const getOwnerTreeStandalone_api = (appId: string, owner: string) => request.post(`/application/${appId}/_/api/menu/owner/tree/${owner}`, {});
// 保存集成菜单
export const saveOwnerMenu_api = (owner: string, appId: string, data: object) => request.patch(`/menu/owner/${owner}/${appId}/_all`, data);

// 获取第三方单点登录授权类型
export const getThirdPartyType = () => request.get<any>(`/dictionary/third-sso-type/items`);
