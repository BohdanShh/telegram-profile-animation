import {
  Canvas,
  Picture,
  Skia,
  createPicture,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { AVATAR_RADIUS } from "@/constants/header-metrics";
import type { AvatarMotion } from "@/hooks/use-avatar-motion";

const RINGS = 5;
const PER_RING = 6;
const FIRST_RING = AVATAR_RADIUS + 22;
const RING_GAP = 28;
const STEP = (2 * Math.PI) / PER_RING;

const SIZE = 26;
const MIN_SCALE = 0.7;

const MAX_OPACITY = 0.55;
const FADE_DISTANCE = 217;

// A wave goes out from the avatar; the stars it passes slide in and fade.
const WAVE_END = 1 / 1.6;
const WAVE_WIDTH = 0.8;
const END_DISTANCE = 20;
const WAVE_EASING = Easing.bezierFn(0.6, 0, 0.4, 1);

const STAR_COLOR = Skia.Color(colors.headerPattern);

// How close the sides bend toward the center; lower is sharper.
const STAR_PINCH = 0.12;

type Star = {
  distance: number;
  cos: number;
  sin: number;
  radius: number;
  opacity: number;
  /** 0 by the avatar, 1 at the far rings. */
  reach: number;
};

// Deterministic, so sizes stay the same between runs.
function random(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const STARS: Star[] = Array.from({ length: RINGS * PER_RING }, (_, index) => {
  const ring = Math.floor(index / PER_RING);
  const distance = FIRST_RING + ring * RING_GAP;

  const turn = ring % 2 === 1 ? STEP / 2 : 0;
  const angle = -Math.PI / 2 + (index % PER_RING) * STEP + turn;

  const scale = MIN_SCALE + random(index + 1) * (1 - MIN_SCALE);

  return {
    distance,
    cos: Math.cos(angle),
    sin: Math.sin(angle),
    radius: Math.floor(SIZE * scale) / 2,
    opacity: MAX_OPACITY * Math.max(1 - distance / FADE_DISTANCE, 0),
    reach: Math.min(distance / (2 * FIRST_RING), 1),
  };
});

/** A four-point sparkle with curved-in sides, centered on the origin, radius 1. */
const STAR_PATH = Skia.PathBuilder.Make()
  .moveTo(0, -1)
  .quadTo(STAR_PINCH, -STAR_PINCH, 1, 0)
  .quadTo(STAR_PINCH, STAR_PINCH, 0, 1)
  .quadTo(-STAR_PINCH, STAR_PINCH, -1, 0)
  .quadTo(-STAR_PINCH, -STAR_PINCH, 0, -1)
  .close()
  .detach();

type Props = {
  progress: SharedValue<number>;
  motion: AvatarMotion;
  width: number;
  height: number;
};

// All stars go into one picture per frame: a native view per star costs a layer each on Android.
export function AvatarPattern({
  progress,
  motion: { discY },
  width,
  height,
}: Props) {
  const centerX = width / 2;

  const picture = useDerivedValue(() => {
    const wave = Math.min(progress.value / WAVE_END, 1);
    const back = -WAVE_WIDTH + wave * (1 + WAVE_WIDTH);
    const centerY = discY.value;

    return createPicture((canvas) => {
      const paint = Skia.Paint();
      paint.setColor(STAR_COLOR);

      for (const { distance, cos, sin, radius, opacity, reach } of STARS) {
        const behind =
          Math.min(Math.max(reach - back, 0), WAVE_WIDTH) / WAVE_WIDTH;
        const pulled = 1 - WAVE_EASING(behind);

        const alpha = opacity * (1 - pulled);
        if (alpha <= 0) continue;

        const offset = distance + (END_DISTANCE - distance) * pulled;
        paint.setAlphaf(alpha);

        canvas.save();
        canvas.translate(centerX + offset * cos, centerY + offset * sin);
        canvas.scale(radius, radius);
        canvas.drawPath(STAR_PATH, paint);
        canvas.restore();
      }
    });
  });

  return (
    <Canvas
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, width, height }}
    >
      <Picture picture={picture} />
    </Canvas>
  );
}
