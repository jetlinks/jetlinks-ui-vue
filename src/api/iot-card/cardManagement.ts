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
export const sync = () => server.get(`/network/card/state/_sync`);

/**
 * 批量删除物联卡
 * @param data
 */
export const removeCards = (data: any) => server.post(`/network/card/batch/_delete`, data);