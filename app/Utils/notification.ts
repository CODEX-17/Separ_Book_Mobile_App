import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getStoreData, storeData } from "./storage";
import { useRouter } from "expo-router";

type Content = {
  title: string;
  body: string;
};

type TriggerDaily = {
  hour: number;
  minute: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

//request permission to send notifications
export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
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

  Notifications.addNotificationResponseReceivedListener(async (response) => {
    if (!response) return;

    const data = response.notification.request.content.data as listenerPropType;

    if (!data?.id) return;

    console.log("Notification data:", data);

    if (data.route) {
      // Navigate to the route and pass chapterContent if it exists
      router.push({
        pathname: "/view-chapter",
        params: { chapterContent: JSON.stringify(data.chapterContent ?? {}) },
      });
    }
  });
};
