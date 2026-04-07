import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import { useAuthStore } from '@jetlinks-web-core/store/auth'

export type EnsureVisualizationDashboardProjectParams = {
  entityId: string
  projectName?: string
  groupId: string
  groupName?: string
  configuration: Record<string, any>
}

//是否应用仪表盘
export const isApplyDashboard = () => useAuthStore().hasPermission('view/dashboard:add')

export const ensureVisualizationDashboardProject = async (params: EnsureVisualizationDashboardProjectParams) => {
  if (!moduleRegistry.hasModule('visualization-manager-ui')) return

  const apis: any = moduleRegistry.getResource('visualization-manager-ui', 'apis')
  if (!isApplyDashboard()) return
  const ensureFn = apis?.ensureDashboardProject as
    | undefined
    | ((p: EnsureVisualizationDashboardProjectParams) => Promise<any>)

  if (!ensureFn) return

  await ensureFn(params)
}
