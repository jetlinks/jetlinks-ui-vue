import { isNoCommunity } from '@/utils/utils';

// 过滤网关类型
export const accessConfigTypeFilter = (data: any[], filterKey: string = 'id'): any[] => {
  if (!data) return []
  const filterKeys = !isNoCommunity ?
    [
      'mqtt-server-gateway',
      'http-server-gateway',
      'mqtt-client-gateway',
      'tcp-server-gateway',
      'plugin_gateway'
    ] : ['plugin_gateway']
  return data.filter(item => !filterKeys.includes(item[filterKey])).map( item => ({ ...item, label: item.name, value: item.id}))
}