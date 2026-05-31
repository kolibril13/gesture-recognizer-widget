import { GestureRecognizer } from "@mediapipe/tasks-vision";
import type { HandResult, Landmark } from "./types.ts";

interface Connection {
  start: number;
  end: number;
}

const HAND_CONNECTIONS = GestureRecognizer.HAND_CONNECTIONS as Connection[];

const COLORS = {
  Left: "#00e5ff",
  Right: "#ff4f81",
  default: "#7cffb2",
} as const;

/**
 * Draws hand landmarks, connections, and handedness labels onto a
 * transparent canvas overlaid on the video. Handles high-DPI displays
 * and automatic resizing.
 */
export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  private mirror = false;
  private cssWidth = 0;
  private cssHeight = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly video: HTMLVideoElement,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Unable to acquire 2D canvas context.");
    this.ctx = ctx;
  }

  setMirror(mirrored: boolean): void {
    this.mirror = mirrored;
  }

  /** Match the backing store to the displayed video size and DPR. */
  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.video.getBoundingClientRect();
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;

    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  draw(hands: HandResult[]): void {
    this.resize();
    this.clear();

    for (const hand of hands) {
      const color =
        hand.handedness === "Left"
          ? COLORS.Left
          : hand.handedness === "Right"
            ? COLORS.Right
            : COLORS.default;
      this.drawConnections(hand.landmarks, color);
      this.drawLandmarks(hand.landmarks);
      this.drawLabel(hand, color);
    }
  }

  private px(lm: Landmark): { x: number; y: number } {
    const x = this.mirror ? 1 - lm.x : lm.x;
    return { x: x * this.cssWidth, y: lm.y * this.cssHeight };
  }

  private drawConnections(landmarks: Landmark[], color: string): void {
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = color;
    for (const { start, end } of HAND_CONNECTIONS) {
      const a = landmarks[start];
      const b = landmarks[end];
      if (!a || !b) continue;
      const pa = this.px(a);
      const pb = this.px(b);
      this.ctx.beginPath();
      this.ctx.moveTo(pa.x, pa.y);
      this.ctx.lineTo(pb.x, pb.y);
      this.ctx.stroke();
    }
  }

  private drawLandmarks(landmarks: Landmark[]): void {
    this.ctx.fillStyle = "#ffffff";
    for (const lm of landmarks) {
      const p = this.px(lm);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawLabel(hand: HandResult, color: string): void {
    const wrist = hand.landmarks[0];
    if (!wrist) return;
    const p = this.px(wrist);
    const text = `${hand.handedness} · ${hand.gesture}`;

    this.ctx.font = "600 16px system-ui, sans-serif";
    const metrics = this.ctx.measureText(text);
    const padX = 8;
    const padY = 6;
    const boxW = metrics.width + padX * 2;
    const boxH = 24;
    const boxX = Math.min(Math.max(p.x - boxW / 2, 0), this.cssWidth - boxW);
    const boxY = Math.max(p.y - 40, 0);

    this.ctx.fillStyle = "rgba(0,0,0,0.65)";
    this.ctx.fillRect(boxX, boxY, boxW, boxH);
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, boxX + padX, boxY + boxH - padY);
  }
}
