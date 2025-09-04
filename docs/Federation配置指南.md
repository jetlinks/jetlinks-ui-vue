# Federation配置指南

> 模块联邦配置和管理的完整指南

## 📖 概述

本指南详细介绍如何配置和使用模块联邦系统，包括动态配置、策略管理、组件加载等功能。

## 🏗️ 配置架构

### 核心组件

```typescript
// 配置层次结构
FederationStrategy          // 策略管理器
├── RemoteConfig           // 远程应用配置
├── ApplicationConfig      // 应用配置
└── MicroFrontendConfig    // 微前端配置管理
```

## 🔧 基础配置

### 1. 联邦策略配置

```typescript
import { federationStrategy } from '../../federation-strategy'

// 注册单个远程应用
federationStrategy.registerRemote({
  name: 'device-manager',                    // 应用名称
  entry: 'http://localhost:3001/remoteEntry.js', // 远程入口
  format: 'esm',                            // 模块格式: esm | systemjs | var
  from: 'vite',                             // 来源类型: vite | webpack  
  preload: true,                            // 是否预加载
  timeout: 30000                            // 超时时间(ms)
})

// 批量注册
federationStrategy.batchRegisterRemotes([
  {
    name: 'device-manager',
    entry: 'http://localhost:3001/remoteEntry.js'
  },
  {
    name: 'notify-manager', 
    entry: 'http://localhost:3002/remoteEntry.js'
  }
])
```

### 2. 微前端配置

```typescript
import { microFrontendConfig } from '../../micro-frontend-config'

// 初始化配置
await microFrontendConfig.initialize([
  {
    id: 'device-manager',
    name: '设备管理',
    path: 'http://localhost:3001/'
  },
  {
    id: 'notify-manager',
    name: '通知管理', 
    path: 'http://localhost:3002/'
  }
])

// 获取应用信息
const appInfo = microFrontendConfig.getAppInfo('device-manager')
console.log('应用状态:', appInfo.status)

// 检查应用就绪状态
const isReady = microFrontendConfig.isAppReady('device-manager')
```

## 🚀 组件加载

### 1. 基础组件加载

```typescript
import { FederationLoader } from '@/utils/federation-loader'

// 加载远程组件
const result = await FederationLoader.loadComponent({
  remoteName: 'device-manager',          // 远程应用名
  exposedModule: './DeviceList',         // 导出模块路径
  entryUrl: 'http://localhost:3001/remoteEntry.js', // 可选：自定义入口
  timeout: 10000,                        // 可选：超时时间
  useCache: true                         // 可选：使用缓存
})

if (result.success) {
  const DeviceListComponent = result.data
  // 使用组件...
} else {
  console.error('组件加载失败:', result.error)
}
```

### 2. Vue组件中使用

```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <component :is="RemoteComponent" v-else-if="RemoteComponent" />
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadComponent } from '@/utils/federation-loader'

const RemoteComponent = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const result = await loadComponent({
      remoteName: 'device-manager',
      exposedModule: './DeviceList'
    })
    
    if (result.success) {
      RemoteComponent.value = result.data
    } else {
      error.value = result.error?.message || '加载失败'
    }
  } catch (err) {
    error.value = '加载异常'
  } finally {
    loading.value = false
  }
})
</script>
```

### 3. 组合式API使用

```typescript
// composables/useFederationComponent.ts
import { ref, onMounted } from 'vue'
import { loadComponent } from '@/utils/federation-loader'

export function useFederationComponent(remoteName: string, exposedModule: string) {
  const component = ref(null)
  const loading = ref(true)
  const error = ref('')

  const load = async () => {
    loading.value = true
    error.value = ''
    
    try {
      const result = await loadComponent({
        remoteName,
        exposedModule,
        useCache: true
      })
      
      if (result.success) {
        component.value = result.data
      } else {
        error.value = result.error?.message || '加载失败'
      }
    } catch (err) {
      error.value = '加载异常'
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
```

使用组合式API：

```vue
<template>
  <div>
    <component :is="component" v-if="component" />
    <div v-else-if="loading">加载中...</div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="reload">重试</button>
    </div>
  </div>
</template>

<script setup>
import { useFederationComponent } from '@/composables/useFederationComponent'

const { component, loading, error, reload } = useFederationComponent(
  'device-manager',
  './DeviceList'
)
</script>
```

