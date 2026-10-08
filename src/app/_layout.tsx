import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerBlurEffect: "none",
        scrollEdgeEffects: {
          top: "hidden",
          bottom: "automatic",
          left: "automatic",
          right: "automatic",
        },
        statusBarStyle: Platform.select({ android: "light", default: "auto" }),
        title: "",
      }}
    />
  );
}
