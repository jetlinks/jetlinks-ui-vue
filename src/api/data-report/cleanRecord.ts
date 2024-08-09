import server from '@/utils/request';

/**
 * 数据清洗中心查询
 * @param data
 * @returns
 */
export const queryClear = (data: any) =>
    server.post(`/vehicle/device/_query/clear`, data);

/**
 * 数据清洗导出
 * @param format 类型
 * @param data  数据
 * @returns
 */
export const _export = (format: string, data: any) =>
    server.postStream(`/vehicle/device/clear/${format}`, data);
