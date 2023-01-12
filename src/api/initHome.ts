import server from '@/utils/request';

// 更新全部菜单
export const updateMenus = (data: any) => server
// 添加角色
export const addRole = (data: any) => server.post(`/role`)

//更新权限菜单
export const getRoleMenu = (id: string) => server.get(`/menu/role/${id}/_grant/tree`)

//更新权限菜单
export const updateRoleMenu = (id: string, data: any) => server.put(`/menu/role/${id}/_grant`)

// 记录初始化
export const saveInit = () => server.post(`/user/settings/init`,{ init: true },)

//获取初始化
export const getInit = () => server.get(`/user/settings/init`)

// 获取当前系统权限信息

export const getSystemPermission = () =>server.get(`/system/resources/permission`)

// 保存基础信息
 export const save = (data?: any) => server.post('/system/config/scope/_save')