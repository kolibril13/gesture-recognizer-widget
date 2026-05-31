import { Camera } from "./camera.ts";
import { GestureRecognizerService } from "./gesture-recognizer.ts";
import { LANDMARK_NAMES } from "./landmarks.ts";
import { Renderer } from "./renderer.ts";
import type { HandResult, Landmark, RecognitionFrame } from "./types.ts";

/** Minimal structural type for the anywidget model (avoids `any`). */
interface AnyModel {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  save_changes(): void;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
}

interface RenderContext {
  model: AnyModel;
  el: HTMLElement;
}

type Triplet = [number, number, number];

function num(model: AnyModel, key: string, fallback: number): number {
  const v = model.get(key);
  return typeof v === "number" ? v : fallback;
}

function bool(model: AnyModel, key: string, fallback: boolean): boolean {
  const v = model.get(key);
  return typeof v === "boolean" ? v : fallback;
}

function toTriplet(lm: Landmark | undefined): Triplet | [] {
  return lm ? [lm.x, lm.y, lm.z] : [];
}

/** Build the widget DOM inside `el` and return the relevant nodes. */
function buildDom(el: HTMLElement): {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  message: HTMLElement;
  startBtn: HTMLButtonElement;
  select: HTMLSelectElement;
  mirrorInput: HTMLInputElement;
  statusEl: HTMLElement;
  readout: HTMLElement;
} {
  el.classList.add("grw");
  el.innerHTML = `
    <div class="grw-stage">
      <video class="grw-video" autoplay playsinline muted></video>
      <canvas class="grw-canvas"></canvas>
      <div class="grw-msg">Camera is off</div>
    </div>
    <div class="grw-controls">
      <button class="grw-btn grw-start">Start Camera</button>
      <select class="grw-select" disabled></select>
      <label class="grw-check"><input type="checkbox" class="grw-mirror" checked /> Mirror</label>
      <span class="grw-status"><span class="grw-dot"></span><span class="grw-status-text">idle</span></span>
      <span class="grw-readout">No hand</span>
    </div>
  `;

  const q = <T extends HTMLElement>(sel: string): T => {
    const node = el.querySelector<T>(sel);
    if (!node) throw new Error(`widget DOM missing ${sel}`);
    return node;
  };

  return {
    video: q<HTMLVideoElement>(".grw-video"),
    canvas: q<HTMLCanvasElement>(".grw-canvas"),
    message: q<HTMLElement>(".grw-msg"),
    startBtn: q<HTMLButtonElement>(".grw-start"),
    select: q<HTMLSelectElement>(".grw-select"),
    mirrorInput: q<HTMLInputElement>(".grw-mirror"),
    statusEl: q<HTMLElement>(".grw-status"),
    readout: q<HTMLElement>(".grw-readout"),
  };
}

function pickPrimary(hands: HandResult[]): HandResult | null {
  if (hands.length === 0) return null;
  return hands.reduce((best, h) => (h.confidence > best.confidence ? h : best));
}

