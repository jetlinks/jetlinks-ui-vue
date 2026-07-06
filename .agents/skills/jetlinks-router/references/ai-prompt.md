# JetLinks AI 开发规则索引

本文件是 JetLinks 系脚手架的总路由，用来帮助智能体先判断任务类型，再切换到最合适的 focused skill，最后按当前工作区的真实实现落地。

**上下文**：本文件较长；日常可先读 `../agents/openai.yaml` 的默认提示词，再按需打开本文件的对应章节。前端交互细则在 `jetlinks-web-style` 分片（`style-catalog-core-base.md` / `style-catalog-core-detail-shell.md` / `style-catalog-templates.md` 等），不要在 router 内复制前端规则正文。

它不提供仓库快照，不硬编码模块清单、包名、版本号或固定目录结构。所有这类信息都必须从当前工作区现有代码、`pom.xml`、资源目录和相邻模块中发现。

## 全局原则

1. 先发现，再实现
    - 不凭记忆假设模块名、注解包、依赖坐标、命令 ID、Topic、资源路径。
    - 先查看当前工作区的相邻代码、父子模块结构、现有配置和示例。

2. 复杂任务先 plan 再实施
    - 对跨模块、多子任务、需求仍在变化、存在多个方案或兼容性风险的任务，先输出精简计划并等待用户确认。
    - 计划至少包含目标、范围、不做什么、实施步骤、风险 / 待确认点和验证方式。
    - 简单低风险小任务可在给出简短计划后直接实施。

3. 后端大改先设计与测试目标，再开发
    - 对较大的后端改动或新功能，必须遵循 [`backend-design-test-driven-rules.md`](backend-design-test-driven-rules.md)。
    - 文档落点遵循 [`document-placement-rules.md`](document-placement-rules.md)：README 只放长期总览，测试报告、任务流水和 PR 证据不放 README。
    - 先把设计稿、任务拆分和测试目标写入当前工作区对应归属文档，再等待用户明确确认。
    - 计划 / PRD / 设计稿是稳定契约，不是执行日志；实现过程中只有需求、方案、任务拆分、风险或测试目标变化时才回写，不追加扫描记录、步骤进度、调试尝试、测试日志、PR 文案或会话总结。
    - 用户确认后，先按真实使用场景和数据制定测试目标，再实现代码，直到测试目标达成。
    - 不允许为了让测试通过而删除测试、弱化断言、只跑无关测试、改低业务期望或绕过真实校验。
    - 兼容性是通用发布边界判断，不只限于 CRUD：API / DTO / Event / Topic / Command / 协议 / 配置 / 前端路由 / QueryParam / termType 等同一 PR 内未发布中间形态优先收敛到最佳实践；已合入、已发布、已有持久化数据或外部依赖时才设计兼容 / 迁移。
    - 添加兼容代码前必须说明兼容对象；拿不准是否已发布或外部依赖时，只问一个具体确认问题，不为了保险保留旧分支。

4. 只切换必要 skill
    - 本文件只做路由。
    - 进入某个场景后，只加载最少数量的 focused skill。

5. 优先复用现有抽象
    - JetLinks 系项目通常已经提供 CRUD 基类、命令服务、事件、订阅、国际化约定。
    - 默认沿用现有模式，不新增平行方案。
    - 对字符串、集合、Map 判空以及常见默认值处理，在依赖已存在或相邻实现已使用时，优先复用 Apache Commons 工具类，不手写重复判空模板；字符串比较 / 前后缀 / 包含 / 索引 / 普通替换等 Commons Lang 操作按大小写语义优先用 `Strings.CS` / `Strings.CI`，不使用已废弃的 `StringUtils.*` 变体，具体规则切到 `$jetlinks-conventions`。

6. 以当前模块风格为准
    - 响应式或阻塞式、`javax` 或 `jakarta`、控制器基类、服务基类、i18n 路径，都以目标模块现状为准。
    - 仅在新建模块且没有可参考实现时，才基于通用规则做最小决策。
    - 前端任务也以当前 workspace 为准：先路由到 `$jetlinks-web`；除局部调整白名单外，同时组合 `$jetlinks-web-style` 建立页面交互方案档案。
    - 前端通用组件、hooks、utils 以当前 workspace 的 `jetlinks-web-core` 和相邻页面真实用法为准；详细前端约束不在 router 中重复维护。

