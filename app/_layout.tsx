import { BottomNavigationProvider } from "./context/BottomNavigationContext";
import { ChapterContextProvider } from "./context/ChapterContex";
import { SettingContextProvider } from "./context/SettingContext";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logAsyncStorage } from "./Utils/storage";

SplashScreen.preventAutoHideAsync();

(Text as any).defaultProps ??= {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps ??= {};
(TextInput as any).defaultProps.allowFontScaling = false;

export default function RootLayout() {
  //Load of Fonts
  let [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // LOG THE LOCAL STORAGE
  useEffect(() => {
    logAsyncStorage();
  }, []);

  // //Clear Data
  // useEffect(() => {
  //   const clearData = async () => {
  //     await AsyncStorage.clear();
  //   };

  //   clearData();
  // }, []);

  if (!loaded && !error) return null;

  return (
    <BottomNavigationProvider>
      <SettingContextProvider>
        <ChapterContextProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              keyboardHandlingEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="update-notification" />
            <Stack.Screen name="preface" />
            <Stack.Screen name="onboard" />
            <Stack.Screen name="ask-name" />
            <Stack.Screen name="(home)" />
            <Stack.Screen name="view-chapter" />
            <Stack.Screen name="setting" />
            <Stack.Screen
              name="(home)/modal.tsx"
              options={{
                headerShown: true,
                presentation: "modal",
              }}
            />
          </Stack>
        </ChapterContextProvider>
      </SettingContextProvider>
    </BottomNavigationProvider>
  );
}
