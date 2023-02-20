import server from '@/utils/request';


// 获取数据源列表
export const getDataSourceList_api = (data: object) => server.post(`/datasource/config/_query/`, data);

// 获取数据库类型字典
export const getDataTypeDict_api = () => server.get(`/datasource/config/types`);

// 修改数据源状态
export const changeStatus_api = (id:string, status:'_disable'|'_enable') => server.put(`/datasource/config/${id}/${status}`);