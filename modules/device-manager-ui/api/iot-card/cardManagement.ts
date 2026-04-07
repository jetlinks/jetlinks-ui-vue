import { request } from '@jetlinks-web/core'

/**
 * 不分页查询平台对接
 * @param data
 */
export const queryPlatformNoPage = (data: any) => request.post(`/network/card/platform/_query/no-paging`, data)

/**
 * 分页查询物联卡管理列表
 * @param data
 */
export const query = (data: any) => request.post(`/network/card/_query`, data)

/**
 * 激活待激活物联卡
 * @param cardId
 */
export const changeDeploy = (cardId: string) => request.get(`/network/card/${cardId}/_activation`);

/**
 * 停用已激活物联卡
 * @param cardId
 */
export const unDeploy = (cardId: string) => request.get(`/network/card/${cardId}/_deactivate`);

/**
 * 复机已停机物联卡
 * @param cardId
 */
export const resumption = (cardId: string) => request.get(`/network/card/${cardId}/_resumption`);

/**
 * 删除物联卡
 * @param id
 */
export const del = (id: string) => request.remove(`/network/card/${id}`);

/**
 * 同步物联卡状态
 */
export const sync = (data: any) => request.post(`/network/card/state/_sync`,data);

/**
 * 批量删除物联卡
 * @param data
 */
export const removeCards = (data: any) => request.post(`/network/card/batch/_delete`, data);

/**
 * 解绑设备
 * @param cardId
 */
export const unbind = (cardId: string) => request.get(`/network/card/${cardId}/_unbind`);

/**
 * 分页查询未绑定设备列表
 * @param data
*/
export const queryUnbounded = (data: any) => request.post(`/network/card/unbounded/device/_query`, data);

/**
 * 绑定设备
 * @param cardId
 * @param deviceId 选择的设备id
 */
export const bind = (cardId: string | any, deviceId: string) => request.get(`/network/card/${cardId}/${deviceId}/_bind`);

/**
 * 导入物联卡实例
 * @param configId 对接平台id
 * @param params
 */
export const _import = (configId: any, params: any) => request.get(`/network/card/${configId}/_import`, params);

/**
 * 根据id批量导出
 * @param format 类型 xlsx、csv
 * @param params
 */
export const _export = (format: string, data: any) => request.postStream(`/network/card/download.${format}/_query`, data);

/**
 * 下载模板
 * @param format 类型 xlsx、csv
 */
export const exportCard = (format: string) => request.get(`/network/card/template.${format}`,{},{responseType: 'blob'});

/**
 * 验证iccid
 * @param id
 */
export const validateId = (id: string) => request.get(`/network/card/id/_validate?id=${id}`);

/**
 * 新增物联卡
 * @param data
 */
export const add = (data: any) => request.patch(`/network/card`, data);

/**
 * 编辑物联卡
 * @param data
 */
export const edit = (data: any) => request.put(`/network/card/${data.id}`, data);

/**
 * 根据id查看详情
 * @param id
 */
export const queryDetail = (id: any) => request.get(`/network/card/${id}`);
export const queryDetailById = (id: any) => request.get(`/network/card/detail/${id}`);

/**
 * 查询物联卡充值缴费日志
 * @param data
 */
export const queryRechargeList = (data: any) => request.post(`/network/card/recharge/_log`, data)

/**
 * 充值
 * @param data
 */
export const recharge = (data: any) => request.post(`/network/card/_recharge`, data)
export const queryCount = (data: any) => request.post(`/network/card/_count`,data)

export const queryDeactivate = (id: string) => request.get(`/network/card/${id}/stop/reason`)

export const querySyncLog = (data: any) => request.post(`/network/card/flow/sync/_log`, data)

