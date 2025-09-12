<template>
  <div class="remote-component-wrapper">
    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-state">
      <slot name="loading">
        <div class="default-loading">
          <a-spin size="small" />
          <span>正在加载远程组件...</span>
        </div>
      </slot>
    </div>

    <!-- 远程组件 -->
    <component
      v-else-if="component"
      :is="component"
      v-bind="componentProps"
      v-on="componentEvents"
    />

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <slot name="empty">
        <a-empty description="远程组件未找到" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { moduleRegistry } from '@/utils/module-registry'

interface Props {
  /** 远程应用名称 */
  remoteName: string
  /** 组件名称 */
  componentName: string
  /** 远程组件地址 */
  remotePath?: string
  /** 传递给远程组件的props */
  componentProps?: Record<string, any>
  /** 传递给远程组件的事件 */
  componentEvents?: Record<string, (...args: any[]) => void>
  /** 超时时间 */
  timeout?: number
}

const props = withDefaults(defineProps<Props>(), {
  componentProps: () => ({}),
  componentEvents: () => ({}),
  cache: true,
  timeout: 10000
})

const component = ref()
const loading = ref(true)

onMounted(async () => {
  // 默认是从注册中心获取远程或者本地组件
  if (!moduleRegistry.hasModule(props.remoteName) && props.remotePath) {
    await moduleRegistry.loadRemoteComponent(props.remoteName, props.remotePath, props.componentName)
  }

  component.value = await moduleRegistry.getResourceItem(props.remoteName, 'components', props.componentName)
  loading.value = false
})

</script>

<style scoped lang="less">
.remote-component-wrapper {
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;

    .default-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #666;

      span {
        font-size: 14px;
      }
    }
  }

  .error-state {
    padding: 20px;
  }

  .empty-state {
    padding: 40px;
    text-align: center;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
