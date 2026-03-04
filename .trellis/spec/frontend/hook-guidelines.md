# Hook 规范

> 本项目自定义 Hook 使用方式。

---

## 概览

本项目通过 Composition API 封装复用逻辑，入口以 `jetlinks-web-core/src/hooks/index.ts` 为准。

- 主应用 Hook：`jetlinks-web-core/src/hooks`
- 子模块 Hook：`modules/*/hooks` 或 `views/**/hook`

本文档重点覆盖：

- `useTabSaveSuccess`
- `useTabSaveSuccessBack`
- `usePlatformContext`
- `usePlatform`
- `isIotPlatform`
- `useRegistryOptions`
- `useRegistryVNodeMerge`

> 说明：完整导出以 `jetlinks-web-core/src/hooks/index.ts` 为准（包含 `useWebSocket`、`useEcharts`）。`useRequest`、`useMircoApp` 等虽在 `src/hooks` 目录，但不在 `index.ts` 统一导出，需要按具体路径单独引入。

## 通用编写与使用约定

- 命名必须以 `use` 开头（工具函数除外，如 `isIotPlatform`）
- 返回结构优先“状态 + 动作方法”
- 生命周期和清理逻辑优先收敛在 Hook 内部
- 参数使用显式类型，避免业务硬编码
- 组件内优先消费 Hook 暴露能力，避免重复造轮子

## Hook 使用示例（高频）

### 1) `useTabSaveSuccess`

适用场景：从当前页打开新页进行“新增/编辑”，新页保存后把结果回传当前页。

签名：

```ts
useTabSaveSuccess(code?: string, options?: {
  onSuccess?: (value: any) => void
})
```

示例：

```ts
import { ref } from 'vue'
import { useTabSaveSuccess } from '@jetlinks-web-core/hooks'

const selectedRoleIds = ref<string[]>([])

const { onOpen } = useTabSaveSuccess('system/Role', {
  onSuccess: (value) => {
    selectedRoleIds.value = value || []
  }
})

const addRole = () => {
  onOpen({ selectedIds: selectedRoleIds.value })
}
```

### 2) `useTabSaveSuccessBack`

适用场景：在被打开的新页中，保存成功后回传数据并返回上级页签。

签名：

```ts
useTabSaveSuccessBack()
```

示例：

```ts
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { onBack } = useTabSaveSuccessBack()

const onSubmitSuccess = async (savedData: Record<string, any>) => {
  await onBack(savedData, {
    onBefore: async () => true
  })
}
```

### 3) `usePlatformContext`

适用场景：页面根级提供当前平台上下文（如 `iot` / `edge`）。

签名：

```ts
usePlatformContext(platform?: string)
```

示例：

```ts
import { usePlatformContext } from '@jetlinks-web-core/hooks'

usePlatformContext('edge')
```

### 4) `usePlatform`

适用场景：在子组件读取上层提供的平台标识。

签名：

```ts
usePlatform(): string
```

示例：

```ts
import { computed } from 'vue'
import { usePlatform } from '@jetlinks-web-core/hooks'

const platform = usePlatform()
const isEdge = computed(() => platform === 'edge')
```

### 5) `isIotPlatform`

适用场景：快速判断是否为 `iot` 平台，做功能显示分支。

签名：

```ts
isIotPlatform(): boolean
```

示例：

```ts
import { isIotPlatform } from '@jetlinks-web-core/hooks'

const isIot = isIotPlatform()
```

### 6) `useRegistryOptions`

适用场景：合并页面基础配置（tabs/menu/list）与运行时注册扩展项。

签名：

```ts
useRegistryOptions<T>({
  baseOptions,
  code,
  autoSync
}: {
  baseOptions: Ref<T[]>
  code: string
  autoSync?: boolean
})
```

示例：

```ts
import { ref } from 'vue'
import { useRegistryOptions } from '@jetlinks-web-core/hooks'

type TabOption = { key: string; tab: string }

const baseTabs = ref<TabOption[]>([
  { key: 'Info', tab: '基本信息' },
  { key: 'Running', tab: '运行状态' }
])

const { mergedOptions, syncOptions } = useRegistryOptions<TabOption>({
  baseOptions: baseTabs,
  code: 'detail-tabs',
  autoSync: false
})

// 需要把派生结果写回基础配置时手动同步
syncOptions()
```

### 7) `useRegistryVNodeMerge`

适用场景：合并默认插槽节点与动态注册组件（replace / before / after / append）。

签名：

```ts
useRegistryVNodeMerge(
  slotVNodes: () => VNode[],
  registryItems: () => RegistryAction[],
  extraProps?: () => Record<string, any>
)
```

示例：

```ts
import { computed, useSlots } from 'vue'
import { componentsRegistry } from '@jetlinks-web-core/utils/components-registry'
import { useRegistryVNodeMerge } from '@jetlinks-web-core/hooks'

const slots = useSlots()

const registryItems = computed(() => {
  return componentsRegistry.getRegistry('device-detail:detail-tabs') ?? []
})

const mergedVNodes = useRegistryVNodeMerge(
  () => slots.default?.() || [],
  () => registryItems.value,
  () => ({ activeKey: 'Info' })
)

const renderContent = () => mergedVNodes.value
```

## 数据请求约定（适用于 Hook 内请求）

1. 请求定义在 `api/*.ts`
2. 页面/组件中复用 Hook 或 Store，不直接散落请求逻辑
3. 统一检查 `resp.success`（或项目统一成功条件）后再消费 `resp.result`

## 常见问题与规避

- 每个组件重复写请求逻辑
- 缺少 `loading`、缺少销毁清理（如 WS 订阅）
- 稳定结构仍大量使用 `any`
- 忽略 `index.ts` 导出边界，导致引入路径不统一
