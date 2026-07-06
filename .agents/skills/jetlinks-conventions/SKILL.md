---
name: jetlinks-conventions
description: 在当前 JetLinks 工作区中应用共享编码规范。适用于需要确认注解和导入、遵循本地命名与包结构、保持最小改动，判断模块是否应该补 i18n，实现 LocaleUtils、I18nEnumDict、messages_zh/messages_en、权限动作文案，补充 TraceHolder / MonoTracer / FluxTracer 链路追踪埋点，为常驻任务、缓存、队列等能力设计 MBean 运维可观测性，或平衡人类可读性与大模型理解成本来编写代码注释的场景。
---

# JetLinks Conventions

Read [`references/code-conventions.md`](references/code-conventions.md) first.

## Workflow

1. Classify the task as annotations/imports, general conventions, comments, i18n, tracing, MBean observability, or a capability-gap / hack-avoidance situation (tool, SDK, framework API not directly satisfying the requirement).
2. Inspect adjacent production code before changing anything.
3. Confirm the current module's programming style, package roots, naming patterns, and smallest-change expectation.
4. Use [`references/annotations-and-imports-reference.md`](references/annotations-and-imports-reference.md) when imports or annotations are unclear.
5. Use [`references/i18n.md`](references/i18n.md) to decide whether the module should receive i18n changes at all.
6. Use [`references/i18n-usage.md`](references/i18n-usage.md) when the task needs concrete i18n implementation details such as resource layout, `LocaleUtils`, exception `i18nCode` usage, reactive usage, `I18nEnumDict`, or resource synchronization.
7. Use [`references/code-comments.md`](references/code-comments.md) when adding or reviewing comments around business rules, compatibility, concurrency, lifecycle, permissions, tracing, MBean operations, or public contracts.
8. Before editing non-trivial backend code, identify the concrete code comment targets from [`references/code-comments.md`](references/code-comments.md); add comments in the touched code when a target exists, and only skip comments when the touched code is straightforward.
9. Use [`references/tracing.md`](references/tracing.md) when adding or reviewing chain tracing instrumentation, critical business spans, context propagation, or TraceHolder usage.
10. Use [`references/mbean-observability.md`](references/mbean-observability.md) when adding or reviewing long-lived in-memory tasks, caches, queues, buffers, retries, connection/session managers, or MBean/JMX observability.
11. Whenever an existing tool, SDK, framework API, library, or local capability does not directly satisfy the requirement (inaccessible method, serialization error, reactive/blocking mismatch, type/generic clash, exception model gap, third-party behavior mismatch, etc.), load [`references/root-cause-and-no-hack-rules.md`](references/root-cause-and-no-hack-rules.md) and resolve the root cause through official extension points, adjacent module abstractions, dependency choice, or by informing the user; never ship reflection / `Unsafe` / visibility hacks / copied source / bytecode injection / monkey patches as a silent workaround.
12. Implement the smallest consistent change that matches the existing codebase and explicitly state the i18n decision when it matters.

## Required Constraints

