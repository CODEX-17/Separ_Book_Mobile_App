import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  Platform,
} from "react-native";
import { isRunningInExpoGo } from "expo";
import { separ as chapterList } from "./data/chapters";
import { feast as feastList } from "./data/feastDateList";
import CustomizeButton from "./components/CustomizeButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SettingContext } from "./context/SettingContext";
import COLORS from "./constants/colors";
import { getStoreData } from "./Utils/storage";
import { Profile } from "./types/interfaces";
import { ChapterContext } from "./context/ChapterContex";
import { getSaturdayDay } from "./Utils/dateUtils";
import { getDailyVerses } from "./Utils/dailyVerse";

export type listenerPropType = {
  id: string;
  route: string;
  contentIndex?: number;
};

type NotificationType =
  | {
      scheduleType: "date";
      name: string;
      content: {
        title: string;
        body: string;
        data: {
          id: string;
          route: string;
          contentIndex?: number;
        };
      };
      date: Date;
    }
  | {
      scheduleType: "time";
      name: string;
      content: {
        title: string;
        body: string;
        data: {
          id: string;
          route: string;
          contentIndex?: number;
        };
      };
      value: { hour: number; minute: number };
    };

const feastNotifications: NotificationType[] = feastList.flatMap(
  (element): NotificationType[] => {
    if (!element.date) return [];

    const id = `feast-reminder-${element.name
      .toLowerCase()
      .replace(/ /g, "-")}`;

    return [
      {
        scheduleType: "date",
        name: id,
        content: {
          title: element.name,
          body: `${element.name} is today. Remember to observe the feast! Make this day special.`,
          data: {
            id,
            route: "/(home)",
          },
        },
        date: element.date,
      },
    ];
  },
);

