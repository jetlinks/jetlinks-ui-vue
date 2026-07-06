---
name: jetlinks-crud
description: 在 JetLinks 脚手架中实现标准或高级 CRUD 开发。适用于需要新增或修改实体、服务、控制器、查询流程、批量更新，或处理与 CRUD 相关副作用，同时遵循当前模块现有风格的场景。
---

# JetLinks CRUD

Read [`references/common-crud-rules.md`](references/common-crud-rules.md) first.

## Workflow

1. Confirm the target module's execution model and CRUD base abstractions.
2. If this is a new backend feature, large CRUD change, or CRUD change spanning multiple layers, first follow [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): write the design draft and test goals to the appropriate docs directory and wait for explicit user confirmation.
3. Follow the smallest existing Entity, Service, and Controller pattern that matches the task.
4. If the task includes `createQuery()`, `createUpdate()`, `createDelete()`, `QueryParamEntity`, sorting, nested conditions, pagination, AssetsHolder query injection, QueryHelper, complex SQL, native SQL, or multi-query result composition, read [`references/query-dsl-rules.md`](references/query-dsl-rules.md).
5. If the task includes complex query, batch processing, or CRUD side effects, read [`references/advanced-crud-rules.md`](references/advanced-crud-rules.md).
6. If the task includes custom `termType`, QueryParam condition mapping, related-table filters, or `SubTableTermFragmentBuilder`-style exists queries, also read [`references/dynamic-term-rules.md`](references/dynamic-term-rules.md).
7. Pair with `$jetlinks-assets-permission` whenever CRUD query, detail, update, delete, batch operation, export, or custom endpoint needs data permission control through AssetsHolder.
8. Before implementing, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md): public Entity / DTO / Controller / Service contracts, custom endpoints, non-obvious validation, AssetsHolder boundaries, compatibility, batch limits, lifecycle guards, and complex QueryHelper / SQL / DSL decisions.
9. Pair with `$jetlinks-conventions` or `$jetlinks-reactive` when imports, i18n, comments, or reactive style need extra care.

## Required Constraints

- Do not generate generic CRUD boilerplate that duplicates existing base classes.
- Do not add custom endpoints when the existing query abstraction already covers the use case.
- Do not hand-roll SQL or private filter DTOs when `createQuery()` / `QueryParamEntity` can express the condition, sorting, pagination, or nested logic.
- Do not concatenate dynamic SQL or manually assemble paged / parent-child query results when `QueryHelper`, `transformPageResult`, or `combineOneToMany` fits the task.
- Do not compress complex CRUD DSL into one unreadable chain. When query construction, permission injection, sorting, pagination, result composition, and side effects mix together, split them into named parameters, query builders, or helper methods.
- Do not write database-dialect-specific SQL unless the user explicitly limits the target database or the module already has that constraint; prefer standard SQL and record dialect risk in docs and PR when unavoidable.
- Do not treat SQL as complete just because it returns correct rows on tiny samples; complex SQL, native SQL, deep pagination, aggregation, joins, or batch writes need pressure testing or documented performance evidence.
- Do not perform row-by-row save / delete when `createUpdate()` / `createDelete()` can express the batch operation; use `setNull(...)` for real null assignment.
- Prefer moving heavy side effects out of the main CRUD flow.
- When Apache Commons utilities are already available in the target module or adjacent CRUD code, prefer them for common null or empty checks; for string comparison/search/prefix/suffix operations, follow `$jetlinks-conventions` and use `Strings.CS` / `Strings.CI` instead of deprecated `StringUtils.*` variants when available.
- Do not implement a large CRUD feature before the design draft, task breakdown, and realistic test goals have been documented and confirmed.
- For any CRUD query, detail, update, delete, batch operation, export, or custom endpoint, analyze whether AssetsHolder data permission control is required. Route implementation details to `$jetlinks-assets-permission`. If asset type, related asset field, permission action, binding relation, or admin / tenant / platform exception semantics are unclear, ask the user before implementation.
- Do not weaken tests to satisfy the CRUD gate; tests must assert realistic business results, persistence effects, permissions, validation, and regression paths that matter to the change.
- Do not leave generated CRUD code comment-free when it adds public classes, custom endpoints, permission boundaries, complex query composition, compatibility, batch limits, or non-obvious validation. Add concise code comments at those points; skip comments only for plain fields, standard inherited CRUD, direct DTO mapping, or obvious one-line delegation.
- When CRUD code changes are made, run relevant validation when possible; otherwise state the exact pending commands and remaining CRUD risks.
- For validation, not-found, and conflict errors visible to users, prefer the module's i18n-aware exception pattern over hardcoded exception messages.

## Response Shape

1. CRUD scope
2. Existing abstractions to reuse
3. Design doc path and test goals when the backend design gate applies
4. Whether advanced CRUD rules are needed
5. Whether Query DSL rules are needed
6. Whether QueryHelper or batch update/delete DSL is needed
7. CRUD DSL readability decision when chains become complex
8. Database portability and performance evidence when SQL is involved
9. Comment targets added, or the concrete reason no code comments were needed
10. Verification evidence or exact pending commands
11. Remaining CRUD risks
