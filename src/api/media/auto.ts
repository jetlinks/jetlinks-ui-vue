
import server from '@/utils/request'
//查询标签列表
export const queryTags = () => server.get('/calendar/tags')