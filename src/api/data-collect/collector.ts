import server from '@/utils/request';

export const queryCollector = (data: any) =>
    server.post(`/data-collect/collector/_query/no-paging?paging=false`, data);

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
        `/data-collect/opc/channel/${data.id}/nodes?nodeId=${
            data?.nodeId || ''
        }`,
    );

export const queryTypeList = () => server.get(`/data-collect/opc/data-types`);

