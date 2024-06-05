import server from '@/utils/request';

export const querySim = (data?: any) =>
    server.post(`/vehicle/network/_detail/_query`, data);

export const simDataExport = (format: string, data: any) =>
    server.postStream(`/vehicle/network/_export/data.${format}`, data);
