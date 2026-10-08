import * as Device from "expo-device";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ANDROID_FALLBACK_BAR_HEIGHT,
  HEADER_CONTENT_HEIGHT,
  IOS_BAR_HEIGHT,
  IOS_COLLAPSED_HEIGHT,
  ISLAND_MIN_TOP_INSET,
} from "@/constants/header-metrics";
import { ISLAND_MODEL_IDS } from "@/constants/island-devices";

/** island: drips into the island; topEdge: drips off the top of the screen; plain: scrolls and shrinks. */
export type AvatarMode = "island" | "topEdge" | "plain";

export function useHeaderLayout() {
  const { top: topInset } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const isIOS = Platform.OS === "ios";

  let barHeight = IOS_BAR_HEIGHT;

  if (!isIOS) {
    const measuredBarHeight = headerHeight - topInset;
    barHeight =
      measuredBarHeight > 0 ? measuredBarHeight : ANDROID_FALLBACK_BAR_HEIGHT;
  }

  const collapsedHeight = isIOS ? IOS_COLLAPSED_HEIGHT : barHeight;

  const barCenter = barHeight / 2;
  const collapseRange = HEADER_CONTENT_HEIGHT - collapsedHeight;

  const hasIsland =
    isIOS &&
    (Device.isDevice
      ? ISLAND_MODEL_IDS.has(Device.modelId)
      : topInset >= ISLAND_MIN_TOP_INSET);

  let avatarMode: AvatarMode = "topEdge";
  if (isIOS) avatarMode = hasIsland ? "island" : "plain";

  return {
    top: topInset,
    barCenter,
    collapseRange,
    avatarMode,
  };
}
