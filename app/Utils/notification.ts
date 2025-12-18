import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getStoreData, storeData } from "./storage";

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

// Function to listen for notification responses and remove scheduled time from AsyncStorage
export const listenForNotificationResponse = async () => {
  try {
    interface NotificationSchedule {
      name: ("daily-verse-dayTime" | "daily-verse-nightTime")[];
    }

    const schedule = await getStoreData("NOTIFICATION");

    Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log("Notification received:", response);

      // Check which notification was triggered using the identifier
      if (response.notification.request.identifier === "daily-verse-dayTime") {
        console.log("7:00 AM notification triggered");

        const result = schedule?.name.filter(
          (item) => item !== "daily-verse-dayTime"
        );

        console.log("Filtered schedule:", result);

        // Update AsyncStorage with the filtered schedule
        await storeData("NOTIFICATION", { name: result || [] });
      }

      if (
        response.notification.request.identifier === "daily-verse-nightTime"
      ) {
        const result = schedule?.name.filter(
          (item) => item !== "daily-verse-nightTime"
        );

        console.log("Filtered schedule:", result);

        // Update AsyncStorage with the filtered schedule
        await storeData("NOTIFICATION", { name: result || [] });
      }
    });
  } catch (error) {
    console.error("Error listening for notification response:", error);
    return;
  }
};
