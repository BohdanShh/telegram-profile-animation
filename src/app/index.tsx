import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ProfileHeader } from "@/components/profile-header";
import { SettingsList } from "@/components/settings-list";
import { colors } from "@/constants/colors";
import { useSettingsScroll } from "@/hooks/use-settings-scroll";

export default function Index() {
  const { scrollY, scrollHandler } = useSettingsScroll();

  return (
    <View style={styles.root}>
      {Platform.OS === "ios" ? (
        <>
          <Stack.Toolbar placement="left">
            <Stack.Toolbar.Button icon="qrcode" onPress={() => {}} />
          </Stack.Toolbar>
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Button onPress={() => {}}>Edit</Stack.Toolbar.Button>
          </Stack.Toolbar>
        </>
      ) : (
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Pressable
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="QR code"
                hitSlop={8}
                style={{ padding: 8 }}
              >
                <SymbolView
                  name={{ ios: "qrcode", android: "qr_code" }}
                  size={24}
                  tintColor={colors.onHeader}
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Edit"
                hitSlop={8}
                style={{ padding: 8 }}
              >
                <SymbolView
                  name={{ ios: "pencil", android: "edit" }}
                  size={24}
                  tintColor={colors.onHeader}
                />
              </Pressable>
            ),
          }}
        />
      )}

      <ProfileHeader scrollY={scrollY} />

      <SettingsList onScroll={scrollHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.groupedBackground,
  },
});
