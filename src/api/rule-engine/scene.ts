import server from '@/utils/request';


export const modify = (id: string, data: any) => server.put(`/scene/${id}`, data)

export const save = (data: any) => server.post(`/scene`, data)

export const detail = (id: string) => server.get(`/scene/${id}`)

export const query = (data: any) => server.post('/scene/_query/',data);

export const queryBranch = (data: any, id: string) => server.post(`/scene/branch/query?alarmId=${id}`,data);

export const _delete = (id: string) => server.remove(`/scene/${id}/`);

export const _action = (id: string, type: '_disable' | '_enable') => server.put(`/scene/${id}/${type}`);

/**
 * 手动触发
 * @param id
 * @returns
 */
export const _execute = (id: string) => server.post(`/scene/${id}/_execute`);

// 内置参数
export const queryBuiltInParams = (data: any, params?: any) => server.post(`/scene/parse-variables`, data, params);

export const getParseTerm = (data: Record<string, any>) => server.post(`/scene/parse-term-column`, data)

export const queryAlarmPage = (data: Record<string, any>) => server.post(`/alarm/config/_query`, data)

export const queryAlarmList = (data: Record<string, any>) => server.post(`/alarm/config/_query/no-paging`, data)
export const queryAlarmCount = (data: Record<string, any>) => server.post(`/alarm/config/_count`, data)
