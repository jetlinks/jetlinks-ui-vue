import { request } from '@jetlinks-web/core'

// 更新全部菜单
export const updateMenus = (data: any) => request.patch(`/menu/iot/_all`, data)


// 记录初始化
export const saveInit = () => request.post(`/user/settings/init`,{ init: true },)

//获取初始化
export const getInit = () => request.get(`/user/settings/init`)

// 保存基础信息
 export const save = (data?: any) => request.post('/system/config/scope/_save',data)

// 查询保存后的数据
export const detail = (data?: any) => request.post(`/system/config/scopes`, data)
