
// 保存网络组件
import {request} from "@jetlinks-web/core";

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
