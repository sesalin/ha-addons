import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { HAClient } from "./ha";
import { buildAutoSchema } from "./schema";
import { redactEntity, redactEvent } from "./filters";
import { Options } from "./types";

const PORT = parseInt(process.env.PORT || "8099", 10);
const UI_DIST = process.env.UI_DIST || "/opt/nexdom/ui/dist";
const SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN || "";
if (!SUPERVISOR_TOKEN) {
  console.error("[nexdom] Missing SUPERVISOR_TOKEN");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

function loadOptions(): Options {
  try {
    const raw = fs.readFileSync("/data/options.json", "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      features: {
        lights: true,
        climate: true,
        security: true,
        covers: true,
        sensors: true,
        cameras: true,
        energy: true,
      },
      theme: { primary: "#3b82f6", radius: "0.75rem", logo_url: "" },
      mappings: {},
    };
  }
}

const ha = new HAClient({ token: SUPERVISOR_TOKEN });
ha.connectEvents();

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/states", async (_req, res) => {
  try {
    const states = await ha.listStates();
    const redacted = states.map(redactEntity);
    res.json(redacted);
  } catch (e: any) {
    res.status(500).json({ error: "states_failed" });
  }
});

app.get("/api/schema/auto", async (_req, res) => {
  try {
    const options = loadOptions();
    const states = await ha.listStates();
    const schema = buildAutoSchema(states, options);
    res.json(schema);
  } catch (e: any) {
    res.status(500).json({ error: "schema_failed" });
  }
});

app.post("/api/act", async (req, res) => {
  const { domain, service, data } = req.body || {};
  if (!domain || !service) return res.status(400).json({ error: "invalid_request" });
  try {
    const result = await ha.callService(String(domain), String(service), data || {});
    res.json({ ok: true, result });
  } catch (e: any) {
    res.status(500).json({ error: "service_failed" });
  }
});

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const onEvent = (ev: any) => {
    const payload = redactEvent(ev);
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  const keepalive = setInterval(() => res.write(`:keepalive\n\n`), 25000);
  ha.on("ha_event", onEvent);
  req.on("close", () => {
    clearInterval(keepalive);
    ha.off("ha_event", onEvent);
    res.end();
  });
});

app.get("/api/camera_proxy", async (req, res) => {
  const entity_id = String(req.query.entity_id || "");
  if (!entity_id) return res.status(400).send("Missing entity_id");
  try {
    const buf = await ha.cameraProxy(entity_id);
    res.setHeader("Content-Type", "image/jpeg");
    res.send(buf);
  } catch (e) {
    res.status(500).send("camera_proxy_failed");
  }
});

// Serve UI static files
app.use(express.static(UI_DIST));
app.get("*", (_req, res) => {
  res.sendFile(path.join(UI_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[nexdom] Listening on ${PORT}`);
});

