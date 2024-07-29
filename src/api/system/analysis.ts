import server from '@/utils/request';

// 获取分析报表配置
export const getReportConfig = () => server.get(`report/configuration`);
