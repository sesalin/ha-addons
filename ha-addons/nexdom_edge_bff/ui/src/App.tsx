import React, { useEffect, useMemo, useState } from "react";
import { fetchSchema, fetchStates } from "./api";
import type { AutoSchema, Entity } from "./types";
import { Nav } from "./components/Nav";
import { PageRenderer } from "./components/pages/PageRenderer";

export default function App() {
  const [schema, setSchema] = useState<AutoSchema | null>(null);
  const [states, setStates] = useState<Record<string, Entity>>({});
  const [current, setCurrent] = useState("home");

  useEffect(() => {
    (async () => {
      const s = await fetchSchema();
      setSchema(s);
      // Apply theme tokens
      if (s.theme?.primary) {
        const rgb = hexToRgb(s.theme.primary);
        if (rgb) document.documentElement.style.setProperty("--color-primary", `${rgb.r} ${rgb.g} ${rgb.b}`);
      }
      if (s.theme?.radius) {
        document.documentElement.style.setProperty("--radius", s.theme.radius);
      }
      if (s.theme?.logo_url) {
        document.documentElement.style.setProperty("--logo-url", `url(${s.theme.logo_url})`);
      }
      const st = await fetchStates();
      const map: Record<string, Entity> = {};
      for (const e of st) map[e.entity_id] = e;
      setStates(map);
    })();
  }, []);

  const navItems = useMemo(() => schema?.nav ?? [], [schema]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[image:var(--logo-url)] bg-cover bg-center rounded-skin" />
          <h1 className="text-2xl font-bold">Nexdom Edge</h1>
        </div>
        <Nav items={navItems} current={current} onSelect={setCurrent} />
      </header>
      <main>
        {!schema && <div>Cargando…</div>}
        {schema && current === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="font-semibold mb-2">Bienvenido</div>
              <p className="text-sm text-slate-600">Esta UI se construye automáticamente desde el esquema.</p>
            </div>
          </div>
        )}
        {schema && current !== "home" && schema.pages[current] && (
          <PageRenderer
            id={current}
            title={schema.pages[current].title}
            domain={schema.pages[current].domain}
            entities={schema.pages[current].entities}
            states={states}
          />
        )}
      </main>
    </div>
  );
}

function hexToRgb(hex?: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  const s = hex.replace("#", "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return { r, g, b };
  }
  if (s.length === 6) {
    const r = parseInt(s.substring(0, 2), 16);
    const g = parseInt(s.substring(2, 4), 16);
    const b = parseInt(s.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

