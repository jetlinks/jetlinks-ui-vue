---
name: jetlinks-protocol
description: 在 JetLinks 协议包中处理协议支持注册、MQTT/HTTP/TCP/UDP/CoAP 编解码、Topic 或 path 路由、二进制报文读写、注册鉴权、设备物模型映射、协议文档与测试定位。适用于阅读、创建或维护 ProtocolSupportProvider、DeviceMessageCodec、MessageParser、二进制消息注册表等协议代码，排查上下行链路、认证失败、粘拆包、应答关联或基于协议文档实现新的设备接入方式。
---

# JetLinks Protocol

Read [`references/protocol-workflow.md`](references/protocol-workflow.md) first.

## Workflow

1. Classify the request as protocol reading, protocol implementation, binary packet analysis, or integration debugging.
2. If this creates a new protocol package or changes protocol behavior, first follow [`../jetlinks-router/references/backend-design-test-driven-rules.md`](../jetlinks-router/references/backend-design-test-driven-rules.md): write the design draft, protocol examples, and realistic test goals to the appropriate docs directory and wait for explicit user confirmation.
3. Inspect protocol support registration first, then locate routes, config metadata, authenticators, and codec bindings.
4. Trace the upstream path from transport input to `DeviceMessage`, then trace the downstream path back to encoded packets, topics, or replies.
5. Read [`references/development-patterns.md`](references/development-patterns.md) when creating a new protocol package or turning a protocol document into implementation tasks.
6. Read [`references/transport-codecs.md`](references/transport-codecs.md) when the task depends on MQTT, HTTP, TCP, UDP, CoAP, or WebSocket behavior.
7. Read [`references/binary-message-patterns.md`](references/binary-message-patterns.md) when the task involves framing, message types, ACK or reply correlation, sequence numbers, or dynamic data types.
8. Read [`references/example-locations.md`](references/example-locations.md) to find local docs, tests, and sample entry points before changing code.
9. Read [`references/debugging-checklist.md`](references/debugging-checklist.md) when the symptom is auth failure, message loss, bad routing, decode failure, or device/platform mismatch.
10. Before implementing or changing protocol code, identify comment targets from [`../jetlinks-conventions/references/code-comments.md`](../jetlinks-conventions/references/code-comments.md): Provider / Codec / parser public contracts, wire compatibility, endian / framing assumptions, ACK or sequence correlation, ByteBuf lifecycle, auth boundary, retry / timeout, and transport-specific deviations.
11. Reuse the existing protocol abstraction and update adjacent tests or protocol docs when the wire behavior changes.

## Required Constraints

- Do not assume fixed topics, HTTP paths, packet layouts, auth tokens, or message headers. Verify them from the current repository's provider, codec, docs, and tests.
- Do not fold product-specific device modeling rules into the generic protocol layer unless the repository already uses that boundary.
- Do not change binary field order, endian rules, or sequence correlation without checking compatibility and updating examples or tests.
- Do not implement only one direction of a protocol change. Verify both upstream decode and downstream encode when the transport supports both.
- Do not start from business-field mapping before the transport boundary and frame boundary are stable.
- Do not make simple protocols carry complex caches, state machines, or split packages just because another protocol does; add those only when the protocol explicitly needs them.
- Do not implement a new protocol or large wire-behavior change before the design draft, packet examples, upstream/downstream mapping, compatibility risks, and realistic test goals have been documented and confirmed.
- Do not make protocol tests pass with invented packets that ignore the real document or adjacent examples; validate representative registration, auth, framing, decode, encode, ACK, error, and compatibility cases.
- Do not leave protocol providers, codecs, parsers, packet registries, or compatibility branches comment-free when they encode wire contracts, framing / endian assumptions, ACK or sequence correlation, ByteBuf lifecycle, auth boundary, or transport-specific deviations. Add concise code comments and complete public contract comments where implementers depend on them.
- If protocol changes cannot be verified in-session, state the exact pending test or debug commands and residual interoperability risks.
- Combine this skill with `$jetlinks-reactive` or `$jetlinks-delivery` when the task also changes reactive flows or requires commit or PR preparation.

## Response Shape

1. Task type and target transport or packet family
2. Confirmed protocol entry points
3. Upstream and downstream message path
4. Design doc path and test goals when the backend design gate applies
5. Proposed code, test, and doc changes
6. Comment targets added, or the concrete reason no code comments were needed
7. Verification evidence and remaining protocol risks
