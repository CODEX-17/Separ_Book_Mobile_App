import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ImageBackground } from "react-native";
import {
  requestNotificationPermission,
  scheduleNotificationDaily,
  scheduleNotificationDate,
} from "./Utils/notification";
import { separ as chapterList } from "./data/chapters";
import { feast as feastList } from "./data/feastDateList";
import CustomizeButton from "./components/CustomizeButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
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

const WelcomeScreen = () => {
  const router = useRouter();
  const today = new Date();
  const curretYear = today.getFullYear();
  const currentMonth = today.getMonth(); // Months are zero-based
  const currentSaturday = getSaturdayDay(); // Get the date of the upcoming Saturday
  const [profile, setProfile] = useState<Profile | null>(null);

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

  if (!settingContext) {
    return null;
  }

  const morningSeparVerseIndex = Math.floor(Math.random() * chapterList.length);
  const eveningSeparVerseIndex = Math.floor(Math.random() * chapterList.length);

  const morningSeparVerse = chapterList[morningSeparVerseIndex]; // Random verse for morning

  const eveningSeparVerse = chapterList[eveningSeparVerseIndex]; // Random verse for evening

  // Initial notificationList
  const [notificationList, setNotificationList] = useState<NotificationType[]>([
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
    {
      scheduleType: "time",
      name: "daily-verse-morning",
      content: {
        title: "Morning Separ Verse",
        body: `Chapter: ${morningSeparVerse.chapter} - Verse: ${morningSeparVerse.verse}\n${morningSeparVerse.content}`,
        data: {
          id: "daily-verse-morning",
          route: "/view-chapter",
          contentIndex: morningSeparVerseIndex,
        },
      },
      value: { hour: 7, minute: 0 },
    },
    {
      scheduleType: "time",
      name: "daily-verse-evening",
      content: {
        title: "Evening Separ Verse",
        body: `Chapter: ${eveningSeparVerse.chapter} - Verse: ${eveningSeparVerse.verse}\n${eveningSeparVerse.content}`,
        data: {
          id: "daily-verse-evening",
          route: "/view-chapter",
          contentIndex: eveningSeparVerseIndex,
        },
      },
      value: { hour: 19, minute: 0 },
    },
  ]);

  // Initializing and pushing the feastList into NotificationList
  useEffect(() => {
    if (!feastList) return;

    //console.log("newMoon:", newMoon());

    const feastNotifications: NotificationType[] = feastList
      .map((element) => {
        return {
          scheduleType: "date",
          name: `feast-reminder-${element.name
            .toLowerCase()
            .replace(/ /g, "-")}`,
          content: {
            title: element.name,
            body: `${element.name} is today. Remember to observe the feast! Make this day special.`,
            data: {
              id: `feast-reminder-${element.name
                .toLowerCase()
                .replace(/ /g, "-")}`,
              route: "/(home)",
            },
          },
          date: element.date,
        };
      })
      .filter(
        (
          item
        ): item is {
          scheduleType: "date";
          name: string;
          content: {
            title: string;
            body: string;
            data: { id: string; route: string };
          };
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

      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          if (!response) return;

          const data = response.notification.request.content
            .data as listenerPropType;

          if (!data?.id) return;

          console.log("Notification data:", data);

          if (data.route) {
            if (data?.contentIndex) {
              setCurrentChapter(data?.contentIndex);
              router.push("/view-chapter");
            } else {
              router.push("/(home)");
            }
          }
        }
      );
    }

    if (notificationList.length) initNotifications();
  }, [notificationList]);

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
              Version 1.0.0
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
