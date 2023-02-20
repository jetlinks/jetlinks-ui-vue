import server from '@/utils/request';
/**
 * 查询等级
 */
export const queryLevel = () => server.get('/alarm/config/default/level');