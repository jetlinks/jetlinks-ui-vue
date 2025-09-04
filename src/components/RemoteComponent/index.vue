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
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <slot name="error" :error="error" :retry="reload">
        <a-result
          status="error"
          :title="`远程组件加载失败`"
          :sub-title="`${remoteName}/${componentPath}`"
        >
          <template #extra>
            <a-button type="primary" @click="reload">
              重新加载
            </a-button>
          </template>
        </a-result>
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
import { computed, watchEffect } from 'vue'
import { useRemoteComponent } from '@/utils/remote-component-loader'
import type { RemoteComponentOptions } from '@/utils/remote-component-loader'

interface Props {
  /** 远程应用名称 */
  remoteName: string
  /** 组件路径 */
  componentPath: string
  /** 远程应用URL */
  remoteUrl?: string
  /** 传递给远程组件的props */
  componentProps?: Record<string, any>
  /** 传递给远程组件的事件 */
  componentEvents?: Record<string, (...args: any[]) => void>
  /** 是否启用缓存 */
  cache?: boolean
  /** 超时时间 */
  timeout?: number
}

const props = withDefaults(defineProps<Props>(), {
  componentProps: () => ({}),
  componentEvents: () => ({}),
  cache: true,
  timeout: 10000
})

const emit = defineEmits<{
  loaded: [component: any]
  error: [error: Error]
  loading: [loading: boolean]
}>()

// 构建远程组件选项
const options = computed<RemoteComponentOptions>(() => ({
  remoteName: props.remoteName,
  componentPath: props.componentPath,
  remoteUrl: props.remoteUrl,
  cache: props.cache,
  timeout: props.timeout
}))

// 使用远程组件钩子
const { component, loading, error, reload } = useRemoteComponent(options.value)

// 监听状态变化并发出事件
watchEffect(() => {
  emit('loading', loading.value)
  
  if (error.value) {
    emit('error', error.value)
  }
  
  if (component.value) {
    emit('loaded', component.value)
  }
})

// 暴露方法给父组件
defineExpose({
  reload,
  component,
  loading,
  error
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