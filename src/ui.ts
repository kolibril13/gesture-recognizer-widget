import type { CameraDevice } from "./camera.ts";
import type {
  HandResult,
  PerformanceMetrics,
  RecognitionFrame,
  WebSocketState,
} from "./types.ts";

type StatusKind = "idle" | "loading" | "ready" | "active" | "error";

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing required element #${id}`);
  return node as T;
}

/** Callbacks the UI invokes in response to user interaction. */
export interface UICallbacks {
  onToggleCamera: () => void;
  onSelectCamera: (deviceId: string) => void;
  onToggleMirror: (mirrored: boolean) => void;
  onToggleWebSocket: () => void;
  onWebSocketUrlChange: (url: string) => void;
  onWebSocketAutoReconnectChange: (enabled: boolean) => void;
}

/**
 * Owns every DOM reference and all rendering of textual state.
 * Knows nothing about MediaPipe — it only reflects data it is handed.
 */
export class UI {
  readonly video = el<HTMLVideoElement>("webcam");
  readonly canvas = el<HTMLCanvasElement>("overlay");

  private readonly statusDot = el<HTMLElement>("status-dot");
  private readonly statusText = el<HTMLElement>("status-text");
  private readonly videoMessage = el<HTMLElement>("video-message");

  private readonly toggleCameraBtn = el<HTMLButtonElement>("toggle-camera");
  private readonly cameraSelect = el<HTMLSelectElement>("camera-select");
  private readonly mirrorToggle = el<HTMLInputElement>("mirror-toggle");

  private readonly detectionList = el<HTMLElement>("detection-list");
  private readonly rawJson = el<HTMLElement>("raw-json");

  private readonly metricFps = el<HTMLElement>("metric-fps");
  private readonly metricInference = el<HTMLElement>("metric-inference");
  private readonly metricAvgInference = el<HTMLElement>("metric-avg-inference");
  private readonly metricHands = el<HTMLElement>("metric-hands");

  private readonly wsUrl = el<HTMLInputElement>("ws-url");
  private readonly wsAutoReconnect = el<HTMLInputElement>("ws-autoreconnect");
  private readonly wsToggle = el<HTMLButtonElement>("ws-toggle");
  private readonly wsStatus = el<HTMLElement>("ws-status");

  private readonly errorBanner = el<HTMLElement>("error-banner");
  private readonly errorText = el<HTMLElement>("error-text");
  private readonly errorDismiss = el<HTMLButtonElement>("error-dismiss");

  bindControls(cb: UICallbacks): void {
    this.toggleCameraBtn.addEventListener("click", cb.onToggleCamera);
    this.cameraSelect.addEventListener("change", () =>
      cb.onSelectCamera(this.cameraSelect.value),
    );
    this.mirrorToggle.addEventListener("change", () =>
      cb.onToggleMirror(this.mirrorToggle.checked),
    );
    this.wsToggle.addEventListener("click", cb.onToggleWebSocket);
    this.wsUrl.addEventListener("change", () =>
      cb.onWebSocketUrlChange(this.wsUrl.value),
    );
    this.wsAutoReconnect.addEventListener("change", () =>
      cb.onWebSocketAutoReconnectChange(this.wsAutoReconnect.checked),
    );
    this.errorDismiss.addEventListener("click", () => this.hideError());
  }

  get mirrorEnabled(): boolean {
    return this.mirrorToggle.checked;
  }

  get webSocketUrl(): string {
    return this.wsUrl.value;
  }

  get webSocketAutoReconnect(): boolean {
    return this.wsAutoReconnect.checked;
  }

  setStatus(kind: StatusKind, text: string): void {
    this.statusDot.dataset.kind = kind;
    this.statusText.textContent = text;
  }

  setCameraButton(label: string, opts: { disabled?: boolean } = {}): void {
    this.toggleCameraBtn.textContent = label;
    this.toggleCameraBtn.disabled = opts.disabled ?? false;
  }

  setCameraRunning(running: boolean): void {
    this.videoMessage.hidden = running;
    this.toggleCameraBtn.classList.toggle("btn-danger", running);
    this.toggleCameraBtn.classList.toggle("btn-primary", !running);
  }

  populateCameras(devices: CameraDevice[], activeId: string | null): void {
    this.cameraSelect.innerHTML = "";
    for (const device of devices) {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label;
      if (device.deviceId === activeId) option.selected = true;
      this.cameraSelect.appendChild(option);
    }
    this.cameraSelect.disabled = devices.length === 0;
  }

  renderDetections(hands: HandResult[]): void {
    if (hands.length === 0) {
      this.detectionList.innerHTML =
        '<p class="empty-state">No hands detected.</p>';
      return;
    }

    this.detectionList.innerHTML = hands
      .map(
        (hand) => `
        <div class="detection-card">
          <div class="detection-row">
            <span class="detection-key">Gesture</span>
            <span class="detection-val">${escapeHtml(hand.gesture)}</span>
          </div>
          <div class="detection-row">
            <span class="detection-key">Confidence</span>
            <span class="detection-val">${hand.confidence.toFixed(2)}</span>
          </div>
          <div class="detection-row">
            <span class="detection-key">Hand</span>
            <span class="detection-val">${escapeHtml(hand.handedness)}</span>
          </div>
        </div>`,
      )
      .join("");
  }

  renderJson(frame: RecognitionFrame): void {
    this.rawJson.textContent = JSON.stringify(frame, null, 2);
  }

  renderMetrics(metrics: PerformanceMetrics): void {
    this.metricFps.textContent = metrics.fps.toFixed(0);
    this.metricInference.textContent = `${metrics.inferenceTimeMs.toFixed(1)} ms`;
    this.metricAvgInference.textContent = `${metrics.averageInferenceTimeMs.toFixed(1)} ms`;
    this.metricHands.textContent = metrics.handCount.toFixed(0);
  }

  setWebSocketState(state: WebSocketState): void {
    this.wsStatus.dataset.state = state;
    this.wsStatus.textContent = capitalize(state);
    this.wsToggle.textContent =
      state === "connected" || state === "connecting" ? "Disconnect" : "Connect";
  }

  showError(message: string): void {
    this.errorText.textContent = message;
    this.errorBanner.hidden = false;
  }

  hideError(): void {
    this.errorBanner.hidden = true;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