## ⚡ 预加载策略

### 1. 应用预加载

```typescript
import { microFrontendConfig } from '../../micro-frontend-config'

// 预加载单个应用
await microFrontendConfig.preloadApp('device-manager')

// 批量预加载
await microFrontendConfig.preloadApps(['device-manager', 'notify-manager'])
```

### 2. 智能预加载器

```typescript
import { preloader, PreloadStrategy } from '@/utils/federation-preloader'

// 添加预加载任务
const taskId = preloader.addTask('device-manager', {
  strategy: PreloadStrategy.IDLE,        // 空闲时预加载
  priority: 8,                          // 优先级 1-10
  delay: 1000,                          // 延迟时间
  concurrent: true,                     // 是否允许并发
  maxConcurrency: 3,                    // 最大并发数
  timeout: 30000,                       // 超时时间
  networkCondition: 'fast'              // 网络条件: fast | slow | any
})

// 批量添加任务
preloader.addTasks([
  { appId: 'device-manager', config: { strategy: PreloadStrategy.IMMEDIATE } },
  { appId: 'notify-manager', config: { strategy: PreloadStrategy.IDLE } }
])

// 获取预加载统计
const stats = preloader.getStats()
console.log('预加载统计:', stats)
```

### 3. 预加载策略说明

| 策略 | 触发时机 | 适用场景 |
|------|----------|----------|
| `IMMEDIATE` | 立即 | 核心功能模块 |
| `IDLE` | 浏览器空闲时 | 常用功能模块 |
| `VISIBLE` | 组件可见时 | 懒加载组件 |
| `INTERACTION` | 用户交互时 | 低频使用模块 |
| `ROUTE` | 路由匹配时 | 特定路由模块 |

## 🔄 动态配置

### 1. 运行时添加远程应用

```typescript
import { federationStrategy } from '../../federation-strategy'
import { useApplication } from '@/store'

const applicationStore = useApplication()

// 动态注册新的远程应用
federationStrategy.registerRemote({
  name: 'new-module',
  entry: 'http://localhost:3003/remoteEntry.js'
})

// 更新应用列表
applicationStore.appList.push({
  id: 'new-module',
  name: '新模块',
  path: 'http://localhost:3003/',
  enabled: true
})

// 预加载新应用
await applicationStore.preloadApp('new-module')
```

### 2. 配置更新和热重载

```typescript
// 更新远程应用配置
federationStrategy.registerRemote({
  name: 'device-manager',
  entry: 'http://new-host:3001/remoteEntry.js', // 新的入口地址
  format: 'esm',
  from: 'vite'
}, { override: true }) // 覆盖现有配置

// 重新加载应用
await applicationStore.reloadApp('device-manager')

// 清除缓存并重新加载
import { FederationLoader } from '@/utils/federation-loader'
FederationLoader.clearCache('device-manager')
await applicationStore.preloadApp('device-manager')
```

## 📦 模块导出规范

### 1. 远程模块导出

远程应用需要正确导出模块：

```typescript
// 远程应用的 vite.config.ts
import { defineConfig } from 'vite'
import { federation } from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'device-manager',
      filename: 'remoteEntry.js',
      exposes: {
        './DeviceList': './src/components/DeviceList.vue',
        './DeviceDetail': './src/components/DeviceDetail.vue',
        './api': './src/api/index.ts',
        './store': './src/store/index.ts'
      },
      shared: ['vue', 'vue-router', 'pinia']
    })
  ]
})
```

### 2. 模块注册导出

```typescript
// 远程应用的 src/index.ts
import DeviceList from './components/DeviceList.vue'
import DeviceDetail from './components/DeviceDetail.vue'
import { deviceApi } from './api'
import { useDeviceStore } from './store'

// 导出给联邦使用
export {
  DeviceList,
  DeviceDetail,
  deviceApi,
  useDeviceStore
}

// 自动注册到模块注册中心
export const register = () => {
  const { moduleRegistry } = import('@/utils/module-registry')
  
  moduleRegistry.register('device-manager', {
    components: {
      DeviceList,
      DeviceDetail
    },
    apis: {
      deviceApi
    },
    stores: {
      useDeviceStore
    }
  })
}
```

