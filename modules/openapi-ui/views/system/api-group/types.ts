/**
 * API 操作信息
 */
export interface ApiOperationInfo {
  /** API规格ID (对应api_spec表的id) */
  id?: string
  /** API 路径 */
  path: string
  /** HTTP 方法 */
  method: string
  /** API 描述 (对应api_spec表的summary) */
  description?: string
  /** API 标签 */
  tags?: string[]
  /** 唯一标识 (path + method 或 id) */
  key?: string
  /** 能力分组（业务能力域） */
  group?: string
  /** 风险等级 */
  riskLevel?: 'low' | 'medium' | 'high'
  /** 操作类型（读/写/控制） */
  operationType?: 'read' | 'write' | 'control'
  /** 影响对象（设备/产品/系统等） */
  impactScope?: string[]
  /** 是否推荐对外开放 */
  recommended?: boolean
}

/**
 * 数据权限配置
 */
export interface ApiDataPermissionConfig {
  /** 数据权限支持状态：support-支持, unsupported-不支持, indirect-间接支持 */
  accessSupport?: 'support' | 'unsupported' | 'indirect'
  /** 资产类型（当accessSupport=support时有值） */
  assetType?: string
  /** 间接菜单配置（当accessSupport=indirect时有值） */
  indirectMenus?: string[]
}

/**
 * API 分组基本信息
 */
export interface ApiGroupBaseInfo {
  /** 分组 ID */
  id?: string
  /** 分组名称 */
  name: string
  /** 分组描述 */
  description?: string
  /** 所属应用 ID (可选) */
  appId?: string
  /** 创建时间 */
  createTime?: number
  /** 更新时间 */
  updateTime?: number
}
/**
 * API 分组列表项
 */
export interface ApiGroupItem {
  id: string
  name: string
  description?: string
  appId?: string
  appName?: string
  enabled: boolean
  status?: {
    text: string
    value: string
  }
  apiCount?: number
  hasDataPermission?: boolean
  assetType?: string
  createTime: number
  updateTime: number
}
