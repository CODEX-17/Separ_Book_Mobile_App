import { BottomNavigationProvider } from "./context/BottomNavigationContext";
import { ChapterContextProvider } from "./context/ChapterContex";
import { SettingContextProvider } from "./context/SettingContext";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Text, TextInput } from "react-native";
import {
  listenForNotificationResponse,
  requestNotificationPermission,
  scheduleNotificationDaily,
  ScheduleNotificationDailyType,
  scheduleNotificationDate,
} from "./Utils/notification";
import { separ as chapterList } from "./data/chapters";
import { getSaturdayDay } from "./Utils/dateUtils";

SplashScreen.preventAutoHideAsync();

(Text as any).defaultProps ??= {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps ??= {};
(TextInput as any).defaultProps.allowFontScaling = false;

export default function RootLayout() {
  const today = new Date();
  const curretYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Months are zero-based
  const currentSaturday = getSaturdayDay(); // Get the date of the upcoming Saturday

  const morningSeparVerse =
    chapterList[Math.floor(Math.random() * chapterList.length)]; // Random verse for morning

  const eveningSeparVerse =
    chapterList[Math.floor(Math.random() * chapterList.length)]; // Random verse for evening

  const notificationList = [
    {
      type: "date",
      name: "shabbath-reminder",
      content: {
        title: "Shabbath Reminder",
        body: `Shabbath Shalom! Prepare for the day of rest. Make sure to set aside time for reflection and prayer.`,
      },
      date: new Date(curretYear, currentMonth, currentSaturday, 6, 0), // 6:00 AM
    },
    {
      type: "time",
      name: "daily-tifillah-reminders-morning",
      content: {
        title: "Morning Tifillah Reminder",
        body: `Shalom! It's time for your morning Tifillah.`,
      },
      value: { hour: 6, minute: 0 }, // 6:00 AM
    },
    {
      type: "time",
      name: "daily-tifillah-reminders-evening",
      content: {
        title: "Evening Tifillah Reminder",
        body: `Shalom! It's time for your evening Tifillah.`,
      },
      value: { hour: 18, minute: 0 }, // 6:00 PM
    },
    {
      type: "time",
      name: "daily-verse-morning",
      content: {
        title: "Morning Separ Verse",
        body: `Chapter: ${morningSeparVerse.chapter} - Verse: ${morningSeparVerse.verse}\n${morningSeparVerse.content}`,
      },
      value: { hour: 7, minute: 0 },
    },
    {
      type: "time",
      name: "daily-verse-evening",
      content: {
        title: "Evening Separ Verse",
        body: `Chapter: ${eveningSeparVerse.chapter} - Verse: ${eveningSeparVerse.verse}\n${eveningSeparVerse.content}`,
      },
      value: { hour: 19, minute: 0 },
    },
  ];

  // Initialize notifications on app load
  useEffect(() => {
    async function initNotifications() {
      await requestNotificationPermission();
      // Clear old notifications to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (let i = 0; i < notificationList.length; i++) {
        const element = notificationList[i];

        if (element.type === "date" && element.date) {
          // Handle date-based notifications
          await scheduleNotificationDate({
            name: element.name,
            content: element.content,
            date: element.date,
          });
        } else if (element.type === "time" && element.value) {
          await scheduleNotificationDaily({
            name: element.name,
            content: element.content,
            value: element.value,
          });
        }
      }
    }

    initNotifications();
  }, []);

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
