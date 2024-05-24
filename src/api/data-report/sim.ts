import server from '@/utils/request';

export const querySim = (data?: any) =>
    server.post(`/vehicle/network/_query`, data);
