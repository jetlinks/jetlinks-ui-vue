import server from '@/utils/request';

// 更新全部菜单
export const updateMenus = (data: any) => server.path(`/menu/iot/_all`, data)
// 添加角色
export const addRole = (data: any) => server.post(`/role`, data)

//更新权限菜单
export const getRoleMenu = (id: string) => server.get(`/menu/role/${id}/_grant/tree`)

//更新权限菜单
export const updateRoleMenu = (id: string, data: any) => server.put(`/menu/role/${id}/_grant`, data)

// 记录初始化
export const saveInit = () => server.post(`/user/settings/init`,{ init: true },)

//获取初始化
export const getInit = () => server.get(`/user/settings/init`)

// 获取当前系统权限信息

export const getSystemPermission = () =>server.get(`/system/resources/permission`)

// 保存基础信息
 export const save = (data?: any) => server.post('/system/config/scope/_save',data)

 // 查询对应协议下的本地端口数据
  export const getResourcesCurrent = () => server.get('/network/resources/alive/_current')

// 保存网络组件
export const saveNetwork = (data: any) => server.post(`/network/config`, data)

// 保存协议
export const saveProtocol = () => server.post(`/protocol/default-protocol/_save`,)

// 新增设备接入网关
export const saveAccessConfig = (data: any) => server.post(`/gateway/device`, data)

// 新增产品
export const saveProduct = (data: any) => server.post(`/device/product`,data)

// 新增设备
export const saveDevice = (data: any) => server.post(`/device/instance`,data)

// 启用设备
export const deployDevice =  (deviceId: string, params?: any) => server.post(`/device-instance/${deviceId}/deploy`,params,)
export const changeDeploy= (id: string) => server.post(`/device-product/${id}/deploy`)

// 查询保存后的数据
export const detail = (data?: any) => server.post(`/system/config/scopes`, data)

// 获取协议
export const getProtocol = () =>server.get(`/protocol/_query/no-paging?paging=false`)

// 上传文件