7. 生成最小可用实现
    - 只实现用户明确要求的内容。
    - 不额外生成示例实体、演示接口、假设性的扩展点。
    - 保持改动范围聚焦，不把无关重构、顺手修复或跨主题整理混进当前任务。
    - 涉及 CRUD 查询、详情、更新、删除、批量操作、导出或自定义接口时，必须分析是否需要 AssetsHolder 数据权限控制；具体实现切到 `$jetlinks-assets-permission`，不要手写租户 / 部门 / 创建人过滤替代统一资产权限；资产类型、关联字段、权限动作或例外规则拿不准时先询问用户。

8. 软链接模块同样属于工作区事实
    - 如果模块、组件或聚合目录是符号链接，不要忽略。
    - 需要同时识别“链接入口路径”和“真实目标路径”，必要时沿链接继续读取代码与配置。

9. 低上下文脚手架也要可工作
    - 如果当前仓库几乎没有业务代码、只有少量模板或只是空脚手架，不要停在“缺少参考实现”。
    - 在这种情况下，允许退化到“模板仓库模式”：基于根 `pom.xml`、目录结构、已有依赖和本规则集生成最小可用骨架。
    - 退化模式不仅适用于模块创建，也适用于 CRUD、权限、命令边界、事件驱动和基础 i18n 决策。

10. 任务结束时可以判断是否值得沉淀知识
    - 只有产出了稳定、可复用、非显然的知识时，才建议写总结或沉淀文档。
    - 沉淀形式优先选择 worklog、knowledge、playbook，再考虑 prompt 或 skill 更新。
    - 沉淀文档记录可复用结论，不反向污染计划 / PRD / 设计稿；单次过程流水留在对话、PR / CI、工作流 journal / task log 或用户确认的 worklog。
    - 不为每次任务默认新增文档；先更新已有归属文档，或把一次性测试证据留在 PR / CI。
    - 如果判断值得沉淀，不要直接结束任务；应先提示用户是否需要生成正式文档。
    - 如果结论已经成熟到可抽成通用 JetLinks skill，还应额外询问是否并入 `jetlinks-develop-skills` 并准备官方 PR。

11. 一个任务可以同时使用多个 focused skill
    - 例如“新建模块并补 CRUD”通常会同时使用模块路由、通用规范和 CRUD skill。
    - 例如“改事件处理器并整理 PR”通常会同时使用事件订阅、响应式实践和 Git 交付 skill。
    - 例如“改前端列表页并补提交流程”通常会同时使用前端 skill 和交付 skill。

12. 用户可见异常默认属于 i18n 范畴
   - 优先沿用当前模块已有的 `i18nCode` / message key 异常模型，不在异常构造里写死 message。
   - 只有本地异常体系确实只支持 `message` 时，才在边界层回退到本地化后的文本。

13. 根因优先，禁用奇技淫巧：统一以 [`jetlinks-conventions/references/root-cause-and-no-hack-rules.md`](../../jetlinks-conventions/references/root-cause-and-no-hack-rules.md) 为准；router 不重复列举禁止清单。

14. 注释要平衡人类可读性和模型上下文
   - 复杂业务规则、兼容逻辑、并发 / 生命周期保护、安全边界、TraceHolder / MBean 决策等，需要结合 [`jetlinks-conventions/references/code-comments.md`](../../jetlinks-conventions/references/code-comments.md) 写短注释。
   - 类注释和 SPI 接口方法注释必须完整，写清职责、调用时机、参数、返回、错误、副作用和实现约束；必要时补真实 `@since` 和指向订阅相关类型 / 参考实现的 `@see`。
   - 简单赋值、DTO 搬运、直观方法调用不写噪声注释；优先用好命名和小方法，注释只解释原因和边界。
   - 注释要求必须落到代码里；最终回复、设计稿或 PR 说明不能替代代码旁边的类注释、方法注释或关键分支短注释。

15. 常驻能力要考虑运维可观测性
   - 涉及常驻内存任务、缓存、队列、buffer、重试池、会话 / 连接 / 订阅管理器或后台执行器时，必须结合 [`jetlinks-conventions/references/mbean-observability.md`](../../jetlinks-conventions/references/mbean-observability.md) 判断是否需要 MBean。
   - 目标是辅助运维快速定位问题：看统计、看状态、看最近错误，并在安全边界内刷新缓存、flush、compact 或手动重试。

## 标准工作流

1. 分类任务
    - 判断这是结构发现、模块创建、CRUD、复杂查询、跨服务调用、实时订阅、事件驱动、国际化、前端页面改造、代码注释、MBean 运维可观测性还是导入/注解确认。

