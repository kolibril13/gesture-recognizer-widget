# Gesture Recognizer Studio

<video src="https://github.com/kolibril13/gesture-recognizer-widget/raw/main/hand.mp4" controls width="100%"></video>

[![PyPI](https://img.shields.io/pypi/v/gesture-recognizer-widget)](https://pypi.org/project/gesture-recognizer-widget/)

A from-scratch clone of the **MediaPipe Studio Gesture Recognizer** demo, built
with modern TypeScript + Vite and the official
[`@mediapipe/tasks-vision`](https://www.npmjs.com/package/@mediapipe/tasks-vision)
package. No UI framework — pure TypeScript + DOM.

## Features

- **Webcam** — start/stop, camera selector, mirror toggle, live FPS.
- **Gesture recognition** — Open_Palm, Closed_Fist, Pointing_Up, Thumb_Up,
  Thumb_Down, Victory, ILoveYou. Shows label, confidence, and handedness.
- **Hand landmarks** — points + connections + handedness labels rendered on a
  transparent, high-DPI canvas overlay. Up to 2 hands.
- **Live data panel** — current detections plus a collapsible raw-JSON view.
- **Performance metrics** — FPS, inference time, average inference time,
  detected hand count.
- **Typed event bus** — emits `gesture`, `handAppeared`, `handDisappeared`,
  `frame`, `metrics`, and more.
- **WebSocket streaming** — disabled by default; configurable URL, optional
  auto-reconnect, streams JSON gesture payloads.
- **Dark, responsive UI** with status indicators, loading and error states, and
  webcam permission handling.

## Requirements

- Node.js 18+ (tested on Node 26)
- A browser with webcam access (Chrome/Edge recommended for WebGL/GPU delegate)

## Installation

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Vite serves the app at `http://localhost:5173` and opens it automatically. Allow
camera access when prompted, then click **Start Camera**.

> The model and WASM runtime are fetched from the MediaPipe CDN on first load,
> so an internet connection is required the first time.

## Build & preview (production)

```bash
npm run build      # type-check + bundle to dist/
npm run preview    # serve the production build locally
```

## Lint

```bash
npm run lint
npm run lint:fix
```

## Project structure

```text
src/
  main.ts                # entry point
  app.ts                 # orchestration + render loop + metrics
  camera.ts              # getUserMedia lifecycle + device enumeration
  gesture-recognizer.ts  # MediaPipe Tasks Vision wrapper
  renderer.ts            # canvas overlay (landmarks, connections, labels)
  ui.ts                  # all DOM references and rendering
  websocket.ts           # optional JSON streaming client
  event-bus.ts           # lightweight typed event bus
  types.ts               # shared domain types
  landmarks.ts           # canonical 21 hand-landmark names
  widget.ts              # anywidget front-end entry (bundled separately)
src_widget/
  README.md              # PyPI long description for the Python package
  gesture_widget/
    __init__.py          # the anywidget.AnyWidget subclass + traitlets
    static/
      widget.js          # built bundle (npm run build:widget)
      widget.css         # widget styles
pyproject.toml           # Python packaging (PyPI: gesture-recognizer-widget)
index.html
styles.css
vite.config.ts           # standalone app build
vite.widget.config.ts    # widget library build
tsconfig.json
eslint.config.js
```

## JupyterLab widget (anywidget)

The same recognizer is also packaged as an [anywidget](https://anywidget.dev)
so you can read live hand-landmark positions directly in Python. It is published
on PyPI as **`gesture-recognizer-widget`** (see
[`src_widget/README.md`](src_widget/README.md) for the package docs).

### Install from PyPI

```bash
pip install gesture-recognizer-widget
```

### Use it in a notebook

```python
from gesture_widget import GestureRecognizerWidget

w = GestureRecognizerWidget()
w                       # display the cell, then click "Start Camera"
```

### Development version (run against your local checkout)

```bash
npm install
npm run build:widget    # bundles src/widget.ts -> src_widget/gesture_widget/static/widget.js
pip install -e .        # editable install of the local package
```

In an embedded interpreter such as Blender's bundled Python, point its `pip` at
the repo: `subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "/path/to/caputre_motion"])`.

```python
# Read individual finger / hand-landmark positions ([x, y, z], normalized 0..1):
w.index_finger_tip      # -> [0.51, 0.42, 0.0]
w.thumb_tip
w.wrist

# High-level result for the primary (most confident) hand:
w.gesture               # -> "Victory"
w.confidence            # -> 0.93
w.handedness            # -> "Right"
w.num_hands             # -> 1

# Everything at once:
w.finger_positions()    # {"wrist": [...], "thumb_cmc": [...], ...}  (21 entries)
w.hands                 # full per-hand data for every detected hand

# React to changes:
w.observe(lambda ch: print(ch["new"]), "index_finger_tip")

# Control from Python:
w.start(); w.stop()     # toggle the camera
w.mirror = False
w.max_num_hands = 1
w.sync_interval_ms = 50 # how often landmarks are pushed to Python (default 100ms)
```

**Traitlets exposed** (all `.tag(sync=True)`):

- 21 per-landmark points, each `[x, y, z]`: `wrist`, `thumb_cmc`, `thumb_mcp`,
  `thumb_ip`, `thumb_tip`, `index_finger_mcp`, `index_finger_pip`,
  `index_finger_dip`, `index_finger_tip`, `middle_finger_*`, `ring_finger_*`,
  `pinky_*` (for the primary hand; empty list when no hand is detected).
- `gesture`, `confidence`, `handedness`, `num_hands`, `landmarks`, `hands`
- `status`, `fps`, `inference_ms`
- controls: `streaming`, `mirror`, `max_num_hands`, `sync_interval_ms`

> Camera access requires a browser context; start it from the rendered widget's
> button (a user gesture) or via `w.start()`. The model + WASM are fetched from
> the MediaPipe CDN on first load.

## WebSocket payload

When connected, each detected hand is streamed per frame:

```json
{
  "timestamp": 123456789,
  "gesture": "Victory",
  "confidence": 0.93,
  "handedness": "Right",
  "landmarks": [{ "x": 0.5, "y": 0.4, "z": 0.0 }]
}
```

A quick local echo server for testing:

```bash
npx -y wscat -l 8080
```
