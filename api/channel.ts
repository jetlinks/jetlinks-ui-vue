import {request} from '@jetlinks-web/core'

export const query = (data: any) =>
  request.post(`/data-collect/channel/_query`, data);

export const detail = (id: string) => request.get(`/data-collect/channel/${id}`)

export const queryChannelCount = (data: any) =>
  request.post(`/data-collect/channel/statistics`, data);

export const queryChannelNumber = (data: any) =>
  request.post(`/data-collect/channel/_count`, data);

export const queryChannelNoPaging = (data:any = {}) =>
  request.post(`/data-collect/channel/_query/no-paging`, {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
    ...data
  });

export const remove = (id: string) =>
  request.remove(`/data-collect/channel/${id}`);

export const save = (data: any) => request.post(`/data-collect/channel`, data);

export const update = (id: string, data: any) =>
  request.put(`/data-collect/channel/${id}`, data);

export const getProviders = () => request.get(`/data-collect/channel/providers`);

export const getResourceJson = (provider: string) => request.get(`/data-collect/${provider}/resource/_/script/editor.json`);
export const queryOptionsList = (type: string) =>
  request.get(`/data-collect/opc/${type}`);


export const queryCertificateList = () =>
  request.get(`/network/certificate/_query/no-paging?paging=false`, {});
