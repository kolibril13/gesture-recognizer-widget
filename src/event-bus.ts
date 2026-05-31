import type {
  HandResult,
  PerformanceMetrics,
  RecognitionFrame,
  WebSocketState,
} from "./types.ts";

/**
 * Strongly-typed map of all application events to their payloads.
 * Add new events here to extend the bus — handlers are type-checked.
 */
export interface AppEventMap {
  /** Emitted every recognition frame. */
  frame: RecognitionFrame;
  /** Emitted when the active/primary gesture changes. */
  gesture: HandResult;
  /** Emitted when a new hand enters the scene. */
  handAppeared: HandResult;
  /** Emitted when a previously tracked hand leaves the scene. */
  handDisappeared: { index: number };
  /** Emitted on each metrics update. */
  metrics: PerformanceMetrics;
  /** Camera lifecycle. */
  cameraStarted: { deviceId: string };
  cameraStopped: undefined;
  /** WebSocket lifecycle. */
  websocketState: WebSocketState;
  /** Non-fatal, user-facing errors. */
  error: { message: string };
}

export type EventKey = keyof AppEventMap;
export type EventHandler<K extends EventKey> = (payload: AppEventMap[K]) => void;

/** Returned by `on`/`once` to remove the handler. */
export type Unsubscribe = () => void;

/**
 * A minimal, dependency-free, fully typed event bus.
 *
 * @example
 * gestureEvents.on("gesture", (data) => console.log(data));
 */
export class EventBus<M extends object> {
  private readonly handlers = new Map<keyof M, Set<(payload: never) => void>>();

  on<K extends keyof M>(event: K, handler: (payload: M[K]) => void): Unsubscribe {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler as (payload: never) => void);
    return () => this.off(event, handler);
  }

  once<K extends keyof M>(event: K, handler: (payload: M[K]) => void): Unsubscribe {
    const wrapped = (payload: M[K]): void => {
      this.off(event, wrapped);
      handler(payload);
    };
    return this.on(event, wrapped);
  }

  off<K extends keyof M>(event: K, handler: (payload: M[K]) => void): void {
    const set = this.handlers.get(event);
    if (!set) return;
    set.delete(handler as (payload: never) => void);
    if (set.size === 0) this.handlers.delete(event);
  }

  emit<K extends keyof M>(event: K, payload: M[K]): void {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of [...set]) {
      (handler as (payload: M[K]) => void)(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

/** Singleton bus used throughout the app. */
export const gestureEvents = new EventBus<AppEventMap>();
