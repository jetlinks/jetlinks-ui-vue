import server from '@/utils/request';

// 获取当前用户可访问菜单
export const getMenuTree_api = (data: object) => server.post(`/menu/_all/tree`, data);

export const queryOwnThree = (data: any) => server.post<any>('/menu/user-own/tree', data)



// 获取资产类型
export const getAssetsType_api = () => server.get(`/asset/types`);
// 获取菜单详情
export const getMenuInfo_api = (id:string) => server.get(`/menu/${id}`);
// 编辑菜单信息
export const saveMenuInfo_api = (data: object) => server.patch(`/menu`, data);
// 新增菜单信息
export const addMenuInfo_api = (data: object) => server.post(`/menu`, data);