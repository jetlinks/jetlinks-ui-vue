import server from '@/utils/request';


export const save = (data: object) => server.post(`/media/server`, data);

export const update = (data: object) => server.patch(`/media/server`, data);

export const query = (data: object) => server.post(`/media/server/_query`, data);

export const queryDetail = (id: string) => server.get(`/media/server/${id}`);

export const remove = (id: string) => server.remove(`/media/server/${id}`);

export const queryProviders = () => server.get(`/media/server/providers`);

export const enalbe = (id: string) => server.post(`/media/server/${id}/_enable`);

export const disable = (id: string) => server.post(`/media/server/${id}/_disable`);



