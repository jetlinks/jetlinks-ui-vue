import { request } from '@jetlinks-web/core'

export const save = (data: Object) => request.post(`/protocol`, data);

export const update = (data: Object) => request.patch(`/protocol`, data);

export const list = (data: Object) => request.post(`/protocol/_query`, data);

export const remove = (id: string) => request.remove(`/protocol/${id}`);

export const querySystemApi = (data: Object) =>
    request.post(`/system/config/scopes`, data);
