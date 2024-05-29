import server, { request } from '@/utils/request';

export const queryAlarmData = (data?: any) =>
    server.post(`/vehicle/alarm/es/query`, data);
