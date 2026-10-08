import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { Avatar } from "@/components/avatar";
import { AvatarPattern } from "@/components/avatar-pattern";
import { colors } from "@/constants/colors";
import {
  HEADER_CONTENT_HEIGHT,
  NAME_LOCK_DRIFT,
} from "@/constants/header-metrics";
import { useAvatarMotion } from "@/hooks/use-avatar-motion";
import { useHeaderLayout } from "@/hooks/use-header-layout";

const KEEP_GRADIENT = Platform.OS === "android";
const GRADIENT_OPACITY = KEEP_GRADIENT ? 1 : 0.85;
const GRADIENT_FADE_PROGRESS = 0.97;
const GRADIENT_FADE_DURATION = 250;
const AVATAR = require("../../assets/images/avatar.png");

const GRADIENT = `radial-gradient(circle at 50% 45%, ${colors.headerGradient.join(", ")})`;

const NAME_CENTER = 146;
const SUBTITLE_CENTER = 173;
const NAME_FONT_SIZE = 28;
const SUBTITLE_FONT_SIZE = 17;
const NAME_MIN_SCALE = 0.6;
const SUBTITLE_MIN_SCALE = 0.8;
const SUBTITLE_DRIFT = 1;
const NAME_LINE_HEIGHT = 34;
const SUBTITLE_LINE_HEIGHT = 22;

type Props = {
  scrollY: SharedValue<number>;
};

export function ProfileHeader({ scrollY }: Props) {
  const { top, barCenter, collapseRange, avatarMode } = useHeaderLayout();
  const { width, height: windowHeight } = useWindowDimensions();

  const expandedHeight = top + HEADER_CONTENT_HEIGHT;
  // Room to stretch when the list is pulled down past the top.
  const frameHeight = expandedHeight + windowHeight;
  // The name rides with the list until it locks, then drifts the last few points into the bar.
  const nameTravel = NAME_CENTER - barCenter + NAME_LOCK_DRIFT;

  const progress = useDerivedValue(() =>
    Math.min(Math.max(scrollY.value / collapseRange, 0), 1),
  );

  const avatarMotion = useAvatarMotion(scrollY, top, avatarMode, nameTravel);

  const backgroundOpacity = useSharedValue(1);
  useAnimatedReaction(
    () => !KEEP_GRADIENT && progress.value >= GRADIENT_FADE_PROGRESS,
    (faded, wasFaded) => {
      if (faded !== wasFaded) {
        backgroundOpacity.value = withTiming(faded ? 0 : 1, {
          duration: GRADIENT_FADE_DURATION,
        });
      }
    },
  );

  const nameCollapse = useDerivedValue(() =>
    Math.min(Math.max(scrollY.value / nameTravel, 0), 1),
  );
  const nameOffset = useDerivedValue(
    () => -Math.min(Math.max(scrollY.value, 0), nameTravel),
  );

  const visibleHeight = useDerivedValue(
    () => expandedHeight - Math.min(scrollY.value, collapseRange),
  );

  // Clipped by moving the frame up and its content back down, so nothing is laid out on scroll.
  const frameStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: visibleHeight.value - frameHeight }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: frameHeight - visibleHeight.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value * GRADIENT_OPACITY,
    transform: [{ scaleY: visibleHeight.value / expandedHeight }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    // White on the gradient, dark by the time the gradient is gone and the page shows through.
    color: interpolateColor(
      backgroundOpacity.value,
      [0, 1],
      [colors.label, colors.onHeader],
    ),
    transform: [
      { translateY: nameOffset.value + NAME_LOCK_DRIFT * nameCollapse.value },
      { scale: 1 + (NAME_MIN_SCALE - 1) * nameCollapse.value },
    ],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: 1 - nameCollapse.value,
    transform: [
      { translateY: nameOffset.value - SUBTITLE_DRIFT * nameCollapse.value },
      { scale: 1 + (SUBTITLE_MIN_SCALE - 1) * nameCollapse.value },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.frame, { height: frameHeight }, frameStyle]}
    >
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, contentStyle]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.gradient, { height: expandedHeight }, gradientStyle]}
        />

        <AvatarPattern
          progress={progress}
          motion={avatarMotion}
          width={width}
        />

        <Avatar
          source={AVATAR}
          motion={avatarMotion}
          width={width}
          mode={avatarMode}
        />

        <Animated.Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.name,
            { top: top + NAME_CENTER - NAME_LINE_HEIGHT / 2 },
            nameStyle,
          ]}
        >
          Bohdan
        </Animated.Text>
        <Animated.Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.subtitle,
            { top: top + SUBTITLE_CENTER - SUBTITLE_LINE_HEIGHT / 2 },
            subtitleStyle,
          ]}
        >
          +380 00 000 00 00 • @bohdanshh
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    transformOrigin: "top",
    experimental_backgroundImage: GRADIENT,
  },
  name: {
    position: "absolute",
    left: 0,
    right: 0,
    height: NAME_LINE_HEIGHT,
    lineHeight: NAME_LINE_HEIGHT,
    textAlign: "center",
    color: colors.onHeader,
    fontSize: NAME_FONT_SIZE,
    fontWeight: "500",
  },
  subtitle: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SUBTITLE_LINE_HEIGHT,
    lineHeight: SUBTITLE_LINE_HEIGHT,
    textAlign: "center",
    color: colors.onHeaderSecondary,
    fontSize: SUBTITLE_FONT_SIZE,
  },
});
