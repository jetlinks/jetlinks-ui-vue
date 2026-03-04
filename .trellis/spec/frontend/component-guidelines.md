# 组件规范

> 本项目组件编写方式。

---

## 概览

默认使用 Vue 3 SFC + `script setup`。
通用组件主要位于 `jetlinks-web-core/src/components`，业务组件位于各模块 `views` 或 `components`。

## 组件文件结构

推荐顺序：

1. `<template>`
2. `<script setup lang="ts">`
3. `<style scoped lang="less">`

常见模式：

- 组件显式命名（`name` 或 `defineOptions`）
- `ref + defineExpose` 做父子联动
- `provide/inject` 在复杂页面传递上下文

参考：

- `jetlinks-web-core/src/components/Search/Search.vue`
- `modules/authentication-manager-ui/views/system/User/index.vue`
- `modules/authentication-manager-ui/views/system/User/components/EditUserDialog.vue`

## Props 与 Emits

- 优先使用 `defineProps({...})` 指定默认值与运行时约束
- 复杂类型使用 `PropType<T>`
- 事件建议使用 `defineEmits<...>()` 保持契约明确

## 样式约定

- 默认使用 `scoped + less`
- 仅在必要时使用 `:deep(...)`
- 主题变量优先复用全局变量与现有样式体系

---

## 通用组件注册约定

`jetlinks-web-core/src/main.ts` 通过 `.use(components)` 全局注册了大量通用组件，
组件定义入口在 `jetlinks-web-core/src/components/index.ts`。

因此日常页面中优先直接使用组件标签，不需要重复局部 import（除非模块内有同名覆盖组件）。

---

## `index.ts` 全量组件使用说明（按分类，含功能 + 示例）

> 本节覆盖 `jetlinks-web-core/src/components/index.ts` 的全部注册项（含 `FormItem` 动态注册与 `Echarts` 插件注册）。
>
> 命名提示：
>
> - `TimeSelect` 全局标签名为 `JDashboardTimeSelect`（组件 `name`）。
> - `Echarts` 通过 `app.use(Echarts)` 注册，全局标签名为 `JEcharts`。
> - `FormItemOrg/FormItemRole/FormItemPosition` 推荐在模板中使用 `form-item-*` 写法。

### A) 页面布局与结构

- `BasicLayoutPage`：系统主框架页（菜单、面包屑、头部）。示例：路由配置 `component: BasicLayoutPage`。
- `BlankLayoutPage`：空白壳页面（登录、单页流程等）。示例：路由配置 `component: BlankLayoutPage`。
- `FullPage`：自适应满高容器。示例：`<FullPage :showScroll="true"><j-pro-table ... /></FullPage>`。
- `TitleComponent`：分区标题栏（支持 `extra` 插槽）。示例：`<TitleComponent data="基础信息"><template #extra><a-button type="link">刷新</a-button></template></TitleComponent>`。
- `TitleValue`：标题 + 值展示。示例：`<TitleValue title="设备ID">{{ detail.id }}</TitleValue>`。
- `TabsCard`：图片/文案卡片式 Tab。示例：`<TabsCard :options="tabOptions" v-model:activeKey="activeKey" />`。

### B) 查询、列表与批量操作

- `ProSearch`：统一高级搜索区（含搜索历史）。示例：`<ProSearch :columns="columns" target="system-user" @search="onSearch" />`。
- `CardBox`：卡片列表项容器（状态、操作、选中）。示例：`<CardBox :value="item" :actions="actions" :active="selectedIds.includes(item.id)" @click="onSelect" />`。
- `CrudTable`：`ProSearch + j-pro-table + EditDialog` 一体化 CRUD。示例：`<CrudTable :columns="columns" :request="queryPage" :schema="schema" permission="system/User" />`。
- `BatchDropdown`：批量操作下拉/已选状态切换。示例：`<BatchDropdown v-model:isCheck="isBatchCheck" :actions="batchActions" @change="onBatchModeChange" />`。
- `VirtualScroll`：长列表虚拟滚动。示例：`<VirtualScroll :data="list" :itemHeight="40" @reachBottom="loadMore"><template #renderItem="item"><div>{{ item.name }}</div></template></VirtualScroll>`。
- `CheckButton`：单/多选按钮组。示例：`<CheckButton v-model:value="form.level" :options="levelOptions" />`。
- `ConfirmModal`：点击触发确认弹窗。示例：`<ConfirmModal title="确认删除？" :onConfirm="onDelete"><a-button danger>删除</a-button></ConfirmModal>`。

### C) 条件构建与表单编辑

