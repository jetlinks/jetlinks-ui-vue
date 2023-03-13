import server from '@/utils/request';


// 获取数据源列表
export const getDataSourceList_api = (data: object) => server.post(`/datasource/config/_query/`, data);
// 获取数据源信息
export const getDataSourceInfo_api = (id: string) => server.get(`/datasource/config/${id}`);

// 获取数据库类型字典
export const getDataTypeDict_api = () => server.get(`/datasource/config/types`);

// 修改数据源状态
export const changeStatus_api = (id: string, status: '_disable' | '_enable') => server.put(`/datasource/config/${id}/${status}`);
// 新增/更新数据源
export const saveDataSource_api = (data: any) => data.id ? server.patch(`datasource/config`, data) : server.post(`/datasource/config`, data)

// 删除数据源
export const delDataSource_api = (id: string) => server.remove(`/datasource/config/${id}`);
// 获取左侧树
export const rdbTree_api = (id: string) => server.get(`/datasource/rdb/${id}/tables?includeColumns=false`);
// 获取右侧表格
export const rdbTables_api = (id: string,key:string) => server.get(`/datasource/rdb/${id}/table/${key}`);
// 保存表格
export const saveTable_api = (id: string,data:object) => server.patch(`/datasource/rdb/${id}/table`,data);
/**
 * 删除已保存的行
 */
export const delSaveRow_api = (datasourceId: string, table: string, data: any) => server.post(`/datasource/rdb/${datasourceId}/table/${table}/drop-column`,data);
