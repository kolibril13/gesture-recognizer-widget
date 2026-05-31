import {
  FilesetResolver,
  GestureRecognizer,
  type GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import type { HandResult, Landmark, RecognitionFrame } from "./types.ts";

const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm";

const MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

export interface RecognizerOptions {
  numHands?: number;
  /** "GPU" is faster where supported; falls back to "CPU" on failure. */
  delegate?: "GPU" | "CPU";
}

/**
 * Thin wrapper around the MediaPipe Tasks Vision GestureRecognizer.
 * Owns the model lifecycle (init / recognize / close).
 */
export class GestureRecognizerService {
  private recognizer: GestureRecognizer | null = null;
  private lastVideoTime = -1;

  get isReady(): boolean {
    return this.recognizer !== null;
  }

  async initialize(options: RecognizerOptions = {}): Promise<void> {
    const { numHands = 2, delegate = "GPU" } = options;

    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

    try {
      this.recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_PATH, delegate },
        runningMode: "VIDEO",
        numHands,
      });
    } catch (gpuError) {
      // GPU delegate can fail on some browsers/drivers — retry on CPU.
      if (delegate === "GPU") {
        console.warn("GPU delegate failed, retrying on CPU.", gpuError);
        this.recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_PATH, delegate: "CPU" },
          runningMode: "VIDEO",
          numHands,
        });
      } else {
        throw gpuError;
      }
    }
  }

  /**
   * Run recognition on the current video frame. Returns `null` when the
   * frame is unchanged (avoids the recognizer throwing on duplicate
   * timestamps) or when the recognizer is not initialized.
   */
  recognize(
    video: HTMLVideoElement,
    timestampMs: number,
  ): RecognitionFrame | null {
    if (!this.recognizer) return null;
    if (video.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = video.currentTime;

    const start = performance.now();
    const raw = this.recognizer.recognizeForVideo(video, timestampMs);
    const inferenceTimeMs = performance.now() - start;

    return {
      timestamp: timestampMs,
      inferenceTimeMs,
      hands: this.mapResult(raw),
    };
  }

  close(): void {
    this.recognizer?.close();
    this.recognizer = null;
    this.lastVideoTime = -1;
  }

  private mapResult(raw: GestureRecognizerResult): HandResult[] {
    const hands: HandResult[] = [];
    const handCount = raw.landmarks.length;

    for (let i = 0; i < handCount; i++) {
      const landmarks: Landmark[] = (raw.landmarks[i] ?? []).map((lm) => ({
        x: lm.x,
        y: lm.y,
        z: lm.z,
        visibility: lm.visibility,
      }));

      const topGesture = raw.gestures[i]?.[0];
      const topHandedness = raw.handedness[i]?.[0];

      hands.push({
        index: i,
        gesture: topGesture?.categoryName ?? "None",
        confidence: topGesture?.score ?? 0,
        handedness: topHandedness?.categoryName ?? "Unknown",
        landmarks,
      });
    }

    return hands;
  }
}
