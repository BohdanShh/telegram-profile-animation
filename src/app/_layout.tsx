import { Stack } from "expo-router";

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
        title: "",
      }}
    />
  );
}
