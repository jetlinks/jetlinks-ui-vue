# `@jetlinks-web` 能力优先使用规范

> 目标：让 AI 和开发者在写代码时，优先复用 `@jetlinks-web/*` 已封装能力，减少重复实现与风格漂移。

---

## 1. 强约束（AI 编码优先级）

- 新增前端功能时，优先从本文件能力清单选型，再考虑自行实现。
- 能用 `@jetlinks-web/*` 的现成方法/组件时，不重复封装同类逻辑。
- 若未采用本清单能力，需在 PR 或任务说明里写明原因（兼容、性能、能力缺口等）。

---

## 2. 包级能力地图

| 包名 | 主要职责 | 常见能力 |
|------|----------|----------|
| `@jetlinks-web/utils` | 通用工具函数 | `onlyMessage`、`LocalStore`、`getToken`、`randomString`、`downloadFileByUrl` |
| `@jetlinks-web/hooks` | 组合式逻辑封装 | `useRequest`、`usePermission`、`useRouterParams` |
| `@jetlinks-web/components` | 通用基础组件 | `ConfigProvider`、`AIcon`、`PermissionButton`、`EditTable`、`ValueItem` |
| `@jetlinks-web/constants` | 运行时常量 | `TOKEN_KEY`、`TOKEN_KEY_URL`、`BASE_API` |
| `@jetlinks-web/core` | 底层请求/WS 能力 | `request`、`wsClient`、`crateAxios` |

> 说明：上表基于当前仓库真实引用频次与现有实现总结。

---

## 3. 高频工具函数（`@jetlinks-web/utils`）

### 3.1 `onlyMessage`

用途：统一消息提示（同类型消息去重展示），替代页面内零散 `message.success/error`。

```ts
import { onlyMessage } from '@jetlinks-web/utils'

onlyMessage('保存成功')
onlyMessage('保存失败，请重试', 'error')
```

### 3.2 `LocalStore` / `getToken` / `setToken` / `removeToken`

用途：统一本地存储与 token 读写，不直接硬编码 `localStorage` key。

```ts
import { LocalStore, getToken, setToken, removeToken } from '@jetlinks-web/utils'

const token = getToken()
LocalStore.set('activeMenu', 'system/User')
setToken('new-token')
removeToken()
```

### 3.3 `randomString` / `randomNumber`

用途：生成前端临时唯一标识（表单行 key、临时 id、请求标识）。

```ts
import { randomString, randomNumber } from '@jetlinks-web/utils'

const rowKey = randomString(8)
const traceId = randomNumber()
```

### 3.4 下载与文件处理

- `downloadFileByUrl(url, name, type?)`
- `downloadBlob(data, name, type?)`
- `downloadJson(record, fileName)`

```ts
import { downloadFileByUrl, downloadJson } from '@jetlinks-web/utils'

downloadFileByUrl('/api/file/export', 'report', 'xlsx')
downloadJson({ name: 'template', fields: [] }, 'device-template')
```

### 3.5 图片与加密

- `getImage(path)`：读取静态资源地址
- `getBase64ByImg(file, cb)`：图片转 base64
- `encrypt(text, key?)`：加密场景（登录/敏感字段）

```ts
import { getImage, getBase64ByImg, encrypt } from '@jetlinks-web/utils'

const logo = getImage('/login/logo.png')
const password = encrypt('plain-password')
getBase64ByImg(file, (base64) => (preview.value = base64))
```

---

## 4. 高频 Hooks（`@jetlinks-web/hooks`）

### 4.1 `useRequest`（请求首选）

用途：统一请求生命周期（`loading/data/run/reload`），减少重复 `try/catch + loading` 模板代码。

```ts
import { useRequest } from '@jetlinks-web/hooks'
import { onlyMessage } from '@jetlinks-web/utils'
import { saveUser } from '@/api/user'

const { loading, run } = useRequest(saveUser, {
  immediate: false,
  onSuccess: () => {
    onlyMessage('保存成功')
  },
  onError: () => {
    onlyMessage('保存失败', 'error')
  }
})

const onSubmit = async () => {
  await run(formModel)
}
```

列表数据场景：

```ts
const { data: options, reload } = useRequest(queryOptions, {
  defaultValue: [],
  onSuccess: (resp) => resp.result
})
```

### 4.2 `usePermission`

