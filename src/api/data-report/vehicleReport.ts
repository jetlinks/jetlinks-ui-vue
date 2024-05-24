import server from '@/utils/request'

 /**
  * 查询车辆列表(分页)
  * @param data 查询条件
  */
 export const queryVehicleList = (data: any) => server.post('/vehicle/_query', data)