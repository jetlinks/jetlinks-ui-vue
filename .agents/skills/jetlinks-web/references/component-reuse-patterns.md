# JetLinks Web Component Reuse Patterns

本文件用于把常见前端场景映射到 `jetlinks-web-core` 通用组件，约束同类页面保持一致实现。交互模版的单一事实源按分片加载：[`../../jetlinks-web-style/references/style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md)（索引）+ [`style-catalog-templates.md`](../../jetlinks-web-style/references/style-catalog-templates.md)（按需只读候选 `###`）+ [`style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md)（§1–§6）+ 按需 [`style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md)；本文件只给出组件级复用矩阵、编辑触发梯度表与短约束，详情头 / 10 条 / 侧栏等**见 detail-shell，下文不重复**。

## 反传统后台感硬约束

实现时必须遵守的正向硬约束，避免页面默默回退成"传统后台 + 大表格 + 全字段弹窗"套壳：

### 编辑触发梯度（按业务最小代价优先）

| 优先级 | 触发方式 | 适用场景 | 推荐组件 |
| --- | --- | --- | --- |
| 1 | inline 单字段 | 名称、标签、说明、备注、描述、状态切换、单一开关 | `InputEditable` / `Editable` / `FormItemEditable` |
| 2 | 分区局部编辑 | 单一对象的某个分区字段集合（基本信息 / 归属等） | `SectionCard` + `KvGrid` + `StickyActionBar` |
| 3 | 局部抽屉 | 单一目标 + 字段较多 + 希望保留上下文 | `JlDrawerShell` + 表单 + `StickyActionBar` |
| 4 | 完整弹窗 | 字段多、强校验、跨字段依赖 | `EditDialog` |
| 5 | 独立配置页 | 多阶段、长流程、需要独立 URL | 配置向导（Steps）+ 独立路由 |

> 名称 / 标签 / 说明 / 备注 / 描述 / 状态切换 / 单一开关这类轻量字段，**禁止默认打开完整编辑弹窗**。

### 其他硬约束

- 首屏不可叠加：禁选"4 KPI 卡 + 顶部搜索栏 + 大表格"的经营分析三段套壳；任何统计卡 / 趋势图 / 排行榜没有真实数据源、刷新机制、动作承接时必须删除或降级
- **一屏一主视觉锚点**：主 CTA / 关键数据带 / 真实产品状态区三选一，不叠加；工作流页主要内容（表格 / 列表 / 详情）必须首屏可见，不允许解释型 hero / 装饰卡 / 教程文案把它推下去
- 状态先于字段：列表 / 卡片 / 摘要区的第一信息层必须是状态、标签、归属、主动作（用 `j-badge-status` / `MetaChip` / `AppTag`）
- **状态强调收口**：状态优先用 `.pill` / 小 dot / 完整描边 / 弱状态底；**禁止** `border-left: 3px solid` 或 `box-shadow: inset 4px 0 0` 这类单侧彩色线条作为主要状态信号；业务列表已有 status pill 时，行本身只用 hover / selected 弱底，不再叠彩色左条
- 信息密度目标：卡片墙每行 3-4 张、单卡核心字段 ≤ 5 + 状态徽标；摘要列表单行 ≤ 7 个关键信息块；表格列数 6-10、操作列 1-2 个常用 + "更多"
- 动作就近：常用动作随对象就近呈现，不堆 toolbar
- 文案面向终端用户：禁出现"待接接口 / 这里以后接数据 / 模块说明 / 交互方式 / 设计意图"等开发态文字；统一走当前 i18n
- 弹窗不是唯一编辑路径：详情页必须先评估能否走 inline / sectional 编辑，再决定是否需要弹窗

## 详情页 / 编辑统一样式 / 整页版式 / 侧栏（不重复展开）

以下为 `jetlinks-web-style` 中与组件选型强相关、且正文很长的规范：**通用 §1–§6**见 [`../../jetlinks-web-style/references/style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md)；**详情头 / §8 编辑统一 / 详情 10 条 / 侧栏 / FAB**见 [`../../jetlinks-web-style/references/style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md)（单文件 ~16KB）。**入口表**见 [`../../jetlinks-web-style/references/style-catalog-core.md`](../../jetlinks-web-style/references/style-catalog-core.md)。

- **§7** 详情页头部摘要区（名称 / 说明 inline、标签就地、状态快捷动作、反模式）
- **§8** 编辑交互样式统一（字段 → 控件唯一映射、节奏、反模式）
- **详情页 10 条硬规则** + AI 味 7 条不要 + **反向引用**做主区段
- **侧栏与导航交互**（active 分两档、折叠 8 条、顶级路由不渲染 PageHead、FAB / z-index）

本文件向下只保留**场景 → 组件矩阵**与短规则，避免与 core 双重占用上下文。

## 场景组件矩阵

| 场景 | 优先组件 | 使用要点 |
| --- | --- | --- |
| 卡片 | `EntityCard` / `CardBox` / `ResponsiveGrid` | 卡片只承载单个对象摘要、状态、标签和主要动作，不做装饰容器 |
| 列表 | `j-pro-table` / 摘要列表 / `VirtualScroll` | 标准列对比用表格，复杂记录定位用摘要列表或卡片 |
| 筛选 | `ConditionFilter` / `QuickFilterSidebar` | 主筛选与快捷筛选共用同一条件模型 |
| 条件字段编辑 | `ConditionFilter` 字段定义 / `loadOptions` / `loadSelectedOptions` / `handleParamsItem` | 先走字段驱动编辑器，不为单个字段造专属搜索组件 |
| 详情分区 | `SectionCard` / `KvGrid` / `TabsCard` | 对象详情优先分区展示，避免散落字段块 |
| 轻量编辑 | `InputEditable` / `Editable` / `FormItemEditable` | 名称、标签、说明、备注、描述等字段优先单项编辑 |
| 完整编辑 | `EditDialog` / `JlDrawerShell` / 独立配置页 | 仅在字段多、依赖强或需要完整校验时使用 |
| 抽屉 | `JlDrawerShell` | 详情 quick view、帮助内容、单步表单和试运行面板优先复用统一抽屉壳 |
| 底部操作 | `StickyActionBar` | 页面、详情、抽屉底部固定操作保持统一 |
| 标签与状态 | `MetaChip` / `ChipGroup` / `AppTag` / `j-badge-status` | 状态、分类、能力标签统一胶囊或状态组件 |
| 图标 | `AIcon` / `IconLibrary` / 当前项目图标资产 | 图标表达状态、动作或对象类型，不做无意义装饰 |
| 动态扩展 | `RegistryComponent` / `RemoteComponent` | 运行时扩展优先注册读取，不直接跨模块引用实现 |
| 资源选择 | `MarketplaceResourcePicker` / `CardSelect` | 需要预览、筛选、能力说明时不要退化为普通下拉 |

## 详情页编辑规则

- 名称、标签、说明、备注、描述等轻量字段优先单项编辑。
- 单项编辑应复用 `InputEditable`、`Editable` 或 `FormItemEditable`。
- 不要为了编辑一个字段打开完整编辑表单。
- 复杂配置才进入 `EditDialog`、`JlDrawerShell` 或独立配置页。
- 详情页应包含对象摘要、分区详情、局部编辑和关联记录，而不是固定表格弹窗。

## 功能介绍规则

### 先识别功能的最终用户

写任何功能介绍 / 说明卡 / 引导文案 / 帮助提示前，先回答四件事：

- 这个功能的最终用户是谁（运营 / 运维 / 平台管理员 / 租户管理员 / 设备管理员 / 业务管理员 / 终端使用者 / 开发集成方等具体角色）。
- 用户进入这个页面想要完成的目标动作是什么。
- 用户能看懂的术语是什么（不是字段 key、API 路径、组件名、Topic、命令 ID、权限码）。
- 用户做完这一步后下一步是什么。

四件事任何一件答不上来，先问用户，不要硬写。

### 不允许出现

- 把用户的**原始需求文本、prompt、内部任务描述、需求文档原文、开发故事卡描述**直接放进页面文案、说明卡、Tooltip、空态提示、帮助区域或弹窗描述。
- 开发视角口吻："本功能用于实现...""我们将提供...""这里展示用户希望的...""按需求实现 XX 能力"。
- 字段 key、变量名、API 路径、组件名、Topic 名、命令 ID、权限码、内部 schema 名出现在用户可见文案中。
- "原型说明 / 设计意图 / 交互方式 / 占位文案 / 待接接口 / 这里以后接数据 / TODO / 待定" 等开发态文字。
- 没有真实动作承接或业务价值的介绍区块（删掉）。
- 把同一段功能介绍复制贴到首屏 banner、空态、Tooltip、帮助入口里，造成冗余。

### 必须做到

- 功能介绍只服务最终用户理解：能做什么 + 启用前置条件 + 配置影响 + 下一步去哪，能用 2 行说清就不写 3 行。
- 文案从最终用户视角改写：动作动词开头，少用"用于 / 旨在 / 通过 / 借助"等需求文档口吻。
- 帮助优先以 Tooltip、Popconfirm、空态引导、状态附加说明承接，而不是顶部塞一块说明 banner。
- 状态 / 空态 / 错态 / 加载态文案要具体到对象与下一步动作，例如"暂未接入设备，先创建一个产品再添加设备"，而不是"暂无数据"。
- 校验文案给出具体限制和示例，例如"长度 32 字符内，仅支持字母、数字、`_`、`-`"，而不是"输入有误"。
- 多角色页面按角色就近呈现：管理员才看得到的说明不要漏到租户视图。

## 复用决策

实现前必须回答：

- 当前场景属于矩阵中的哪一类。
- `jetlinks-web-core/src/components/index.ts` 是否已导出对应组件。
- 相邻页面如何使用该组件。
- 复用时需要遵守哪些 props、slots、emits、权限或 i18n 约定。
- 如果不复用，缺的是交互能力、数据契约、展示能力还是扩展能力。

## 反模式

- 每个业务页面都手写自己的卡片、标签、详情字段栅格、抽屉壳或底部操作条。
- 把轻量字段修改塞进完整编辑弹窗。
- 为资源选择、能力选择、模型选择手写普通下拉，导致没有预览、筛选和说明。
- 为了页面看起来完整，新增没有业务动作承接的介绍卡、统计卡或图标区。
- 复制其他业务页面的局部组件，而不先判断是否应复用或沉淀到 `jetlinks-web-core`。
- 默认"4 KPI 卡 + 顶部搜索栏 + 大表格"的"经营分析"三段套壳；任何无来源、无动作承接的统计 / 趋势 / 排行都属于此类。
- 把完整编辑弹窗当成唯一编辑路径，跳过 inline / sectional 编辑评估。
- 用多 Tab 平铺同质化内容（每个 Tab 只是同一组字段的另一种分组），制造"信息丰富"假象。
- 列表 / 卡片首屏堆全字段，不先用状态徽标、标签胶囊、归属、主动作建立识别度。
- 在没有业务真实数据源时塞入装饰性 `JEcharts` 图表占位。
- 模版选择跳过用户确认，直接默认落到标准管理表格页。
- 新页面用 `ProSearch` 原始表格风格兜底，而没有写明旧页兼容、用户明确要求或轻量固定筛选例外。
- 直接渲染后端 `{ value, text }` 枚举对象，或为同一枚举在多个组件重复维护文案映射。

## 自检清单

- 是否已把场景映射到明确的 `jetlinks-web-core` 组件。
- 同类页面是否使用同一组件和交互骨架。
- 轻量字段是否支持单项编辑。
- 是否为搜索层明确了 `ConditionFilter` / `ProSearch` 决策，且 `ProSearch` 有具体例外理由。
- 后端 `EnumDict` / `I18nEnumDict` 枚举是否显示 `text`、提交和逻辑使用 `value`。
- 是否避免了重复手写卡片、列表、详情、图标和抽屉。
- 未复用时是否给出可验证证据。
