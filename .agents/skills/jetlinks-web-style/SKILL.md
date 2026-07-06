---
name: jetlinks-web-style
description: 为 JetLinks 前端页面选择、复用并约束业务交互方案。这是 JetLinks 前端交互方案选择的核心入口。除非任务属于"局部调整白名单"（改一个字段 / 改一个筛选条件 / 改一个弹窗 / 仅样式与文案 props 微调），任何新增页面、重构页面壳层、调整信息架构或主筛选 / 主列表 / 主详情承载都必须先形成一个可交付的方案档案：按 `style-catalog.md`（索引）加载 `style-catalog-routing.md`、`style-catalog-core-base.md`，详情 / 侧栏相关再加载 `style-catalog-core-detail-shell.md`，并只读取 `style-catalog-templates.md` 中候选对应的 `###` 小节。输出 1 个推荐方案和最多 3 个替代方案；若业务事实不足或结构风险高则先让用户确认，否则可采用推荐方案继续实现。按统一字段（业务任务 / 首屏 ASCII 线框 / 信息密度 / 编辑梯度 / 核心组件 / 状态锚点 / 不借鉴清单）稳定复用结构与 `jetlinks-web-core` 组件组合，禁止默认回退成"传统后台表格 + 编辑弹窗"套壳；标准管理表格页和 `ProSearch` 只能在有明确业务或兼容依据时使用。
---

# JetLinks Web Style

Read [`references/style-selection-rules.md`](references/style-selection-rules.md) first. A solution profile is **mandatory by default**; explicit user confirmation is required only when facts are insufficient or the structural choice is risky.

## Workflow

1. Read [`references/style-selection-rules.md`](references/style-selection-rules.md) and determine whether this task hits the **local-tweak whitelist** (single form field, single filter chip, single dialog content, styling/copy/props-only). If it does, hand back to `../jetlinks-web/SKILL.md` for direct implementation; no solution profile is needed.
2. Identify the first task, target user, operated object count, success criterion, and source of key metrics/charts. If one critical fact is unknown, ask one focused question; if two or more are unknown, or 2+ templates remain equally plausible, stop for clarification.
3. If the user already named a solution, reference page, or said "按当前资产页这种结构", map it directly to the closest solution in [`references/style-catalog-templates.md`](references/style-catalog-templates.md) (read only the matching `###` section) and continue. Still record what will **not** be borrowed from the reference.
4. Otherwise, pick candidates using [`references/style-catalog-routing.md`](references/style-catalog-routing.md)'s "业务任务 → 方案路由" table. Present 1 recommended solution and 1-3 alternatives from [`references/style-catalog-templates.md`](references/style-catalog-templates.md); **load only the `###` subsections for those candidates**, not the full file. Do not silently default to a CRUD shell. Do not ask an open-ended design question.
5. For each option, describe the business fit, first-screen ASCII skeleton, information density target, edit trigger gradient, core `jetlinks-web-core` component families, state/label anchor, main action placement, and what should not be borrowed from unrelated pages. If `标准管理表格页` is recommended, explicitly say why card ledger / filter workbench / detail workspace are not a better fit.
6. Decide the confirmation mode: if the user explicitly asked for implementation and the recommendation is clearly supported by the known facts, proceed with the recommended option and report it as the assumed choice; otherwise ask the user to choose before coding. Never block on choice when only one business-fit solution is credible and the change is reversible.
7. Record a compact solution profile before implementation: solution name, primary filter surface, content surface, detail carrier, edit mode, core components to verify, action placement, density target, sidebar mode, confirmation mode, and rejected alternatives.
8. Restate the anti-admin-shell hard constraints from [`references/style-catalog-core-base.md`](references/style-catalog-core-base.md) and, when the chosen solution implies object detail / master-detail / runtime-edit shell / app sidebar, also from [`references/style-catalog-core-detail-shell.md`](references/style-catalog-core-detail-shell.md) (see [`references/style-catalog-core.md`](references/style-catalog-core.md) entry table). Cover at minimum: edit trigger gradient, no-stack first screen + **one main visual anchor per screen**, state-before-fields + **no single-side colored bar as primary status signal**, density target, modal-is-not-the-only-edit-path; when the solution carries a single-object detail header, the "详情页头部摘要区" rule: name/description inline editable, tags added/removed in place, status switched via quick actions, no "编辑按钮 → 基本信息表单"; always the "编辑交互样式统一" rule: per-field-type fixed component mapping with identical trigger and save behavior across modules, no bespoke editable text / chip / inline form / validation bubble when `jetlinks-web-core` already exposes one; when the solution carries an object detail page, also apply the "详情页 10 条硬规则" + AI 味 7 条不要 + 反向引用做主区段; when the solution introduces a sidebar, apply the two-tier active-state rule + the 8 collapsible-group etiquette rules; for top-level tab root routes, do not render PageHead; for floating elements, tokenized z-index and single-FAB-per-page, so implementation does not drift.
9. Hand implementation back to `../jetlinks-web/SKILL.md`, but keep the chosen solution profile stable unless the user explicitly changes it; component availability must still be verified from the target workspace `jetlinks-web-core`.
10. When the user says "复用现在这种风格", treat it as a request to reuse the closest business interaction solution; match the existing structure and interaction skeleton instead of inventing a visually different page shell.
11. When a new reusable solution emerges, extend [`references/style-catalog-templates.md`](references/style-catalog-templates.md) with a new `###` section (and update the index table in [`references/style-catalog.md`](references/style-catalog.md) if needed) instead of rewriting this workflow.

