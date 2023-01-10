import server from '@/utils/request';

// 获取tree数据-第一层
export const getTreeOne_api = () => server.get(`/v3/api-docs/swagger-config`);
// 获取tree数据-第二层
export const getTreeTwo_api = (name:string) => server.get(`/v3/api-docs/${name}`);