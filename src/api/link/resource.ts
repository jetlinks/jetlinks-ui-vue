import server from '@/utils/request';

export const queryCollector = (data: any) =>
    server.post(`/data-collect/collector/_query`, data);

// 资源详情
export const detailResource = (id: string) => server.get(`/resources/instance/${id}/detail`)
//检查更新
export const checkUpdate = (id: string) => server.get(`/resources/library/${id}/check/update`)

//获取最新版本信息
export const _latest = (id: string) => server.get(`/resources/library/${id}/version/_latest`)

//应用资源受影响产品列表
export const _queryProduct = (id: string,data:any) => server.post(`resources/library/${id}/affected/product/_query`,data)
// export const _queryProductNoPaging = (id: string,data:any) => server.post(`resources/library/${id}/affected/product/_query/no-paging`,data)

//应用资源受影响采集器列表
export const _queryCollector = (id: string,data:any) => server.post(`resources/library/${id}/affected/collector/_query`,data)
//应用资源受协议影响的产品列表
export const _queryProtocol = (id: string,data:any) => server.post(`/resources/library/${id}/protocol/affected/product/_query`,data)

//应用资源协议列表
export const _queryProtocolResource = (id: string,data:any) => server.post(`/resources/library/${id}/affected/protocol/_query`,data)

//当前资源的最新版本协议列表
export const _queryProtocolNew = (id: string,data:any) => server.post(`/resources/library/${id}/protocol/current/_query`,data)