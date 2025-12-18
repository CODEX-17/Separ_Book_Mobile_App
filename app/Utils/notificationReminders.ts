import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleDailyNotifications() {
  // Clear old notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 7:00 AM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning ☀️",
      body: "Time to read your daily verses.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0,
    },
  });

  // 7:00 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Evening 🌙",
      body: `Don't forget to continue your reading.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19, // 7 PM (24-hour format)
      minute: 0,
    },
  });
}
