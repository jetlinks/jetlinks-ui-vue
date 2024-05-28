import server, {request} from '@/utils/request';

export const queryAlarmSheet = (data?: any) =>
    server.post(`/vehicle/alarm/_query`, data);

export const getDicList = (data?: any) =>
    server.post(`/dictionary-item/_query`, data);

export const _export = (format: string, data: any) => server.postStream(`/vehicle/alarm/es/${format}`, data);