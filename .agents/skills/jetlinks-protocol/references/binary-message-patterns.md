# Binary Message Patterns

## Framing checklist

- Capture the outer frame first: length prefix, delimiter, checksum, or none.
- Verify byte order before touching numeric fields.
- Record the exact field order for message type, timestamp, sequence, device ID, payload, and auth fields.
- Confirm whether login packets or ACK packets have a different body layout from normal business packets.

## Message type registry

- Search for an enum or registry that maps wire type codes to JetLinks `DeviceMessage` implementations.
- If the repository uses enum ordinal values on the wire, preserve numeric stability. Prefer append-only changes unless the code uses explicit codes instead of ordinal values.
- Update both read and write paths when adding a new packet type.

## Data type handling

- Search for a `DataType`-style abstraction before writing raw `ByteBuf` parsing by hand.
- Keep null, object, array, and dynamic type handling symmetric between encode and decode.
- Verify string, binary, and collection length semantics separately from outer frame length.

## Request and reply correlation

- Check how platform `messageId` maps to wire-level sequence numbers or correlation IDs.
- Preserve device ID, sequence number, and reply type when building ACK or response packets.
- If the repository caches message ID to sequence mappings, verify timeout, eviction, and fallback behavior before changing it.

## Validation strategy

- Add round-trip tests for every modified message family: encode then decode should preserve semantic fields.
- Keep at least one hex or byte-level example when the repository already documents packet samples.
- Add negative checks when changing framing or dynamic type rules, because malformed packet handling is easy to break silently.
