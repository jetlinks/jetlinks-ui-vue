import { isNoCommunity } from '@/utils/utils';

// 过滤网关类型
export const accessConfigTypeFilter = (data: any[], filterKey: string = 'id'): any[] => {
  if (!data) return []
  return data.map( item => ({ ...item, label: item.name, value: item.id}))
}