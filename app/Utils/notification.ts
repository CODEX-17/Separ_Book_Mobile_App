import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import { useRouter } from "expo-router";

type Content = {
  title: string;
  body: string;
};

type TriggerDaily = {
  hour: number;
  minute: number;
};

let notificationHandlerConfigured = false;

export async function loadNotifications() {
  if (Platform.OS === "android" && isRunningInExpoGo()) {
    return null;
  }

  const Notifications = await import("expo-notifications");
  if (!notificationHandlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationHandlerConfigured = true;
  }
  return Notifications;
}

//request permission to send notifications
export async function requestNotificationPermission() {
  const Notifications = await loadNotifications();
  if (!Notifications) return false;

  let { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    ({ status } = await Notifications.requestPermissionsAsync());
  }

  if (status === "granted" && Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return status === "granted";
}

export interface ScheduleNotificationDailyType {
  name: string;
  content: Content;
  value: TriggerDaily;
}

export interface ScheduleNotificationDateType {
  name: string;
  content: Content;
  date: Date;
}

export const scheduleNotificationDaily = async ({
  name,
  content,
  value,
}: ScheduleNotificationDailyType) => {
  const Notifications = await loadNotifications();
  if (!Notifications) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(name, {
      name,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: value.hour,
      minute: value.minute,
    },
  });
};

export const scheduleNotificationDate = async ({
  name,
  content,
  date,
}: ScheduleNotificationDateType) => {
  if (!Number.isFinite(date.getTime())) {
    throw new RangeError(`Notification "${name}" requires a valid date.`);
  }

  if (date.getTime() <= Date.now()) {
    console.info(
      `Skipping notification "${name}" because its scheduled date has passed.`
    );
    return;
  }

  const Notifications = await loadNotifications();
  if (!Notifications) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(name, {
      name,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
};

export type listenerPropType = {
  id: string;
  route: string;
  chapterContent?: { chapter: string; verse: string; content: string };
};

// Set up a single listener for notification responses
export const setupNotificationListener = () => {
  const router = useRouter();

  void loadNotifications()
    .then((Notifications) => {
      if (!Notifications) return;

      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as listenerPropType;

        if (!data?.id) return;
        if (data.route) {
          router.push({
            pathname: "/view-chapter",
            params: {
              chapterContent: JSON.stringify(data.chapterContent ?? {}),
            },
          });
        }
      });
    })
    .catch((error: unknown) => {
      console.error("Failed to set up notification listener:", error);
    });
};
