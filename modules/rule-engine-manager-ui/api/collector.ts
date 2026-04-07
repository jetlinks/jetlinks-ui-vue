import { request } from '@jetlinks-web/core'

export const queryCollector = (data: any) =>
  request.post(`/data-collect/collector/_detail`, data);

export const queryCollectorNoPaging = (data:any) =>
  request.post(`/data-collect/collector/_query/no-paging?paging=false`,data)

export const queryCollectorDevice = (data:any) =>
  request.post(`/data-collect/collector/_query`,data)

export const queryCollectorById = (id: string) => request.get(`/data-collect/collector/${id}/_detail`);

export const queryEntityTemplate = (data: any) =>
  request.post(`/entity/template/_query`, data);

export const queryCollectorCopy = (collectorId: string, data: any) =>
  request.post(`/data-collect/collector/${collectorId}/_copy`, data);

export const queryCollectorTree = (data: any) =>
  request.post(`/data-collect/collector/_detail/no-paging?paging=false`, data);

export const queryChannelNoPaging = () =>
  request.post(`/data-collect/channel/_query/no-paging`, {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
  });
export const queryCollectorCount = (data: any) =>
  request.post(`/data-collect/collector/statistics`, data);

export const queryCollectorNumber = (data: any) =>
  request.post(`/data-collect/collector/_count`, data);

export const queryPointCount = (data: any) =>
  request.post(`/data-collect/point/statistics`, data);

export const save = (data: any) => request.post(`/data-collect/collector`, data);

export const saveByTemplate = (data: any) => request.post(`/data-collect/collector/with-points`, data);

export const update = (id: string, data: any) =>
  request.put(`/data-collect/collector/${id}`, data);

export const remove = (id: string) =>
  request.remove(`/data-collect/collector/${id}`);

export const queryPoint = (data: any) =>
  request.post(`/data-collect/point/_query`, data);

export const queryPointsNoPaging = (data:any) =>
  request.post('/data-collect/point/_query/no-paging',data)

export const _validateField = (id: string, data?: any) =>
  request.get(`/data-collect/point/${id}/_validate`, data);

export const queryCodecProvider = () => request.get(`/things/collector/codecs`);

export const updatePoint = (id: string, data: any) =>
  request.put(`/data-collect/point/${id}`, data);

export const savePointBatch = (data: any) =>
  request.patch(`/data-collect/point`, data);

export const savePoint = (data: any) =>
  request.post(`/data-collect/point`, data);

export const batchDeletePoint = (data: any) =>
  request.post(`/data-collect/point/batch/_delete`, data);

export const removePoint = (id: string) =>
  request.remove(`/data-collect/point/${id}`);

export const readPoint = (collectorId: string, data: string[]) =>
  request.post(`/data-collect/collector/${collectorId}/points/_read`, data);

export const writePoint = (collectorId: string, data: string[]) =>
  request.post(`/data-collect/collector/${collectorId}/points/_write`, data);

export const queryPointNoPaging = (data: any) =>
  request.post(`/data-collect/point/_query/no-paging`, data);

export const queryPointNoPagingV2 = (data: any) => 
  request.post(`/data-collect/point/convert/_query/no-paging`, data)

export const scanOpcUAList = (data: any) =>
  request.get(
    `/data-collect/opc/channel/${data.id}/nodes?nodeId=${data?.nodeId || ''
    }`,
  );

export const scanList = (id:string, command: string, data:any)=> request.post(`/data-collect/channel:${id}/command/${command}`,data);

export const queryTypeList = () => request.get(`/data-collect/opc/data-types`);

export const getProviders = () => request.get('/data-collect/channel/gateway/codec/providers')

export const getStates = () => request.get('/dictionary/running-state/items')

export const getSnapTypes = () => request.get('/s7/client/s7codecs/list')

export const getArea = () => request.get('/s7/client/s7area/list')

export const exportTemplate = (provider: string, format: string) =>request.get(`/data-collect/point/${provider}/template.${format}`, {}, {responseType: 'blob'})

/**
 * BACNet协议扫描对象
 * @param channelId 通道id
 * @param instanceNumber 设备实例号
 */
export const getBacnetObjectList = (channelId: string, instanceNumber: string) => request.get(`/collect/bacnet/${channelId}/${instanceNumber}/objects`);

/**
 * 查询未使用的属性id
 * @param data 采集器Id
 */
// export const getBacnetPropertyIdNotUse = (data: any) => request.post(`/collect/bacnet/${data.collectorId}/unused/ids`, data)
export const getBacnetPropertyIdNotUse = (data: any) => request.post(`/data-collect/BACNetIp/command/QueryUnusedPropertyIds`, data)

/**查询bacnet值类型*/
export const getBacnetValueType = () => request.post(`/data-collect/BACNetIp/command/QueryValueTypes`, {})
/**opc查询类型*/
export const getOpcValueType = () => request.post(`/data-collect/OPC_UA/command/OpcUaType`, {})

/**
 * 导出点位数据
 */
export const exportPoint = (collectorId:string,provider:string) => request.get(`/data-collect/point/${collectorId}/${provider}/export.xlsx`, {}, {responseType: 'blob'})

export const getFunction = () => request.get('/dictionary/streaming-agg-type/items')

