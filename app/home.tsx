import React, { use, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getStoreData } from "./Utils/storage";
import { SettingContext } from "./context/SettingContext";
import COLORS from "./constants/colors";
import isTefillahTime from "./Utils/tifillahTime";
import { Profile } from "./types/interfaces";
import { ranks } from "./data/ranking";
import { findingRankStatus, rankMapping } from "./Utils/rankUtils";
import { feast } from "./data/feastDateList";
import { newMoon } from "./Utils/newMoonCalculation";

const Home = () => {
  const [userName, setUserName] = useState<string>("");
  const today = new Date();
  const day = today.getDay();
  const [profile, setProfile] = useState<Profile>();

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const todayOnly = normalizeDate(today);

  const currentFeast = feast.find((item: any) => {
    if ("date" in item && item.date instanceof Date) {
      return normalizeDate(item.date).getTime() === todayOnly.getTime();
    }

    if (
      "dateFrom" in item &&
      item.dateFrom instanceof Date &&
      "dateTo" in item &&
      item.dateTo instanceof Date
    ) {
      const start = normalizeDate(item.dateFrom).getTime();
      const end = normalizeDate(item.dateTo).getTime();
      const current = todayOnly.getTime();
      return current >= start && current <= end;
    }

    return false;
  });

  const upcomingFeasts = feast
    .map((item: any) => {
      if ("date" in item && item.date instanceof Date) {
        return { ...item, nextDate: normalizeDate(item.date) };
      }

      if ("dateFrom" in item && item.dateFrom instanceof Date) {
        return { ...item, nextDate: normalizeDate(item.dateFrom) };
      }

      return null;
    })
    .filter(
      (item: any) => item && item.nextDate.getTime() > todayOnly.getTime(),
    )
    .sort((a: any, b: any) => a.nextDate.getTime() - b.nextDate.getTime());

  const nextFeast = upcomingFeasts[0];

  const parseNewMoonISO = (item: any) =>
    item?.iso ? new Date(item.iso) : null;

  const newMoonList = newMoon()
    .map((item: any) => {
      const isoDate = parseNewMoonISO(item);
      return isoDate && !isNaN(isoDate.getTime()) ? { ...item, isoDate } : null;
    })
    .filter(Boolean) as any[];

  const currentNewMoon = newMoonList.find((item: any) => {
    const d = normalizeDate(item.isoDate);
    return d.getTime() === todayOnly.getTime();
  });

  const nextNewMoon = newMoonList
    .filter((item: any) => item.isoDate.getTime() > Date.now())
    .sort((a: any, b: any) => a.isoDate.getTime() - b.isoDate.getTime())[0];

  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return false;
  }

  const { objSetting, handleChangeSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const shortenName = (username: string) => {
    if (!username) return "No name!";

    if (username.length > 10) {
      return username.substring(0, 9) + "...";
    }

    return username;
  };

  // Load profile on mount
  useEffect(() => {
    (async () => {
      const profileData = await getStoreData("PROFILE");
      if (profileData) setProfile(profileData);
    })();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const profileData = await getStoreData("PROFILE");

      if (profileData) {
        setUserName(profileData.name);
      } else {
        return null;
      }
    };

    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.primaryText,
              fontSize: 16,
            }}
          >
            {day === 6 ? "Shabbat Shalom!" : "Shalom!"}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.primaryText,
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {shortenName(userName)}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.secondaryText,
              fontSize: 13,
            }}
          >
            {today.toDateString()}
          </Text>
        </View>
        {ranks && profile ? (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.yellow,
                paddingVertical: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  color: COLORS.black,
                  fontSize: 10,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Lvl.{`${profile?.level} ${findingRankStatus(profile?.level)}`}
              </Text>
            </View>
            <Image
              style={styles.image}
              source={rankMapping(findingRankStatus(profile?.level))}
            />
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              allowFontScaling={false}
              style={{ fontFamily: "Poppins-Bold" }}
            >
              No Rank
            </Text>
          </View>
        )}
      </View>
      {/* Feast Status Card */}
      {(currentFeast || nextFeast) && (
        <View
          style={[
            styles.reminderCard,
            { marginTop: 20, backgroundColor: themeColors.card },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.primaryText,
              fontFamily: "Poppins-Bold",
            }}
          >
            Feast Schedule
          </Text>

          {currentFeast ? (
            <Text
              allowFontScaling={false}
              style={{ color: themeColors.secondaryText, marginTop: 4 }}
            >
              Currently Scheduled: {currentFeast.name}
              {"dateFrom" in (currentFeast as any) &&
              "dateTo" in (currentFeast as any)
                ? ` (${formatDate((currentFeast as any).dateFrom)} - ${formatDate(
                    (currentFeast as any).dateTo,
                  )})`
                : ` (${formatDate((currentFeast as any).date)})`}
            </Text>
          ) : (
            <Text
              allowFontScaling={false}
              style={{ color: themeColors.secondaryText, marginTop: 4 }}
            >
              Incoming Feast: {nextFeast.name} ({formatDate(nextFeast.nextDate)}
              )
            </Text>
          )}
        </View>
      )}

      {/* New Moon Status Card */}
      {(currentNewMoon || nextNewMoon) && (
        <View
          style={[
            styles.reminderCard,
            { marginTop: 20, backgroundColor: themeColors.card },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.primaryText,
              fontFamily: "Poppins-Bold",
            }}
          >
            New Moon Schedule
          </Text>

          {currentNewMoon ? (
            <Text
              allowFontScaling={false}
              style={{ color: themeColors.secondaryText, marginTop: 4 }}
            >
              Currently Scheduled: New Moon ({currentNewMoon.date}{" "}
              {currentNewMoon.time})
            </Text>
          ) : (
            <Text
              allowFontScaling={false}
              style={{ color: themeColors.secondaryText, marginTop: 4 }}
            >
              Incoming New Moon: {nextNewMoon.date} {nextNewMoon.time}
            </Text>
          )}
        </View>
      )}

      {/* Tifillah Time Reminder Card */}
      {isTefillahTime() && (
        <View
          style={[
            styles.reminderCard,
            { marginTop: 40, backgroundColor: themeColors.card },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={{
              color: themeColors.primaryText,
              fontFamily: "Poppins-Bold",
            }}
          >
            Reminders
          </Text>
          <Text
            allowFontScaling={false}
            style={{ color: themeColors.secondaryText }}
          >
            Shalom! {userName}, Tefillah Time na po!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    color: "#343434",
  },
  reminderCard: {
    width: "100%",
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  image: {
    height: 70,
    width: 70,
  },
});

export default Home;
