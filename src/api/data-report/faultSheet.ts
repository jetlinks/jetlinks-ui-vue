import server from '@/utils/request';

export const queryFaultData = (data?: any) =>
    server.post(`/vehicle/fault/es/query`, data);
