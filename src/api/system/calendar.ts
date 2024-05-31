import server from '@/utils/request';
//编辑标签
export const saveTag = (data:any) => server.patch('/calendar/tags',data)
//查询标签列表
export const queryTags = () => server.get('/calendar/tags')
//删除标签
export const deleteTags = (ids:any) => server.remove('/calendar/tags',{},{data:ids})
//保存标签颜色
export const saveTagsColor = (data:any) => server.post('/system/config/calendar-tag-color',data) 
//查询标签颜色
export const getTagsColor = () => server.get('/system/config/calendar-tag-color');
//查询