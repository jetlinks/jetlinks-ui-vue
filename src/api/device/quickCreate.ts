import server from '@/utils/request'

export const queryClassificationType = () => server.post('/resources/classification-type/_query/no-paging');

export const queryClassification = (data:any) => server.post('/resources/classification/_all/tree',data)