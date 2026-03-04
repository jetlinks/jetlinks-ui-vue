# Utils 工具函数规范

> 本文档覆盖 `jetlinks-web-core/src/utils/index.ts` 统一导出的工具函数，按分类给出用途说明与使用示例。

---

## 概览

- 导出入口：`jetlinks-web-core/src/utils/index.ts`
- 统一引入方式：`import { ... } from '@jetlinks-web-core/utils'`
- 当前导出子模块：`menu`、`comm`、`validate`、`regular`、`document`、`encodeQuery`、`utils`、`modules`

---

## A. 菜单与路由装配（`menu.ts`）

### 1) `handleMenus`

**用途**：把后端菜单 + 扩展菜单 + 页面组件映射，转换为侧边栏菜单与动态路由。

**签名**：

```ts
handleMenus(
  menuData: MenuItem[],
  extraMenus: any,
  components: Record<string, any>,
  level?: number
): {
  menuMap: Map<string, { path: string; title: string }>
  menus: RouteRecordRaw[]
  menuRoutes: RouteRecordRaw[]
  authButtons: Record<string, string[]>
}
```

**示例**：

```ts
import { handleMenus } from '@jetlinks-web-core/utils'

const { menus, menuRoutes, authButtons } = handleMenus(
  serverMenus,
  extraMenus,
  viewModules
)
```

### 2) `handleAuthMenu`

**用途**：递归提取菜单按钮权限（`code -> buttonIds`）。

**示例**：

```ts
import { handleAuthMenu } from '@jetlinks-web-core/utils'

const permissionMap: Record<string, string[]> = {}
handleAuthMenu(serverMenus, (code, buttons) => {
  permissionMap[code] = buttons
})
```

### 3) `routerFallback`

**用途**：回退逻辑优先 `history.back()`，否则根据路由 `breadcrumb` 回到上级。

**示例**：

```ts
import { routerFallback } from '@jetlinks-web-core/utils'

const onBack = () => routerFallback()
```

---

## B. 通用 UI / 数据处理（`comm.ts`）

### 1) 下载与资源

- `downloadJson(record, fileName, format?)`：下载 JSON 文件（默认日期格式 `YYYY_MM_DD`）。
- `getImageUrl(id)`：根据 `id` 返回本地图片或文件服务地址。

```ts
import { downloadJson, getImageUrl } from '@jetlinks-web-core/utils'

downloadJson(config, 'device-template')
const src = getImageUrl(form.logo)
```

### 2) 查询条件与 Select 辅助

- `modifySearchColumnValue(e, columnMap)`：批量替换查询条件里的 `column`。
- `filterSelectNode(value, option, key = 'label')`：`a-select` 过滤方法。

```ts
import { modifySearchColumnValue, filterSelectNode } from '@jetlinks-web-core/utils'

const params = modifySearchColumnValue(searchParams, { username: 'context.username' })
const filterOption = (input: string, option: any) => filterSelectNode(input, option, 'label')
```

### 3) 提示与基础映射

- `onlyMessage(msg, type?, extra?)`：同 `type` 只保留一条 message（基于 `key=type`）。
- `accessConfigTypeFilter(data)`：把 `{ id, name }` 映射为 `{ value, label }`。

```ts
import { onlyMessage, accessConfigTypeFilter } from '@jetlinks-web-core/utils'

onlyMessage('保存成功', 'success')
const options = accessConfigTypeFilter(accessTypes)
```

### 4) 本地状态与运行环境

- `getAppId()` / `setAppId(id)`：读写本地 `app_id`。
- `isFullScreen()`：判断浏览器是否全屏。
- `isZhCN(name)`：判断路径是否 `-cn` 结尾。
- `getBaseApi()`：微应用场景优先取主应用注入 API。
- `getUploadHeaders()`：上传请求头（自动带 token）。

```ts
import { getAppId, setAppId, isFullScreen, getBaseApi, getUploadHeaders } from '@jetlinks-web-core/utils'

setAppId('edge-app')
const appId = getAppId()
const baseApi = getBaseApi()
const headers = getUploadHeaders()
```

### 5) 集合与树转换

- `mergeObjectArrays(a, b, key = 'key')`：按 key 合并数组，`b` 优先覆盖。
- `transformTree(data, options?)`：树字段映射 + 节点 Map 构建（会原位修改节点）。

```ts
import { mergeObjectArrays, transformTree } from '@jetlinks-web-core/utils'

const merged = mergeObjectArrays(defaultTabs, runtimeTabs, 'key')

const { tree, map } = transformTree(rawTree, {
  filedNames: { title: 'name', key: 'id', children: 'children' },
  handleNode: (node) => { node.disabled = !!node.readonly }
})
```

---

## C. 校验与正则（`validate.ts` + `regular.ts`）

### 1) 常用校验函数

- `phoneRegEx(value)`：手机号 / 座机校验。
- `passwordRegEx(value)`：密码强度校验（至少 8 位，含大小写与数字）。
- `testIP(value)`：IPv4 校验。
- `testIpv4_6(value)`：IPv4 / IPv6 校验。

```ts
import { phoneRegEx, passwordRegEx, testIP, testIpv4_6 } from '@jetlinks-web-core/utils'

const validPhone = phoneRegEx('13800138000')
const validPwd = passwordRegEx('Abcd1234')
const validIp = testIpv4_6('2001:db8::1')
```

