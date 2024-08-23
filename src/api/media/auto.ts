
import server from '@/utils/request'
//查询标签列表
export const queryTags = () => server.get('/calendar/tags')

//查询计划
export const queryList = (data:any) => server.post('/media/record/schedule/_query',data)

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

//查询已绑定的通道
export const queryBoundChannel =(data:any) => server.post('/media/channel/_query',data)

//解绑通道
export const unbindChannel = (scheduleId:string,data:any) => server.post(`/media/record/schedule/${scheduleId}/_unbind`,data)

//查询执行日志
export const queryLogs = (data:any) => server.post('/media/record/schedule/history/_query',data)