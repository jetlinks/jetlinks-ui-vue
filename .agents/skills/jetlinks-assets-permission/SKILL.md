---
name: jetlinks-assets-permission
description: 在当前 JetLinks 工作区中使用统一 AssetsHolder 资产权限体系处理数据权限。适用于 CRUD 查询、详情、更新、删除、批量、导出、自定义接口、关联资产、命令服务、订阅或聚合查询需要资产权限控制，或需要判断 AssetType、@AssetsController、AssetsHolderCrudController、CorrelatesAssetsHolderCrudController、CrudAssetPermission、AssetsHolder.injectQueryParam / assertPermission / filterAssets 用法的场景。
---

# JetLinks Assets Permission

Read [`references/assets-holder-rules.md`](references/assets-holder-rules.md) first.

## Workflow

1. Classify the asset-permission scenario: owned CRUD asset, correlated asset, custom endpoint, aggregate query, command boundary, binding or unbinding, subscription or message filtering.
2. Inspect adjacent code for `AssetType` enums, `@AssetsController`, `AssetsHolderCrudController`, `CorrelatesAssetsHolderCrudController`, `CrudAssetPermission`, `AssetsHolder.injectQueryParam`, `AssetsHolder.assertPermission`, command handlers, and local tests.
3. If this is part of a large backend feature, pair with [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): document the asset type, permission boundary, test goals, and user confirmation before implementation.
4. Choose the unified AssetsHolder integration pattern that matches the local codebase; do not create ad hoc tenant, user, department, organization, or creator filters.
5. Before implementing asset permission code, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md): asset ownership, correlated asset mapping, `ignore = true` equivalent checks, admin / platform exceptions, batch mixed-permission behavior, custom query injection, command or subscription permission propagation.
6. Pair with `$jetlinks-crud`, `$jetlinks-boundary`, `$jetlinks-events`, or `$jetlinks-reactive` when the asset permission decision belongs to those flows.

## Required Constraints

- Always prefer the JetLinks `AssetsHolder` asset permission system for data permission control.
- Do not hand-roll data permission filters in CRUD code unless you are implementing or extending an AssetsHolder provider, dimension provider, term builder, asset supplier, or binding provider.
- Do not use `@AssetsController(ignore = true)` on a protected endpoint unless the method performs equivalent `AssetsHolder.injectQueryParam`, `AssetsHolder.assertPermission`, or `AssetsHolder.filterAssets` handling.
- Do not assume the asset type string. Find or add the module's `AssetType` / `EnumAssetType` definition and follow adjacent naming.
- CRUD permissions should normally use `CrudAssetPermission.read`, `save`, `delete`, or `share`; custom permissions require an `AssetPermission` definition and local examples.
- For related assets, verify whether the permission should apply to the entity itself or a referenced asset, then use the correlated-controller or query-injection pattern.
- If asset ownership, related asset mapping, permission action, or admin / tenant / platform exception semantics are unclear, ask the user before implementation.
- Tests must verify allowed and denied asset scopes with realistic IDs, bindings, and permissions; do not bypass the core holder behavior with mocks that make the permission check meaningless.
- Do not leave custom asset permission code comment-free when it encodes non-obvious ownership, correlated asset mapping, `@AssetsController(ignore = true)` replacement checks, admin / platform exceptions, batch mixed-permission behavior, custom query injection, or permission propagation through commands / subscriptions. Add concise comments next to those boundaries.

## Response Shape

1. Asset permission scenario
2. Existing AssetsHolder patterns found
3. Asset type and permission action
4. Recommended integration pattern
5. Unclear ownership or scope questions, if any
6. Comment targets added, or the concrete reason no code comments were needed
7. Verification evidence or exact pending commands
