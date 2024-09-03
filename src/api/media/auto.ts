
import server from '@/utils/request'
//查询标签列表
export const queryTags = () => server.get('/calendar/tags')

//查询计划
export const queryList = (data:any) => server.post('/media/record/schedule/_query',data)

//查询计划不分页
export const queryListNoPaging = (data:any) => server.post('/media/record/schedule/_query/no-paging',data)

//查询录像记录
export const queryRecord = (type:string,data:any) => server.post(`/media/channel/${type}/record/agg`,data)

//查询录像文件
export const queryFiles = (data:any) => server.post('/media/record/schedule/files/_query',data)

//保存计划
export const savePlan = (data:any) => server.post('/media/record/schedule',data)

//编辑计划
export const updatePlan = (data:any) => server.patch('/media/record/schedule',data)

//启禁用计划
export const controlPlan = (id:string,data:any) => server.put(`/media/record/schedule/${id}`,data)

//删除计划
export const deletePlan = (id:string) => server.remove(`/media/record/schedule/${id}`)

//绑定通道
export const bindChannel = (scheduleId:string,data:any) => server.post(`/media/record/schedule/${scheduleId}/_bind`,data)

//绑定通道(按通道)
export const bindChannelAll = (channelId:string,type:string,isAll:boolean,data:any) => server.post(`/media/record/schedule/channel/${channelId}/${type}/_bind?all=${isAll}`,data)

//查询已绑定的通道
export const queryBoundChannel =(data:any) => server.post('/media/channel/_query',data)

//解绑通道
export const unbindChannel = (scheduleId:string,data:any) => server.post(`/media/record/schedule/${scheduleId}/_unbind`,data)

//查询执行日志
export const queryLogs = (scheduleId:string,data:any) => server.post(`/media/record/schedule/${scheduleId}/history/_query`,data)

export const unbindChannelAll = (scheduleId:string) => server.post(`/media/record/schedule/${scheduleId}/_bind-clear`)
