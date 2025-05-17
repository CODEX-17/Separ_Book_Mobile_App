import { BottomNavigationProvider } from "./context/BottomNavigationContext";
import { ChapterContextProvider } from "./context/ChapterContex";
import { SettingContextProvider } from "./context/SettingContext";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { getStoreData, storeData } from "./Utils/storage";
import {
  listenForNotificationResponse,
  scheduleNotificationDaily,
  ScheduleNotificationDailyType,
} from "./Utils/notification";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const today = new Date();
  const morningTime = new Date(today.setHours(7, 0, 0, 0)).toLocaleTimeString(); // Set time to 7:00 AM
  const eveningTime = new Date(
    today.setHours(19, 0, 0, 0)
  ).toLocaleTimeString(); // Set time to 7:00 PM

  const morningTimeStringSched = "7:00:00 AM";
  const eveningTimeStringSched = "7:00:00 PM";

  let [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  //Schedule notification for daily verse
  const handleScheduleNotificationDaily = async ({
    name,
    content,
    value,
  }: ScheduleNotificationDailyType) => {
    try {
      scheduleNotificationDaily({
        name,
        content,
        value,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

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
