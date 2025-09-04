import React from "react";
import type { Entity } from "../../types";
import { CameraTile, ClimateCard, CoverSlider, EntityRow, LightTile, LockCard, SensorTile } from "../Tile";

export function PageRenderer({
  id,
  title,
  domain,
  entities,
  states,
}: {
  id: string;
  title: string;
  domain: string;
  entities: string[];
  states: Record<string, Entity>;
}) {
  const list = entities.map((eid) => states[eid]).filter(Boolean);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((e) => (
          <div key={e.entity_id}>
            {domain === "light" && <LightTile e={e} />}
            {domain === "climate" && <ClimateCard e={e} />}
            {domain === "lock" && <LockCard e={e} />}
            {domain === "cover" && <CoverSlider e={e} />}
            {domain === "camera" && <CameraTile e={e} />}
            {(domain === "sensor" || domain === "binary_sensor") && <SensorTile e={e} />}
            {/* Fallback */}
            {!["light","climate","lock","cover","camera","sensor","binary_sensor"].includes(domain) && (
              <EntityRow e={e} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