const WelcomeScreen = () => {
  const router = useRouter();
  const today = new Date();
  const curretYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Months are zero-based
  const currentSaturday = getSaturdayDay(); // Get the date of the upcoming Saturday
  const [profile, setProfile] = useState<Profile | null>(null);
  const dailyVerses = getDailyVerses(chapterList, today);

  //Check for data
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const result = await getStoreData("PROFILE");

        if (result) {
          setProfile(result);
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    getProfileData();
  }, []);

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);

  const { currentChapter, setCurrentChapter } = chapterContext || {
    currentChapter: 0,
    setCurrentChapter: () => {},
  };

  const dailyVerseNotifications: NotificationType[] = [];
  if (dailyVerses.morning) {
    dailyVerseNotifications.push({
      scheduleType: "time",
      name: "daily-verse-morning",
      content: {
        title: "Morning Separ Verse",
        body: `Chapter: ${dailyVerses.morning.verse.chapter} - Verse: ${dailyVerses.morning.verse.verse}\n${dailyVerses.morning.verse.content}`,
        data: {
          id: "daily-verse-morning",
          route: "/view-chapter",
          contentIndex: dailyVerses.morning.index,
        },
      },
      value: { hour: 7, minute: 0 },
    });
  }
  if (dailyVerses.evening) {
    dailyVerseNotifications.push({
      scheduleType: "time",
      name: "daily-verse-evening",
      content: {
        title: "Evening Separ Verse",
        body: `Chapter: ${dailyVerses.evening.verse.chapter} - Verse: ${dailyVerses.evening.verse.verse}\n${dailyVerses.evening.verse.content}`,
        data: {
          id: "daily-verse-evening",
          route: "/view-chapter",
          contentIndex: dailyVerses.evening.index,
        },
      },
      value: { hour: 19, minute: 0 },
    });
  }

  // Initial notificationList
  const [notificationList] = useState<NotificationType[]>([
    {
      scheduleType: "date",
      name: "shabbath-reminder",
      content: {
        title: "Shabbath Reminder",
        body: `Shabbath Shalom! Prepare for the day of rest. Make sure to set aside time for reflection and prayer.`,
        data: {
          id: "shabbath-reminder",
          route: "/(home)",
        },
      },
      date: new Date(curretYear, currentMonth, currentSaturday, 6, 0), // 6:00 AM
    },
    {
      scheduleType: "time",
      name: "daily-tifillah-reminders-morning",
      content: {
        title: "Morning Tifillah Reminder",
        body: `Shalom! It's time for your morning Tifillah.`,
        data: {
          id: "daily-tifillah-reminders-morning",
          route: "/(home)",
        },
      },
      value: { hour: 6, minute: 0 }, // 6:00 AM
    },
    {
      scheduleType: "time",
      name: "daily-tifillah-reminders-evening",
      content: {
        title: "Evening Tifillah Reminder",
        body: `Shalom! It's time for your evening Tifillah.`,
        data: {
          id: "daily-tifillah-reminders-evening",
          route: "/(home)",
        },
      },
      value: { hour: 18, minute: 0 }, // 6:00 PM
    },
    ...dailyVerseNotifications,
    ...feastNotifications,
  ]);

  if (!settingContext) {
    return null;
  }

  // Initialize notifications on app load
  useEffect(() => {
    let isActive = true;
    let responseSubscription: { remove: () => void } | undefined;

    async function initNotifications() {
      if (Platform.OS === "android" && isRunningInExpoGo()) {
        console.info(
          "Notifications are disabled in Expo Go on Android. Use a development build to enable them.",
        );
        return;
      }

      const Notifications = await import("expo-notifications");
      const {
        requestNotificationPermission,
        scheduleNotificationDaily,
        scheduleNotificationDate,
      } = await import("./Utils/notification");
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission || !isActive) return;

      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const element of notificationList) {
        if (element.scheduleType === "date" && element.date) {
          await scheduleNotificationDate({
            name: element.name,
            content: element.content,
            date: element.date,
          });
        } else if (element.scheduleType === "time" && element.value) {
          await scheduleNotificationDaily({
            name: element.name,
            content: element.content,
            value: element.value,
          });
        }
      }

      if (!isActive) return;

      responseSubscription =
        Notifications.addNotificationResponseReceivedListener(
          async (response) => {
            if (!response) return;

            const data = response.notification.request.content
              .data as listenerPropType;

            if (!data?.id) return;

            console.log("Notification data:", data);

            if (data.route) {
              if (data.contentIndex !== undefined) {
                setCurrentChapter(data?.contentIndex);
                router.push("/view-chapter");
              } else {
                router.push("/(home)");
              }
            }
          },
        );
    }

    void initNotifications().catch((error: unknown) => {
      console.error("Failed to initialize notifications:", error);
    });

    return () => {
      isActive = false;
      responseSubscription?.remove();
    };
  }, [notificationList, router, setCurrentChapter]);

  const { objSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const fadeAnim = useSharedValue(0);

  // Animated style for background fade effect
  const backgroundAnimation = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    backgroundColor: themeColors.background,
  }));

  useEffect(() => {
    fadeAnim.value = 0;
    fadeAnim.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, [objSetting.theme]);

  const handleStart = () => {
    if (profile) {
      router.push("/(home)");
    } else {
      router.push("/ask-name");
    }
  };

  return (
    <Animated.View style={[styles.container, backgroundAnimation]}>
      <ImageBackground
        source={require("../assets/images/bg-blue.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Image
            style={styles.image}
            source={require("../assets/images/white-logo-icon.png")}
          />
          <View style={{ alignItems: "center", gap: 10 }}>
            <CustomizeButton
              title={"Explore"}
              icons={<Icon name="navigate-next" color="#003092" size={25} />}
              onPress={handleStart}
              width={250}
              styleButton={[{ borderRadius: 50, backgroundColor: "#fff" }]}
              styleText={{ color: "#003092", allowFontScaling: false }}
            />
            <Text
              style={[styles.text, { fontSize: 15 }]}
              allowFontScaling={false}
            >
              Version 1.0.1
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.text, { fontSize: 9 }]} allowFontScaling={false}>
            Develop by Rumar Pamparo
          </Text>
          <Text style={[styles.text]} allowFontScaling={false}>
            @All Right Reserved 2025
          </Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
    gap: 50,
  },
  text: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  footer: {
    alignItems: "center",
    height: 90,
    width: "100%",
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default WelcomeScreen;
