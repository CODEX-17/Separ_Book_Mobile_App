import * as Notifications from "expo-notifications";
import { feast } from "../data/feastDateList";
import { scheduleNotificationDate } from "./notification";
import { getStoreData } from "./storage";
import { newMoon } from "./newMoonCalculation";

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

  const profile = await getStoreData("PROFILE");
  const userName = profile?.name?.trim() || "Beloved";

  // 7:00 AM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good Morning ☀️",
      body: `Shalom ${userName}, time to read your daily verses.`,
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
      body: `Shalom ${userName}, don't forget to continue your reading.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19, // 7 PM (24-hour format)
      minute: 0,
    },
  });
}

export async function scheduleFeastNotifications() {
  const profile = await getStoreData("PROFILE");
  const userName = profile?.name?.trim() || "Beloved";

  for (const item of feast) {
    if ("date" in item && item.date instanceof Date) {
      await scheduleNotificationDate({
        name: `feast-${item.name}`,
        content: {
          title: "Feast Reminder",
          body: `Shalom ${userName}, today is ${item.name}.`,
        },
        date: item.date,
      });
    }

    if ("dateFrom" in item && item.dateFrom instanceof Date) {
      await scheduleNotificationDate({
        name: `feast-start-${item.name}`,
        content: {
          title: "Feast Reminder",
          body: `Shalom ${userName}, ${item.name} starts today.`,
        },
        date: item.dateFrom,
      });
    }

    if ("dateTo" in item && item.dateTo instanceof Date) {
      await scheduleNotificationDate({
        name: `feast-end-${item.name}`,
        content: {
          title: "Feast Reminder",
          body: `Shalom ${userName}, ${item.name} ends today.`,
        },
        date: item.dateTo,
      });
    }
  }
}

export async function scheduleNewMoonNotifications() {
  const profile = await getStoreData("PROFILE");
  const userName = profile?.name?.trim() || "Beloved";
  const schedule = newMoon();

  for (const item of schedule) {
    if (!item?.iso) continue;

    const triggerDate = new Date(item.iso);
    if (isNaN(triggerDate.getTime())) continue;
    if (triggerDate.getTime() <= Date.now()) continue;

    await scheduleNotificationDate({
      name: `newmoon-${item.date}-${item.time}`,
      content: {
        title: "New Moon Reminder",
        body: `Shalom ${userName}, New Moon is on ${item.date} at ${item.time}.`,
      },
      date: triggerDate,
    });
  }
}
