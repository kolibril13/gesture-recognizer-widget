import { gestureEvents } from "./event-bus.ts";
import type { GestureStreamPayload, WebSocketState } from "./types.ts";

export interface WebSocketOptions {
  url: string;
  autoReconnect: boolean;
}

const RECONNECT_DELAY_MS = 2000;

/**
 * Optional JSON streaming client. Disabled by default — call `connect()`
 * to open the socket. Supports configurable URL and automatic reconnect.
 */
export class GestureWebSocket {
  private socket: WebSocket | null = null;
  private state: WebSocketState = "disconnected";
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manualClose = false;

  private url = "ws://localhost:8080";
  private autoReconnect = false;

  get currentState(): WebSocketState {
    return this.state;
  }

  configure(options: Partial<WebSocketOptions>): void {
    if (options.url !== undefined) this.url = options.url;
    if (options.autoReconnect !== undefined) {
      this.autoReconnect = options.autoReconnect;
    }
  }

  connect(): void {
    if (this.state === "connected" || this.state === "connecting") return;
    this.manualClose = false;
    this.openSocket();
  }

  disconnect(): void {
    this.manualClose = true;
    this.clearReconnectTimer();
    this.socket?.close();
    this.socket = null;
    this.setState("disconnected");
  }

  /** Send a gesture payload if the socket is open; no-op otherwise. */
  send(payload: GestureStreamPayload): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  private openSocket(): void {
    this.setState("connecting");
    try {
      this.socket = new WebSocket(this.url);
    } catch (err) {
      this.handleFailure(err);
      return;
    }

    this.socket.addEventListener("open", () => this.setState("connected"));
    this.socket.addEventListener("error", () => this.setState("error"));
    this.socket.addEventListener("close", () => {
      this.socket = null;
      if (this.manualClose) {
        this.setState("disconnected");
        return;
      }
      this.setState("disconnected");
      if (this.autoReconnect) this.scheduleReconnect();
    });
  }

  private handleFailure(err: unknown): void {
    const message = err instanceof Error ? err.message : "WebSocket failed";
    gestureEvents.emit("error", { message: `WebSocket: ${message}` });
    this.setState("error");
    if (this.autoReconnect && !this.manualClose) this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => this.openSocket(), RECONNECT_DELAY_MS);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private setState(state: WebSocketState): void {
    this.state = state;
    gestureEvents.emit("websocketState", state);
  }
}
