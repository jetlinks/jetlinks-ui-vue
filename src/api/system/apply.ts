import server from '@/utils/request';


// 获取应用管理列表
export const getApplyList_api = (data: any) => server.post(`/application/_query/`, data)
// 修改应用状态
export const changeApplyStatus_api = (id:string,data: any) => server.put(`/application/${id}`, data)
// 删除应用
export const delApply_api = (id:string) => server.remove(`/application/${id}`)



// 获取组织列表
export const getDepartmentList_api = () => server.get(`/organization/_all/tree`);