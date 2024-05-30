import server from '@/utils/request';

/**
 * @function queryFaultData 分页查询数据
 * @param data
 */
export const queryFaultData = (data?: any) =>
    server.post(`/vehicle/fault/es/query`, data);

export const faultDataExport = (format: string, data: any) =>
    server.postStream(`/vehicle/fault/es/${format}`, data);
