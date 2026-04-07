import { request } from '@jetlinks-web/core'
import {getBaseApi} from "@jetlinks-web-core/utils";

export const RESOURCE_UPLOAD = () => `${getBaseApi()}/resources/install/task/_upload`;

export const queryCollector = (data: any) =>
    request.post(`/data-collect/collector/_query`, data);

// 资源详情
export const detailResource = (id: string) => request.get(`/resources/instance/${id}/detail`)
//检查更新
export const checkUpdate = (id: string) => request.get(`/resources/library/${id}/check/update`)

//获取最新版本信息
export const _latest = (id: string) => request.get(`/resources/library/cloud/${id}`)

//应用资源受影响产品列表
export const _queryProduct = (id: string, data: any) => request.post(`resources/library/${id}/affected/product/_query`, data)
export const _queryProductNoPaging = (id: string,data:any) => request.post(`resources/library/${id}/affected/product/_query/no-paging`,data)

//应用资源受影响采集器列表
export const _queryCollector = (id: string, data: any) => request.post(`resources/library/${id}/affected/collector/_query`, data)
//应用资源受协议影响的产品列表
export const _queryProtocol = (id: string,type: string, data: any) => request.post(`/resources/library/${id}/${type}/affected/product/_query`, data)
export const _queryProtocolNoPag = (id: string, data: any) => request.post(`/resources/library/${id}/protocol/affected/product/_query/no-paging`, data)

//应用资源协议列表
export const _queryNowNoPaging = (id: string,type: string, data:any) => request.post(`/resources/library/${id}/affected/${type}/_query/no-paging`,data)

/**
 * 保存产品
 * @param data 产品信息
 * @returns
 */
export const saveProduct = (data: Record<string, unknown>) => request.patch('/device-product', data)

//更新协议
export const saveProtocol = (data: Object) => request.patch(`/protocol`, data);
// 更新插件
export const savePlugin = (data: Object) => request.patch('/plugin/driver', data)

//当前资源的最新版本协议列表
export const _queryNew = (id: string, type: string) => request.get(`/resources/library/${id}/${type}/current/_query`)

//获取云端我的资源信息
export const _queryResourceCloud = (data:any) => request.post('/resources/cloud',data)

//获取资源库信息
export const _queryTemplate = (data: any) => request.post('/resources/instance/detail/_query', data)

//获取资源库信息不分页接口
export const _queryTemplateNoPaging = (data: any) => request.post('/resources/instance/_query/no-paging', data)

//安装资源
export const installResource = (data: any) => request.post('/resources/install/task/_create', data)

// 查询任务列表
export const queryTaskListNoPaging = (data: any) => request.post('/resources/install/task/_query/no-paging', data)

// 开始任务
export const deployTask = (data: any) => request.post('/resources/install/task/_deploy', data)
// 删除全部/单个任务
export const delTask = (data: any) => request.post('/resources/install/task/_delete', data)
// 停止任务
export const stopTask = (data: any) => request.post('/resources/install/task/_stop', data)
/**
 * 类型查询
 * @param data
 */
const queryProvider = (data: any) => request.get(`/resources/classification/type/provider`, data)


/**
 * 分类树查询
 * @param data
 */
const queryClassify = (data: any) => request.post(`/resources/classification/_query/_children/tree`, data)
const queryClassifyType = (data: any) => request.post(`/resources/classification-type/_query/no-paging`, data)

export const ResourceApi = {
    queryProvider,
    queryClassify,
    queryClassifyType,
}
