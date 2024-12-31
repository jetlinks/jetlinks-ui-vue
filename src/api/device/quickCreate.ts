import server from '@/utils/request'

export const queryClassificationType = () => server.post('/resources/classification-type/_query/no-paging');

export const queryClassification = (data:any) => server.post('/resources/classification/_all/tree',data)

export const queryNetWorkConfig = (data:any) => server.get('/resources/library/config')

export const queryPluginConfiguration = (data:any) => server.post(`/plugin/driver/convert`,data)

export const queryProtocolConfiguration = (type:string,data:any) => server.post(`protocol/convert?transport=${type}`,data)

export const queryGB28181Configuration = () => server.get('/protocol/fixed-media/transports')

export const queryNetWork = (data: any) => server.post(`/network/config/_query/no-paging`, data);

export const queryProtocolDetail =(id:string) => server.get(`/protocol/${id}`)

export const quickCreateProduct = (data:any) => server.post('/resources/library/quick/product',data)

//查看平台网络可复用组件
export const queryAliveNetWork = (networkType:string) => server.get(`/network/config/${networkType}/_alive`)



