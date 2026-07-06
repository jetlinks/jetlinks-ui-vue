---
name: jetlinks-boundary
description: 在当前 JetLinks 工作区中选择并实现跨边界交互方式。适用于需要在直接依赖、命令服务、代理或其他跨模块访问模式之间做决策和落地的场景，尤其是响应式模块或低上下文脚手架中的边界选择。
---

# JetLinks Boundary

Read [`references/module-reference.md`](references/module-reference.md) first.

## Workflow

1. Identify the capability boundary that the task needs to cross.
2. If this is a new backend feature, large cross-boundary behavior change, or boundary decision that affects data ownership, permissions, transactions, or external messages, first follow [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): write the design draft and realistic test goals to the appropriate docs directory and wait for explicit user confirmation.
3. Confirm whether the current workspace already has command services, proxies, support IDs, or concrete command classes.
4. Read [`references/cross-service-call-rules.md`](references/cross-service-call-rules.md) before implementing providers or consumers.
5. Before implementing boundary code, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md): public command contracts, service / command IDs, permission context, retry or fallback, remote / local boundary choice, payload compatibility, and provider-side side effects.
6. Keep the chosen pattern aligned with the module's execution model, existing naming scheme, and local command invocation style.

## Required Constraints

- Do not invent command IDs, service IDs, support IDs, or proxy contracts.
- Do not directly inject another boundary's internal implementation class.
- When local command classes already exist, prefer explicit command objects with `commandSupport.execute(...)` over shortcut calls such as `executeToMono(...)`.
- In reactive modules, keep the cross-boundary call non-blocking.
- Do not implement a large boundary change before the design draft, rejected options, data permission implications, and realistic test goals have been documented and confirmed.
- Do not fake boundary tests by mocking away the contract being selected; verify request payloads, permission context, success and failure semantics, and fallback behavior that matter to the caller.
- Do not leave public command DTOs, command handlers, providers, proxies, or boundary fallbacks comment-free when they define a cross-module contract, permission propagation, payload compatibility, retry / fallback behavior, or side effects. Add concise code comments and complete public contract comments where callers or implementers depend on them.
- When boundary code changes are made, run relevant validation when possible; otherwise state the exact pending commands and cross-boundary risks.

## Response Shape

1. Boundary to cross
2. Existing mechanisms found in the workspace
3. Recommended interaction pattern
4. Design doc path and test goals when the backend design gate applies
5. Rejected patterns and reasons
6. Comment targets added, or the concrete reason no code comments were needed
7. Verification evidence or exact pending commands
