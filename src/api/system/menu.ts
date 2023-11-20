import server from '@/utils/request';

// 获取当前用户可访问菜单
export const getMenuTree_api = (data: object) => server.post(`/menu/_all/tree`, data);

export const queryOwnThree = (data: any) => server.post<any>('/menu/user-own/tree', data)
/**
 * 校验编码唯一性
 * @param data 
 */
export const validCode_api = (data:object) => server.get(`/menu/code/_validate`,data);


// 获取资产类型
export const getAssetsType_api = () => server.get(`/asset/types`);
// 获取菜单详情
export const getMenuInfo_api = (id:string) => server.get(`/menu/${id}`);
// 编辑菜单信息
export const saveMenuInfo_api = (data: object) => server.patch(`/menu`, data);
// 新增菜单信息
export const addMenuInfo_api = (data: object) => server.post(`/menu`, data);
// 删除菜单信息
export const delMenuInfo_api = (id: string) => server.remove(`/menu/${id}`);
//查询集成菜单
export const queryApp = (data:any) => server.post('/application/_query/no-paging',data)