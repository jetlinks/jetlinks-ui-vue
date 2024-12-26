import server from '@/utils/request';

export const queryCollector = (data: any) =>
    server.post(`/data-collect/collector/_query`, data);

// 资源详情
export const detailResource = (id: string) => server.get(`/resources/instance/${id}/detail`)
//检查更新
export const checkUpdate = (id: string) => server.get(`/resources/library/${id}/check/update`)

//获取最新版本信息
export const _latest = (id: string) => server.get(`/resources/library/cloud/${id}`)

//应用资源受影响产品列表
export const _queryProduct = (id: string, data: any) => server.post(`resources/library/${id}/affected/product/_query`, data)
// export const _queryProductNoPaging = (id: string,data:any) => server.post(`resources/library/${id}/affected/product/_query/no-paging`,data)

//应用资源受影响采集器列表
export const _queryCollector = (id: string, data: any) => server.post(`resources/library/${id}/affected/collector/_query`, data)
//应用资源受协议影响的产品列表
export const _queryProtocol = (id: string, data: any) => server.post(`/resources/library/${id}/protocol/affected/product/_query`, data)

//应用资源协议列表
export const _queryProtocolNow = (id: string,data:any) => server.post(`/resources/library/${id}/affected/protocol/_query`,data)

// //当前资源的最新版本协议列表
// export const _queryProtocolNew = (id: string,data:any) => server.post(`/resources/library/${id}/protocol/current/_query`,data)

/**
 * 保存产品
 * @param data 产品信息
 * @returns
 */
export const saveProduct = (data: Record<string, unknown>) => server.patch('/device-product', data)

//更新协议
export const saveProtocol = (data: Object) => server.patch(`/protocol`, data);
export const _queryProtocolResource = (id: string, data: any) => server.post(`/resources/library/${id}/affected/protocol/_query`, data)

//当前资源的最新版本协议列表
export const _queryProtocolNew = (id: string, data: any) => server.post(`/resources/library/${id}/protocol/current/_query`, data)

//获取云端我的资源信息
export const _queryResourceCloud = () => server.get('/resources/cloud')

//获取资源库信息
export const _queryTemplate = (data: any) => server.post('/resources/instance/detail/_query', data)

//获取资源库信息不分页接口
export const _queryTemplateNoPaging = (data: any) => server.post('/resources/instance/_query/no-paging', data)

//安装资源
export const installResource = (data: any) => server.post('/resources/install/task/_create', data)

// 查询任务列表
export const queryTaskListNoPaging = (data: any) => server.post('/resources/install/task/_query/no-paging', data)

// 开始任务
export const deployTask = (data: any) => server.post('/resources/install/task/_deploy', data)
// 删除全部/单个任务
export const delTask = (data: any) => server.post('/resources/install/task/_delete', data)
// 停止任务
export const stopTask = (data: any) => server.post('/resources/install/task/_stop', data)
/**
 * 类型查询
 * @param data
 */
const queryProvider = (data: any) => server.get(`/resources/center/type/provider`, data)

/**
 * 分类树查询
 * @param data
 */
const queryClassify = (data: any) => server.post(`/resources/center/_query/_children/tree`, data)
const queryClassifyType = (data: any) => server.post(`/resources/center/classification-type/_query`, data)

export const ResourceApi = {
    queryProvider,
    queryClassify,
    queryClassifyType,
}
