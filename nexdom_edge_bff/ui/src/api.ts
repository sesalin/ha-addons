import type { AutoSchema, Entity } from "./types";

export async function fetchSchema(): Promise<AutoSchema> {
  const res = await fetch("/api/schema/auto");
  if (!res.ok) throw new Error("schema_failed");
  return res.json();
}

export async function fetchStates(): Promise<Entity[]> {
  const res = await fetch("/api/states");
  if (!res.ok) throw new Error("states_failed");
  return res.json();
}

export async function act(domain: string, service: string, data: any) {
  const res = await fetch("/api/act", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, service, data }),
  });
  if (!res.ok) throw new Error("act_failed");
  return res.json();
}

export function cameraUrl(entity_id: string) {
  const u = new URL(`/api/camera_proxy`, window.location.origin);
  u.searchParams.set("entity_id", entity_id);
  return u.toString();
}