## 🛠️ 高级配置

### 1. 自定义加载器

```typescript
import { FederationLoader } from '@/utils/federation-loader'

// 扩展加载器功能
class CustomFederationLoader extends FederationLoader {
  public static async loadComponentWithRetry(config, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      const result = await this.loadComponent(config)
      if (result.success) return result
      
      // 重试前清除缓存
      if (i < maxRetries - 1) {
        this.clearCache(config.remoteName)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    
    throw new Error('组件加载失败，已达到最大重试次数')
  }
}
```

### 2. 条件加载

```typescript
// 根据条件动态选择远程应用
const getRemoteConfig = (feature: string) => {
  const configs = {
    'device': { remoteName: 'device-manager', exposedModule: './DeviceList' },
    'alert': { remoteName: 'notify-manager', exposedModule: './AlertList' },
    'user': { remoteName: 'user-manager', exposedModule: './UserList' }
  }
  
  return configs[feature]
}

// 使用
const config = getRemoteConfig('device')
if (config) {
  const result = await loadComponent(config)
}
```

### 3. 版本管理

```typescript
import { federationStrategy } from '../../federation-strategy'

// 带版本的配置
federationStrategy.registerRemote({
  name: 'device-manager',
  entry: 'http://localhost:3001/remoteEntry.js',
  version: '1.2.0',
  format: 'esm',
  from: 'vite'
})

// 版本兼容性检查
const checkVersionCompatibility = (requiredVersion: string, actualVersion: string) => {
  // 实现版本比较逻辑
  return true // 简化示例
}
```

## 🔍 调试和故障排除

### 1. 调试工具

```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  window.__FEDERATION_DEBUG__ = {
    strategy: federationStrategy,
    config: microFrontendConfig,
    loader: FederationLoader,
    
    // 调试方法
    loadComponent: (remoteName, exposedModule) => {
      return FederationLoader.loadComponent({
        remoteName,
        exposedModule,
        useCache: false // 调试时不使用缓存
      })
    },
    
    clearAllCache: () => {
      FederationLoader.clearCache()
    },
    
    getStats: () => ({
      remotes: federationStrategy.getAllRemoteConfigs(),
      apps: microFrontendConfig.getAllApps(),
      cache: FederationLoader.getCacheStats()
    })
  }
}
```

### 2. 错误处理

```typescript
import { federationBridge } from '@/utils/micro-federation-bridge'

// 监听加载错误
federationBridge.on('federation-module:load-failed', (event) => {
  const { moduleId, error } = event.payload
  
  // 记录错误日志
  console.error(`模块 ${moduleId} 加载失败:`, error)
  
  // 可以实现降级策略
  handleLoadError(moduleId, error)
})

const handleLoadError = (moduleId: string, error: string) => {
  // 降级策略: 使用本地组件替代
  if (moduleId === 'device-manager') {
    // 加载本地备用组件
    import('./fallback/DeviceListFallback.vue').then(component => {
      // 替换逻辑...
    })
  }
}
```

### 3. 性能监控

```typescript
import { performanceMonitor } from '@/utils/federation-performance-monitor'

// 设置性能阈值
performanceMonitor.setThresholds({
  warning: 2000,  // 2秒警告
  error: 4000,    // 4秒错误
  timeout: 8000   // 8秒超时
})

// 添加性能观察者
performanceMonitor.addObserver((metrics) => {
  if (metrics.loadTime > 3000) {
    console.warn(`${metrics.name} 加载时间过长: ${metrics.loadTime}ms`)
  }
})
```

## ⚠️ 最佳实践

### 1. 配置管理
- 使用环境变量管理不同环境的配置
- 实现配置的热更新机制
- 定期清理无效的配置

### 2. 错误处理
- 实现完善的降级策略
- 提供用户友好的错误提示
- 记录详细的错误日志

### 3. 性能优化
- 合理设置预加载策略
- 使用缓存机制减少重复加载
- 监控和分析加载性能

### 4. 开发调试
- 使用开发工具进行调试
- 实现mock数据支持本地开发
- 提供完善的错误信息

---

更多详细信息请参考 [性能监控指南](./性能监控指南.md) 和 [最佳实践](./最佳实践.md)。
