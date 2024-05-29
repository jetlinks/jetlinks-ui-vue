import server, {request} from '@/utils/request';

export const queryAlarmData = (data?: any) =>
    server.post(`/vehicle/alarm/es/query`, data);

export const _export = (format: string, data: any) => server.postStream(`/vehicle/alarm/es/${format}`, data);
