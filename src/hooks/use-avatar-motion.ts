import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";

import {
  AVATAR_CENTER,
  AVATAR_RADIUS,
  NAME_LOCK_DRIFT,
} from "@/constants/header-metrics";
import type { AvatarMode } from "@/hooks/use-header-layout";

// Lottie mask geometry, in its 512×512 units.
export const MASK_FRAMES = 540;
const MASK_SCROLL = 120;
export const MASK_SIZE = 512;
const MASK_AVATAR_RADIUS = 150;
const MASK_AVATAR_CENTER_Y = 234;

const LINE_CLEARANCE = 1;

const DISC_MIN_SCALE = 0.55;
const DISC_DRIFT = NAME_LOCK_DRIFT + 10;

export const MASK_SCALE = AVATAR_RADIUS / MASK_AVATAR_RADIUS;

export type AvatarMotion = {
  restY: number;
  maskTop: number;
  frame: SharedValue<number>;
  blur: SharedValue<number>;
  lift: SharedValue<number>;
  discY: SharedValue<number>;
  discScale: SharedValue<number>;
};

export function useAvatarMotion(
  scrollY: SharedValue<number>,
  top: number,
  mode: AvatarMode,
  collapseDistance: number,
): AvatarMotion {
  const plain = mode === "plain";
  const restY = top + AVATAR_CENTER;
  const maskTop = restY - MASK_AVATAR_CENTER_Y * MASK_SCALE;
  // Without an island nothing hides the line, so it's lifted off screen before the mask plays.
  const maxLift =
    mode === "topEdge" ? Math.max(maskTop + LINE_CLEARANCE, 0) : 0;

  const frame = useDerivedValue(() =>
    plain
      ? 0
      : Math.round(
          interpolate(
            scrollY.value,
            [maxLift, maxLift + MASK_SCROLL],
            [0, MASK_FRAMES],
            Extrapolation.CLAMP,
          ),
        ),
  );

  const lift = useDerivedValue(() =>
    Math.min(Math.max(scrollY.value, 0), maxLift),
  );

  const collapse = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [maxLift, maxLift + collapseDistance],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  );

  const discY = useDerivedValue(
    () => restY - Math.max(scrollY.value, 0) + DISC_DRIFT * collapse.value,
  );

  const discScale = useDerivedValue(
    () => 1 + (DISC_MIN_SCALE - 1) * collapse.value,
  );

  const blur = useDerivedValue(() =>
    plain ? collapse.value : frame.value / MASK_FRAMES,
  );

  return { restY, maskTop, frame, blur, lift, discY, discScale };
}
