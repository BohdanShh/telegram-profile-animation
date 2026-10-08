import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const chevron: SymbolViewProps["name"] = {
  ios: "chevron.right",
  android: "chevron_right",
};

export type SettingsRowData = {
  title: string;
  symbol: SymbolViewProps["name"];
  iconColor?: string;
  value?: string;
};

type Props = SettingsRowData & {
  showSeparator: boolean;
};

export function SettingsRow({
  title,
  symbol,
  iconColor,
  value,
  showSeparator,
}: Props) {
  const isAction = iconColor === undefined;

  return (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, !isAction && { backgroundColor: iconColor }]}>
        <SymbolView
          name={symbol}
          size={isAction ? 26 : 17}
          tintColor={isAction ? colors.accent : colors.onHeader}
          resizeMode="scaleAspectFit"
          style={isAction ? styles.actionSymbol : styles.symbol}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[styles.title, isAction && styles.actionTitle]}
      >
        {title}
      </Text>

      {value !== undefined && <Text style={styles.value}>{value}</Text>}

      {!isAction && (
        <SymbolView
          name={chevron}
          size={14}
          weight="semibold"
          tintColor={colors.tertiaryLabel}
          style={styles.chevron}
        />
      )}

      {showSeparator && <View style={styles.separator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 51,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  pressed: {
    backgroundColor: colors.cardPressed,
  },
  icon: {
    width: 29,
    height: 29,
    marginRight: 15,
    borderRadius: 7,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    width: 17,
    height: 17,
  },
  actionSymbol: {
    width: 28,
    height: 28,
  },
  title: {
    flex: 1,
    color: colors.label,
    fontSize: 17,
  },
  actionTitle: {
    color: colors.accent,
  },
  value: {
    color: colors.secondaryLabel,
    fontSize: 17,
    marginLeft: 8,
  },
  chevron: {
    width: 10,
    height: 14,
    marginLeft: 12,
  },
  separator: {
    position: "absolute",
    bottom: 0,
    left: 60,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
});
