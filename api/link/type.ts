import { request } from '@jetlinks-web/core'

export const queryNetworkConfig = (params: object) =>
    request.post(`/network/config/_query`, params);

export const remove = (id: string) => request.remove(`/network/config/${id}`);

export const shutdown = (data: object) =>
    request.post(`/network/config/${data}/_shutdown`);

export const start = (data: object) =>
    request.post(`/network/config/${data}/_start`);

export const supports = () => request.get(`/network/config/supports`);

export const query = (data: Object) =>
    request.post(`/network/config/_query`, data);

export const providers = () => request.get(`/gateway/device/providers`);

export const resourcesCurrent = () =>
    request.get(`/network/resources/alive/_current`);

export const resourceClusters = () => request.get(`/network/resources/clusters`);

export const resourceClustersById = (id: string) =>
    request.get(`/network/resources/alive/${id}`);

export const allResources = () => request.get(`/network/resources/alive/_all`);

export const certificates = (data: any = {}) =>
    request.post(`/network/certificate/_query/no-paging?paging=false`, data);

export const save = (data: Object) => request.post(`/network/config`, data);

export const update = (data: Object) => request.patch(`/network/config`, data);

export const detail = (id: string) => request.get(`/network/config/${id}`);

/**
 * 获取TCP粘拆包TS资源
 */
export const getTs = () => request.get('/system/resources/ScriptPayloadParser.d.ts')
