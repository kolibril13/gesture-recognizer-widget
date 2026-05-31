"""A JupyterLab anywidget wrapping the MediaPipe Gesture Recognizer.

Each of the 21 MediaPipe hand landmarks is exposed as its own traitlet
holding ``[x, y, z]`` normalized coordinates for the primary (most
confident) detected hand, so they can be read directly from Python::

    from gesture_widget import GestureRecognizerWidget

    w = GestureRecognizerWidget()
    w                      # display in a notebook cell, then Start Camera
    w.index_finger_tip     # -> [0.51, 0.42, 0.0]
    w.gesture              # -> "Victory"

You can also observe individual landmarks::

    w.observe(lambda ch: print(ch["new"]), "index_finger_tip")
"""

from __future__ import annotations

import pathlib

import anywidget
import traitlets as t

_HERE = pathlib.Path(__file__).parent
_STATIC = _HERE / "static"

#: Canonical MediaPipe hand-landmark names (index == landmark index).
LANDMARK_NAMES: tuple[str, ...] = (
    "wrist",
    "thumb_cmc",
    "thumb_mcp",
    "thumb_ip",
    "thumb_tip",
    "index_finger_mcp",
    "index_finger_pip",
    "index_finger_dip",
    "index_finger_tip",
    "middle_finger_mcp",
    "middle_finger_pip",
    "middle_finger_dip",
    "middle_finger_tip",
    "ring_finger_mcp",
    "ring_finger_pip",
    "ring_finger_dip",
    "ring_finger_tip",
    "pinky_mcp",
    "pinky_pip",
    "pinky_dip",
    "pinky_tip",
)


def _point() -> t.List:
    """A traitlet holding an ``[x, y, z]`` point (empty when no hand)."""
    return t.List(trait=t.Float(), default_value=[]).tag(sync=True)


class GestureRecognizerWidget(anywidget.AnyWidget):
    """Live webcam gesture recognition + hand landmarks for JupyterLab."""

    _esm = _STATIC / "widget.js"
    _css = _STATIC / "widget.css"

    # --- Controls (Python -> JS) ---
    streaming = t.Bool(False).tag(sync=True)
    mirror = t.Bool(True).tag(sync=True)
    max_num_hands = t.Int(2).tag(sync=True)
    #: Minimum interval between landmark syncs to Python, in milliseconds.
    sync_interval_ms = t.Int(100).tag(sync=True)

    # --- Status / metrics (JS -> Python) ---
    status = t.Unicode("idle").tag(sync=True)
    fps = t.Float(0.0).tag(sync=True)
    inference_ms = t.Float(0.0).tag(sync=True)
    num_hands = t.Int(0).tag(sync=True)

    # --- Primary-hand recognition result ---
    gesture = t.Unicode("None").tag(sync=True)
    confidence = t.Float(0.0).tag(sync=True)
    handedness = t.Unicode("").tag(sync=True)

    #: All 21 landmarks of the primary hand as ``[[x, y, z], ...]``.
    landmarks = t.List(default_value=[]).tag(sync=True)
    #: Full per-hand data for every detected hand.
    hands = t.List(default_value=[]).tag(sync=True)

    # --- Individual landmark traitlets (primary hand) ---
    wrist = _point()
    thumb_cmc = _point()
    thumb_mcp = _point()
    thumb_ip = _point()
    thumb_tip = _point()
    index_finger_mcp = _point()
    index_finger_pip = _point()
    index_finger_dip = _point()
    index_finger_tip = _point()
    middle_finger_mcp = _point()
    middle_finger_pip = _point()
    middle_finger_dip = _point()
    middle_finger_tip = _point()
    ring_finger_mcp = _point()
    ring_finger_pip = _point()
    ring_finger_dip = _point()
    ring_finger_tip = _point()
    pinky_mcp = _point()
    pinky_pip = _point()
    pinky_dip = _point()
    pinky_tip = _point()

    def finger_positions(self) -> dict[str, list[float]]:
        """Return ``{landmark_name: [x, y, z]}`` for the primary hand."""
        return {name: list(getattr(self, name)) for name in LANDMARK_NAMES}

    def start(self) -> None:
        """Start the webcam and recognition (subject to browser permission)."""
        self.streaming = True

    def stop(self) -> None:
        """Stop the webcam and recognition."""
        self.streaming = False
