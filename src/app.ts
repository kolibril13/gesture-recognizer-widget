import { Camera } from "./camera.ts";
import { gestureEvents } from "./event-bus.ts";
import { GestureRecognizerService } from "./gesture-recognizer.ts";
import { Renderer } from "./renderer.ts";
import { UI } from "./ui.ts";
import { GestureWebSocket } from "./websocket.ts";
import type { HandResult, PerformanceMetrics, RecognitionFrame } from "./types.ts";

/** Rolling tracker for FPS and inference timing. */
class MetricsTracker {
  private frameTimes: number[] = [];
  private inferenceTimes: number[] = [];
  private lastFrame = performance.now();

  record(inferenceTimeMs: number): void {
    const now = performance.now();
    const delta = now - this.lastFrame;
    this.lastFrame = now;

    if (delta > 0) this.frameTimes.push(delta);
    this.inferenceTimes.push(inferenceTimeMs);
    if (this.frameTimes.length > 60) this.frameTimes.shift();
    if (this.inferenceTimes.length > 60) this.inferenceTimes.shift();
  }

  snapshot(handCount: number, lastInferenceMs: number): PerformanceMetrics {
    const avgFrame = average(this.frameTimes);
    return {
      fps: avgFrame > 0 ? 1000 / avgFrame : 0,
      inferenceTimeMs: lastInferenceMs,
      averageInferenceTimeMs: average(this.inferenceTimes),
      handCount,
    };
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Top-level application controller. Wires modules together, runs the
 * render loop, and translates per-frame results into typed events.
 */
export class App {
  private readonly ui = new UI();
  private readonly camera: Camera;
  private readonly recognizer = new GestureRecognizerService();
  private readonly renderer: Renderer;
  private readonly websocket = new GestureWebSocket();
  private readonly metrics = new MetricsTracker();

  private rafId: number | null = null;
  private running = false;
  private trackedHands = new Map<number, string>();
  private lastPrimaryGesture: string | null = null;

  constructor() {
    this.camera = new Camera(this.ui.video);
    this.renderer = new Renderer(this.ui.canvas, this.ui.video);
  }

  async start(): Promise<void> {
    this.bindUI();
    this.bindEvents();

    this.ui.setStatus("loading", "Loading gesture model…");
    this.ui.setCameraButton("Loading…", { disabled: true });

    try {
      await this.recognizer.initialize({ numHands: 2, delegate: "GPU" });
      this.ui.setStatus("ready", "Model ready — start the camera");
      this.ui.setCameraButton("Start Camera", { disabled: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.ui.setStatus("error", "Failed to load model");
      this.ui.showError(`Could not initialize recognizer: ${message}`);
    }

    window.addEventListener("beforeunload", () => this.dispose());
  }

  private bindUI(): void {
    this.ui.bindControls({
      onToggleCamera: () => void this.toggleCamera(),
      onSelectCamera: (id) => void this.switchCamera(id),
      onToggleMirror: (mirrored) => {
        this.camera.setMirror(mirrored);
        this.renderer.setMirror(mirrored);
      },
      onToggleWebSocket: () => this.toggleWebSocket(),
      onWebSocketUrlChange: (url) => this.websocket.configure({ url }),
      onWebSocketAutoReconnectChange: (autoReconnect) =>
        this.websocket.configure({ autoReconnect }),
    });

    this.camera.setMirror(this.ui.mirrorEnabled);
    this.renderer.setMirror(this.ui.mirrorEnabled);
    this.websocket.configure({
      url: this.ui.webSocketUrl,
      autoReconnect: this.ui.webSocketAutoReconnect,
    });
  }

  private bindEvents(): void {
    gestureEvents.on("websocketState", (state) =>
      this.ui.setWebSocketState(state),
    );
    gestureEvents.on("error", ({ message }) => this.ui.showError(message));

    // Stream every detected hand over the socket when connected.
    gestureEvents.on("frame", (frame) => {
      for (const hand of frame.hands) {
        this.websocket.send({
          timestamp: frame.timestamp,
          gesture: hand.gesture,
          confidence: hand.confidence,
          handedness: hand.handedness,
          landmarks: hand.landmarks,
        });
      }
    });
  }

  private async toggleCamera(): Promise<void> {
    if (this.camera.isActive) {
      this.stopLoop();
      await this.camera.stop();
      this.renderer.clear();
      this.ui.setCameraRunning(false);
      this.ui.setCameraButton("Start Camera");
      this.ui.setStatus("ready", "Camera stopped");
      this.resetTracking();
      return;
    }

    try {
      this.ui.setCameraButton("Starting…", { disabled: true });
      await this.camera.start();
      await this.refreshDeviceList();
      this.ui.setCameraRunning(true);
      this.ui.setCameraButton("Stop Camera", { disabled: false });
      this.ui.setStatus("active", "Recognizing…");
      this.startLoop();
    } catch (err) {
      this.ui.setCameraButton("Start Camera", { disabled: false });
      this.handleCameraError(err);
    }
  }

  private async switchCamera(deviceId: string): Promise<void> {
    if (!this.camera.isActive) return;
    try {
      this.stopLoop();
      await this.camera.start(deviceId);
      this.startLoop();
    } catch (err) {
      this.handleCameraError(err);
    }
  }

  private async refreshDeviceList(): Promise<void> {
    const devices = await this.camera.listDevices();
    this.ui.populateCameras(devices, this.camera.activeDeviceId);
  }

  private toggleWebSocket(): void {
    const state = this.websocket.currentState;
    this.websocket.configure({
      url: this.ui.webSocketUrl,
      autoReconnect: this.ui.webSocketAutoReconnect,
    });
    if (state === "connected" || state === "connecting") {
      this.websocket.disconnect();
    } else {
      this.websocket.connect();
    }
  }

  private startLoop(): void {
    if (this.running) return;
    this.running = true;
    const loop = (): void => {
      if (!this.running) return;
      this.tick();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(): void {
    const frame = this.recognizer.recognize(this.ui.video, performance.now());
    if (!frame) return;

    this.renderer.draw(frame.hands);
    this.ui.renderDetections(frame.hands);
    this.ui.renderJson(frame);

    this.metrics.record(frame.inferenceTimeMs);
    const snapshot = this.metrics.snapshot(
      frame.hands.length,
      frame.inferenceTimeMs,
    );
    this.ui.renderMetrics(snapshot);
    gestureEvents.emit("metrics", snapshot);

    gestureEvents.emit("frame", frame);
    this.diffHands(frame);
  }

  /** Emit hand appear/disappear and gesture-change events. */
  private diffHands(frame: RecognitionFrame): void {
    const seen = new Set<number>();

    for (const hand of frame.hands) {
      seen.add(hand.index);
      if (!this.trackedHands.has(hand.index)) {
        gestureEvents.emit("handAppeared", hand);
      }
      this.trackedHands.set(hand.index, hand.gesture);
    }

    for (const index of [...this.trackedHands.keys()]) {
      if (!seen.has(index)) {
        this.trackedHands.delete(index);
        gestureEvents.emit("handDisappeared", { index });
      }
    }

    const primary = this.primaryHand(frame.hands);
    const primaryGesture = primary?.gesture ?? null;
    if (primary && primaryGesture !== this.lastPrimaryGesture) {
      gestureEvents.emit("gesture", primary);
    }
    this.lastPrimaryGesture = primaryGesture;
  }

  private primaryHand(hands: HandResult[]): HandResult | null {
    if (hands.length === 0) return null;
    return hands.reduce((best, h) =>
      h.confidence > best.confidence ? h : best,
    );
  }

  private resetTracking(): void {
    this.trackedHands.clear();
    this.lastPrimaryGesture = null;
    this.ui.renderDetections([]);
  }

  private handleCameraError(err: unknown): void {
    let message = "Unable to access the camera.";
    if (err instanceof DOMException) {
      if (err.name === "NotAllowedError") {
        message = "Camera permission denied. Please allow access and retry.";
      } else if (err.name === "NotFoundError") {
        message = "No camera device was found.";
      } else {
        message = `Camera error: ${err.message}`;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }
    this.ui.setStatus("error", "Camera error");
    this.ui.showError(message);
  }

  dispose(): void {
    this.stopLoop();
    void this.camera.stop();
    this.recognizer.close();
    this.websocket.disconnect();
    gestureEvents.clear();
  }
}
