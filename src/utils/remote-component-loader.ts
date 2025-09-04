/**
 * 远程组件加载器
 * 提供在任意位置加载远程组件的能力
 */

import type { Component } from 'vue'
import { defineAsyncComponent, ref, onMounted, h } from 'vue'

export interface RemoteComponentOptions {
  /** 远程应用名称 */
  remoteName: string
  /** 组件路径 */
  componentPath: string
  /** 远程应用URL */
  remoteUrl?: string
  /** 加载失败时的回退组件 */
  fallback?: Component
  /** 加载中的组件 */
  loading?: Component
  /** 错误处理组件 */
  error?: Component
  /** 超时时间（毫秒） */
  timeout?: number
  /** 是否启用缓存 */
  cache?: boolean
}

/**
 * 动态加载远程组件
 */
export function loadRemoteComponent(options: RemoteComponentOptions): Component {
  const {
    remoteName,
    componentPath,
    remoteUrl,
    fallback,
    loading,
    error,
    timeout = 10000,
    cache = true
  } = options

  return defineAsyncComponent({
    loader: async () => {
      try {
        // 确保联邦运行时可用
        const runtime = await ensureFederationRuntime()
        
        // 如果提供了远程URL，先注册远程应用
        if (remoteUrl && !runtime.getRemoteInfo(remoteName)) {
          await registerRemoteApp(remoteName, remoteUrl)
        }
        
        // 加载远程组件
        const module = await runtime.loadRemote(remoteName, componentPath)
        return module.default || module
      } catch (err) {
        console.error(`Failed to load remote component ${remoteName}/${componentPath}:`, err)
        
        if (fallback) {
          return fallback
        }
        
        throw err
      }
    },
    
    loadingComponent: loading || {
      template: `
        <div class="remote-component-loading">
          <div class="loading-spinner"></div>
          <p>正在加载远程组件...</p>
        </div>
      `,
      style: {
        '.remote-component-loading': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          color: '#666'
        },
        '.loading-spinner': {
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }
      }
    },
    
    errorComponent: error || {
      props: ['error'],
      template: `
        <div class="remote-component-error">
          <h4>远程组件加载失败</h4>
          <p>组件: ${remoteName}/${componentPath}</p>
          <p>错误: {{ error.message }}</p>
          <button @click="$emit('retry')">重试</button>
        </div>
      `,
      style: {
        '.remote-component-error': {
          padding: '16px',
          border: '1px solid #ff4d4f',
          borderRadius: '4px',
          backgroundColor: '#fff2f0',
          color: '#ff4d4f'
        }
      }
    },
    
    timeout,
    suspensible: false
  })
}

/**
 * Vue组合式API钩子：使用远程组件
 */
export function useRemoteComponent(options: RemoteComponentOptions) {
  const component = ref<Component | null>(null)
  const loading = ref(true)
  const error = ref<Error | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    
    try {
      const runtime = await ensureFederationRuntime()
      
      if (options.remoteUrl && !runtime.getRemoteInfo(options.remoteName)) {
        await registerRemoteApp(options.remoteName, options.remoteUrl)
      }
      
      const module = await runtime.loadRemote(options.remoteName, options.componentPath)
      component.value = module.default || module
    } catch (err) {
      error.value = err as Error
      console.error(`Failed to load remote component:`, err)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return {
    component,
    loading,
    error,
    reload: load
  }
}

/**
 * 创建远程组件包装器
 */
export function createRemoteWrapper(options: RemoteComponentOptions): Component {
  return {
    name: `RemoteWrapper-${options.remoteName}-${options.componentPath}`,
    setup() {
      const { component, loading, error, reload } = useRemoteComponent(options)
      
      return () => {
        if (loading.value) {
          return options.loading 
            ? h(options.loading)
            : h('div', { class: 'remote-loading' }, '加载中...')
        }
        
        if (error.value) {
          return options.error
            ? h(options.error, { error: error.value, onRetry: reload })
            : h('div', { class: 'remote-error' }, `加载失败: ${error.value.message}`)
        }
        
        if (component.value) {
          return h(component.value)
        }
        
        return null
      }
    }
  }
}

/**
 * 批量预加载远程组件
 */
export async function preloadRemoteComponents(components: Array<{
  remoteName: string
  componentPath?: string
}>) {
  const runtime = await ensureFederationRuntime()
  
  const promises = components.map(async ({ remoteName, componentPath }) => {
    try {
      if (componentPath) {
        await runtime.loadRemote(remoteName, componentPath)
      } else {
        await runtime.preloadRemote(remoteName)
      }
    } catch (error) {
      console.warn(`Failed to preload ${remoteName}${componentPath ? '/' + componentPath : ''}:`, error)
    }
  })
  
  await Promise.allSettled(promises)
}

/**
 * 确保联邦运行时可用
 */
async function ensureFederationRuntime(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Remote components can only be loaded in browser environment')
  }
  
  // 检查运行时是否已初始化
  if ((window as any).__federation_runtime__) {
    return (window as any).__federation_runtime__
  }
  
  // 等待运行时初始化（最多等待5秒）
  let attempts = 0
  while (attempts < 50) {
    if ((window as any).__federation_runtime__) {
      return (window as any).__federation_runtime__
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }
  
  throw new Error('Federation runtime not available')
}

/**
 * 注册远程应用
 */
async function registerRemoteApp(remoteName: string, remoteUrl: string): Promise<void> {
  const runtime = await ensureFederationRuntime()
  
  // 如果运行时支持动态注册，使用它
  if (runtime.registerRemote) {
    await runtime.registerRemote(remoteName, remoteUrl)
    return
  }
  
  // 否则手动加载远程入口
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = `${remoteUrl.replace(/\/$/, '')}/remoteEntry.js`
  
  return new Promise((resolve, reject) => {
    script.onload = () => {
      document.head.removeChild(script)
      resolve()
    }
    
    script.onerror = () => {
      document.head.removeChild(script)
      reject(new Error(`Failed to load remote app: ${remoteName}`))
    }
    
    document.head.appendChild(script)
  })
}

/**
 * 远程组件指令（Vue指令）
 */
export const vRemoteComponent = {
  mounted(el: HTMLElement, binding: any) {
    const { remoteName, componentPath, remoteUrl } = binding.value
    
    const options: RemoteComponentOptions = {
      remoteName,
      componentPath,
      remoteUrl
    }
    
    const wrapper = createRemoteWrapper(options)
    
    // 这里需要实际的Vue应用实例来创建组件
    // 在实际使用中，应该通过插件注册来获取应用实例
    console.warn('v-remote-component directive needs to be properly implemented with Vue app instance')
  }
}

// 导出类型
export type { RemoteComponentOptions }