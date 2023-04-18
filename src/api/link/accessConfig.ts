import server from '@/utils/request';

export const getProviders = () => server.get(`/gateway/device/providers`);

export const detail = (id: string) => server.get(`/gateway/device/${id}`);

export const getNetworkList = (
    networkType: string,
    include: string,
    data: Object,
) =>
    server.get(
        `/network/config/${networkType}/_alive?include=${include}`,
        data,
    );

export const getProtocolList = (transport: string, params: Object) =>
    server.get(`/protocol/supports/${transport ? transport : ''}`, params);

export const getConfigView = (id: string, transport: string) =>
    server.get(`/protocol/${id}/transport/${transport}`);

export const getChildConfigView = (id: string) =>
    server.get(`/protocol/${id}/transports`);

export const save = (data: Object) => server.post(`/gateway/device`, data);

export const update = (data: Object) => server.patch(`/gateway/device`, data);

export const list = (data: Object) =>
    server.post(`/gateway/device/detail/_query`, data);

export const undeploy = (id: string) =>
    server.post(`/gateway/device/${id}/_shutdown`);

export const deploy = (id: string) =>
    server.post(`/gateway/device/${id}/_startup`);

export const remove = (id: string) => server.remove(`/gateway/device/${id}`);

export const getResourcesCurrent = () =>
    server.get(`/network/resources/alive/_current`);

export const getClusters = () =>
    server.get(`network/resources/clusters`);

export const getPluginList = (data: any) => server.post('/plugin/driver/_query/no-paging', data)

export const getPluginConfig = (id: string) => server.get(`/plugin/driver/${id}/description`)
