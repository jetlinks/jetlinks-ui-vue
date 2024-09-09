import server from '@/utils/request';

export const queryCollector = (data: any) =>
    server.post(`/data-collect/collector/_query/no-paging?paging=false`, data);

export const queryCollectorTree = (data: any) =>
    server.post(`/data-collect/collector/_detail/no-paging?paging=false`, data);

export const queryChannelNoPaging = () =>
    server.post(`/data-collect/channel/_query/no-paging`, {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
    });

export const save = (data: any) => server.post(`/data-collect/collector`, data);

export const update = (id: string, data: any) =>
    server.put(`/data-collect/collector/${id}`, data);

export const remove = (id: string) =>
    server.remove(`/data-collect/collector/${id}`);

export const queryPoint = (data: any) =>
    server.post(`/data-collect/point/_query`, data);

export const _validateField = (id: string, data?: any) =>
    server.get(`/data-collect/point/${id}/_validate`, data);

export const queryCodecProvider = () => server.get(`/things/collector/codecs`);

export const updatePoint = (id: string, data: any) =>
    server.put(`/data-collect/point/${id}`, data);

export const savePointBatch = (data: any) =>
    server.patch(`/data-collect/point`, data);

export const savePoint = (data: any) =>
    server.post(`/data-collect/point`, data);

export const batchDeletePoint = (data: any) =>
    server.post(`/data-collect/point/batch/_delete`, data);

export const removePoint = (id: string) =>
    server.remove(`/data-collect/point/${id}`);

export const readPoint = (collectorId: string, data: string[]) =>
    server.post(`/data-collect/collector/${collectorId}/points/_read`, data);

export const writePoint = (collectorId: string, data: string[]) =>
    server.post(`/data-collect/collector/${collectorId}/points/_write`, data);

export const queryPointNoPaging = (data: any) =>
    server.post(`/data-collect/point/_query/no-paging`, data);

export const scanOpcUAList = (data: any) =>
    server.get(
        `/data-collect/opc/channel/${data.id}/nodes?nodeId=${data?.nodeId || ''
        }`,
    );

export const queryTypeList = () => server.get(`/data-collect/opc/data-types`);

export const getProviders = () => server.get('/data-collect/channel/gateway/codec/providers')

export const getStates = () => server.get('/dictionary/running-state/items')

export const getSnapTypes = () => server.get('/s7/client/s7codecs/list')

export const getArea = () => server.get('/s7/client/s7area/list')

export const exportTemplate = (provider: string, format: string) =>server.get(`/data-collect/point/${provider}/template.${format}`, {}, {responseType: 'blob'})

/**
 * BACNet协议扫描对象
 * @param channelId 通道id
 * @param instanceNumber 设备实例号
 */
export const getBacnetObjectList = (channelId: string, instanceNumber: string) => server.get(`/collect/bacnet/${channelId}/${instanceNumber}/objects`);

/**
 * 查询未使用的属性id
 * @param data 采集器Id
 */
export const getBacnetPropertyIdNotUse = (data: any) => server.post(`/collect/bacnet/${data.collectorId}/unused/ids`, data)

// /**
//  * 查询所有属性id
//  */
// export const getBacnetAllPropertyId = () => server.get('/collect/bacnet/property/ids')

/**查询bacnet值类型*/
export const getBacnetValueType = () => server.get(`/collect/bacnet/value/types`)

/**
 * 导出点位数据
 */
export const exportPoint = (collectorId:string,provider:string) => server.get(`/data-collect/point/${collectorId}/${provider}/export.xlsx`, {}, {responseType: 'blob'})