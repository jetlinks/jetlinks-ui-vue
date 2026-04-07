import { request } from '@jetlinks-web/core';


export const modify = (id: string, data: any) => request.put(`/scene/${id}`, data)

export const save = (data: any) => request.post(`/scene`, data)

export const detail = (id: string) => request.get(`/scene/${id}`)

export const query = (data: any) => request.post('/scene/_query/',data);

export const queryBranch = (data: any, id: string) => request.post(`/scene/branch/query?alarmId=${id}`,data);

export const _delete = (id: string) => request.remove(`/scene/${id}/`);

export const _action = (id: string, type: '_disable' | '_enable') => request.put(`/scene/${id}/${type}`);

/**
 * 手动触发
 * @param id
 * @returns
 */
export const _execute = (id: string) => request.post(`/scene/${id}/_execute`);

// 内置参数
export const queryBuiltInParams = (data: any, params?: any) => request.post(`/scene/parse-variables`, data, {params});

export const getParseTerm = (data: Record<string, any>) => request.post(`/scene/parse-term-column`, data)

export const queryAlarmPage = (data: Record<string, any>) => request.post(`/alarm/config/_query`, data)

export const queryAlarmList = (data: Record<string, any>) => request.post(`/alarm/config/_query/no-paging`, data)
export const queryAlarmCount = (data: Record<string, any>) => request.post(`/alarm/config/_count`, data)

/**
 * 获取触发器类型
 */
export const queryType = () => request.get('/scene/trigger/supports')

/**
 * 获取执行动作类型
 */
export const queryActionType = () => request.get('/scene/action/supports')

export const queryAggregation = () => request.get('/scene/aggregation/supports')

export const queryArrayTerms = (data:any={}) => request.post('/scene/parse-array-child-term-column', data)
