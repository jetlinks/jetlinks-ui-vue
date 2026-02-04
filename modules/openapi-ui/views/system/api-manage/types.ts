/**
 * API 接口管理页面的类型定义
 */

/**
 * API 治理属性
 */
export interface ApiGovernanceAttrs {
  /** API ID */
  id: string
  /** API 路径 */
  path: string
  /** HTTP 方法 */
  method: string
  /** API 描述 */
  description?: string
  /** 能力分组 */
  group?: string
  /** 风险等级 */
  riskLevel: 'low' | 'medium' | 'high'
  /** 操作类型 */
  operationType: 'read' | 'write' | 'control'
  /** 已绑定权限数量 */
  permissionCount?: number
  /** 可见性 */
  visibility?: 'INTERNAL' | 'PARTNER' | 'PUBLIC'
  /** 影响对象 */
  impactScope?: string[]
}

/**
 * 批量编辑的操作对象
 */
export interface BatchEditOperation {
  /** 字段名 */
  field: 'riskLevel' | 'operationType' | 'visibility'
  /** 新值 */
  value: any
  /** 受影响的 API ID 列表 */
  apiIds: string[]
}

/**
 * 列表筛选条件
 */
export interface ListFilter {
  /** 关键字搜索（path、description） */
  keyword?: string
  /** 风险等级 */
  riskLevel?: ('low' | 'medium' | 'high')[]
  /** 操作类型 */
  operationType?: ('read' | 'write' | 'control')[]
  /** 可见性 */
  visibility?: ('internal' | 'saas_user' | 'open')[]
  /** 稳定性 */
  stable?: ('stable' | 'preview' | 'deprecated' | 'internal')[]
  /** 能力分组 */
  group?: string
  /** 业务能力 */
  businessGroup?: string[]
  /** 影响范围 */
  impactScope?: string[]
  /** 权限绑定状态 */
  hasPermission?: boolean
}

/**
 * 列表排序
 */
export interface ListSort {
  /** 排序字段 */
  field: string
  /** 排序方向 */
  order: 'asc' | 'desc'
}

/**
 * 页面状态
 */
export interface PageState {
  /** 选中的 API ID 集合 */
  selectedApiIds: Set<string>
  /** 编辑状态：编辑字段->新值 */
  editingChanges: Map<string, any>
  /** 当前编辑的 API ID（单个编辑时） */
  editingApiId?: string
  /** 是否批量编辑模式 */
  batchEditMode: boolean
}