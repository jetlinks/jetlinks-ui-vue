import server from '@/utils/request';

export const getProviders = () => server.get(`/gateway/device/providers`);

export const detail = (id) => server.get(`/gateway/device/${id}`);

export const getNetworkList = (networkType, data, params) =>
    server.get(
        `/network/config/${networkType}/_alive?include=${params.include}`,
        data,
    );

export const getProtocolList = (transport, params) =>
    server.get(`/protocol/supports/${transport ? transport : ''}`, params);

export const getConfigView = (id, transport) =>
    server.get(`/protocol/${id}/transport/${transport}`);

export const getChildConfigView = (id) =>
    server.get(`/protocol/${id}/transports`);

export const save = (data) => server.post(`/gateway/device`, data);

export const update = (data) => server.patch(`/gateway/device`, data);

export const list = (data) =>
    server.post(`/gateway/device/detail/_query`, data);

export const undeploy = (id) => server.post(`/gateway/device/${id}/_shutdown`);

export const deploy = (id) => server.post(`/gateway/device/${id}/_startup`);

export const del = (id) => server.remove(`/gateway/device/${id}`);
