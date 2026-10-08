import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
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

type Star = {
  distance: number;
  angle: number;
  size: number;
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
  const scale = MIN_SCALE + random(index + 1) * (1 - MIN_SCALE);
  return {
    distance,
    angle: -Math.PI / 2 + (index % PER_RING) * STEP + turn,
    size: Math.floor(SIZE * scale),
    opacity: MAX_OPACITY * Math.max(1 - distance / FADE_DISTANCE, 0),
    reach: Math.min(distance / (2 * FIRST_RING), 1),
  };
});

const STAR_SYMBOL: SymbolViewProps["name"] = {
  ios: "star.fill",
  android: "star",
};

type Props = {
  progress: SharedValue<number>;
  motion: AvatarMotion;
  width: number;
};

export function AvatarPattern({ progress, motion, width }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {STARS.map((star, index) => (
        <PatternStar
          key={index}
          star={star}
          progress={progress}
          discY={motion.discY}
          centerX={width / 2}
        />
      ))}
    </View>
  );
}

type StarProps = {
  star: Star;
  progress: SharedValue<number>;
  discY: SharedValue<number>;
  centerX: number;
};

function PatternStar({
  star: { distance, angle, size, opacity, reach },
  progress,
  discY,
  centerX,
}: StarProps) {
  const style = useAnimatedStyle(() => {
    const wave = Math.min(progress.value / WAVE_END, 1);
    const back = -WAVE_WIDTH + wave * (1 + WAVE_WIDTH);
    const behind = Math.min(Math.max(reach - back, 0), WAVE_WIDTH) / WAVE_WIDTH;
    const pulled = 1 - WAVE_EASING(behind);
    const radius = distance + (END_DISTANCE - distance) * pulled;
    return {
      opacity: opacity * (1 - pulled),
      transform: [
        { translateX: centerX + radius * Math.cos(angle) - size / 2 },
        { translateY: discY.value + radius * Math.sin(angle) - size / 2 },
      ],
    };
  });

  const box = { width: size, height: size };

  return (
    <Animated.View style={[styles.star, box, style]}>
      <SymbolView
        name={STAR_SYMBOL}
        size={size}
        tintColor={colors.headerPattern}
        style={box}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: "absolute",
  },
});
