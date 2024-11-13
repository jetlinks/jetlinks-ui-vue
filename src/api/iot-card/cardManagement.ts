import server from '@/utils/request'

/**
 * 不分页查询平台对接
 * @param data
 */
export const queryPlatformNoPage = (data: any) => server.post(`/network/card/platform/_query/no-paging`, data)

/**
 * 分页查询物联卡管理列表
 * @param data
 */
export const query = (data: any) => server.post(`/network/card/_query`, data)

/**
 * 激活待激活物联卡
 * @param cardId
 */
export const changeDeploy = (cardId: string) => server.get(`/network/card/${cardId}/_activation`);

/**
 * 停用已激活物联卡
 * @param cardId
 */
export const unDeploy = (cardId: string) => server.get(`/network/card/${cardId}/_deactivate`);

/**
 * 复机已停机物联卡
 * @param cardId
 */
export const resumption = (cardId: string) => server.get(`/network/card/${cardId}/_resumption`);

/**
 * 删除物联卡
 * @param id
 */
export const del = (id: string) => server.remove(`/network/card/${id}`);


/**
 * 激活待激活物联卡(批量)
 * @param data
 */
export const changeDeployBatch = (data: any) => server.get(`/network/card/_activation/_bitch`, data);

/**
 * 停用已激活物联卡(批量)
 * @param data
 */
export const unDeployBatch = (data: any) => server.get(`/network/card/_deactivate/_bitch`, data);

/**
 * 复机已停机物联卡(批量)
 * @param data
 */
export const resumptionBatch = (data: any) => server.get(`/network/card/_resumption/_bitch`, data);

/**
 * 同步物联卡状态
 */
export const sync = (data: any) => server.post(`/network/card/state/_sync`,data);

/**
 * 批量删除物联卡
 * @param data
 */
export const removeCards = (data: any) => server.post(`/network/card/batch/_delete`, data);

/**
 * 解绑设备
 * @param cardId
 */
export const unbind = (cardId: string) => server.get(`/network/card/${cardId}/_unbind`);

/**
 * 分页查询未绑定设备列表
 * @param data
*/
export const queryUnbounded = (data: any) => server.post(`/network/card/unbounded/device/_query`, data);

/**
 * 绑定设备
 * @param cardId
 * @param deviceId 选择的设备id
 */
export const bind = (cardId: string | any, deviceId: string) => server.get(`/network/card/${cardId}/${deviceId}/_bind`);

/**
 * 导入物联卡实例
 * @param configId 对接平台id
 * @param params
 */
export const _import = (configId: any, params: any) => server.get(`/network/card/${configId}/_import`, params);

/**
 * 根据id批量导出
 * @param format 类型 xlsx、csv
 * @param params
 */
export const _export = (format: string, data: any) => server.postStream(`/network/card/download.${format}/_query`, data);

/**
 * 下载模板
 * @param format 类型 xlsx、csv
 */
export const exportCard = (format: string) => server.get(`/network/card/template.${format}`,{},{responseType: 'blob'});

/**
 * 验证iccid
 * @param id
 */
export const validateId = (id: string) => server.get(`/network/card/id/_validate?id=${id}`);

/**
 * 新增物联卡
 * @param data
 */
export const add = (data: any) => server.patch(`/network/card`, data);

/**
 * 编辑物联卡
 * @param data
 */
export const edit = (data: any) => server.put(`/network/card/${data.id}`, data);

/**
 * 根据id查看详情
 * @param id
 */
export const queryDetail = (id: any) => server.get(`/network/card/${id}`);

/**
 * 查询物联卡充值缴费日志
 * @param data
 */
export const queryRechargeList = (data: any) => server.post(`/network/card/recharge/_log`, data)

/**
 * 充值
 * @param data
 */
export const recharge = (data: any) => server.post(`/network/card/_recharge`, data)
export const queryCount = (data: any) => server.post(`/network/card/_count`,data)

export const queryDeactivate = (id: string) => server.get(`/network/card/${id}/stop/reason`)
