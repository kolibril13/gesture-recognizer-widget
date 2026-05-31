import { gestureEvents } from "./event-bus.ts";

export interface CameraDevice {
  deviceId: string;
  label: string;
}

/**
 * Wraps webcam access via getUserMedia and exposes a simple
 * start/stop lifecycle plus device enumeration.
 */
export class Camera {
  private stream: MediaStream | null = null;
  private currentDeviceId: string | null = null;

  constructor(private readonly video: HTMLVideoElement) {}

  get isActive(): boolean {
    return this.stream !== null;
  }

  get activeDeviceId(): string | null {
    return this.currentDeviceId;
  }

  /**
   * Enumerate available video input devices. Labels are only populated
   * after permission has been granted at least once.
   */
  async listDevices(): Promise<CameraDevice[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === "videoinput")
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${i + 1}`,
      }));
  }

  /** Start (or restart) the stream, optionally on a specific device. */
  async start(deviceId?: string): Promise<void> {
    await this.stop();

    const video: MediaTrackConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    };
    if (deviceId) {
      video.deviceId = { exact: deviceId };
    } else {
      video.facingMode = "user";
    }

    const constraints: MediaStreamConstraints = { video, audio: false };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.video.srcObject = this.stream;

    const track = this.stream.getVideoTracks()[0];
    this.currentDeviceId = track?.getSettings().deviceId ?? deviceId ?? null;

    await this.waitForVideoReady();
    await this.video.play();

    gestureEvents.emit("cameraStarted", {
      deviceId: this.currentDeviceId ?? "",
    });
  }

  async stop(): Promise<void> {
    if (this.stream) {
      for (const track of this.stream.getTracks()) {
        track.stop();
      }
      this.stream = null;
      this.currentDeviceId = null;
      this.video.srcObject = null;
      gestureEvents.emit("cameraStopped", undefined);
    }
  }

  setMirror(mirrored: boolean): void {
    this.video.style.transform = mirrored ? "scaleX(-1)" : "none";
  }

  private waitForVideoReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.video.readyState >= 2 && this.video.videoWidth > 0) {
        resolve();
        return;
      }
      const onReady = (): void => {
        this.video.removeEventListener("loadeddata", onReady);
        resolve();
      };
      this.video.addEventListener("loadeddata", onReady);
    });
  }
}
