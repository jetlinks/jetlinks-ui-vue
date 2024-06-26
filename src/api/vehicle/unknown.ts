import server from '@/utils/request';

/**
 * 协议解析异常
 * @param params
 * @returns
 */
export const queryUnknownProtocol = (params: any) =>
    server.post(`/vehicle/unknown/protocol`, params);

/**
 * 协议解析异常导出
 * @string format
 * @param params
 * @returns
 */
export const exportUnknownProtocol = (format: string, data: any) =>
    server.post(`/vehicle/unknown/protocol/${format}`, data);

/**
 * 设备命名异常
 * @param params
 * @returns
 */
export const queryUnknownName = (params: any) =>
    server.post(`/vehicle/unknown/name`, params);

/**
 * 设备命名异常导出
 * @string format
 * @param params
 * @returns
 */
export const exportUnknownName = (format: string, data: any) =>
    server.post(`/vehicle/unknown/name/${format}`, data);
