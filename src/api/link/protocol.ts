import server from '@/utils/request';
import { BASE_API_PATH } from '@/utils/variable';

export const PROTOCOL_UPLOAD = `${BASE_API_PATH}/file/upload`;

export const detail = (id: string) => server.get(`/gateway/device/${id}`);

export const save = (data: Object) => server.post(`/gateway/device`, data);

export const update = (data: Object) => server.patch(`/gateway/device`, data);

export const list = (data: Object) => server.post(`/protocol/_query`, data);

export const remove = (id: string) => server.remove(`/gateway/device/${id}`);

export const querySystemApi = (data: Object) =>
    server.post(`/system/config/scopes`, data);