### 2) 正则常量与快捷函数

- `urlReg` / `isUrl(path)`：URL 校验。
- `inputReg` / `isInput(value)`：仅字母、数字、`_`、`-`。
- `CronRegEx` / `isCron(value)`：Cron 表达式校验。
- `regIPv6` / `regIpv4`：IP 正则常量。

```ts
import { isUrl, isInput, isCron, regIpv4 } from '@jetlinks-web-core/utils'

isUrl('https://demo.jetlinks.cn')
isInput('device_code_01')
isCron('0 0/5 * * * ?')
regIpv4.test('192.168.1.10')
```

---

## D. 查询参数编码（`encodeQuery.ts`）

### 1) `paramsEncodeQuery`

**用途**：将 `terms[]`、`sorts[]` 结构编码为后端分页接口需要的扁平 query 参数。

```ts
import { paramsEncodeQuery } from '@jetlinks-web-core/utils'

const query = paramsEncodeQuery({
  current: 1,
  terms: [{ column: 'name', type: 'like', value: 'test', termsType: 'and', terms: [] }],
  sorts: [{ name: 'createTime', order: 'desc' }]
})
```

### 2) `encodeQuery`

**用途**：兼容旧式表单参数结构，自动处理 `$LIKE/$IN/$START/$END`。

```ts
import { encodeQuery } from '@jetlinks-web-core/utils'

const query = encodeQuery({
  current: 1,
  terms: { 'name$LIKE': 'jetlinks', 'status@eq': 'enabled' },
  sorts: { createTime: 'descend' }
})
```

### 3) `handleParamsToString`

**用途**：把条件数组组装为字符串化 `terms` 结构（用于固定分组场景）。

```ts
import { handleParamsToString } from '@jetlinks-web-core/utils'

const termsJson = handleParamsToString([
  { column: 'name', value: 'A', termType: 'eq' },
  { column: 'state', value: 'online', termType: 'eq' }
])
```

---

## E. 浏览器行为与页面辅助（`document.ts` + `utils.ts`）

### 1) 外部脚本加载

- `createScript(src)`：动态插入 `<script>`，加载成功后 `resolve(true)`。

```ts
import { createScript } from '@jetlinks-web-core/utils'

await createScript('https://cdn.example.com/sdk.js')
```

### 2) 页面环境与跳转

- `isNoCommunity`：是否非社区版（布尔常量）。
- `openEdgeUrl(id, routePath?)`：带 token 打开 Edge 页面。
- `initPersonal()`：从 URL 读取个人化 token 参数并注入运行态。

```ts
import { isNoCommunity, openEdgeUrl, initPersonal } from '@jetlinks-web-core/utils'

if (isNoCommunity) {
  initPersonal()
}
openEdgeUrl(deviceId, '/device/detail')
```

### 3) 行复制逻辑（“同上”）

- `getEffectivePrevRow(rows, index)`：找到当前行可继承的上一有效行。
- `applySameAsAbove(rows, index, checked)`：勾选“同上”后复制 `name/code` 并处理禁用态。

```ts
import { applySameAsAbove } from '@jetlinks-web-core/utils'

const nextRows = applySameAsAbove(formRows, rowIndex, true)
```

### 4) `TabSaveSuccess`（类）

**说明**：当前类只包含构造初始化（`id/url`），未提供公开方法；业务上优先使用 `hooks` 中的 `useTabSaveSuccess` / `useTabSaveSuccessBack`。

```ts
import { TabSaveSuccess } from '@jetlinks-web-core/utils'

const state = new TabSaveSuccess('/system/user')
```

---

## F. 模块发现与注册（`modules.ts`）

> 该组函数基于 `import.meta.glob('../../../modules/*/...')`，按模块 `priority` 排序后执行。

### 1) `modules`

**用途**：返回全部有效模块映射（过滤 `default.filter === true`）。

```ts
import { modules } from '@jetlinks-web-core/utils'

const moduleMap = modules()
```

### 2) `getModulesMenu`

**用途**：读取各模块 `baseMenu.ts` 并聚合菜单数组。

```ts
import { getModulesMenu } from '@jetlinks-web-core/utils'

const extraMenus = getModulesMenu()
```

### 3) `registerModule`

**用途**：依次调用模块 `default.register?.()` 完成注册。

```ts
import { registerModule } from '@jetlinks-web-core/utils'

registerModule()
```

### 4) 初始化与配置读取

- `getModulesInitPage()`：获取模块初始化页面（后写优先）。
- `getHideHeaderRightConfig()`：获取顶部右侧隐藏配置。
- `getPackageConfig()`：获取模块 package 级配置。

```ts
import { getModulesInitPage, getHideHeaderRightConfig, getPackageConfig } from '@jetlinks-web-core/utils'

const initPage = getModulesInitPage()
const hideHeaderRight = getHideHeaderRightConfig()
const packageConfig = getPackageConfig()
```

---

## 使用建议

- 在页面层优先调用 `@jetlinks-web-core/utils` 导出，不直接跨层引用内部文件。
- 对有副作用的函数（如 `openEdgeUrl`、`createScript`、`registerModule`）建议在用户操作或应用启动阶段调用。
- `transformTree`、`encodeQuery` 会修改传入对象，若需要保留原始数据请先深拷贝。