- `EditDialog`：配置驱动新增/编辑弹窗。示例：`<EditDialog v-if="visible" :data="current" :schema="schema" :request="saveData" @save="reload" @close="visible=false" />`。
- `MetadataValueItem`：按 `valueType` 自动渲染输入控件。示例：`<MetadataValueItem :item="metadataItem" v-model="form.value" />`。
- `TermsCascader`：单条条件构建器。示例：`<TermsCascader :value="term" :showValueType="false" @change="onTermsChange" />`。
- `TermsCascaderGroup`：条件组（组内/组间 AND/OR）。示例：`<TermsCascaderGroup v-model:value="termsGroup" :showValueType="true" />`。
- `TermsCascaderGroupItem`：组内条件明细（细粒度场景）。示例：`<TermsCascaderGroupItem v-model:value="termsItems" :minItems="1" />`。
- `Editable`：点击即改的轻量可编辑控件。示例：`<Editable v-model:value="row.name" type="string" />`。
- `FormItemEditable`：`a-form-item` + `Editable` 组合。示例：`<FormItemEditable name="name" label="名称" v-model:value="form.name" :rules="[{ required: true, message: '请输入名称' }]" />`。
- `InputEditable`：文本快速编辑（展示态/编辑态切换）。示例：`<InputEditable :value="detail.name" :maxLength="64" @change="onRename" />`。
- `FormItemOrg`：组织选择器（树形，多选友好）。示例：`<form-item-org v-model:value="form.orgIdList" :extraProps="{ multiple: true }" />`。
- `FormItemRole`：角色选择器（分组树）。示例：`<form-item-role v-model:value="form.roleIdList" :extraProps="{ multiple: true }" />`。
- `FormItemPosition`：职位选择器（组织/职位组合展示）。示例：`<form-item-position v-model:value="form.positions" :extraProps="{ multiple: true }" />`。
- `IconLibrary`：图标选择器。示例：`<IconLibrary v-model:type="form.icon" />`。
- `MonacoEditor`：JSON/脚本编辑器。示例：`<MonacoEditor v-model="script" language="json" :options="{ minimap: { enabled: false } }" @errorChange="onEditorError" />`。

### D) 上传、导入与媒体展示

- `ProUpload`：图片上传（带裁剪与大小限制）。示例：`<ProUpload v-model:modelValue="form.photoUrl" accept="image/jpeg,image/png" :size="4" />`。
- `ImageUpload`：图片上传（`v-model:value`）。示例：`<ImageUpload :value="form.logo" @update:value="(v) => form.logo = v" />`。
- `BatchImport`：批量导入弹窗（模板下载 + 导入执行）。示例：`<BatchImport v-if="visible" :downloadUrlBuilder="downloadTemplate" :request="importApi" @save="reload" @close="visible=false" />`。
- `Player`：视频播放器（mp4/flv/m3u8/rtc）。示例：`<Player :url="videoUrl" autoplay :live="false" protocol="mp4" />`。
- `Image`：带 loading 状态的图片组件。示例：`<Image width="100%" :src="previewUrl" alt="preview" />`。
- `ChatTextArea`：支持拖拽上传与发送的聊天输入区。示例：`<ChatTextArea :uploadCategories="['image','document']" @send="onSend" @update:inputHeight="onHeightChange" />`。

### E) 地图、时间与可视化

- `AMapComponent`：高德地图容器。示例：`<AMapComponent style="height: 400px" @init="onMapInit"><el-amap-marker :position="point" /></AMapComponent>`。
- `PathSimplifier`：地图轨迹简化与回放。示例：`<PathSimplifier ref="pathRef" :pathData="pathData" />`（可通过 `pathRef.start()` 启动回放）。
- `SelectAMap`：地图坐标拾取输入。示例：`<SelectAMap v-model:point="form.coordinate" @change="onPointChange" />`。
- `JDashboardTimeSelect`：仪表盘时间范围快捷选择。示例：`<JDashboardTimeSelect :type="'week'" :quickBtnList="quickBtnList" @change="onTimeChange" />`。
- `FullCalendar`：日历计划与日期选择。示例：`<FullCalendar :preview="true" @selectDate="onSelectDate" />`。
- `JEcharts`：ECharts 图表容器。示例：`<JEcharts :option="echartsOptions" />`。

### F) 动态扩展与远程组件

- `RemoteComponent`：运行时加载远程组件。示例：`<RemoteComponent remoteName="device-ui" componentName="DevicePanel" :componentProps="{ id: deviceId }" />`。
- `RegistryComponent`：按页面注册点动态插入组件。示例：`<RegistryComponent code="detail-tabs" :activeKey="activeKey"><a-tabs key="base" /></RegistryComponent>`。
- `DesignerPreview`：可视化设计 JSON 预览。示例：`<DesignerPreview :data="designerSchema" />`。

### G) 安全校验

- `Captcha`：图形验证码（弹窗或内嵌）。示例：`<Captcha :open="captchaVisible" :config="captchaConfig" :showDialog="false" @success="onCaptchaSuccess" @update:open="(v) => captchaVisible = v" />`。

### 参考文件（建议优先检索）

- `jetlinks-web-core/src/components/index.ts`
- `modules/authentication-manager-ui/views/system/User/index.vue`
- `modules/authentication-manager-ui/views/system/User/components/EditUserDialog.vue`
- `modules/device-manager-ui/views/device/Instance/Detail/Running/Property/Detail/PropertyAMap.vue`
- `modules/notify-manager-ui/views/Template/Detail/components/ToUserModal/Modal.vue`

