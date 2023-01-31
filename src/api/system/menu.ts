import server from '@/utils/request';

// 获取当前用户可访问菜单
export const getMenuTree_api = (data: object) => server.post(`/menu/_all/tree`, data);

export const queryOwnThree = (data: any) => server.post<any>('/menu/user-own/tree', data)



// 获取资产类型
export const getAssetsType_api = () => server.get(`/asset/types`);
// 获取菜单详情
export const getMenuDetail_api = (id:string) => server.get(`/menu/${id}`);
