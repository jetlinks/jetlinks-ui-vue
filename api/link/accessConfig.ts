import { request } from '@jetlinks-web/core'
export const getProviders = () => request.get(`/gateway/device/providers`);

export const detail = (id: string) => request.get(`/gateway/device/${id}`);

export const getNetworkList = (
    networkType: string,
    include: string,
    data: Object,
) =>
    request.get(
        `/network/config/${networkType}/_alive?include=${include}`,
        data,
    );

/**
 * 查询多类型的网络组件列表接口
 */
export const getNetworkComponentList = (data: Record<string, any>, include: Object) =>
    request.post(`/network/config/_alive?include=${include}`, data);

export const getProtocolList = (transport: string, params: Object) =>
    request.get(`/protocol/supports/${transport ? transport : ''}`, params);

export const getConfigView = (id: string, transport: string) =>
    request.get(`/protocol/${id}/transport/${transport}`);

export const getChildConfigView = (id: string) =>
    request.get(`/protocol/${id}/transports`);

export const save = (data: Object) => request.post(`/gateway/device`, data);

export const update = (data: Object) => request.patch(`/gateway/device`, data);

export const list = (data: Object) =>
    request.post(`/gateway/device/detail/_query`, data);

export const undeploy = (id: string) =>
    request.post(`/gateway/device/${id}/_shutdown`);

export const deploy = (id: string) =>
    request.post(`/gateway/device/${id}/_startup`);

export const remove = (id: string) => request.remove(`/gateway/device/${id}`);

export const getResourcesCurrent = () =>
    request.get(`/network/resources/alive/_current`);

export const getClusters = () =>
    request.get(`/network/resources/clusters`);

export const getPluginList = (data: any) => request.post('/plugin/driver/_query/no-paging', data)

export const getPluginConfig = (id: string) => request.get(`/plugin/driver/${id}/description`)

export const getCommandsByAccess = (id: string) => request.get(`/gateway/device/${id}/commands`)

export const getCommandsDevicesByAccessId = (id: string, data: any) => request.post(`/gateway/device/${id}/command/QueryDevicePage`, data)

/**
 * 复合网关-获取已选择的接入网关的详情
 * @param data 复合网关配置中的gateways数组
 */
export const getCompositeProviderDetail = (data: any[]) => request.post(`/gateway/device/detail/config`, data)