2. 判断是否进入 `plan-first`
    - 如果任务复杂、跨模块、需求仍在变化、涉及多个子任务，或存在多个方案 / 明显风险，先输出计划并等待用户确认。
    - 如果是较大的后端改动或新功能，先读取 [`backend-design-test-driven-rules.md`](backend-design-test-driven-rules.md) 和 [`document-placement-rules.md`](document-placement-rules.md)，把设计稿和测试目标落到对应归属文档，等待用户确认后才能实现。

3. 扫描当前工作区
    - 查看根目录、父 `pom.xml`、聚合模块、相邻模块、资源目录和已有实现。
    - 额外检查符号链接目录，确认是否有链接进来的外部模块、组件或子工程。

4. 切换最少 skill
    - 只切到覆盖当前任务的 focused skill。

5. 找相邻示例
    - 在目标模块或相似模块中定位同类实现。
    - 如果示例位于软链接模块中，允许沿链接读取其真实内容。
    - 如果没有相邻示例，切换到模板仓库模式，按通用规则生成最小实现。

6. 实现
    - 复用现有抽象，保持命名、分层、注解和返回类型一致。

7. 校验
    - 检查依赖、注解、导入、编程模型、权限、i18n、事件或 Topic 是否与当前工作区一致。
    - 如果当前环境无法直接执行验证，也要明确给出待执行命令、预期验证点和剩余风险边界。

8. 交付
    - 如果任务包含提交、推送或发 PR，切换到 `$jetlinks-delivery`。
    - 后端新增功能或既有功能变动必须先补或更新对应单元测试。
    - 较大后端改动或新功能的交付说明必须引用设计稿路径、用户确认状态和测试目标达成情况。
    - 运行改单涉及的单元测试；涉及数据库、消息、协议、跨模块边界、外部依赖、启动装配或事件链路时再跑集成测试，未触发时写明不适用原因。
    - 输出测试命令、通过数、失败数、跳过数和覆盖率数据。

9. 沉淀
    - 如果任务已经完成，且产出了稳定经验，切换到 `$jetlinks-capture`。
    - 先判断值不值得沉淀，再决定写成 worklog、knowledge、playbook，还是回写 skill / prompt。
    - 先给出沉淀建议、推荐路径和摘要草稿；用户确认后再生成正式文档。
    - 如果结论已具备跨项目复用价值，再询问是否并入 `https://github.com/jetlinks/jetlinks-develop-skills` 并准备 PR。

## 任务路由

### 先看哪些模块、能力和目录

切换：
- [`$jetlinks-routing`](../../jetlinks-routing/SKILL.md)

适用：
- 不知道代码应该落在哪个模块
- 不知道当前脚手架有哪些业务域、组件域、聚合模块
- 不确定新功能应该挂到现有模块还是新建模块

### 判断“直接依赖 / 命令调用 / 事件 / 订阅”

切换：
- [`$jetlinks-boundary`](../../jetlinks-boundary/SKILL.md)
- [`$jetlinks-assets-permission`](../../jetlinks-assets-permission/SKILL.md)

适用：
- 需要使用其他模块能力
- 不确定是加 Maven 依赖、调用命令服务、发布事件还是订阅消息
- 需要判断命令调用应优先复用显式 command 对象，还是只是跟随本地快捷 API
- 空脚手架中首次建立模块边界约定

### 协议包 / 编解码 / 二进制报文

切换：
- [`$jetlinks-protocol`](../../jetlinks-protocol/SKILL.md)

适用：
- 需要修改 `ProtocolSupportProvider`、`DeviceMessageCodec`、传输路由或认证流程
- 需要分析 MQTT、HTTP、TCP、UDP、CoAP 等协议接入方式
- 需要阅读或调整二进制报文、ACK、消息序号或属性和功能消息映射

### 确认注解、包名、导入

切换：
- [`$jetlinks-conventions`](../../jetlinks-conventions/SKILL.md)

适用：
- 不确定 `javax`/`jakarta`
- 不确定实体、控制器、事件、命令、订阅的注解和导入
- 需要判断复杂代码是否应该补注释，以及类注释 / SPI 方法注释是否完整，SPI 是否需要 `@since` / `@see`
- 需要为常驻任务、缓存、队列或重试池判断 MBean 运维可观测性边界

### 创建新模块或聚合模块

切换：
- [`$jetlinks-routing`](../../jetlinks-routing/SKILL.md)

适用：
- 新建 manager/core/adapter 模块
- 调整聚合 `pom.xml`、自动配置、资源目录
- 空脚手架中首次创建业务模块

