# Transport Codecs

## MQTT

- Inspect route registration, topic enums or handlers, authenticator registration, and transport config metadata together.
- Upstream usually depends on topic parsing plus payload decode; verify both placeholders and body structure.
- Downstream usually depends on topic rendering and reply topic selection.
- Common failures: route pattern mismatch, auth token format drift, or handler registration without a matching route.

## HTTP and WebSocket

- Inspect `HttpRoute`, request method, path placeholders, content type, and any bearer or token validation.
- Upstream usually maps request path plus JSON payload into `DeviceMessage`.
- Downstream may respond through HTTP directly or reuse the HTTP codec for WebSocket frames.
- Common failures: product or device placeholder mismatch, missing auth header, wrong content type, or treating WebSocket like plain HTTP.

## TCP

- Inspect the frame boundary first: length prefix, delimiter, fixed header, or custom decoder.
- Confirm whether the first packet is a login or handshake packet before normal message decode.
- Follow both blocking or reactive decode context and packet write path.
- Common failures: frame length off by one, auth packet decoded as business packet, or downstream packet wrapping different from upstream expectations.

## UDP

- Treat each packet as stateless unless the repository explicitly keeps session state.
- Verify whether auth data must be present in every packet.
- Check how ACK or reply packets are constructed without a persistent connection.
- Common failures: assuming device session state exists, dropping auth fields from reply packets, or reusing TCP framing logic in UDP.

## CoAP

- Inspect URI mapping, payload format, and any confirmable or request-response assumptions already present in the repository.
- Verify whether upstream payloads map directly to property or event messages, or pass through an intermediate abstraction.
- Common failures: path mismatch, payload format mismatch, or assuming the same auth semantics as HTTP.

## Cross-transport checks

- If a repository exposes the same logical protocol over multiple transports, compare how auth, docs, and message mapping differ before reusing code.
- Prefer transport-specific docs and tests over generic assumptions when behavior diverges.
