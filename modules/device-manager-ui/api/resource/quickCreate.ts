import { request } from "@jetlinks-web/core";

export const queryClassificationType = (data: any) => request.post('/resources/classification-type/_query/no-paging',data);

export const queryClassification = (data:any) => request.post('/resources/classification/_all/tree',data)

export const queryNetWorkConfig = (data:any) => request.get('/resources/library/config')

export const queryPluginConfiguration = (data:any) => request.post(`/plugin/driver/convert`,data)

export const queryProtocolConfiguration = (type:string,data:any) => request.post(`protocol/convert?transport=${type}`,data)

export const queryGB28181Configuration = () => request.get('/protocol/gb28181-2016/transports')

export const queryNetWork = (data: any) => request.post(`/network/config/_query/no-paging`, data);

export const queryProtocolDetail =(id:string) => request.get(`/protocol/${id}`)

export const quickCreateProduct = (data:any) => request.post('/resources/library/quick/product',data)

//查看平台网络可复用组件
export const queryAliveNetWork = (networkType:string) => request.get(`/network/config/${networkType}/_alive`)

//查询模板详情
export const queryTemplateDetail = (data:any) => request.post('/resources/instance/detail/_query',data)

//查询模版详情不分页
export const queryTemplate = (data:any) => request.post('resources/instance/_query/no-paging',data)



