import { request } from '@jetlinks-web/core';
/**
 * 查询规则编排分页列表
 */
export const queryList = (data: any) => request.post('/rule-engine/instance/_query', data);

/**
 * 新增规则
 */
export const saveRule = (data: any) => request.post('/rule-editor/flows/_create',data);

/**
 * 修改规则
 */
export const modify = (id:any ,data:any) => request.put(`/rule-engine/instance/${id}`,data);

/**
 * 启动规则
 */
export const startRule = (id:string) => request.post(`/rule-engine/instance/${id}/_start`);

/**
 * 禁用规则
 */
export const stopRule = (id:string) => request.post(`/rule-engine/instance/${id}/_stop`);

/**
 * 删除规则
 */
export const deleteRule = (id:string) => request.remove(`/rule-engine/instance/${id}`)

/**
 * 根据设备ID获取设备详情
 * @param id 设备ID
 * @returns 设备详情
 */
export const detail = (id: string, hiddenError?: any) => request.get(`/device-instance/${id}/detail`, {}, {hiddenError})

/**
 * 根据产品ID获取产品详情
 * @param id 产品ID
 * @returns
 */
export const productDetail = (id: string) => request.get(`/device-product/${id}`)
