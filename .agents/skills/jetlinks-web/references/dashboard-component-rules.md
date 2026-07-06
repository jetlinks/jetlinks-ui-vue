# JetLinks Dashboard Component Rules

本文件用于在当前 JetLinks 工作区中新增或改造 `visDashboard` 仪表盘组件，重点覆盖组件目录约定、注册接线、逻辑分层与交付自检。

## 适用范围

- 新增 `modules/*-ui/visDashboard/**` 下的仪表盘组件
- 改造仪表盘运行组件、配置面板或分组结构
- 接入 `DesignerPreview` / `DashBoardCanvas` 所需的扩展组件

## 先确认运行时入口

当前工作区里，仪表盘组件是否能被设计器读取，不只取决于单个组件目录是否存在，还取决于全局扫描入口是否能发现它。

- 设计器预览入口在 `modules/visualization-manager-ui/components/Designer/preview.vue`
- 仪表盘组件实例扫描入口在 `modules/visualization-dashboard-ui/register.ts`
- 仪表盘左侧组件分组扫描入口在 `modules/visualization-dashboard-ui/packages/component/componentList.ts`
- `modules/device-manager-ui/visDashboard/componentList.ts` 可以作为分组组织参考，但当前设计器实际读取的是 `visualization-dashboard-ui` 模块暴露出来的 utils，而不是该模块内的同名文件

## 目录结构

推荐直接沿用 `modules/device-manager-ui/visDashboard/DeviceManagement` 的切片结构，把公共 UI、hooks、services、types 放在分组目录，而不是堆进单个组件目录。

```text
modules/<module>-ui/visDashboard/
  <Group>/
    manifest.json
    shared.ts
    components/
    hooks/
    services/
    <ComponentA>/
      config.ts
      index.ts
      <ComponentA>.vue
      Config.vue
      <type>.png
    <ComponentB>/
      ...
```

目录职责参考：

- `manifest.json`：分组名称与分组 ID，供扩展组件分组扫描使用
- `shared.ts`：该分组共享的 TypeScript 类型、配置结构、辅助函数
- `components/`：多个仪表盘组件共用的纯展示子组件
- `hooks/`：副作用、轮询、订阅、参数派生、状态流
- `services/`：API 请求、SSE/WebSocket 封装、数据转换
- `<Component>/config.ts`：画布元数据、默认配置、网格尺寸
- `<Component>/index.ts`：运行组件、配置面板、配置元数据导出入口
- `<Component>/Config.vue`：右侧配置面板
- `<Component>/<type>.png`：扩展组件列表缩略图；当前扫描逻辑依赖 `config.type + '.png'`

## 单组件契约

### `config.ts`

参考 `modules/device-manager-ui/visDashboard/DeviceManagement/DeviceCountCard/config.ts`：

- `name`：组件显示名
- `type`：全局唯一组件类型
- `componentProps.style`：布局样式配置
- `componentProps.gridItem`：默认尺寸、最小尺寸
- `componentProps.<componentKey>`：该组件自己的默认业务配置

约束：

- `type` 必须稳定且唯一，新增组件不要复用已有类型
- 组件私有配置建议放在与 `type` 对应的 key 下，例如 `deviceCountCard`
- 默认值要完整，避免运行期依赖未定义字段

### `index.ts`

参考 `modules/device-manager-ui/visDashboard/DeviceManagement/DeviceCountCard/index.ts`：

- 运行组件通过 `defineAsyncComponent` 懒加载
- 配置面板通过 `defineAsyncComponent` 懒加载
- 导出三类对象：运行组件、配置组件数组、配置元数据对象

当前工作区里常见导出形态：

```ts
const DeviceCountCard = {
  name: 'deviceCountCard',
  component: defineAsyncComponent(() => import('./DeviceCountCard.vue'))
}

const DeviceCountCardConfig = [
  {
    name: 'deviceCountCard',
    component: defineAsyncComponent(() => import('./Config.vue'))
  }
]

const DeviceCountCardConfigProps = {
  ...deviceCountCardConfig
}
```

### 运行组件

参考 `modules/device-manager-ui/visDashboard/DeviceManagement/DeviceCountCard/DeviceCountCard.vue`：

- 组件只接收 `info`、`style`、`isEdit`
- 通过 `toRef` 把 props 交给 hook
- 页面展示本身不直接发请求，不直接管理轮询或订阅

推荐模式：

- SFC 保持为纯展示层
- 数据读取、轮询、编辑态短路放进 `hooks/`
- API/SSE/WebSocket 放进 `services/`

### 配置组件

参考 `modules/device-manager-ui/visDashboard/DeviceManagement/DeviceCountCard/Config.vue`：