/** anywidget entry point. */
function render({ model, el }: RenderContext): () => void {
  const dom = buildDom(el);

  const camera = new Camera(dom.video);
  const renderer = new Renderer(dom.canvas, dom.video);
  const recognizer = new GestureRecognizerService();

  let frameHandle: number | null = null;
  let running = false;
  let modelReady = false;
  let lastSync = 0;
  let frameTimes: number[] = [];
  let lastFrameTs = performance.now();

  // Prefer requestVideoFrameCallback so we run at the camera's true frame
  // rate rather than being capped by the display refresh.
  const useRvfc = "requestVideoFrameCallback" in dom.video;

  const scheduleNextFrame = (): void => {
    frameHandle = useRvfc
      ? dom.video.requestVideoFrameCallback(tick)
      : requestAnimationFrame(tick);
  };

  const cancelNextFrame = (): void => {
    if (frameHandle === null) return;
    if (useRvfc) dom.video.cancelVideoFrameCallback(frameHandle);
    else cancelAnimationFrame(frameHandle);
    frameHandle = null;
  };

  const setStatus = (status: string): void => {
    dom.statusEl.dataset.state = status;
    const text = dom.statusEl.querySelector(".grw-status-text");
    if (text) text.textContent = status;
    model.set("status", status);
    model.save_changes();
  };

  const initRecognizer = async (): Promise<void> => {
    modelReady = false;
    setStatus("loading");
    recognizer.close();
    await recognizer.initialize({
      numHands: num(model, "max_num_hands", 2),
      delegate: "GPU",
    });
    modelReady = true;
    setStatus(running ? "streaming" : "ready");
  };

  const syncFrame = (frame: RecognitionFrame, fps: number): void => {
    const primary = pickPrimary(frame.hands);

    for (let i = 0; i < LANDMARK_NAMES.length; i++) {
      const name = LANDMARK_NAMES[i];
      if (name) model.set(name, toTriplet(primary?.landmarks[i]));
    }

    model.set("gesture", primary?.gesture ?? "None");
    model.set("confidence", primary?.confidence ?? 0);
    model.set("handedness", primary?.handedness ?? "");
    model.set("num_hands", frame.hands.length);
    model.set("inference_ms", frame.inferenceTimeMs);
    model.set("fps", fps);
    model.set(
      "landmarks",
      primary ? primary.landmarks.map(toTriplet) : [],
    );
    model.set(
      "hands",
      frame.hands.map((h) => ({
        gesture: h.gesture,
        confidence: h.confidence,
        handedness: h.handedness,
        landmarks: h.landmarks.map(toTriplet),
      })),
    );
    model.save_changes();
  };

  const tick = (): void => {
    if (!running) return;
    scheduleNextFrame();
    if (!modelReady) return;

    const frame = recognizer.recognize(dom.video, performance.now());
    if (!frame) return;

    const now = performance.now();
    const delta = now - lastFrameTs;
    lastFrameTs = now;
    if (delta > 0) frameTimes.push(delta);
    if (frameTimes.length > 60) frameTimes.shift();
    const avg = frameTimes.reduce((s, v) => s + v, 0) / (frameTimes.length || 1);
    const fps = avg > 0 ? 1000 / avg : 0;

    renderer.draw(frame.hands);

    const primary = pickPrimary(frame.hands);
    dom.readout.textContent = primary
      ? `${primary.handedness} · ${primary.gesture} (${primary.confidence.toFixed(2)})`
      : "No hand";

    const interval = num(model, "sync_interval_ms", 100);
    if (now - lastSync >= interval) {
      lastSync = now;
      syncFrame(frame, fps);
    }
  };

  const startCamera = async (): Promise<void> => {
    if (running) return;
    try {
      if (!modelReady) await initRecognizer();
      await camera.start();
      camera.setMirror(bool(model, "mirror", true));
      renderer.setMirror(bool(model, "mirror", true));
      await populateDevices();
      running = true;
      dom.message.style.display = "none";
      dom.startBtn.textContent = "Stop Camera";
      dom.startBtn.classList.add("grw-btn-danger");
      setStatus("streaming");
      if (!bool(model, "streaming", false)) {
        model.set("streaming", true);
        model.save_changes();
      }
      scheduleNextFrame();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus("error");
      dom.readout.textContent = `Error: ${message}`;
    }
  };

  const stopCamera = async (): Promise<void> => {
    running = false;
    cancelNextFrame();
    await camera.stop();
    renderer.clear();
    frameTimes = [];
    dom.message.style.display = "";
    dom.startBtn.textContent = "Start Camera";
    dom.startBtn.classList.remove("grw-btn-danger");
    setStatus(modelReady ? "ready" : "idle");
    if (bool(model, "streaming", false)) {
      model.set("streaming", false);
      model.save_changes();
    }
  };

  const populateDevices = async (): Promise<void> => {
    const devices = await camera.listDevices();
    dom.select.innerHTML = "";
    for (const device of devices) {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.textContent = device.label;
      if (device.deviceId === camera.activeDeviceId) option.selected = true;
      dom.select.appendChild(option);
    }
    dom.select.disabled = devices.length === 0;
  };

  // --- DOM event wiring ---
  const onStartClick = (): void => {
    void (running ? stopCamera() : startCamera());
  };
  const onSelectChange = (): void => {
    if (!running) return;
    void (async () => {
      await camera.start(dom.select.value);
    })();
  };
  const onMirrorChange = (): void => {
    const mirrored = dom.mirrorInput.checked;
    camera.setMirror(mirrored);
    renderer.setMirror(mirrored);
    model.set("mirror", mirrored);
    model.save_changes();
  };

  dom.startBtn.addEventListener("click", onStartClick);
  dom.select.addEventListener("change", onSelectChange);
  dom.mirrorInput.addEventListener("change", onMirrorChange);

  // --- Model (Python -> JS) change handlers ---
  const onStreamingChange = (): void => {
    const want = bool(model, "streaming", false);
    if (want && !running) void startCamera();
    else if (!want && running) void stopCamera();
  };
  const onMirrorModelChange = (): void => {
    const mirrored = bool(model, "mirror", true);
    dom.mirrorInput.checked = mirrored;
    camera.setMirror(mirrored);
    renderer.setMirror(mirrored);
  };
  const onMaxHandsChange = (): void => {
    if (modelReady) void initRecognizer();
  };

  model.on("change:streaming", onStreamingChange);
  model.on("change:mirror", onMirrorModelChange);
  model.on("change:max_num_hands", onMaxHandsChange);

  // Reflect initial mirror state from the model into the DOM.
  dom.mirrorInput.checked = bool(model, "mirror", true);

  // Warm up the model so the first Start is fast; failures surface lazily.
  void initRecognizer().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    setStatus("error");
    dom.readout.textContent = `Model load failed: ${message}`;
  });

  // --- Cleanup ---
  return (): void => {
    running = false;
    cancelNextFrame();
    model.off("change:streaming", onStreamingChange);
    model.off("change:mirror", onMirrorModelChange);
    model.off("change:max_num_hands", onMaxHandsChange);
    void camera.stop();
    recognizer.close();
  };
}

export default { render };
