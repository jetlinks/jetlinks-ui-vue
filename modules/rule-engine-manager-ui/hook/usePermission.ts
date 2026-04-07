export const rulePermissionKey = 'rule-permission-key'
export const scenePermissionKey = 'rule-permission-key'

export const useRulePermissionContext = (key: string) => {
  provide(rulePermissionKey, key)
}

export const useRulePermission = () => {
  return inject(rulePermissionKey, 'rule-engine/Instance')
}

export const useScenePermissionContext = (key: string) => {
  provide(scenePermissionKey, key)
}

export const useScenePermission = () => {
  return inject(scenePermissionKey, 'rule-engine/Scene')
}
