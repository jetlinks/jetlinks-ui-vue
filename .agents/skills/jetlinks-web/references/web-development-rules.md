# JetLinks Web Development Rules

本文件是 `jetlinks-web` 的核心入口文档。先读本文件，再按任务需要加载其他参考文档。

## 任务分类

- 页面实现或改造：列表页、详情页、弹窗页、配置页
- 仪表盘组件：`visDashboard` 运行组件、配置面板、设计器接线
- 能力复用：组件、hooks、utils、包级能力选择
- 交互方案选择：标准管理表格、资产卡片台账、筛选工作台、对象详情工作区、主从详情、配置向导、资源选择器
- 目录落点：代码放 `jetlinks-web-core` 还是 `modules/*-ui`
- 状态治理：本地状态、路由状态、store、服务端状态边界
- 质量与类型：交付质量、TypeScript 风险控制
- 业务驱动体验设计：工作台、流程页、概览页、监控页、分步任务页、非标准 CRUD 交互
- 参考借鉴：相邻页面、相似业务案例、Ant Design 交互模式的受控参考

## 标准工作流

1. 先查看目标模块相邻页面，确认真实技术栈、命名、交互风格，并提炼当前前端框架的样式锚点。
2. 先核验工作区事实，再写代码：导出入口、依赖包、模块目录、已有示例。
3. 先分析真实业务：目标用户是谁，最关键动作是什么，页面是在支撑录入、审核、监控、排障、运营还是配置，不要默认它只是“管理表”。
4. 先确认组件事实源：当前 workspace 的 `jetlinks-web-core/src/components/index.ts` 和 `jetlinks-web-core/src/components/*` 是通用组件第一事实源；业务页面和外部组件库只能作为参考，不能替代本地导出核验。
5. 先做能力复用评估，再决定是否新增实现。
6. 编码前执行组件抽离与复用门禁：确认要改哪些 Vue/JSX/TSX 文件、每个文件职责边界、是否可能超过 300 行、是否已有组件 / hooks / utils / services 可复用。
7. 若文件预计超过 300 行、重复结构出现 2 次以上、请求或业务编排准备进入组件，先拆分到子组件、hook、service/api 或 util，再实现。
8. 只加载最小必要参考文档，不一次性读取全部 references。
9. 先定参考优先级：相邻页面 > 同业务域实现 > 相似业务案例 > Ant Design 官方交互模式；参考始终是辅助，不替代业务分析。
10. 若以下五项中任一关键事实未知：目标用户、进入页面后的第一任务、成功标准、操作对象是一条还是一批、关键指标/图表的数据来源，则先向用户提问；若其中两项及以上未知，或页面结构在多种分型间仍摇摆，必须先澄清再实现。
11. 交互方案档案默认强制：除非任务命中 `../../jetlinks-web-style/references/style-selection-rules.md` 中定义的"局部调整白名单"（仅改一个表单字段 / 仅改一个筛选条件 / 仅改一个弹窗内容 / 仅样式与文案与组件 props 微调），任何新增页面、重构页面壳层、调整信息架构或调整主筛选 / 主列表 / 主详情承载方式都必须先联合 `jetlinks-web-style` 建立方案档案再实现：读 [`../../jetlinks-web-style/references/style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md)（索引）+ [`style-catalog-routing.md`](../../jetlinks-web-style/references/style-catalog-routing.md) + 仅 [`style-catalog-templates.md`](../../jetlinks-web-style/references/style-catalog-templates.md) 中推荐方案和替代方案对应的 `###` 小节（禁止整篇 templates）、以及 [`style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md)（§1–§6）+ 按需 [`style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md)（详情 / 侧栏相关）、入口见 [`style-catalog-core.md`](../../jetlinks-web-style/references/style-catalog-core.md)，不允许默认回退到传统 CRUD 页面。若已知事实清楚且只有一个可信推荐方案，可以记录"默认采用推荐方案"并继续；若页面骨架或信息架构风险较高，或 2 个以上方案同样合理，先给出线框图 / 方案选项并等待确认再实现。
12. 先确认当前模块前端 i18n 的真实接入方式：页面标题、字段展示名、表格列名、按钮文案、状态文案、空态提示、校验消息和枚举文本从哪里取值，默认值如何表达；优先沿用相邻实现，不在页面代码中散落硬编码文案。
13. 先确认后端枚举字段契约：`EnumDict` / `I18nEnumDict` 通常返回 `{ value, text }`。用户可见处显示 `text`，提交 / 筛选 / 比较 / 状态色使用 `value`；详细规则见 [`enum-rendering-rules.md`](enum-rendering-rules.md)。
14. 如页面存在通用搜索或筛选层，先确认当前 workspace 是否已提供 `ConditionFilter` 及其编码、回显工具；若已提供，默认优先用它承接搜索层，不因已选页面风格或管理页壳层而直接回退 `ProSearch`。使用 `ProSearch` 必须在方案档案或实现说明中写明例外理由。
15. 方案选定后，按卡片、列表、筛选、详情、轻量编辑、完整编辑、图标、抽屉、底部操作、资源选择等场景映射 `jetlinks-web-core` 组件，再决定是否需要新增局部实现。
16. 使用最小完整改动完成需求，优先沿用现有页面组合和模块边界。
17. 按质量与类型约束做交付前自检，补充可验证路径。

## 业务优先，参考为辅

- 先回答“用户为什么需要这个页面、进入后第一件事要做什么、做完后如何离开”，再决定布局和交互。
- 参考的目的，是帮助补足信息架构、区块节奏、反馈方式和操作组织，而不是替当前业务做决策。
- 只有当参考页面与当前业务在对象模型、任务目标、决策链路上足够接近时，才允许借鉴它的交互组织。
- 完全不同业务场景中的布局、统计卡、快捷操作、流程步骤、看板分栏、告警层级、审批动作等，不应直接照搬。
- 任何首屏数字、统计卡、图表、趋势、排行榜或快捷入口，都必须能回答“这个信息帮助谁做什么决策”；回答不了就删掉。
- 新版样例页面只用于提取方案、布局、组件组合和交互节奏，不复制业务字段、接口、指标、局部组件实现或样例数据。
- `jetlinks-project-ui-cli` 仅在用户明确要求参考时作为外部参考，不进入默认依赖链，也不能作为当前项目组件存在性的证据。

## 先建方案档案，再选组件

- **core 入口**：[`style-catalog-core.md`](../../jetlinks-web-style/references/style-catalog-core.md)；**§1–§6**：[`style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md)；**§7+ / 侧栏 / FAB**：[`style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md)；**索引**：[`style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md)；**路由与统一字段**：[`style-catalog-routing.md`](../../jetlinks-web-style/references/style-catalog-routing.md)；**13 个模版详述**（仅读候选对应 `###`）：[`style-catalog-templates.md`](../../jetlinks-web-style/references/style-catalog-templates.md)。
- 除非命中"局部调整白名单"，否则方案档案是默认强制环节；不允许跳过 `jetlinks-web-style` 直接落地传统 CRUD 套壳。
- 推荐方案和替代方案必须遵守 routing 中的统一字段：业务任务、首屏 ASCII 线框骨架、信息密度目标、编辑触发梯度、核心组件族（来自 `jetlinks-web-core`，落地前仍要核验）、状态 / 标签锚点、主要动作位置、不借鉴清单。
- 候选必须基于 routing 中"业务任务 → 模版路由"挑选；事实清楚且只有一个可信推荐时记录"默认采用推荐方案"并继续，关键事实缺失或两个以上方案同样合理时再让用户选择。
- 方案档案锁定后，保持模版稳定，再按组件复用矩阵选择 `jetlinks-web-core` 组件，并在实现时同步遵守 `style-catalog-core-base.md` 与（若适用）`style-catalog-core-detail-shell.md` 中的反传统后台感硬约束（编辑触发梯度 `inline > sectional > drawer > modal > page`、首屏不可叠加 + **一屏一主视觉锚点**、状态先于字段 + **禁单侧彩色线条作为主要状态信号**、信息密度目标、文案面向终端用户、弹窗不是唯一编辑路径、详情页头部摘要区、编辑交互样式统一、详情页 10 条硬规则、AI 味 7 条不要、反向引用做主区段不放右栏 sticky、侧栏 active 态分档、侧栏折叠 8 条精美规则、顶级路由不渲染 PageHead、浮动元素 z-index token 化 + 单页一个 FAB）。
- 不要随机挑一个其他业务功能来直接搬，也不要把不同业务中的指标、流程和操作布局移植到当前页面。

## 通用组件优先复用

- 卡片、列表、详情、图标、动态编辑、筛选、抽屉、标签、状态和资源选择等常见场景，应先映射到 `jetlinks-web-core` 已有组件。
- 名称、标签、说明、备注、描述等轻量字段优先单项编辑；不要为了编辑一个字段打开完整表单。
- 详情页应支持对象摘要、分区详情、局部编辑和关联记录；不要固定为“表格列表 + 弹窗编辑”。
- 详情页头部摘要区与编辑样式统一以 [`../../jetlinks-web-style/references/style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md) §7、§8 为准（见该文件表格与反模式）。
- 整站编辑控件映射可与 [`component-reuse-patterns.md`](component-reuse-patterns.md) 场景矩阵对照；勿在页面自造 catalog 已规定的控件组合。
- 功能介绍只服务最终用户理解能力、开通条件、配置影响和下一步操作，不展示开发说明、交互原理或原型标注。
- 写任何用户可见文案前，先识别功能的最终用户角色（运营 / 运维 / 平台管理员 / 租户管理员 / 设备管理员 / 业务管理员 / 终端使用者 / 开发集成方等具体角色）、用户目标动作、用户能看懂的术语和下一步；四件事任何一件答不上来先问，不要硬写。
- 禁止把用户的原始需求文本、prompt、内部任务描述、需求文档原文或开发故事卡描述直接放进页面文案、说明卡、Tooltip、空态、帮助区域或弹窗描述；必须按最终用户视角重写，动作动词开头，少用"用于 / 旨在 / 通过 / 借助"等需求文档口吻。
- 用户可见文案中禁止出现字段 key、变量名、API 路径、组件名、Topic 名、命令 ID、权限码、内部 schema 名以及"TODO / 待定 / 占位文案 / 待接接口 / 这里以后接数据 / 原型说明 / 交互方式 / 设计意图"等开发态字样。
- 空态 / 错态 / 加载态文案要具体到对象与下一步动作，例如"暂未接入设备，先创建一个产品再添加设备"；校验文案给具体限制和示例；提交反馈要带对象名与影响范围，而不是"操作成功"。
- 帮助 / 说明优先以 Tooltip、Popconfirm、空态引导、状态附加说明承接，不在顶部塞一块说明 banner；同一段功能介绍不在 banner、空态、Tooltip、帮助入口里重复出现。
- 如果不复用现有组件，必须说明已核验的导出入口、相邻页面和具体能力缺口。

## 必须先问用户的触发条件

- 目标用户不清楚。
- 用户进入页面后的第一任务不清楚。
- 页面成功标准不清楚。
- 用户主要操作的是单对象还是对象集合不清楚。
- 任一关键统计数字、图表、趋势、排行的数据来源或业务用途不清楚。
- 页面分型在“标准管理页 / 详情页 / 工作台 / 分步流 / 概览页”等多个模式之间无法收敛。
- 页面壳层或交互风格存在多个合理方案，且不同方案会明显影响首屏组织或关键操作路径。
- 卡片、列表、详情、编辑方式或资源选择方式存在多个合理方案，且会明显影响用户操作路径。

命中规则：

- 命中 1 项且该项影响页面结构或首屏信息组织：先问用户，再实现。
- 命中 2 项及以上：必须暂停实现，先澄清。

## 原型只用于对齐，不进入最终界面

- 线框图、效果草图、信息架构草图的用途，是帮助开发者、产品和用户确认方向。
- 最终页面是给终端用户使用的，不是给开发者阅读设计思路的。
- 因此不要在最终界面中展示诸如“交互方式”“设计原理”“交互说明”“这里展示 xxx”“待接接口”“后续扩展”“模块说明”等原型或开发标注。
- 若确需说明复杂交互，优先通过自然的文案、控件状态、空态提示、帮助信息、Tooltip 或引导流程表达，而不是把设计备注直接渲染到页面上。
- 在线框阶段可以暂时用标注辅助沟通；一旦进入正式实现，这些标注必须清理掉或转换为真正面向用户的界面文案。

## 用户可见文案统一走国际化

- 页面标题、区块标题、字段展示名、表格列头、按钮文案、Tab 名称、占位文案、空态/错态提示、Tooltip、帮助信息、校验消息、枚举显示值等，只要最终用户会看到，就应优先走当前工作区既有 i18n 机制。
- 不要在页面组件、schema、columns、常量表或渲染函数里到处散落硬编码中文或英文文案。
- 如果当前工作区的 i18n 抽象支持默认值或 fallback，可以使用中文作为默认展示文本；但最终仍应通过统一的 i18n 入口取值，而不是直接把中文写死在页面结构中。
- 如果相邻模块尚未形成清晰的前端 i18n 约定，先按当前模块事实复用最接近的实现，并在需要时结合 `$jetlinks-conventions` 判断落点，不要临时自造另一套国际化封装。
- “字段名不要写死”指的是字段展示名、列名、标题、按钮和提示文案不要散落硬编码；接口字段 key、路由参数 key、查询参数名等技术契约仍以真实接口和相邻实现为准。

## 后端枚举渲染

- 后端字段来自 `EnumDict` / `I18nEnumDict` 时，默认按 `{ value, text }` 处理。
- 表格、卡片、详情、Tag、Badge、Tooltip 和筛选 Token 显示 `text`，不要直接渲染整个对象。
- 表单 model、查询参数、路由参数、状态颜色、图标、排序、权限判断使用 `value`。
- 后端已经返回 `text` 时，前端不再重复维护枚举文案映射；如需颜色 / 图标，只按 `value` 建稳定映射。
- 同一字段可能返回字符串或对象时，集中 normalize，不在模板里到处写三元表达式。
- 条件筛选中的枚举字段优先走 `ConditionFilter` 的通用选项能力，支持 `loadOptions` 和 `loadSelectedOptions`，确保 URL 只存 `value` 也能回显 `text`。

## 与 `$frontend-design` 协同

- 仅当任务包含页面美化、交互优化、层级梳理、状态页完善或体验打磨时，再考虑结合 `$frontend-design`。
- 结合前必须先从当前工作区提炼具体样式锚点：Ant Design / Ant Design Vue 组件语言、排版密度、间距尺度、色彩和状态色、圆角/阴影、按钮和表单反馈、表格操作区、弹窗/抽屉/Tabs 行为、图标和动效语气。
- 把 `$frontend-design` 当成“现有 Ant Design 体系内的交互与视觉润色助手”，而不是重新定义品牌、字体、配色和页面骨架的重设计引擎。
- 当页面壳层或交互方案仍未定时，先建立方案档案；事实清楚时默认采用推荐方案，结构仍有分歧时让用户在少量贴合业务的方案中选择，不要直接把“管理页”当作默认壳。
- 页面交互方案选择只决定业务结构、信息层级和操作路径，不直接决定搜索组件；搜索层仍应单独判断是否优先使用 `ConditionFilter`。
- 页面交互方案选择不替代组件核验；选定方案后仍必须回到当前 workspace 的 `jetlinks-web-core` 组件、hooks 和 utils。
- 先确认页面是否真的适合 CRUD 范式；只有当页面已被明确判断为标准管理页时，才进入管理页组合判断。
- 对标准管理页，若 workspace 已提供 `ConditionFilter` 与路由编码/回显工具，默认优先采用 `ConditionFilter` + `j-pro-table`；只有窄改旧页、用户明确要求旧表格风格，或搜索只是轻量固定表单筛选且无路由回显 / 远程枚举或引用选项 / 保存搜索需求时，才回退到 `ProSearch`。
- 使用 `ProSearch` 的例外必须具体：窄改旧页、用户明确要求旧表格风格、或筛选只有少量固定字段且无路由回显、远程枚举/引用选项、保存搜索、快捷筛选联动需求。相邻页面仍在用 `ProSearch` 只能作为兼容证据，不能让新页面默认沿用原始表格风格。
- 标准管理表格页不是“信息不足时的默认方案”。如果第一任务不是批量检索和轻量增删改查，或对象状态识别、持续筛选、处置流、单对象理解更重要，应优先走资产卡片台账、筛选工作台、对象详情工作区、处置工作台等方案。
- 如果核心价值在监控、分析、流程推进、异常处置或对象关系理解，优先考虑工作台、主从详情、分步流、时间线、卡片区块、图形化概览等更贴近业务的结构。
- 可以参考相似业务的设计，但必须先说明“为什么这个参考与当前业务相似”；只借鉴有业务对应关系的分区、交互和状态呈现，不照搬完全不同场景的交互动线。
- 优先优化信息层级、区块节奏、反馈状态、空/错/载态、微交互和可读性；不要平地起楼式替换成熟页面组合。
- 除非用户明确要求大改版，否则不要新增脱离现有框架的字体体系、品牌主色、背景装饰、重型动效或陌生组件语言。
- 不要为了让页面“看起来丰富”而堆叠无业务意义的统计数字、假趋势图、无来源占位数据或纯装饰卡片。
- 当需求描述不足以支持页面结构决策时，优先问清楚；当文字讨论成本高时，优先提供低保真线框图、信息架构草图或效果预览帮助用户确认方向。

## 按场景加载文档

- 能力复用与组件/Hook/utils 选型：[`capability-reuse-rules.md`](capability-reuse-rules.md)
- 组件事实源和外部参考边界：[`component-source-rules.md`](component-source-rules.md)
- 交互模版分片（**不要整篇加载** `style-catalog-templates.md`）：[`../../jetlinks-web-style/references/style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md) · [`style-catalog-routing.md`](../../jetlinks-web-style/references/style-catalog-routing.md) · [`style-catalog-core.md`](../../jetlinks-web-style/references/style-catalog-core.md)（入口）· [`style-catalog-core-base.md`](../../jetlinks-web-style/references/style-catalog-core-base.md) · [`style-catalog-core-detail-shell.md`](../../jetlinks-web-style/references/style-catalog-core-detail-shell.md) · [`style-catalog-templates.md`](../../jetlinks-web-style/references/style-catalog-templates.md)；本仓库 [`interaction-solution-catalog.md`](interaction-solution-catalog.md) 为上述分片的薄索引
- 卡片、列表、详情、图标、动态编辑等复用矩阵：[`component-reuse-patterns.md`](component-reuse-patterns.md)
- `visDashboard` 仪表盘组件开发：[`dashboard-component-rules.md`](dashboard-component-rules.md)
- 模块与文件落点：[`directory-structure-rules.md`](directory-structure-rules.md)
- 页面类型不确定：[`page-pattern-decision-rules.md`](page-pattern-decision-rules.md)
- 判断区块、统计卡、图表、快捷入口是否该出现：[`block-admission-rules.md`](block-admission-rules.md)
- 借鉴相似业务案例与避免误抄：[`business-ui-example-rules.md`](business-ui-example-rules.md)
- 状态边界与 store 使用：[`state-management-rules.md`](state-management-rules.md)
- 样式变量、字号、间距节奏和局部尺寸约束：结合 `../../jetlinks-web-style/SKILL.md`，以 `jetlinks-web-core/src/style.css` 与 `../../jetlinks-web-style/references/style-rules.md` 为准。
- 质量与类型约束：[`quality-and-type-rules.md`](quality-and-type-rules.md)
- 后端枚举渲染：[`enum-rendering-rules.md`](enum-rendering-rules.md)
- 示例查找入口：[`example-locations.md`](example-locations.md)
- 快速导航总览：[`index.md`](index.md)

## 核心约束

- 不要发明不存在的组件契约、hook 签名或 utils API。
- 不要绕开已有 `@jetlinks-web-core`/`@jetlinks-web` 能力重造同类实现。
- 不要把 `jetlinks-project-ui-cli` 当成默认依赖、默认导入来源或当前项目组件存在性的证据。
- 不要在业务模块里重复手写 `jetlinks-web-core` 已有的通用卡片、详情、抽屉、标签、轻量编辑、资源选择或筛选组件。
- 不要把文档中的能力名称当作固定事实，必须以当前工作区导出为准。
- 不要在页面内硬编码路由权限、菜单元数据、API base 或 token 行为。
- 不要在组件内硬编码设计值；颜色、圆角、阴影、字号、字体、间距和局部尺寸优先复用 Ant Design Vue 能力与 `jetlinks-web-core/src/style.css` 变量或工具类，字号必须使用字号变量或组件默认字号，确实没有 token 可用的自定义局部尺寸统一按 `16px` 基准写 `rem`。
- 不要把一次任务扩展成大范围结构重写，优先最小改动、可验证交付。
- 不要把 `$frontend-design` 产出的创意风格直接覆盖到 JetLinks 页面；现有框架风格、组件库和交互语法始终优先。
- 不要因为实现方便就把业务页面压缩成老套的“筛选 + 表格 + 弹窗”后台 CRUD 套壳，除非当前业务和相邻实现都明确证明这就是最合适的结构。
- 不要默认表格 + 全量编辑表单；对象详情应优先考虑摘要、分区、局部编辑和关联记录。
- 不要在页面壳层或风格仍未收敛时，跳过 `jetlinks-web-style` 方案档案直接默认传统 CRUD 管理页。
- 不要在 workspace 已提供 `ConditionFilter` 及配套编码/回显工具时，仍默认回退到 `ProSearch` 作为通用搜索壳；只有窄改旧页、用户明确要求旧表格风格，或当前筛选确实只是轻量固定表单且没有路由回显 / 远程枚举或引用选项 / 保存搜索需求时才可例外。
- 不要在没有写明例外理由时使用 `ProSearch`；新页面默认先走方案档案 + `ConditionFilter`，不要靠 `ProSearch` 原始表格风格完成页面生成。
- 不要把后端 `EnumDict` / `I18nEnumDict` 返回的 `{ value, text }` 直接渲染成对象，也不要为了显示文案在前端重复维护一份枚举文本映射。
- 不要把完全不同业务场景中的交互路径、快捷操作、状态组织或统计模块直接搬过来。
- 不要添加无来源、无决策价值、无后续动作承接的数据展示，只为了填满页面。
- 不要在未确认真实数据源、刷新机制和业务用途前实现统计卡、图表、趋势或排行榜。
- 不要在页面组件、schema、columns、按钮配置或状态映射里散落硬编码用户可见文案；统一走现有 i18n 入口。
- 不要把原型图中的说明文字、开发注释、交互原理、占位备注直接带进最终页面。
- Vue/JSX/TSX 文件超过 300 行必须拆分，这是编码阶段门禁，不是交付后建议。
- 新增组件、hook、service 或 util 前必须先查已有能力；能复用或配置扩展时，不新增平行实现。
- 页面组件只保留布局组合、状态展示和事件分发；请求、参数组装、业务编排、复杂计算把“超过 300 行”简单处理成空壳组件拆 fix 外，不应继续追加功能代码；应先抽出子组件、hook` 文件执行行数检查，并在最终回复中说明是否存在超过 300 行的文件。

## 自检清单

- 是否已核验目标能力在当前工作区真实存在。
- 是否先完成了业务目标、目标用户和关键任务路径分析，而不是直接套用后台管理页模板。
- 是否坚持了“业务优先、参考为辅”，并只借鉴了相似业务中真正适配的部分。
- 是否优先复用了现有组件、hooks、utils 或 store 契约。
- 是否已通过 `jetlinks-web-style` 建立业务交互方案档案、明确确认模式，并保持方案稳定。
- 是否将卡片、列表、详情、图标、动态编辑、筛选、抽屉、标签和资源选择映射到了 `jetlinks-web-core` 组件。
- 如果没有复用 `jetlinks-web-core` 组件，是否给出了可验证的导出、样例和能力缺口证据。
- 是否保持了模块边界、目录风格和页面交互一致性。
- 如果结合了 `$frontend-design`，是否先抽取并遵守了本地样式锚点，而不是另起一套视觉体系。
- 页面里的统计数字、图表、概览卡和快捷入口是否都具备清晰业务含义、真实来源或明确动作承接。
- 是否已清理原型阶段的说明标注、设计备注和开发者导向文案，只保留终端用户真正需要看到的内容。
- 用户可见标题、字段展示名、列头、按钮、状态和提示文案是否统一走了当前工作区 i18n 机制，并在需要时提供了中文默认值。
- 如果需求存在关键不确定性，是否先向用户确认，或先提供了线框/效果草图帮助对齐。
- 是否完成了关键交互、状态流、路由权限和类型风险验证。