## Required Constraints

- Do not skip the solution profile by default; only the local-tweak whitelist (single form field / single filter chip / single dialog content / styling-copy-props-only) may bypass it.
- Do not confuse "must form a solution profile" with "must always wait for the user"; ask only when missing facts, high-risk structure, or multiple equally valid templates make autonomous selection unsafe.
- Do not ask the user to "describe the style they want" in the abstract when you can provide concrete business solution options.
- Do not offer more than 4 solution options at once.
- Do not present two options that differ only by cosmetic wording; options must imply a different business structure, content surface, detail carrier, or edit mode.
- Do not default every page to a CRUD table shell; solution selection exists to prevent that failure mode.
- Do not recommend `标准管理表格页` as the fallback for missing facts. It is valid only when the first task is clearly batch retrieval / column comparison / lightweight CRUD; otherwise route to asset ledger, filter workbench, detail workspace, disposal workbench, timeline, wizard, or ask for the missing fact.
- Do not use `ProSearch` as part of the solution profile unless the profile records a concrete exception: narrow old-page patch, user explicitly wants old table style, or only a few fixed filters with no route echo / remote enum or reference options / saved search needs. Prefer `ConditionFilter` for new pages.
- Do not stack the "4 KPI cards + top search + big table" backend triplet on a page without business evidence; treat it as a forbidden default.
- Do not invent dashboards, KPI cards, sidebars, or banners unless the selected solution actually requires them and the business model supports them.
- Do not present a solution option without its ASCII skeleton, edit gradient, core component families, and "不借鉴清单" summary; missing fields cause drift in implementation.
- If the user has already approved a solution in the current thread, reuse it and avoid re-asking unless requirements materially changed.
- When the user references an existing page as the anchor, treat that page as a business solution source and explain the mapped solution name explicitly.
- Do not treat solution choice as component proof; after selection, implementation must still use `../jetlinks-web/SKILL.md` to verify current workspace `jetlinks-web-core` components.
- Do not offer a solution copied from a completely different business scenario unless you can explain the shared user task and what will not be borrowed.
- Do not let "frontend-design" or any other design skill override the chosen solution; Ant Design / Ant Design Vue and the catalog's hard constraints remain the visual baseline.

## Response Shape

When solution selection is needed:

1. Why solution choice matters for this page (which first-task is the user really doing)
2. Recommended solution and 1-3 alternatives, each with: business fit, first-screen ASCII skeleton, density target, edit trigger gradient, core components, state/label anchor, main action placement
3. What will not be borrowed from unrelated examples (per each option's "不借鉴清单")
4. If standard table or `ProSearch` appears, the explicit reason and rejected alternatives
5. Confirmation mode: proceed with recommended option, or ask the user to choose, with the single business reason
6. Anti-admin-shell constraints that will be enforced once the profile is locked

When a solution is already chosen:

1. Chosen solution name
2. Stable structure, filter surface, content surface, detail carrier, edit mode, core components to verify, action placement, density target, sidebar mode, confirmation mode, rejected alternatives
3. Search-shell decision: `ConditionFilter` default, or `ProSearch` exception reason
4. Anti-admin-shell hard constraints that apply (edit gradient, no-stack first screen + one main anchor per screen, state-before-fields + no single-side colored bar, density, modal-not-only-edit-path, detail-page header summary zone with inline-edit basics, site-wide edit interaction unification, detail-page 10 hard rules + AI-flavor self-check + reverse-reference as main section when applicable, sidebar two-tier active rule + 8 collapsible-group rules + top-level root routes skip PageHead, tokenized z-index + single-FAB-per-page)
5. Which implementation skill to combine next and what `jetlinks-web-core` components still need verification
