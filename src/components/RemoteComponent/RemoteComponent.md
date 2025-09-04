# RemoteComponent 远程组件

基于模块联邦的远程组件加载器，支持在任意位置动态加载远程组件。

## 特性

- ✅ 兼容 Vite 7
- ✅ 支持组件发布和消费
- ✅ 基于模块联邦思想
- ✅ 完整的错误处理和重试机制
- ✅ 支持加载状态和错误状态的自定义
- ✅ TypeScript 支持
- ✅ 缓存机制
- ✅ 预加载支持

## 基础用法

### 1. 作为组件使用

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <RemoteComponent
      remote-name="user-center"
      component-path="./UserProfile"
      remote-url="http://localhost:3001"
    />
    
    <!-- 传递props和事件 -->
    <RemoteComponent
      remote-name="user-center" 
      component-path="./UserList"
      :component-props="{ pageSize: 10 }"
      :component-events="{ onUserSelect: handleUserSelect }"
    />
    
    <!-- 自定义加载和错误状态 -->
    <RemoteComponent
      remote-name="user-center"
      component-path="./Dashboard"
    >
      <template #loading>
        <a-skeleton active />
      </template>
      
      <template #error="{ error, retry }">
        <div class="custom-error">
          <p>加载失败: {{ error.message }}</p>
          <a-button @click="retry">重试</a-button>
        </div>
      </template>
    </RemoteComponent>
  </div>
</template>

<script setup>
import RemoteComponent from '@/components/RemoteComponent/index.vue'

const handleUserSelect = (user) => {
  console.log('Selected user:', user)
}
</script>
```

### 2. 使用组合式API

```vue
<script setup>
import { useRemoteComponent } from '@/utils/remote-component-loader'

const { component, loading, error, reload } = useRemoteComponent({
  remoteName: 'user-center',
  componentPath: './UserProfile',
  remoteUrl: 'http://localhost:3001'
})
</script>

<template>
  <div>
    <a-spin :spinning="loading">
      <component 
        v-if="component" 
        :is="component" 
        :user-id="123"
        @user-updated="handleUserUpdated"
      />
    </a-spin>
    
    <a-alert 
      v-if="error" 
      type="error" 
      :message="error.message"
      show-icon
    />
  </div>
</template>
```

### 3. 编程式加载

```javascript
import { loadRemoteComponent } from '@/utils/remote-component-loader'

// 动态加载远程组件
const UserProfile = await loadRemoteComponent({
  remoteName: 'user-center',
  componentPath: './UserProfile',
  remoteUrl: 'http://localhost:3001'
})

// 在路由中使用
const routes = [
  {
    path: '/profile',
    component: () => loadRemoteComponent({
      remoteName: 'user-center',
      componentPath: './UserProfile'
    })
  }
]
```

## 配置远程应用

### 发布远程组件

在 `vite.config.ts` 中配置：

```typescript
import { federation } from './configs/plugin'

export default defineConfig({
  plugins: [
    // 其他插件...
    federation({
      name: 'user-center',
      filename: 'remoteEntry.js',
      exposes: {
        './UserProfile': './src/components/UserProfile.vue',
        './UserList': './src/components/UserList.vue',
        './Dashboard': './src/views/Dashboard.vue'
      },
      shared: {
        vue: { singleton: true },
        'vue-router': { singleton: true },
        'ant-design-vue': { singleton: true }
      }
    })
  ]
})
```

### 消费远程组件

```typescript
export default defineConfig({
  plugins: [
    federation({
      name: 'main-app',
      remotes: {
        'user-center': 'http://localhost:3001',
        'order-center': 'http://localhost:3002'
      },
      shared: {
        vue: { singleton: true },
        'vue-router': { singleton: true },
        'ant-design-vue': { singleton: true }
      }
    })
  ]
})
```

## API

### RemoteComponent Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| remoteName | string | - | 远程应用名称 |
| componentPath | string | - | 组件路径 |
| remoteUrl | string | - | 远程应用URL（可选） |
| componentProps | Record<string, any> | {} | 传递给远程组件的props |
| componentEvents | Record<string, Function> | {} | 传递给远程组件的事件 |
| cache | boolean | true | 是否启用缓存 |
| timeout | number | 10000 | 超时时间（毫秒） |

### RemoteComponent Events

| 事件 | 参数 | 说明 |
|------|------|------|
| loaded | component | 组件加载成功时触发 |
| error | error | 组件加载失败时触发 |
| loading | loading | 加载状态变化时触发 |

### RemoteComponent Slots

| 插槽 | 参数 | 说明 |
|------|------|------|
| loading | - | 自定义加载状态 |
| error | { error, retry } | 自定义错误状态 |
| empty | - | 自定义空状态 |

### useRemoteComponent

```typescript
function useRemoteComponent(options: RemoteComponentOptions): {
  component: Ref<Component | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  reload: () => Promise<void>
}
```

### 工具函数

```typescript
// 批量预加载
preloadRemoteComponents([
  { remoteName: 'user-center', componentPath: './UserProfile' },
  { remoteName: 'order-center' }
])

// 创建包装器组件
const UserProfileWrapper = createRemoteWrapper({
  remoteName: 'user-center',
  componentPath: './UserProfile',
  fallback: ErrorComponent
})
```

## 高级用法

### 错误边界

```vue
<template>
  <ErrorBoundary>
    <RemoteComponent
      remote-name="user-center"
      component-path="./RiskyComponent"
    />
  </ErrorBoundary>
</template>
```

### 条件加载

```vue
<template>
  <RemoteComponent
    v-if="shouldLoadRemoteComponent"
    remote-name="user-center"
    component-path="./OptionalComponent"
  />
</template>

<script setup>
import { computed } from 'vue'

const shouldLoadRemoteComponent = computed(() => {
  // 根据某些条件决定是否加载远程组件
  return userHasPermission && featureEnabled
})
</script>
```

### 动态远程地址

```vue
<template>
  <RemoteComponent
    remote-name="dynamic-app"
    component-path="./DynamicComponent"
    :remote-url="dynamicRemoteUrl"
  />
</template>

<script setup>
import { computed } from 'vue'

const dynamicRemoteUrl = computed(() => {
  return process.env.NODE_ENV === 'production'
    ? 'https://production-remote.example.com'
    : 'http://localhost:3001'
})
</script>
```

## 注意事项

1. **共享依赖**: 确保宿主应用和远程应用使用相同版本的共享依赖
2. **类型安全**: 建议为远程组件创建类型声明文件
3. **错误处理**: 始终提供合适的错误处理和回退方案
4. **性能考虑**: 合理使用预加载和缓存机制
5. **网络依赖**: 远程组件依赖网络，需考虑网络异常情况

## 故障排除

### 常见问题

1. **组件加载失败**: 检查远程URL是否正确，网络是否畅通
2. **类型错误**: 确保远程组件导出格式正确
3. **样式丢失**: 检查CSS是否正确打包和加载
4. **依赖冲突**: 确保共享依赖版本兼容

### 调试技巧

```javascript
// 开启详细日志
window.__federation_debug__ = true

// 查看运行时信息
console.log(window.__federation_runtime__)

// 检查远程模块状态
const runtime = window.__federation_runtime__
const info = runtime.getRemoteInfo('user-center')
console.log('Remote info:', info)
```