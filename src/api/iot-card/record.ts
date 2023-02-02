import server from '@/utils/request'

/**
 * 分页查询操作记录列表
 * @param data
 */
export const queryList = (data: any) => server.post(`/network/card/stateOperate/_log`, data)