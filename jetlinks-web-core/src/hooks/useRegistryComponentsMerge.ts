import { computed, h, Fragment, type VNode } from 'vue'
import { cloneDeep, isEqual } from 'lodash-es'
import { useRoute } from 'vue-router'
import { componentsRegistry } from '@jetlinks-web-core/utils/components-registry'
import type { RegistryAction } from '@jetlinks-web-core/utils/components-registry'


interface UseRegistryOptionsParams<T = any> {
  /** 父组件维护的原始 options（ref） */
  baseOptions: Ref<T[]>

  /** code */
  code: String

  /** 是否自动同步到 baseOptions（v-model） */
  autoSync?: boolean
}

/**
 * 扁平化 slot vnodes（处理 Fragment）
 */
const flattenVNodes = (nodes: VNode[]): VNode[] => {
  const result: VNode[] = []
  nodes.forEach(node => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenVNodes(node.children as VNode[]))
    } else {
      result.push(node)
    }
  })
  return result
}

/**
 * 合并 options（tabs / menu / list）
 */
export function useRegistryOptions<T = any>({
                                              baseOptions,
                                              code,
                                              autoSync = false
                                            }: UseRegistryOptionsParams<T>) {

  const route = useRoute()

  const registryItems = computed(() => {
    return componentsRegistry.getRegistry(
      `${route.name as string}:${code}`
    ) ?? []
  })

  /**
   * 派生后的 options（永远不直接写 baseOptions）
   */
  const mergedOptions = computed<T[]>(() => {
    const base = cloneDeep(baseOptions.value)
    if (!registryItems.value.length) return base

    const result: T[] = []
    const indexMap = new Map<any, number>()


    base.forEach((opt, idx) => {
      const key = (opt as any).value ?? (opt as any).key
      indexMap.set(key, idx)
      result.push(opt)
    })

    registryItems.value.forEach(item => {
      const target = item.target
      if (item.mode === 'hide' && target != null) {
        const idx = indexMap.get(target)
        if (idx != null) {
          result.splice(idx, 1)
          indexMap.clear()
          result.forEach((opt, index) => {
            const itemKey = (opt as any).value ?? (opt as any).key
            indexMap.set(itemKey, index)
          })
        }
        return
      }

      if (!item.extraOptions) return

      const key = item.extraOptions.value ?? item.extraOptions.key

      if (item.mode === 'replace' && target != null) {
        const idx = indexMap.get(target)
        if (idx != null) {
          result[idx] = item.extraOptions
          indexMap.set(key, idx)
          return
        }
      }

      if (!indexMap.has(key)) {
        result.push(item.extraOptions)
        indexMap.set(key, result.length - 1)
      }
    })

    return result
  })

  /**
   * 手动同步（推荐）
   */
  const syncOptions = () => {
    if (isEqual(baseOptions.value, mergedOptions.value)) return
    baseOptions.value = cloneDeep(mergedOptions.value)
  }

  /**
   * 自动同步（谨慎使用）
   * 只监听 registryItems，避免递归
   */
  if (autoSync) {
    watch(
      registryItems,
      () => {
        syncOptions()
      },
      { immediate: true }
    )
  }

  return {
    mergedOptions,
    syncOptions
  }
}

/**
 * 合并 slot vnodes
 */
export function useRegistryVNodeMerge(
  slotVNodes: () => VNode[],
  registryItems: () => RegistryAction[],
  extraProps?: () => Record<string, any>
) {
  return computed(() => {
    const base = flattenVNodes(slotVNodes())
    if (!registryItems().length) return base

    const result = [...base]

    registryItems().forEach(item => {
      const index = item.target
        ? result.findIndex(n => n.key === item.target)
        : -1

      const mode = item.mode ?? 'append'

      if (mode === 'hide') {
        if (index !== -1) {
          result.splice(index, 1)
        }
        return
      }

      if (!item.component) return
      const vnode = h(item.component, {
        ...(mode === 'replace' && index !== -1 ? (result[index].props || {}) : {}),
        ...(item.props || {}),
        ...(extraProps ? extraProps() : {}),
        key: `${item.code}:${item.target ?? 'append'}`
      })

      if (mode === 'replace' && index !== -1) {
        result[index] = vnode
        return
      }

      if (mode === 'before' && index !== -1) {
        result.splice(index, 0, vnode)
        return
      }

      if ((mode === 'after' || mode === 'append') && index !== -1) {
        result.splice(index + 1, 0, vnode)
        return
      }

      result.push(vnode)
    })

    return result
  })
}
