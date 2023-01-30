import server from '@/utils/request';

// 获取当前用户可访问菜单
export const getMenuTree_api = (data: object) => server.post(`/menu/_all/tree`, data);