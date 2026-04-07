import { request } from '@jetlinks-web/core';
//编辑标签
export const saveTag = (data:any) => request.patch('/calendar/tags',data)
//查询标签列表
export const queryTags = () => request.get('/calendar/tags')
//删除标签
export const deleteTags = (ids:any) => request.post('/calendar/tags/_delete',{},{ data:ids })
//保存标签颜色
export const saveTagsColor = (data:any) => request.post('/system/config/calendar-tag-color',data)
//查询标签颜色
export const getTagsColor = () => request.get('/system/config/calendar-tag-color');
//查询指定日期内的日历
export const queryEvents = (dateFrom:any,dateTo:any) => request.get(`/calendar/${dateFrom}/${dateTo}`)
//批量保存指定日期的日历
export const saveEvents = (data:any) => request.patch('/calendar',data)
//清空日历
export const clearAll = () => request.remove('/calendar/mine/_all')
