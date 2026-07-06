# Debugging Checklist

## Device cannot authenticate

- Check whether the transport registered an authenticator at all.
- Confirm whether auth happens in a dedicated login packet, in every packet, in the topic, or in an HTTP header.
- Verify the device ID and secure key or token source on both device and platform sides.

## Device connects but no upstream message reaches the platform

- Confirm the route, topic, path, or frame decoder actually matches the incoming data.
- Check whether decode returns a valid `DeviceMessage` or exits early on missing device state.
- Inspect protocol logs before changing codec logic.

## Platform sends downlink but device does not respond

- Trace the downstream encoder and confirm the target transport or topic is correct.
- Verify that message type, reply expectation, and sequence or correlation fields survive encode.
- Check whether the device expects an ACK or login state before accepting business packets.

## Binary packet parses incorrectly

- Recheck length prefix, endian, dynamic type markers, string lengths, and device ID position.
- Verify whether auth bytes live inside the message body or outside it.
- Compare the current packet against protocol docs or round-trip test output before editing parser code.

## ACK or reply cannot match the original request

- Confirm how wire sequence numbers map back to platform `messageId`.
- Verify that ACK and reply packets reuse the expected device ID, message family, and success or error markers.
- Inspect cache or holder logic if correlation works only for a short time window.

## Docs and tests no longer match behavior

- Update transport docs, README examples, or binary packet samples whenever the wire contract changes.
- Prefer adjacent codec or packet tests over ad hoc reproduction code so regressions stay visible.
