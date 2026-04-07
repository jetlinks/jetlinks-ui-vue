<script setup name="RegisterComponents">
import { componentsRegistry } from '@jetlinks-web-core/utils/components-registry'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})

const slots = defineSlots()
const route = useRoute()

/**
 * 辅助函数：扁平化处理 Fragment
 * 避免用户在插槽内使用 v-if/v-for 导致节点被包裹在 Fragment 中
 */
const flatten = (vnodes) => {
  let result = []
  vnodes.forEach((vnode) => {
    if (vnode.type === Fragment) {
      result = result.concat(flatten(vnode.children))
    } else {
      result.push(vnode)
    }
  })
  return result
}

// 核心渲染逻辑
const render = () => {
  // 1. 获取注册的动态组件
  // 建议：此处使用 props.code 或 route.name 取决于你的业务定位
  const registryItems = componentsRegistry.getRegistry(route.name)

  // 2. 获取原始插槽内容并扁平化
  const rawVNodes = slots.default ? slots.default() : []
  let vnodes = flatten(rawVNodes)

  if (registryItems && registryItems.length > 0) {
    // 拷贝一份，避免直接污染原始 slot (Vue 建议做法)
    const resultNodes = [...vnodes]

    registryItems.forEach(item => {
      // 匹配 key
      const index = resultNodes.findIndex(node => node.key === item.target)

      if (index !== -1) {
        // 模式处理
        if (item.mode === 'replace') {
          // 替换节点：保留原 key，使用新组件
          resultNodes[index] = h(item.component, {
            key: item.target,
            ...item.props
          })
        } else if (item.mode === 'before') {
          // 在之前插入
          resultNodes.splice(index, 0, h(item.component, {
            key: `extra-${item.target}`,
            ...item.props
          }))
        } else if (item.mode === 'after') {
          // 在之后插入
          resultNodes.splice(index + 1, 0, h(item.component, {
            key: `extra-${item.target}`,
            ...item.props
          }))
        }
      } else {
        // 如果没有找到 target，或者没有 target，则追加到最后
        resultNodes.push(h(item.component, {
          key: `extra-${Math.random()}`,
          ...item.props
        }))
      }
    })
    return resultNodes
  }

  return vnodes
}

</script>

<template>
  <component
    v-for="com in components"
    :key="com.key"
    :is="com.component || com"
    v-bind="com.props || $attrs"
  >
  </component>
</template>

<style scoped lang="less">

</style>