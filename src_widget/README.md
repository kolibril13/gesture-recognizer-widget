# gesture-recognizer-widget

A Jupyter [anywidget](https://anywidget.dev) that runs the **MediaPipe Gesture
Recognizer** on your webcam and streams the results straight into Python. Each
of the 21 hand landmarks is a live traitlet, so you can read finger positions,
the recognized gesture, and handedness directly in a notebook — and drive
anything you like with them (plots, robots, a Blender rig, …).

All inference happens in the browser via `@mediapipe/tasks-vision`; Python just
receives the numbers.

## Install

```bash
pip install gesture-recognizer-widget
```

## Use it in a notebook

```python
from gesture_widget import GestureRecognizerWidget

w = GestureRecognizerWidget()
w                       # display the cell, then click "Start Camera"
```

```python
# Individual landmarks as [x, y, z], normalized 0..1 (empty list when no hand):
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

> Camera access requires a browser context: start it from the rendered widget's
> button (a user gesture) or via `w.start()`. The model and WASM runtime are
> fetched from the MediaPipe CDN on first load, so the first run needs internet.

## Using the development version

If you've cloned the repo and want to run against your local checkout (e.g. to
hack on the widget while using the notebook), install it in editable mode after
building the front-end bundle:

```bash
npm install
npm run build:widget    # bundles src/widget.ts -> src_widget/gesture_widget/static/widget.js
pip install -e .        # editable install of the local package
```

`pip install -e .` makes `from gesture_widget import GestureRecognizerWidget`
resolve to your working tree, so Python changes are picked up immediately and
rebuilding the bundle refreshes the front-end. If you're working inside an
embedded interpreter (such as Blender's bundled Python), point its `pip` at the
repo instead:

```python
import subprocess, sys
subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "/path/to/caputre_motion"])
```

## License

MIT
