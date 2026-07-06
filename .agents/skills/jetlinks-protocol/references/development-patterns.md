# Protocol Development Patterns

Use this reference when creating or substantially extending a JetLinks protocol package. Keep the guidance generic: verify concrete class names, package roots, resource paths, and transport capabilities from the current repository before editing.

## Required input triage

- Collect the protocol document, packet table, sample frames, or device manual before inventing field semantics.
- Identify transport type, frame boundary, byte order, checksum, escaping, segmentation, command IDs, and message direction.
- Identify the device identity source: device ID, IMEI, SN, VIN, MN, username, token, password, or access key.
- Identify session flow: registration, authentication, heartbeat, reconnect, ACK, request-reply, and whether unauthenticated business packets are accepted.
- Identify JetLinks mapping targets: properties, events, tags, functions, replies, and device online or offline state.

If the input is incomplete, list the missing protocol facts as pending items and implement only the portions that can be verified.

## Implementation order

1. Build the support-provider edge: protocol ID and name, metadata codec, transport codec support, config metadata, default metadata, principal metadata resolver, documents, parser factory, and disposal hooks if needed.
2. Stabilize frame parsing before business decoding: sticky packets, split packets, start and end markers, length semantics, checksum range, escaping, and segmentation reassembly.
3. Decode the common header once, then dispatch by command ID, message type, version, or direction through an enum, registry, or decoder table.
4. Map protocol identity and authentication before business messages so device lookup, credential validation, and online semantics stay consistent.
5. Map business fields to JetLinks messages with semantics first: state to properties, instantaneous records or alarms to events, identity and version data to tags, platform commands to functions.
6. Implement downstream encoding with the same field order, length backfill, checksum, escaping, sequence generation, and reply correlation rules used by the wire protocol.
7. Add focused tests or examples for parser boundaries, representative upstream frames, at least one downstream command, and any ACK or request-reply correlation.

## Package shape

- Keep a small protocol simple: one provider, one transport codec, one parser, a compact message registry, metadata, docs, and adjacent tests are enough.
- Split only around real variability: transport-specific codecs, shared frame codec, uplink and downlink message families, version-specific bodies, utility codecs, or state managers.
- Keep checksum, escaping, BCD, time, string, coordinate, unit conversion, and bit-mask parsing in reusable helpers instead of duplicating byte math across messages.
- Keep request-reply caches, segmentation managers, file-upload managers, and timeout cleanup isolated from stateless decode logic.
- Keep resource files discoverable: SPI provider file, `metadata/device-metadata.json`, transport documents, README examples, and packet samples when present.
- Add contract comments on public providers, codecs, parsers, and packet registries. Non-obvious wire rules such as endian, length field, escape, sequence correlation, auth order, ByteBuf ownership, or released compatibility need short code comments next to the rule.

## ByteBuf and binary rules

- Use `get*` reads for look-ahead and frame-length decisions; consume bytes only after a complete frame is known.
- Preserve `readerIndex` discipline when using slices; retain slices only when they outlive the current buffer handling call.
- Read unsigned, signed, endian, BCD, text encoding, timestamp, and bit-field values exactly as the protocol defines them.
- Keep length semantics explicit: whether length includes header, body, checksum, delimiter, escaped length, or original unescaped payload.
- Reject or discard malformed noise with monitor or parser hooks where the local framework provides them; do not silently shift bytes without evidence.

## Metadata and documentation

- `metadata/device-metadata.json` should cover core properties, key events, necessary functions, and stable tags exposed by the protocol.
- Use business-stable identifiers for metadata; avoid leaking obscure wire abbreviations unless they are the accepted domain term.
- Keep units, ranges, enum values, scaling factors, and field names consistent between code, metadata, and protocol documents.
- Update transport-specific documents whenever topics, paths, authentication, packet layout, templates, or command examples change.

## Delivery checklist

- The provider is visible through SPI and registers the expected transports.
- The identity field, credential type, and authentication flow are explainable from code and docs.
- Public providers, codecs, parsers, and packet registries have useful contract comments, and non-obvious wire or lifecycle rules are commented next to the implementation.
- Parser tests cover complete frame, sticky packet, split packet, invalid frame, and checksum or escape cases when applicable.
- Upstream decoding emits usable JetLinks messages with device ID and semantic payload.
- Downstream encoding can produce at least one real control, query, or reply packet.
- Request-reply or ACK correlation preserves platform `messageId`, wire sequence, device ID, and timeout behavior.
- Default metadata and protocol documents match the current wire contract.
