import { AutoSchema, HAEntity, Options } from "./types";

const DOMAIN_TO_PAGE: Record<string, { id: string; title: string; feature: keyof Options["features"]; icon?: string }> = {
  light: { id: "lights", title: "Luces", feature: "lights", icon: "mdi:lightbulb" },
  climate: { id: "climate", title: "Clima", feature: "climate", icon: "mdi:thermostat" },
  lock: { id: "security", title: "Seguridad", feature: "security", icon: "mdi:lock" },
  alarm_control_panel: { id: "security", title: "Seguridad", feature: "security", icon: "mdi:shield-home" },
  cover: { id: "covers", title: "Cortinas", feature: "covers", icon: "mdi:blinds" },
  camera: { id: "cameras", title: "Cámaras", feature: "cameras", icon: "mdi:cctv" },
  sensor: { id: "sensors", title: "Sensores", feature: "sensors", icon: "mdi:chart-line" },
  binary_sensor: { id: "sensors", title: "Sensores", feature: "sensors", icon: "mdi:motion-sensor" },
  switch: { id: "energy", title: "Energía", feature: "energy", icon: "mdi:flash" },
};

export function buildAutoSchema(states: HAEntity[], options: Options): AutoSchema {
  const pages: Record<string, { id: string; title: string; entities: string[]; domain: string }> = {};

  for (const s of states) {
    const [domain] = s.entity_id.split(".");
    const map = DOMAIN_TO_PAGE[domain];
    if (!map) continue;
    if (!options.features[map.feature]) continue;
    if (!pages[map.id]) pages[map.id] = { id: map.id, title: map.title, entities: [], domain };
    pages[map.id].entities.push(s.entity_id);
  }

  // Always include Home page
  const nav = [{ id: "home", title: "Inicio", icon: "mdi:home" }];
  for (const p of Object.values(pages)) {
    nav.push({ id: p.id, title: p.title });
  }

  return { nav, pages, theme: options.theme || {} };
}