边界：
- 如果存在 `manager` / `core` 分层，CRUD、Controller、应用 Service、持久化 Entity / Repository、权限校验、i18n 和运行时装配归 `manager`。
- `core` 只承载公共 domain、DTO、命令 / 事件定义、常量、SPI / 扩展接口等跨模块契约。
- 不因“需要 CRUD”“存在 DTO”“以后可能复用”把 CRUD 放进 `core`，也不默认创建 `xxx-api`。

### 标准 CRUD

切换：
- [`$jetlinks-crud`](../../jetlinks-crud/SKILL.md)

适用：
- Entity / Service / Controller 的常规新增或修改
- 标准增删改查
- 权限、校验、基础 i18n
- AssetsHolder 数据权限可见范围、详情访问、更新删除校验、批量操作和导出边界判断
- 空脚手架中首次创建基础 CRUD 骨架；若存在 `manager` / `core` 分层，CRUD 骨架落到 `manager`，公共 DTO / 命令契约才落到 `core`

### 复杂 CRUD / 查询 / 批处理

切换：
- [`$jetlinks-crud`](../../jetlinks-crud/SKILL.md)

适用：
- 复杂条件查询、分页、聚合、批量修改、关系同步
- CRUD 伴随复杂副作用
- 关联查询或跨模块查询需要判断 AssetsHolder 权限作用在实体自身、关联资产还是服务边界

### 数据权限 / 资产权限

切换：
- [`$jetlinks-assets-permission`](../../jetlinks-assets-permission/SKILL.md)

适用：
- CRUD、自定义查询、聚合、导出、详情、更新、删除、批量操作需要数据权限控制
- 需要判断 `AssetType`、`@AssetsController`、`AssetsHolderCrudController`、`CorrelatesAssetsHolderCrudController`、`CrudAssetPermission`
- 需要使用 `AssetsHolder.injectQueryParam`、`AssetsHolder.assertPermission`、`AssetsHolder.filterAssets`
- 命令服务、订阅或消息推送需要按资产权限过滤
- 拿不准资产类型、关联字段、权限动作或绑定关系

### 跨服务或跨边界调用

切换：
- [`$jetlinks-boundary`](../../jetlinks-boundary/SKILL.md)

适用：
- 命令服务
- 服务代理
- 远程查询和远程操作
- `commandSupport.execute(QueryCommand.of(...))` 这类显式命令对象优先级判断

### 实时消息 / Topic 订阅

切换：
- [`$jetlinks-events`](../../jetlinks-events/SKILL.md)

适用：
- `@Subscribe`
- EventBus/Topic 流式处理
- 设备消息、系统消息、广播消息

### 领域事件 / 生命周期事件

切换：
- [`$jetlinks-events`](../../jetlinks-events/SKILL.md)

适用：
- `@EventListener`
- 实体新增、修改、删除后的副作用
- 事务提交后的异步处理

### 国际化

切换：
- [`$jetlinks-conventions`](../../jetlinks-conventions/SKILL.md)

适用：
- 新增枚举、实体字段、权限、操作、错误消息、提示消息
- 需要把用户可见异常改成 `i18nCode` / message key，而不是写死 message
- 需要判断当前模块是否应该补 i18n
- 需要处理 `LocaleUtils`、`I18nEnumDict`、`messages_zh/messages_en` 等实现细节

### 前端页面开发与改造

切换：
- [`$jetlinks-web`](../../jetlinks-web/SKILL.md)
- 除局部调整白名单外，组合 [`$jetlinks-web-style`](../../jetlinks-web-style/SKILL.md) 先建立方案档案；结构不确定时再让用户选择
- 如任务明确包含页面美化、交互优化、信息层级梳理或状态反馈打磨，在抽取本地样式锚点后再结合 `$frontend-design`

适用：
- Vue3 页面、弹窗、列表、详情改造
- 需要复用当前 workspace 的 `jetlinks-web-core` / `@jetlinks-web` 组件、hooks、utils
- 需要判断前端目录落点、状态边界、类型与质量约束
- 需要先分析业务目标，再决定交互方案，而不是默认 CRUD 表格页
- 多方案时让用户选择业务交互方案；组件落地仍以 `jetlinks-web-core` 真实导出、组件实现和相邻页面用法为准
- `jetlinks-project-ui-cli` 只在用户明确要求时作为外部参考，不是默认依赖或导入来源
- 需要前端 i18n、后端 `EnumDict` / `I18nEnumDict` 的 `{ value, text }` 渲染、ConditionFilter 优先级、轻量字段编辑、无意义数据规避或原型标注清理等细则时，直接遵循 `$jetlinks-web`
- 标准管理表格页不是信息不足时的兜底；`ProSearch` 必须有窄改旧页、用户明确要求旧表格风格或轻量固定筛选的例外理由

