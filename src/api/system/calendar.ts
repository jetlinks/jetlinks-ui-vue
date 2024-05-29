import server from '@/utils/request';
//编辑标签
export const saveTag = (data:any) => server.patch('/calendar/tags',data)
//查询标签列表
export const queryTags = () => server.get('/calendar/tags')
//删除标签
export const deleteTags = (ids:any) => server.remove('/calendar/tags',{},ids)