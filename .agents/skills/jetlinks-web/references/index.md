# JetLinks Web References Index

本文件仅做轻量导航。核心入口是 [`web-development-rules.md`](web-development-rules.md)。

## Navigation

- [web-development-rules.md](web-development-rules.md): 核心入口、任务分类、标准工作流与核心约束
- [component-source-rules.md](component-source-rules.md): `jetlinks-web-core` 组件事实源、外部参考边界与新版样例提取规则
- [interaction-solution-catalog.md](interaction-solution-catalog.md): 交互模版薄索引；事实源按分片：`style-catalog.md`、`style-catalog-routing.md`、`style-catalog-core.md`（入口）、`style-catalog-core-base.md`、`style-catalog-core-detail-shell.md`、按需 `style-catalog-templates.md` 单节
- [component-reuse-patterns.md](component-reuse-patterns.md): 卡片、列表、详情、图标、动态编辑、抽屉、标签等场景的组件复用矩阵
- [capability-reuse-rules.md](capability-reuse-rules.md): 组件/hooks/utils 与包级能力复用规则
- [dashboard-component-rules.md](dashboard-component-rules.md): `visDashboard` 仪表盘组件目录、注册、分层与接线规则
- [directory-structure-rules.md](directory-structure-rules.md): 目录层级与模块落点规则
- [page-pattern-decision-rules.md](page-pattern-decision-rules.md): 根据业务目标选择 CRUD、工作台、详情页、分步流等页面分型
- [block-admission-rules.md](block-admission-rules.md): 判断统计卡、图表、快捷入口、概览区等区块是否值得存在
- [business-ui-example-rules.md](business-ui-example-rules.md): 如何借鉴相似业务案例，以及哪些“看起来高级”的设计不应照搬
- [condition-filter-rules.md](condition-filter-rules.md): 表达式搜索、Token 化条件输入、远程选项面板、条件路由与快捷筛选联动规则
- [enum-rendering-rules.md](enum-rendering-rules.md): 后端 `EnumDict` / `I18nEnumDict` 返回 `{ value, text }` 时的显示、提交、筛选和回显规则
- [state-management-rules.md](state-management-rules.md): 状态边界与 store 使用规则
- [quality-and-type-rules.md](quality-and-type-rules.md): 质量约束与 TypeScript 约束
- [example-locations.md](example-locations.md): 示例定位与检索命令

## Quick Selection

1. 先明确任务类型和执行路径：`web-development-rules.md`
2. 先确认组件事实源和外部参考边界：`component-source-rules.md`
3. 页面结构或交互路径有多种可能：按 [`../../jetlinks-web-style/references/style-catalog.md`](../../jetlinks-web-style/references/style-catalog.md) 的推荐路径加载分片（routing + **core-base** + 按需 **core-detail-shell** + 仅候选模版节），勿整篇 `style-catalog-templates.md`
4. 需要统一卡片、列表、详情、图标、动态编辑等组件：`component-reuse-patterns.md`
5. 页面结构仍不知道该做成什么：`page-pattern-decision-rules.md`
6. 不确定某个区块、统计卡或图表该不该存在：`block-admission-rules.md`
7. 需要借鉴案例但怕抄错场景：`business-ui-example-rules.md`
8. 需要表达式搜索、通用筛选或远程选项筛选：`condition-filter-rules.md`
9. 接口字段来自 `EnumDict` / `I18nEnumDict` 或返回 `{ value, text }`：`enum-rendering-rules.md`
10. 先判断复用能力再写代码：`capability-reuse-rules.md`
11. 做 `visDashboard` 仪表盘组件：`dashboard-component-rules.md`
12. 不确定代码放哪里：`directory-structure-rules.md`
13. 状态边界不清晰：`state-management-rules.md`
14. 交付前质量或类型风险检查：`quality-and-type-rules.md`
15. 需要找真实实现样例：`example-locations.md`
