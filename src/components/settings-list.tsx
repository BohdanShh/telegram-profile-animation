import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { type ScrollHandlerProcessed } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsRow, type SettingsRowData } from "@/components/settings-row";
import { colors } from "@/constants/colors";
import { HEADER_CONTENT_HEIGHT } from "@/constants/header-metrics";
import { useHeaderLayout } from "@/hooks/use-header-layout";

const GROUPS: SettingsRowData[][] = [
  [
    {
      title: "Change Emoji Status",
      symbol: {
        ios: "face.smiling",
        android: "emoji_emotions",
      },
    },
    {
      title: "Change Profile Color",
      symbol: { ios: "paintpalette", android: "palette" },
    },
    {
      title: "Set Profile Photo",
      symbol: { ios: "camera", android: "photo_camera" },
    },
  ],
  [
    {
      title: "My Profile",
      iconColor: "#f0524f",
      symbol: {
        ios: "person.crop.circle.fill",
        android: "account_circle",
      },
    },
  ],
  [
    {
      title: "Wallet",
      iconColor: "#1e88f5",
      symbol: {
        ios: "wallet.bifold.fill",
        android: "account_balance_wallet",
      },
    },
  ],
  [
    {
      title: "Saved Messages",
      iconColor: "#1e88f5",
      symbol: { ios: "bookmark.fill", android: "bookmark" },
    },
    {
      title: "Recent Calls",
      iconColor: "#34c759",
      symbol: { ios: "phone.fill", android: "call" },
    },
    {
      title: "Devices",
      iconColor: "#ff9f0a",
      value: "4",
      symbol: {
        ios: "laptopcomputer.and.iphone",
        android: "devices",
      },
    },
    {
      title: "Chat Folders",
      iconColor: "#32ade6",
      symbol: { ios: "folder.fill", android: "folder" },
    },
  ],
  [
    {
      title: "Notifications and Sounds",
      iconColor: "#f2554e",
      symbol: {
        ios: "bell.badge.fill",
        android: "notifications",
      },
    },
    {
      title: "Privacy and Security",
      iconColor: "#8e8e93",
      symbol: { ios: "lock.fill", android: "lock" },
    },
    {
      title: "Data and Storage",
      iconColor: "#34c759",
      symbol: {
        ios: "cylinder.split.1x2.fill",
        android: "storage",
      },
    },
    {
      title: "Appearance",
      iconColor: "#2fb1f0",
      symbol: {
        ios: "circle.lefthalf.filled",
        android: "contrast",
      },
    },
    {
      title: "Power Saving",
      iconColor: "#ff9f0a",
      value: "Off",
      symbol: {
        ios: "battery.25percent",
        android: "battery_saver",
      },
    },
    {
      title: "Language",
      iconColor: "#b055e0",
      value: "English",
      symbol: { ios: "globe", android: "language" },
    },
  ],
  [
    {
      title: "Telegram Premium",
      iconColor: "#7b7cf5",
      symbol: { ios: "star.fill", android: "star" },
    },
    {
      title: "My Stars",
      iconColor: "#ffa01a",
      value: "72",
      symbol: { ios: "star.circle.fill", android: "stars" },
    },
    {
      title: "Telegram Business",
      iconColor: "#e8629a",
      symbol: {
        ios: "storefront.fill",
        android: "storefront",
      },
    },
    {
      title: "Send a Gift",
      iconColor: "#2fb8c8",
      symbol: { ios: "gift.fill", android: "redeem" },
    },
  ],
  [
    {
      title: "Ask a Question",
      iconColor: "#ff9f0a",
      symbol: { ios: "ellipsis.bubble.fill", android: "chat" },
    },
    {
      title: "Telegram FAQ",
      iconColor: "#2fa8f0",
      symbol: { ios: "questionmark.circle.fill", android: "help" },
    },
    {
      title: "Telegram Features",
      iconColor: "#ffcc1a",
      symbol: { ios: "lightbulb.fill", android: "lightbulb" },
    },
  ],
];

const GROUP_GAP = 22;

type Props = {
  onScroll: ScrollHandlerProcessed;
};

export function SettingsList({ onScroll }: Props) {
  const { top, collapseRange } = useHeaderLayout();
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      snapToOffsets={[0, collapseRange]}
      snapToEnd={false}
      contentContainerStyle={{
        paddingTop: top + HEADER_CONTENT_HEIGHT + GROUP_GAP,
        paddingHorizontal: 16,
        paddingBottom: bottom + GROUP_GAP,
        gap: GROUP_GAP,
        // Always tall enough to scroll the header fully collapsed.
        minHeight: height + collapseRange,
      }}
    >
      {GROUPS.map((rows) => (
        <View key={rows[0].title} style={styles.card}>
          {rows.map((row, index) => (
            <SettingsRow
              key={row.title}
              {...row}
              showSeparator={index < rows.length - 1}
            />
          ))}
        </View>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