用途：在组合式逻辑中统一权限判断（依赖全局注入的 `hasPermission`）。

```ts
import { usePermission } from '@jetlinks-web/hooks'

const { hasPerm } = usePermission(ref('system/User:update'))
```

### 4.3 `useRouterParams`

用途：跨页面临时参数透传（结合 `setParamsValue` 使用），避免在 URL 暴露过多上下文。

```ts
import { useRouterParams } from '@jetlinks-web/hooks'

const routerParams = useRouterParams()
const source = routerParams.params.value?.sourceId
```

---

## 5. 常用组件（`@jetlinks-web/components`）

> 当前主应用在 `jetlinks-web-core/src/main.ts` 已 `.use(JetLinksComponents)` 全局注册，模板里优先直接使用 `j-*` 组件。

### 5.1 `ConfigProvider`

用途：全局国际化、主题与图标配置入口（见 `jetlinks-web-core/src/App.vue`）。

```vue
<ConfigProvider :locale="locale" :componentsLocale="componentsLocale" :theme="themeConfig">
  <router-view />
</ConfigProvider>
```

### 5.2 `AIcon`

用途：统一图标组件（模板与按钮 icon 插槽高频）。

```vue
<a-button>
  <template #icon><AIcon type="CloudUploadOutlined" /></template>
  发布
</a-button>
```

### 5.3 `PermissionButton` / `j-permission-button`

用途：按钮级权限控制 + 一致化确认流程。

```vue
<j-permission-button
  hasPermission="system/User:update"
  type="primary"
  :popConfirm="{ title: '确认执行？', onConfirm: onConfirm }"
>
  提交
</j-permission-button>
```

### 5.4 `EditTable`

用途：可编辑表格（参数编辑、动作编排场景）。

```vue
<EditTable :data-source="rows" :columns="columns" :height="300" :validateRowKey="true" />
```

### 5.5 `ValueItem` / `j-value-item`

用途：按数据类型自动渲染输入控件。

```vue
<j-value-item
  v-model:modelValue="record.value"
  :itemType="record.type"
  :extraProps="{ style: { width: '100%' } }"
/>
```

---

## 6. 常量与底层能力

### 6.1 `@jetlinks-web/constants`

常见常量：

- `TOKEN_KEY`：token header key
- `TOKEN_KEY_URL`：URL token 参数 key
- `BASE_API`：基础 API 前缀
- `LOCAL_BASE_API`：本地代理 API 存储 key

```ts
import { TOKEN_KEY, BASE_API } from '@jetlinks-web/constants'
```

### 6.2 `@jetlinks-web/core`

适用：平台层初始化（请求拦截、WS 管理），业务页面一般不直接扩展底层逻辑。

```ts
import { request, wsClient } from '@jetlinks-web/core'

await request.get('/system/version')
wsClient.connect()
```

---

## 7. 页面开发推荐组合

### 场景 A：表单提交

`useRequest` + `onlyMessage` + `j-permission-button`

### 场景 B：列表加载

`useRequest(defaultValue)` + `reload` + `onlyMessage(error)`

### 场景 C：鉴权展示

`usePermission`（组合逻辑） + `j-permission-button`（UI 入口）

### 场景 D：token/会话

`getToken/setToken/LocalStore` + `TOKEN_KEY/TOKEN_KEY_URL`

---

## 8. Wrong vs Correct

### 消息提示

```ts
// ❌ 不推荐
message.success('保存成功')
```

```ts
// ✅ 推荐
onlyMessage('保存成功')
```

### 请求 loading 管理

```ts
// ❌ 不推荐（重复模板代码）
const loading = ref(false)
loading.value = true
try {
  const resp = await api()
  if (resp.success) { ... }
} finally {
  loading.value = false
}
```

```ts
// ✅ 推荐
const { loading, run } = useRequest(api, { immediate: false })
await run(payload)
```

---

## 9. 参考入口（供 AI 追踪）

- `node_modules/@jetlinks-web/components/es/components.js`
- `node_modules/@jetlinks-web/hooks/src/useRequest.ts`
- `node_modules/@jetlinks-web/hooks/src/usePermission.ts`
- `node_modules/@jetlinks-web/utils/src/util.ts`
- `node_modules/@jetlinks-web/utils/src/storage.ts`
- `node_modules/@jetlinks-web/constants/src/index.ts`
