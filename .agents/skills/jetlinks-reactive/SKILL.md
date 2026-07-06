---
name: jetlinks-reactive
description: 在当前 JetLinks 工作区中应用响应式与非阻塞实现实践。适用于需要处理 Mono 或 Flux 链路、避免阻塞调用、批量化响应式 CRUD 副作用，或判断响应式处理器如何与事件、订阅和远程调用协作的场景。
---

# JetLinks Reactive

Read [`references/reactive-practice.md`](references/reactive-practice.md) first.

## Workflow

1. Inspect adjacent code to confirm whether the target module is reactive or blocking.
2. If this is a new backend feature or large reactive behavior change, first follow [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): write the design draft and realistic test goals to the appropriate docs directory and wait for explicit user confirmation.
3. If the module is reactive, keep `Mono` or `Flux` end-to-end and avoid imperative fallbacks.
4. If blocking I/O is unavoidable, isolate it explicitly and only use the scheduler pattern already accepted by the codebase.
5. Before editing non-trivial reactive code, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md): async boundaries, backpressure or collection limits, cancellation / retry / timeout behavior, lifecycle cleanup, tracing context propagation, compatibility, and extracted business stages whose purpose is not obvious from the method name.
6. Combine this skill with `$jetlinks-crud`, `$jetlinks-boundary`, or `$jetlinks-events` when the task spans those scenarios.

## Required Constraints

- Do not call `block()` inside reactive business flows unless the current module already does so for the same boundary and there is no safer local alternative.
- Do not introduce nested `subscribe()` for core business control flow.
- Do not wrap blocking code in reactive types and claim the flow is non-blocking.
- Do not use `CompletableFuture.get(...)`, `Thread.sleep`, or busy-wait loops to coordinate with a reactive result; use `flatMap` / `zip` / `then` / `concatMap` / `Sinks` / events / commands instead.
- Do not bypass reactive context with global mutable `static` state or `ThreadLocal` to fake non-blocking propagation.
- Treat `Publisher` / `Subscriber` / `Subscription` demand, cancellation, and terminal signals as the official reactive boundary. A chain starts at an existing `Publisher` or the first real async I/O boundary, not at a local object.
- Operators must compose clearly named functions. Do not write procedural scripts inside a chain; each `map` / `filter` / `flatMap` / `zip` / `then` should express one semantic step.
- Keep operator chains minimal: avoid `Mono.just(...).map(...)`, adjacent `.map(...).map(...)` for one synchronous business step, `.flatMap(Mono::just)`, identity `map`, redundant `then(Mono.just(...))`, or adjacent `.filter().filter(...)` when the value can be computed before wrapping, synchronous steps can be composed into a named function, `thenReturn(...)` is clearer, or predicates can be combined / extracted.
- Split long Reactor chains by business stage. If a chain mixes validation, permission, command execution, persistence, event publication, and result conversion, keep the chain but move stages into named methods such as `validateAndSendCommand(...)` or `saveLogAndReturn(...)`.
- Do not start a chain with `Mono.just(request)` only to transform a local value before the first async boundary; compute the argument directly and call the reactive API, such as `repository.save(request.toEntity())`.
- For critical reactive business stages, use `MonoTracer` / `FluxTracer` or the existing domain tracer to create manual spans and attributes; route detailed TraceHolder rules to [`../jetlinks-conventions/references/tracing.md`](../jetlinks-conventions/references/tracing.md).
- Do not wrap pure synchronous helpers as `Mono` / `Flux`. Data conversion, field calculation, predicate checks, and other non-I/O logic should remain plain methods and be called from `map`, `filter`, or before entering the chain.
- Do not call `collectList()` on unbounded or potentially large streams; only collect when the source is clearly bounded by page, limit, batch, protocol size, or validated input size. Prefer pagination, bounded `buffer` / `window`, streaming, or existing query-composition helpers.
- Keep lambdas as glue code. If a lambda contains validation plus query plus mutation plus side effect, nested branching, loops, `try/catch`, or multiple DB / remote calls, extract a named method and test that method through the reactive chain.
- When the reactive API or library does not satisfy the requirement (signature mismatch, missing extension point, serialization error inside the chain), follow [`../jetlinks-conventions/references/root-cause-and-no-hack-rules.md`](../jetlinks-conventions/references/root-cause-and-no-hack-rules.md): solve at the root via official extension points / adjacent abstractions / dependency choice, or inform the user with concrete trade-offs; do not use reflection / visibility hacks / copied source / silent `catch` to make the chain compile.
- Do not implement a large reactive change before the design draft, backpressure or batching expectations, failure behavior, and realistic test goals have been documented and confirmed.
- Do not make reactive tests pass by sleeping, swallowing errors, ignoring dropped signals, or weakening assertions; verify emitted values, completion or error signals, ordering, concurrency, retry, timeout, and side effects that match real usage.
- Do not leave complex reactive chains or extracted reactive stages comment-free when they encode non-obvious async boundaries, batching / backpressure limits, retry / timeout policy, lifecycle cleanup, compatibility, or tracing context propagation. Add concise comments in the code; skip comments for direct `map` / `flatMap` glue with self-explanatory method names.
- When reactive code changes are made, run relevant validation when possible; otherwise state the exact pending commands and residual blocking risks.

## Response Shape

1. Current module execution model
2. Reactive risks or blocking risks
3. Official reactive boundary, recommended chain, operator semantics, chain readability, tracing decision, and batching / collection boundary
4. Design doc path and test goals when the backend design gate applies
5. Comment targets added, or the concrete reason no code comments were needed
6. Verification evidence or exact pending commands