### 知识沉淀与经验归档

切换：
- [`$jetlinks-capture`](../../jetlinks-capture/SKILL.md)

适用：
- 任务已经完成，需要判断是否值得总结
- 需要将经验写入统一目录，便于后续智能体检索
- 需要决定这次结论应写成 worklog、knowledge、playbook，还是回写 prompt / skill
- 需要判断这次结论是否已经可以抽成 skill，并继续提交到官方 skills 仓库

### 提交、分支、PR 与测试交付

切换：
- [`$jetlinks-delivery`](../../jetlinks-delivery/SKILL.md)

适用：
- 需要 commit、push、发起 PR
- 需要起草或审查中文 commit message
- 需要生成 shell 可执行的 git commit 命令
- 需要整理提交信息、PR 标题或 PR 描述
- 需要确认是否允许直接推送到目标分支
- 需要给出测试和覆盖率证明
- PR 包含后端新增功能或既有功能变动，需要补齐单元测试、覆盖率、集成测试结果或不适用原因

## 常见组合

- 新建模块并提供 CRUD
    - `$jetlinks-routing`
    - `$jetlinks-crud`
    - `$jetlinks-conventions`

- 在现有模块补一个查询接口
    - `$jetlinks-routing`
    - `$jetlinks-crud`
    - 如模块是响应式，再加 `$jetlinks-reactive`

- 调用其他模块能力
    - `$jetlinks-boundary`
    - 如是响应式模块，再加 `$jetlinks-reactive`

- 修改协议包或联调设备接入
    - `$jetlinks-protocol`
    - 如涉及提交与测试证据，再加 `$jetlinks-delivery`

- CRUD 后要同步其他数据
    - `$jetlinks-crud`
    - `$jetlinks-events`
    - 如涉及响应式链路，再加 `$jetlinks-reactive`

- 常驻缓存、重试队列或后台任务
    - `$jetlinks-conventions`
    - 如涉及事件 / 订阅消费，再加 `$jetlinks-events`
    - 如涉及响应式链路，再加 `$jetlinks-reactive`

- 处理设备或系统消息流
    - `$jetlinks-events`
    - 如需要持久化或反查实体，再加 `$jetlinks-crud`

- 前端页面改造并保持能力复用
    - `$jetlinks-web`
    - 除局部调整白名单外，同时加 `$jetlinks-web-style` 先建立方案档案
    - 如命名/导入/i18n 有约束，再加 `$jetlinks-conventions`

- 前端页面交互优化并保持当前框架风格
    - `$jetlinks-web`
    - `$frontend-design`
    - 如命名/导入/i18n 有约束，再加 `$jetlinks-conventions`

- 前端页面业务流复杂且结构未定
    - `$jetlinks-web`
    - `$jetlinks-web-style`
    - 先建立业务交互方案档案；事实清楚时默认采用推荐方案，结构不确定时让用户在少量方案中选择；必要时先输出线框图或效果草图，再进入实现

- 前端页面需要参考相似业务并统一 Ant Design 风格
    - `$jetlinks-web`
    - 除局部调整白名单外加 `$jetlinks-web-style`
    - `$frontend-design`
    - 参考案例只辅助业务方案和交互节奏，组件仍以当前 workspace 的 `jetlinks-web-core` 为准

- 提交并发起 PR
    - `$jetlinks-delivery`
    - 如改动涉及具体模块，再加对应业务 skill

- 任务完成后沉淀经验
    - `$jetlinks-capture`
    - 如需回写项目规则，再加对应业务 skill
    - 如已抽象成通用 skill，再继续准备 `jetlinks-develop-skills` 官方 PR

## 输出要求

### 当用户要求先分析

输出：
1. 任务分类
2. 需要切换的 focused skill
3. 需要先确认的工作区事实
4. 建议落点和实现边界
5. 如果当前仓库参考实现很少，明确说明将切换到模板仓库模式

### 当用户要求直接实现

执行顺序：
1. 静默完成分类
2. 切换最少 focused skill
3. 查看相邻代码
4. 直接实现
5. 如果任务要求交付，再补测试、提交与 PR 规范检查
6. 如果任务产出了稳定经验，再补沉淀建议、推荐路径和摘要草稿，并询问是否生成正式文档
7. 如果结论已成熟到可抽成通用 skill，再询问是否并入 `jetlinks-develop-skills` 并准备官方 PR
8. 总结本次遵循的规则和验证结果
