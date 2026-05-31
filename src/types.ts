/**
 * Shared domain types for the Gesture Recognizer Studio app.
 */

/** A single normalized hand landmark (values in 0..1 range). */
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/** Handedness as reported by MediaPipe. */
export type Handedness = "Left" | "Right";

/** The set of gestures the recognizer model is trained to emit. */
export type GestureLabel =
  | "None"
  | "Closed_Fist"
  | "Open_Palm"
  | "Pointing_Up"
  | "Thumb_Down"
  | "Thumb_Up"
  | "Victory"
  | "ILoveYou";

/** Recognition result for a single detected hand. */
export interface HandResult {
  /** Stable-ish index of the hand within a single frame (0 or 1). */
  index: number;
  gesture: GestureLabel | string;
  confidence: number;
  handedness: Handedness | string;
  landmarks: Landmark[];
}

/** Full per-frame recognition output. */
export interface RecognitionFrame {
  timestamp: number;
  hands: HandResult[];
  inferenceTimeMs: number;
}

/** Performance metrics snapshot. */
export interface PerformanceMetrics {
  fps: number;
  inferenceTimeMs: number;
  averageInferenceTimeMs: number;
  handCount: number;
}

/** Payload streamed over the WebSocket for each detected hand. */
export interface GestureStreamPayload {
  timestamp: number;
  gesture: string;
  confidence: number;
  handedness: string;
  landmarks: Landmark[];
}

/** Connection lifecycle states for the WebSocket module. */
export type WebSocketState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";
