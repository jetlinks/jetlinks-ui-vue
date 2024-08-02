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
export const exportUnknownProtocol = (
    name: string,
    format: string,
    data: any,
) => server.postStream(`/vehicle/unknown/protocol/${name}.${format}`, data);

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
export const exportUnknownName = (name: string, format: string, data: any) =>
    server.postStream(`/vehicle/unknown/name/${name}.${format}`, data);