---

## 使用优先级建议

新增页面优先组合：

1. `ProSearch` + `j-pro-table`（查询 + 列表）
2. `CardBox`（卡片模式）
3. `EditDialog` 或业务弹窗（新增/编辑）
4. `BatchImport` / 上传组件（批量导入导出）

这样能最大程度复用项目已有交互与样式体系。

## 场景化快速选型（推荐）

> 目标：让 AI 或开发者在拿到需求后，优先命中正确组件组合。

### 场景 1：标准列表页（查询 + 表格）

- 推荐组合：`FullPage` + `ProSearch` + `j-pro-table`（或 `CrudTable`）
- 适用：后台管理、设备列表、用户列表

示例：

```vue
<ProSearch :columns="columns" target="system-user" @search="(p) => params = p" />
<FullPage>
  <j-pro-table :columns="columns" :request="queryPage" :params="params" />
</FullPage>
```

### 场景 2：卡片列表页（带状态 + 操作）

- 推荐组合：`j-pro-table`（card 模式） + `CardBox` + `BatchDropdown`
- 适用：模板、资源、设备分组等可视化卡片列表

示例：

```vue
<BatchDropdown v-model:isCheck="isBatchCheck" :actions="batchActions" />
<j-pro-table mode="CARD">
  <template #card="item">
    <CardBox :value="item" :actions="actions" :active="selectedIds.includes(item.id)" />
  </template>
</j-pro-table>
```

### 场景 3：新增弹窗（配置驱动）

- 推荐组合：`EditDialog`
- 适用：字段结构稳定、校验规则固定、希望减少重复表单代码

示例：

```vue
<a-button type="primary" @click="visible = true">新增</a-button>
<EditDialog
  v-if="visible"
  title="新增用户"
  :schema="schema"
  :request="saveUser"
  @save="reload"
  @close="visible = false"
/>
```

### 场景 4：编辑页（原位编辑 / 行内编辑）

- 推荐组合：`InputEditable` / `Editable` / `FormItemEditable`
- 适用：详情页轻量编辑、无需完整弹窗流程

示例（详情头部改名）：

```vue
<InputEditable :value="detail.name" :maxLength="64" @change="onRename" />
```

示例（表单内可编辑项）：

```vue
<FormItemEditable
  name="name"
  label="名称"
  v-model:value="form.name"
  :rules="[{ required: true, message: '请输入名称' }]"
/>
```

### 场景 5：批量导入与文件/图片上传

- 推荐组合：`BatchImport` + `ProUpload` + `ImageUpload`
- 适用：批量导入设备/用户，头像/封面上传

示例：

```vue
<BatchImport
  v-if="importVisible"
  :downloadUrlBuilder="downloadTemplate"
  :request="importUsers"
  @save="reload"
  @close="importVisible = false"
/>
<ProUpload v-model:modelValue="form.photoUrl" accept="image/jpeg,image/png" :size="4" />
```

### 场景 6：组织/角色/职位授权编辑

- 推荐组合：`form-item-org` + `form-item-role` + `form-item-position`
- 适用：用户编辑、权限分配、组织绑定

示例：

```vue
<form-item-org v-model:value="form.orgIdList" :extraProps="{ multiple: true }" />
<form-item-role v-model:value="form.roleIdList" :extraProps="{ multiple: true }" />
<form-item-position v-model:value="form.positions" :extraProps="{ multiple: true }" />
```

### 场景 7：地图轨迹与坐标配置

- 推荐组合：`AMapComponent` + `PathSimplifier` + `SelectAMap`
- 适用：轨迹回放、地理围栏、定位点录入

示例：

```vue
<SelectAMap v-model:point="form.coordinate" />
<AMapComponent style="height: 400px">
  <PathSimplifier ref="pathRef" :pathData="pathData" />
</AMapComponent>
```

### 场景 8：数据看板与图表分析

- 推荐组合：`JDashboardTimeSelect` + `JEcharts` + `FullCalendar`
- 适用：监控看板、趋势分析、计划排期

示例：

```vue
<JDashboardTimeSelect :type="'week'" @change="onTimeChange" />
<JEcharts :option="trendOption" />
<FullCalendar :preview="true" />
```

### 场景 9：动态扩展与微前端集成

- 推荐组合：`RegistryComponent` + `RemoteComponent` + `DesignerPreview`
- 适用：按页面动态插槽扩展、远程组件挂载、可视化方案预览

示例：

```vue
<RegistryComponent code="detail-tabs" :activeKey="activeKey">
  <a-tabs key="base" />
</RegistryComponent>
<RemoteComponent remoteName="device-ui" componentName="DevicePanel" :componentProps="{ id: deviceId }" />
```

## 常见问题

- 提交前遗留 `console.log`
- 组件内部塞入过多页面级逻辑
- 已有别名不使用，仍使用深层相对路径
- 没有复用通用组件，导致页面交互风格不一致
