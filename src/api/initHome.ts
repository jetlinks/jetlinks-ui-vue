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

// 获取当前系统权限信息

export const getSystemPermission = () =>request.get(`/system/resources/permission`)

//更新权限菜单
export const updateRoleMenu = (id: string, data: any) => request.put(`/menu/role/${id}/_grant`, data)

// 添加角色
export const addRole = (data: any) => request.post(`/role`, data)

//更新权限菜单
export const getRoleMenu = (id: string) => request.get(`/menu/role/${id}/_grant/tree`)

//添加角色分组
export const addRoleGroup = (data:any) => request.patch('/role/group',data)

/**
 * 查询系统版本信息
 * @returns
 */
export const systemVersion = () => request.get(`/system/version`)

// export const getProviders = () => request.get(`/data-collect/channel/providers`);
export const queryModule = () => request.get(`/command-supports/service/collectorService:collector/commands`);

export const saveNetwork = (data: any) => request.post(`/network/config`, data)

// 保存协议
export const saveProtocol = () => request.post(`/protocol/default-protocol/_save`)

// 新增设备接入网关
export const saveAccessConfig = (data: any) => request.post(`/gateway/device`, data)

// 新增产品
export const saveProduct = (data: any) => request.post(`/device/product`,data)

// 新增设备
export const saveDevice = (data: any) => request.post(`/device/instance`,data)

// 启用设备
export const deployDevice =  (deviceId: string, params?: any) => request.post(`/device-instance/${deviceId}/deploy`,params,)
export const changeDeploy= (id: string) => request.post(`/device-product/${id}/deploy`)

// 获取协议
export const getProtocol = () => request.get(`/protocol/_query/no-paging?paging=false`)

// 查询对应协议下的本地端口数据
export const getResourcesCurrent = () => request.get('/network/resources/alive/_current')

