import server from '@/utils/request';

export const queryAlarm = (data?: any) =>
    server.post(`/vehicle/alarm/_query`, data);
