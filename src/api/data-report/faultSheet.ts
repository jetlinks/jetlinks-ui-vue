import server from '@/utils/request';

export const queryFault = (data?: any) =>
    server.post(`/vehicle/fault/_query`, data);
