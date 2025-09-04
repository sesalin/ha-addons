import React from "react";
import { act, cameraUrl } from "../api";
import type { Entity } from "../types";

export function LightTile({ e }: { e: Entity }) {
  const on = e.state === "on";
  const toggle = async () => {
    await act("light", on ? "turn_off" : "turn_on", { entity_id: e.entity_id });
  };
  return (
    <div className="card">
      <div className="font-semibold mb-2">{e.entity_id}</div>
      <div className="flex items-center justify-between">
        <span>Estado: {on ? "Encendida" : "Apagada"}</span>
        <button className="btn" onClick={toggle}>{on ? "Apagar" : "Encender"}</button>
      </div>
    </div>
  );
}

export function ClimateCard({ e }: { e: Entity }) {
  const t = e.attributes.temperature ?? e.attributes.target_temp ?? e.attributes.temperature ?? 22;
  const current = e.attributes.current_temperature ?? e.attributes.temp ?? e.state;
  const set = async (n: number) => {
    await act("climate", "set_temperature", { entity_id: e.entity_id, temperature: n });
  };
  return (
    <div className="card">
      <div className="font-semibold mb-2">{e.entity_id}</div>
      <div className="flex items-center gap-4">
        <div>Actual: {current}</div>
        <div>Setpoint: {t}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => set(Number(t) - 1)}>-</button>
          <button className="btn" onClick={() => set(Number(t) + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}

export function LockCard({ e }: { e: Entity }) {
  const locked = e.state === "locked";
  const toggle = async () => {
    await act("lock", locked ? "unlock" : "lock", { entity_id: e.entity_id });
  };
  return (
    <div className="card">
      <div className="font-semibold mb-2">{e.entity_id}</div>
      <div className="flex items-center justify-between">
        <span>{locked ? "Cerrada" : "Abierta"}</span>
        <button className="btn" onClick={toggle}>{locked ? "Abrir" : "Cerrar"}</button>
      </div>
    </div>
  );
}

export function CoverSlider({ e }: { e: Entity }) {
  const open = async () => act("cover", "open_cover", { entity_id: e.entity_id });
  const close = async () => act("cover", "close_cover", { entity_id: e.entity_id });
  return (
    <div className="card">
      <div className="font-semibold mb-2">{e.entity_id}</div>
      <div className="flex gap-2">
        <button className="btn" onClick={open}>Abrir</button>
        <button className="btn" onClick={close}>Cerrar</button>
      </div>
    </div>
  );
}

export function CameraTile({ e }: { e: Entity }) {
  const src = cameraUrl(e.entity_id);
  return (
    <div className="card">
      <div className="font-semibold mb-2">{e.entity_id}</div>
      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
      <img src={src} alt={`Snapshot ${e.entity_id}`} className="rounded-skin max-w-full"/>
    </div>
  );
}

export function SensorTile({ e }: { e: Entity }) {
  const unit = e.attributes.unit_of_measurement ? ` ${e.attributes.unit_of_measurement}` : "";
  return (
    <div className="card">
      <div className="font-semibold mb-1">{e.entity_id}</div>
      <div className="text-2xl">{e.state}{unit}</div>
    </div>
  );
}

export function EntityRow({ e }: { e: Entity }) {
  return (
    <div className="card">
      <div className="font-semibold">{e.entity_id}</div>
      <div className="text-sm text-slate-600">{e.state}</div>
    </div>
  );
}

