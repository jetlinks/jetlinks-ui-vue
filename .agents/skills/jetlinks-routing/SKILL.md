---
name: jetlinks-routing
description: 发现 JetLinks 工作区结构并选择正确模块，必要时创建新模块。适用于需要梳理当前仓库结构、定位业务模块、识别软链接模块，或在低上下文脚手架中创建新模块的场景。
---

# JetLinks Routing

Read [`references/module-list.md`](references/module-list.md) first.

## Workflow

1. Inspect the root layout, parent `pom.xml`, aggregator modules, and symlinked directories.
2. If the request creates a new backend module or large backend capability, first follow [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): write the design draft and realistic test goals to the appropriate docs directory and wait for explicit user confirmation.
3. Identify the candidate business modules and explain why each one matches the request.
4. If no existing module fits, read [`references/module-creation-rules.md`](references/module-creation-rules.md) and create the smallest compliant module structure.
5. When creating a module that includes public contracts, starter configuration, SPI registration, or first sample code, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md).
6. Prefer extending an existing module before creating a new one.

## Required Constraints

- Do not hardcode module inventories into the skill output.
- Do not ignore symlinked modules or external subprojects linked into the workspace.
- Do not create a new module just because the static list is unclear.
- Keep module placement or creation changes scoped to the requested capability; do not reshuffle unrelated modules or aggregators.
- When a workspace uses `manager` / `core` layering, place CRUD, controllers, application services, persistence, permissions, i18n, and runtime wiring in `manager`; keep `core` limited to shared domain objects, DTOs, commands, events, constants, SPI, and extension contracts. Do not create `xxx-api` by default.
- Do not create a new backend module or large capability before documenting and confirming the design, module responsibilities, dependency boundaries, test goals, and data permission implications.
- Do not create public module contracts, configuration classes, SPI registration entry points, or first sample code without useful class / contract comments when they establish the module's extension boundary.
- If module or structure changes are made, report the validation performed or the exact pending commands and placement risks.

## Response Shape

1. Workspace structure
2. Candidate modules
3. Recommended code location
4. Design doc path and test goals when the backend design gate applies
5. Whether a new module is required
6. Comment targets added, or the concrete reason no code comments were needed
7. Validation notes or pending commands