- 接收 `configData`
- 只负责配置表单与选项组织
- 如果多个组件存在重复配置结构，优先抽成分组级配置组件，例如 `DashboardCountConfig.vue`

## 分层规则

`DeviceManagement` 目录已经给出当前工作区里比较稳妥的分层方式。

### 共享类型与配置合并

参考 `modules/device-manager-ui/visDashboard/DeviceManagement/shared.ts`：

- 用接口统一约束 `DashboardCardInfo`、`DashboardCardProps`、各类配置对象
- 通过 `getComponentConfig` 把运行时 `info.componentProps[key]` 与默认配置合并
- 不要在组件里到处手写 `as any` 读取配置

### 服务层

参考：

- `modules/device-manager-ui/visDashboard/DeviceManagement/services/dashboardMetrics.ts`
- `modules/device-manager-ui/visDashboard/DeviceManagement/services/deviceMap.ts`

规则：

- API 请求、参数拼装、响应校验、数据归一化放在 `services/`
- SSE/EventSource 之类连接封装也放在 `services/`
- 服务层返回已经适合组件消费的结构，避免视图层重复转换

### Hook 层

参考：

- `modules/device-manager-ui/visDashboard/DeviceManagement/hooks/useMetricPolling.ts`
- `modules/device-manager-ui/visDashboard/DeviceManagement/hooks/useMetricCards.ts`
- `modules/device-manager-ui/visDashboard/DeviceManagement/hooks/useDeviceMessage.ts`
- `modules/device-manager-ui/visDashboard/DeviceManagement/hooks/useDeviceMap.ts`

规则：

- hook 负责监听配置变化、触发刷新、管理 `loading` / `error`
- 编辑态 `isEdit` 下应停止请求并回退到占位数据
- 轮询、定时器、流式连接必须在配置变化和卸载时清理
- 多个卡片共享同一套刷新策略时，先抽通用 hook，再派生具体组件 hook

### 展示组件

参考：

- `modules/device-manager-ui/visDashboard/DeviceManagement/components/MetricImageCard.vue`
- `modules/device-manager-ui/visDashboard/DeviceManagement/components/MetricTrendCard.vue`
- `modules/device-manager-ui/visDashboard/DeviceManagement/components/SectionHeader.vue`
- `modules/device-manager-ui/visDashboard/DeviceManagement/components/QuickTimeSelect.vue`

规则：

- 展示组件保持无副作用，只消费 props / emits
- 出现两个及以上重复卡片结构时，优先抽成分组级复用组件
- 优先复用现有设计体系组件，如 `a-spin`、`a-empty`、`a-badge`、`a-tooltip`

## 状态与交互要求

当前工作区里的真实实现已经覆盖了仪表盘组件常见状态，新增组件时不要省略。

- Loading：如 `MetricImageCard.vue`、`DeviceMapCard.vue`
- Error：如 `MetricTrendCard.vue`、`useMetricPolling.ts`
- Empty：如 `DeviceMapCard.vue` 在无点位时渲染 `a-empty`
- Edit Mode：如 `useMetricPolling.ts`、`useDeviceMap.ts`，编辑态不发起真实请求

额外注意：

- 图表和地图组件的父容器必须有真实宽高，避免 0 尺寸导致渲染失败
- 需要时间筛选、标题栏等重复交互时，优先像 `QuickTimeSelect.vue`、`SectionHeader.vue` 一样抽公共组件
- 图表 option 计算和展示条件可以留在运行组件内，但数据获取与刷新策略不要写回组件模板层

## 接入自检

新增扩展仪表盘组件时，至少核对以下事实：

1. 组件目录是否位于 `modules/<module>-ui/visDashboard/<Group>/<Component>/`
2. `manifest.json`、`config.ts`、`index.ts`、`Config.vue` 是否齐全
3. `config.type` 是否唯一，且缩略图文件名是否与 `type` 完全一致
4. 是否把请求、轮询、订阅放进了 `hooks/` 或 `services/`
5. 是否提供了 loading / error / empty / edit mode 行为
6. 若要在设计器里按扩展模块出现，是否通过 `componentScope.modules` 或 `extendComponents` 触发了扫描
7. 若要改默认左侧组件列表，是否更新了 `modules/visualization-dashboard-ui/packages/component/componentList.ts`，而不是只改模块内示例文件

## 参考落点

- 运行时扫描入口：`modules/visualization-dashboard-ui/register.ts`
- 左侧分组扫描入口：`modules/visualization-dashboard-ui/packages/component/componentList.ts`
- 设计器预览接线：`modules/visualization-manager-ui/components/Designer/preview.vue`
- 组件结构参考：`modules/device-manager-ui/visDashboard/DeviceManagement/**`
- 编辑器集成补充说明：`modules/visualization-manager-ui/docs/DASHBOARD_GUIDE.md`
