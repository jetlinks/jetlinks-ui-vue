import type { ApiOperationInfo } from '../types'

/**
 * 根据HTTP方法推断操作类型
 */
export const inferOperationType = (method: string): 'read' | 'write' | 'control' => {
  if (method === 'GET') return 'read'
  if (['POST', 'PUT', 'PATCH'].includes(method)) return 'write'
  if (method === 'DELETE') return 'control'
  return 'read'
}

/**
 * 根据方法+路径推断风险等级
 */
export const inferRiskLevel = (method: string, path: string): 'low' | 'medium' | 'high' => {
  const lowerPath = path.toLowerCase()
  
  // 高风险：删除操作、批量操作、导入操作
  if (method === 'DELETE' || 
      lowerPath.includes('delete') || 
      lowerPath.includes('remove') ||
      lowerPath.includes('undeploy') ||
      lowerPath.includes('unbind')) {
    return 'high'
  }
  
  // 高风险：批量导入、批量操作
  if (method === 'POST' && (
    lowerPath.includes('import') || 
    lowerPath.includes('batch') ||
    lowerPath.includes('export')
  )) {
    return 'high'
  }
  
  // 低风险：只读操作
  if (method === 'GET') {
    return 'low'
  }
  
  // 默认中等风险
  return 'medium'
}

/**
 * 根据tags或path推断影响对象
 */
export const inferImpactScope = (tags: string[] = [], path: string): string[] => {
  const scope: string[] = []
  const lowerPath = path.toLowerCase()
  
  // 从path中提取影响对象
  if (lowerPath.includes('/device') || lowerPath.includes('device')) {
    scope.push('设备')
  }
  if (lowerPath.includes('/product') || lowerPath.includes('product')) {
    scope.push('产品')
  }
  if (lowerPath.includes('/firmware') || lowerPath.includes('firmware')) {
    scope.push('固件')
  }
  if (lowerPath.includes('/system') || lowerPath.includes('system')) {
    scope.push('系统')
  }
  if (lowerPath.includes('/user') || lowerPath.includes('user')) {
    scope.push('用户')
  }
  if (lowerPath.includes('/role') || lowerPath.includes('role')) {
    scope.push('角色')
  }
  if (lowerPath.includes('/permission') || lowerPath.includes('permission')) {
    scope.push('权限')
  }
  
  // 从tags中提取
  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase()
    if (lowerTag.includes('device') && !scope.includes('设备')) {
      scope.push('设备')
    }
    if (lowerTag.includes('product') && !scope.includes('产品')) {
      scope.push('产品')
    }
    if (lowerTag.includes('firmware') && !scope.includes('固件')) {
      scope.push('固件')
    }
  })
  
  return scope.length > 0 ? scope : ['通用']
}

/**
 * 将技术分组映射到业务能力域
 */
export const mapGroupToBusinessDomain = (group: string): string => {
  const groupMap: Record<string, string> = {
    'device': '设备管理',
    'device-instance': '设备管理',
    'device-message': '设备消息',
    'device-product': '产品管理',
    'firmware': '固件升级',
    'firmware-upgrade': '固件升级',
    'product': '产品管理',
    'system': '系统配置',
    'user': '用户管理',
    'role': '角色管理',
    'permission': '权限管理',
    'organization': '组织管理',
    'network': '网络管理',
    'rule-engine': '规则引擎',
    'dashboard': '数据看板',
    'notification': '消息通知',
  }
  
  const lowerGroup = group.toLowerCase()
  
  // 精确匹配
  if (groupMap[lowerGroup]) {
    return groupMap[lowerGroup]
  }
  
  // 模糊匹配
  for (const [key, value] of Object.entries(groupMap)) {
    if (lowerGroup.includes(key)) {
      return value
    }
  }
  
  // 默认返回原分组名
  return group || '未分组'
}

/**
 * 增强API操作信息，添加推断的字段
 */
export const enhanceApiOperationInfo = (item: any): ApiOperationInfo => {
  const operationType = inferOperationType(item.method)
  const riskLevel = inferRiskLevel(item.method, item.path)
  const impactScope = inferImpactScope(item.tags || [], item.path)
  const businessGroup = mapGroupToBusinessDomain(item.group || '未分组')
  
  return {
    ...item,
    operationType,
    riskLevel,
    impactScope,
    group: businessGroup,
    key: item.id || `${item.path}_${item.method}`,
  }
}
