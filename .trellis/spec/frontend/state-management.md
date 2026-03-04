# 状态管理

> 本文档基于 `jetlinks-web-core/src/store/index.ts` 与现有 store 实现，说明项目状态分层、使用约定与实用示例。

---

## 1. Store 入口契约（`store/index.ts`）

当前项目使用 Pinia，`index.ts` 提供两类能力：

1. **默认导出 Pinia 实例**
2. **聚合导出业务 Store**

```ts
import { createPinia } from 'pinia'

export * from './auth'
export * from './user'
export * from './menu'
export * from './system'
export * from './application'
export * from './ai'

const pinia = createPinia()
export default pinia
```

### 统一接入方式

- 在应用入口挂载：`app.use(pinia)`（见 `jetlinks-web-core/src/main.ts`）
- 在业务中统一引入：`import { useMenuStore, useSystemStore } from '@jetlinks-web-core/store'`

---

## 2. 状态分层与职责

### A) 本地状态（组件内）

适合：弹窗开关、输入中间态、临时 loading 等短生命周期状态。

```ts
const visible = ref(false)
const formModel = reactive({ name: '', code: '' })
```

### B) 全局状态（Pinia Store）

适合：跨页面/跨布局复用，或路由守卫依赖的数据。

项目已沉淀的全局域：

- `useAuthStore`：按钮权限与鉴权方法（`hasPermission`）
- `useUserStore`：用户信息、管理员标识、站内信更新计数
- `useMenuStore`：动态路由、菜单映射、页面跳转
- `useSystemStore`：系统配置、主题、标题、阈值能力开关
- `useApplication`：子应用列表、远程模块加载
- `useAIStore`：AI 按钮可见性、抽屉状态、智能体列表

### C) 路由状态（query/params）

适合：页面可分享筛选条件、回跳上下文参数。  
示例：`menuStore.routerPush(name, { query, params })`

### D) 服务端状态（API -> Store）

约定：服务端数据优先通过 Store action 拉取，统一 `resp.success` 判定后再落状态。

---

## 3. 初始化时序（实战）

路由守卫是全局状态初始化主入口（见 `jetlinks-web-core/src/router/index.ts`）：

1. `useUserStore().getUserInfo()`
2. `useSystemStore().queryVersion()/queryInfo()/getShowThreshold()`
3. `useApplication().queryApplication()`（主应用场景）
4. `useMenuStore().queryMenus()` 并动态 `addRoute`

建议流程示例：

```ts
const userStore = useUserStore()
const systemStore = useSystemStore()
const menuStore = useMenuStore()

if (!Object.keys(userStore.userInfo).length) {
  await userStore.getUserInfo()
  await systemStore.queryInfo()
}

if (!menuStore.menu.length) {
  await menuStore.queryMenus()
}
```

---

## 4. 组件内使用模式（推荐）

### 模式 1：状态用 `storeToRefs`，动作直接解构

```ts
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@jetlinks-web-core/store'

const systemStore = useSystemStore()
const { layout, theme, language } = storeToRefs(systemStore)
const { changeTheme } = systemStore
```

### 模式 2：页面初始化触发 Action

```ts
import { onMounted } from 'vue'
import { useMenuStore } from '@jetlinks-web-core/store'

const menuStore = useMenuStore()

onMounted(async () => {
  if (!menuStore.menu.length) {
    await menuStore.queryMenus()
  }
})
```

### 模式 3：权限驱动 UI 显示

```ts
import { computed } from 'vue'
import { useAuthStore } from '@jetlinks-web-core/store'

const authStore = useAuthStore()
const canEdit = computed(() => authStore.hasPermission('system/User:update'))
```

---

## 5. 核心 Store 场景示例

### `useUserStore`：登录后拉取用户信息

```ts
const userStore = useUserStore()
await userStore.getUserInfo()

if (userStore.isAdmin) {
  // 管理员特权逻辑
}
```

### `useMenuStore`：按菜单编码跳转

```ts
const menuStore = useMenuStore()
menuStore.jumpPage('system/User', {
  query: { tab: 'detail' },
  params: { id: '1001' }
})
```

### `useSystemStore`：切换主题与布局参数

```ts
const systemStore = useSystemStore()
systemStore.changeTheme('dark')
systemStore.changeLayout('siderWidth', 256)
```

### `useApplication`：获取子应用并按 id 查询

```ts
const appStore = useApplication()
await appStore.queryApplication()
const authApp = appStore.findAppById('authentication-manager')
```

### `useAIStore`：查询智能体后展示入口

```ts
const aiStore = useAIStore()
await aiStore.queryAgent('device-detail', { deviceId: 'd-001' })
aiStore.setDrawer(true)
```

---

## 6. 何时放进 Store（决策规则）

满足任一条件就考虑进入全局 Store：

- 多页面共享（如 `userInfo`、`systemInfo`）
- 需要在路由守卫/布局层访问（如菜单、权限、系统配置）
- 需要跨路由保留（如应用列表、全局能力开关）

否则保持组件本地状态，避免全局污染。

---

## 7. 常见错误与正确写法

### 错误 1：把短生命周期状态写进全局 Store

```ts
// ❌ 不推荐：仅当前弹窗使用
const useDialogStore = defineStore('dialog', { ... })
```

```ts
// ✅ 推荐：放组件内
const visible = ref(false)
```

### 错误 2：直接解构响应式 state 导致丢失响应

```ts
// ❌
const { layout } = useSystemStore()
```

```ts
// ✅
const systemStore = useSystemStore()
const { layout } = storeToRefs(systemStore)
```

### 错误 3：重复请求同一全局数据

```ts
// ❌ 每次进入页面都无条件请求
await menuStore.queryMenus()
```

```ts
// ✅ 先判断缓存
if (!menuStore.menu.length) {
  await menuStore.queryMenus()
}
```