- Do not invent package names, import families, resource IDs, action IDs, topics, or service IDs.
- Do not add extra layers, helper classes, or demo code unless the task requires them.
- Prefer local examples over generic memory.
- Clearly separate workspace facts from fallback defaults when the repository is low-context.
- Do not introduce i18n into a module unless the module already follows an i18n convention or the user explicitly asks for it.
- When Apache Commons utilities are already available or aligned with adjacent code, prefer them for null or empty checks and common object or collection operations instead of handwritten repetitive branches; for Commons Lang string comparison, prefix/suffix, contains, index/search, or plain replace/remove operations, use `org.apache.commons.lang3.Strings.CS` / `Strings.CI` by case-sensitivity when the dependency provides them, and do not call the deprecated `StringUtils.*` variants.
- Keep convention-driven changes scoped to the required consistency fix; do not expand into unrelated cleanup.
- Prefer readable code over dense fluent chains. When a chained call mixes multiple business phases or becomes hard to summarize in one sentence, split it into named local variables, named private methods, or a small existing abstraction.
- Do not force Java Stream or fluent style onto business workflows, protocol parsing, state transitions, or complex validation. Use imperative code when named intermediate results and early returns make the behavior clearer.
- Do not hide side effects in `Stream.peek(...)`, `map` / `filter` lambdas, mutable external variables, or stream operations that call remote services, databases, caches, or event publishers.
- Do not leave complex code completely uncommented. Add concise comments for non-obvious business rules, compatibility, concurrency/lifecycle guards, security boundaries, TraceHolder/MBean decisions, and public contracts; class comments and SPI interface method comments must be complete, while implementation comments should stay concise and must not restate code line by line. For SPI classes or methods, add real `@since` and focused `@see` links to related subscription types, default implementations, or reference implementations when they help implementers understand the contract; ask when the version is unclear instead of inventing it.
- Do not satisfy the comment requirement only in the final answer or PR description. When a required comment target exists, the comment must be added to the code next to the class, method, branch, boundary, or lifecycle guard it explains.
- For new or changed critical backend business flows, explicitly decide whether manual tracing is needed. Use the platform tracing APIs (`TraceHolder`, `MonoTracer`, `FluxTracer`) at key business stages and record stable, non-sensitive business attributes.
- Do not add noisy per-record tracing, full payload dumps, tokens, credentials, personal data, or high-cardinality raw user input to spans. Prefer stable span names and put bounded identifiers or counts into attributes.
- For long-lived in-memory tasks, caches, queues, buffers, retry pools, or session / connection / subscription managers, explicitly decide whether an MBean is needed for operations observability. Expose bounded statistics, health/status, and safe internal operations such as refresh, flush, compact, or retry; do not expose secrets, full payloads, unbounded collections, or destructive operations without a clear business-safe boundary.
- When convention-related code changes are made, report the validation performed or the exact pending commands and unresolved convention risks.
- For user-visible exceptions, prefer the local exception pattern that carries `i18nCode` or message key plus args; do not hardcode Chinese or English text in exception constructors.
- When the framework, SDK, third-party library, or existing API does not directly satisfy the requirement, solve the root cause via official extension points, adjacent module abstractions, dependency adjustments, or by informing the user with concrete trade-offs; do not use reflection / `Unsafe` / visibility bypass / copied source / monkey patches / bytecode injection / hidden access-level changes as a silent workaround. If such an option is the only path, explain the limitation and obtain user confirmation before applying it. See [`references/root-cause-and-no-hack-rules.md`](references/root-cause-and-no-hack-rules.md).
- Do not silence build / lint / type-check errors with broad `@SuppressWarnings`, commented-out code, ignored tests, swallowed exceptions (`catch (Exception e) {}`), or `e.printStackTrace()` instead of structured handling; fix the underlying issue or escalate to the user.
- Do not block in reactive modules to "make it work" or invent parallel `ObjectMapper` / serializer instances to dodge serialization errors; resolve via `Module` / `Mixin` / `JsonSerializer` / `JsonDeserializer` / `@JsonTypeInfo` and reuse the module's standard configuration.
- Do not keep compatibility code for an earlier implementation that only exists inside the same unreleased PR. Prefer the final best-practice shape and update in-PR callers, tests, fixtures, docs, and examples together; only preserve old behavior when it is released, persisted, externally depended on, or explicitly requested by the user.

## Response Shape

1. Conventions to follow
2. Adjacent files or patterns checked
3. I18n decision or unresolved import/i18n risks
4. If a tool/API capability gap was hit, the root cause analysis, the chosen resolution path (official extension point / adjacent abstraction / dependency change / informing the user), and any usage of reflection / visibility bypass / copied source that was explicitly confirmed by the user
5. Release-boundary decision when compatibility code is considered
6. Readability decision for long chained calls when relevant
7. Comment decision for complex or non-obvious code when relevant
8. TraceHolder / tracing decision when relevant
9. MBean / operations observability decision when relevant
10. Verification evidence or exact pending commands
