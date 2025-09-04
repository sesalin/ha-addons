import { HAEntity } from "./types";

const SENSITIVE_ATTRS = new Set([
  "friendly_name",
  "mac",
  "mac_address",
  "ssid",
  "password",
  "ip",
  "latitude",
  "longitude",
]);

export function redactEntity(e: HAEntity): HAEntity {
  const copy: HAEntity = {
    entity_id: e.entity_id,
    state: e.state,
    attributes: {},
  };
  for (const [k, v] of Object.entries(e.attributes || {})) {
    if (SENSITIVE_ATTRS.has(k)) continue;
    copy.attributes[k] = v;
  }
  return copy;
}

export function redactEvent(ev: any): any {
  // Expecting HA WS event with "event" { data }
  try {
    const data = ev?.event?.data ?? ev?.event ?? ev;
    const entity_id = data?.entity_id ?? ev?.data?.entity_id;
    const new_state = data?.new_state as HAEntity | undefined;
    const old_state = data?.old_state as HAEntity | undefined;
    return {
      type: ev?.event_type || ev?.type || "event",
      entity_id,
      new_state: new_state ? redactEntity(new_state) : undefined,
      old_state: old_state ? redactEntity(old_state) : undefined,
      time_fired: ev?.time_fired ?? undefined,
    };
  } catch {
    return { type: "event" };
  }
}

