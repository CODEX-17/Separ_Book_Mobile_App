import { Stack } from "expo-router";
import { View } from "react-native";

export default function RenderLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{ headerShown: false, keyboardHandlingEnabled: true }}
      >
        <Stack.Screen name="chapter" />
        <Stack.Screen name="random" />
        <Stack.Screen name="search" />
        <Stack.Screen name="feast" />
        <Stack.Screen name="developer" />
        <Stack.Screen name="(calendar)" />
      </Stack>
    </View>
  );
}
