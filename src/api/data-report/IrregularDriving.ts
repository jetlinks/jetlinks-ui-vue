import server from '@/utils/request';

/**
 * ADAS查询
 * @param data 查询条件
 */
export const queryADAS = (data?: any) =>
    server.post(`/vehicle/adas/es/query`, data);
/**
 * ADAS导出
 * @param format 格式
 * @param data 数据
 */
export const adasExport = (format: string, data: any) =>
    server.postStream(`/vehicle/adas/es/${format}`, data);

/**
 * 震动异常查询
 * @param data 查询条件
 */
export const queryAbnormal = (data?: any) =>
    server.post(`/vehicle/vibration/es/query`, data);
/**
 * 震动异常导出
 * @param format 格式
 * @param data 数据
 */
export const abnormalExport = (format: string, data: any) =>
    server.postStream(`/vehicle/vibration/es/${format}`, data);

/**
 * 超速异常查询
 * @param data 查询条件
 */

export const querySpeed = (data?: any) =>
    server.post(`/vehicle/speed/es/query`, data);
/**
 * 超速异常导出
 * @param format 格式
 * @param data 数据
 */
export const speedExport = (format: string, data: any) =>
    server.postStream(`/vehicle/speed/es/${format}`, data);
/**
 * 超载异常查询
 * @param data 查询条件
 */
export const queryOverLoad = (data?: any) =>
    server.post(`/vehicle/load/es/query`, data);

/**
 * 超载异常导出
 * @param format 格式
 * @param data 数据
 */
export const overLoadExport = (format: string, data: any) =>
    server.postStream(`/vehicle/load/es/${format}`, data);

/**
 * DSM异常查询
 * @param data 查询条件
 */
export const queryDSM = (data?: any) =>
    server.post(`/vehicle/dsm/es/query`, data);

/**
 * 超载异常导出
 * @param format 格式
 * @param data 数据
 */
export const dsmExport = (format: string, data: any) =>
    server.postStream(`/vehicle/dsm/es/${format}`, data);
