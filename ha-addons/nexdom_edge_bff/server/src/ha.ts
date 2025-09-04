import axios, { AxiosInstance } from "axios";
import WebSocket from "ws";
import { EventEmitter } from "events";
import { HAEntity } from "./types";

type WSMsg = { type: string; [k: string]: any };

export class HAClient extends EventEmitter {
  private http: AxiosInstance;
  private wsUrl: string;
  private token: string;
  private ws?: WebSocket;
  private wsConnected = false;
  private nextId = 1;
  private reconnectTimer?: NodeJS.Timeout;

  constructor({
    baseUrl = "http://supervisor/core/api",
    wsUrl = "ws://supervisor/core/websocket",
    token,
  }: {
    baseUrl?: string;
    wsUrl?: string;
    token: string;
  }) {
    super();
    this.token = token;
    this.wsUrl = wsUrl;
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async listStates(): Promise<HAEntity[]> {
    const { data } = await this.http.get<HAEntity[]>("/states");
    return data;
  }

  async callService(domain: string, service: string, data: any): Promise<any> {
    const { data: resp } = await this.http.post(`/services/${domain}/${service}`, data);
    return resp;
  }

  async cameraProxy(entity_id: string): Promise<Buffer> {
    const { data } = await this.http.get(`/camera_proxy/${encodeURIComponent(entity_id)}`, {
      responseType: "arraybuffer",
    });
    return Buffer.from(data);
  }

  connectEvents() {
    if (this.ws) return;
    const ws = new WebSocket(this.wsUrl);
    this.ws = ws;

    ws.on("open", () => {
      // Expect auth_required then send token
    });

    ws.on("message", (raw: WebSocket.RawData) => {
      try {
        const msg: WSMsg = JSON.parse(raw.toString());
        if (msg.type === "auth_required") {
          ws.send(JSON.stringify({ type: "auth", access_token: this.token }));
          return;
        }
        if (msg.type === "auth_ok") {
          this.wsConnected = true;
          // Subscribe to state_changed
          const id = this.nextId++;
          ws.send(
            JSON.stringify({ type: "subscribe_events", event_type: "state_changed", id })
          );
          return;
        }
        if (msg.type === "result" && msg.success) {
          // ignore
          return;
        }
        if (msg.type === "event") {
          this.emit("ha_event", msg.event);
          return;
        }
      } catch {
        // ignore parsing errors
      }
    });

    ws.on("close", () => {
      this.ws = undefined;
      this.wsConnected = false;
      this.scheduleReconnect();
    });

    ws.on("error", () => {
      ws.close();
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connectEvents();
    }, 3000);
  }
}

