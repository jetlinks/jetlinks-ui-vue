# Protocol Workflow

## 1. Find the registration edge first

- Search for `ProtocolSupportProvider`, `CompositeProtocolSupport`, or equivalent support bootstrap code.
- Record each `addMessageCodecSupport`, `addAuthenticator`, `addRoutes`, `addConfigMetadata`, and `setDocument` call.
- Note whether the same codec is reused across multiple transports, because config metadata and auth behavior often diverge there.

## 2. Trace the upstream path

- Start from the transport entry: topic, path, socket frame, packet buffer, or request body.
- Identify where authentication happens relative to decode.
- Follow the code until raw transport data becomes a JetLinks `DeviceMessage`.
- Capture any headers added during decode, especially message sequence numbers, tokens, or reply markers.

## 3. Trace the downstream path

- Find how platform messages are mapped back to transport output.
- Confirm how topics, HTTP responses, socket packets, or binary frames are assembled.
- For bidirectional protocols, verify how reply, ACK, and request-response correlation is preserved.

## 4. Implement with local patterns

- Extend existing route registries, codec classes, message wrappers, and helper enums before introducing new abstractions.
- Keep protocol docs close to the transport that owns them.
- Add or update tests next to the codec or packet abstraction you changed.

## 5. Validate before finishing

- The provider registers the target transport and any required auth or config metadata.
- Upstream decode and downstream encode remain symmetric where the protocol expects symmetry.
- Docs, examples, and tests still describe the current wire behavior.
- Any compatibility risk is called out explicitly when message fields or transport routes change.
- Code comments exist where the implementation encodes non-obvious wire contracts, framing / endian assumptions, sequence or ACK correlation, ByteBuf ownership, auth order, transport-specific differences, or released compatibility.
