import type { Component } from 'vue'
import { modules } from '../utils/modules'

export type ActionPosition = 'replace' | 'before' | 'after' | 'append' | 'hide'

export interface RegistryAction {
  targetPage: string                // 目标页面, 比如; system/User
  targetModule?: string              // 目标模块, 比如: header; 作用于RegistryComponent props的 code
  target?: string            // 目标功能（如 add）； 作用于RegistryComponent 下子组件的 key
  mode?: ActionPosition  // 执行位置 replace（替换） / before（在前面插入） / after（在后面插入） / append（追加）
  order?: number
  component?: Component
  code: string     // 组件唯一标识，作用于RegistryComponent下子组件的 key
  props?: Record<string, any>
  extraOptions?: Record<string, any>
}

export interface RegistryActionComponent extends RegistryAction {
  key: string
  props?: Record<string, any>
}

export class ComponentsRegistry {
  private registryMap: Map<string, RegistryAction[]> = new Map()

  getKey(action: RegistryAction) {
    return `${action.targetPage}:${action.targetModule || 'default'}`
  }

  /**
   * 注册组件，单个注册
   * @param action
   */
  register(action: RegistryAction) {
    const key = this.getKey(action)
    let actions: RegistryAction[] = []

    if (this.registryMap.has(key)) {
      actions = this.registryMap.get(key)!
    }

    const index = actions.findIndex(item => item.code === action.code)

    if (index !== -1) { // 已存在相同组件
      actions[index] = action
    } else {
      actions.push(action)
    }

    this.registryMap.set(key, actions)
  }

  batchRegister() {
    const _modules = modules()
    Object.values(_modules).forEach((module: any) => {
      const components = module.default?.getRegisterComponents?.() || []
      components.forEach((component: RegistryAction) => this.register(component))
    })
  }

  getRegistry(code: string) {
    return (this.registryMap.get(code) || []) as RegistryActionComponent[]
  }
}

export const componentsRegistry = new ComponentsRegistry()
