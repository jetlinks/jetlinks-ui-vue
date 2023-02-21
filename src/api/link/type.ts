import server from '@/utils/request';

export const queryNetworkConfig = (params: object) =>
    server.post(`/network/config/_query`, params);

export const remove = (id: string) => server.remove(`/network/config/${id}`);

export const shutdown = (data: object) =>
    server.post(`/network/config/${data}/_shutdown`);

export const start = (data: object) =>
    server.post(`/network/config/${data}/_start`);

export const supports = () => server.get(`/network/config/supports`);

export const query = (data: Object) =>
    server.post(`/network/config/_query`, data);

export const providers = () => server.get(`/gateway/device/providers`);

export const resourcesCurrent = () =>
    server.get(`/network/resources/alive/_current`);

export const resourceClusters = () => server.get(`network/resources/clusters`);

export const resourceClustersById = (id: string) =>
    server.get(`/network/resources/alive/${id}`);

export const allResources = () => server.get(`/network/resources/alive/_all`);

export const certificates = () =>
    server.get(`/network/certificate/_query/no-paging?paging=false`);

export const save = (data: Object) => server.post(`/network/config`, data);

export const update = (data: Object) => server.patch(`/network/config`, data);

export const detail = (id: string) => server.get(`/network/config/${id}`);
