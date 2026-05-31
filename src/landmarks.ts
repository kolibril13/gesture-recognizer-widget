/**
 * Canonical MediaPipe hand-landmark ordering (21 points).
 * The index in this array matches the index in the landmark array
 * returned by the recognizer, and the string is the snake_case name
 * used for the per-landmark Python traitlets.
 *
 * @see https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
 */
export const LANDMARK_NAMES = [
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
] as const;

export type LandmarkName = (typeof LANDMARK_NAMES)[number];
