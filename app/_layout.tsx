import { BottomNavigationProvider } from "./context/BottomNavigationContext";
import { ChapterContextProvider } from "./context/ChapterContex";
import { SettingContextProvider } from "./context/SettingContext";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Text, TextInput } from "react-native";
import {
  requestNotificationPermission,
  scheduleNotificationDaily,
  scheduleNotificationDate,
} from "./Utils/notification";
import { separ as chapterList } from "./data/chapters";
import { getSaturdayDay } from "./Utils/dateUtils";
import { feast as feastList } from "./data/feastDateList";

SplashScreen.preventAutoHideAsync();

type Notification =
  | {
      type: "date";
      name: string;
      content: { title: string; body: string };
      date: Date;
    }
  | {
      type: "time";
      name: string;
      content: { title: string; body: string };
      value: { hour: number; minute: number };
    };

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

  // Initial notificationList
  const [notificationList, setNotificationList] = useState<Notification[]>([
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
  ]);

  // Initializing and pushing the feastList into NotificationList
  useEffect(() => {
    if (!feastList) return;

    const feastNotifications: Notification[] = feastList
      .map((element) => {
        return {
          type: "date",
          name: `feast-reminder-${element.name
            .toLowerCase()
            .replace(/ /g, "-")}`,
          content: {
            title: element.name,
            body: `${element.name} is today. Remember to observe the feast! Make this day special.`,
          },
          date: element.date,
        };
      })
      .filter(
        (
          item
        ): item is {
          type: "date";
          name: string;
          content: { title: string; body: string };
          date: Date;
        } => item.date !== undefined
      );

    // Append to existing notifications
    setNotificationList((prev) => [...prev, ...feastNotifications]);
  }, [feastList]);

  // Initialize notifications on app load
  useEffect(() => {
    async function initNotifications() {
      await requestNotificationPermission();
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const element of notificationList) {
        if (element.type === "date" && element.date) {
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

    if (notificationList.length) initNotifications();
  }, [notificationList]);

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
