import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { getStoreData } from "./Utils/storage";
import { SettingContext } from "./context/SettingContext";
import { ChapterContext } from "./context/ChapterContex";
import COLORS from "./constants/colors";
import isTefillahTime from "./Utils/tifillahTime";
import { Profile, Verse } from "./types/interfaces";
import { ranks } from "./data/ranking";
import { findingRankStatus, rankMapping } from "./Utils/rankUtils";
import { feast } from "./data/feastDateList";
import { newMoon } from "./Utils/newMoonCalculation";
import { separ as chapterList } from "./data/chapters";
import { getDailyVerses } from "./Utils/dailyVerse";

const Home = () => {
  const [now, setNow] = useState(() => new Date());
  const today = now;
  const day = today.getDay();
  const [profile, setProfile] = useState<Profile>();
  const dailyVerses = getDailyVerses(chapterList, today);
  const isMorningVerseAvailable = now.getHours() >= 7;
  const isEveningVerseAvailable = now.getHours() >= 19;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

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
  const chapterContext = useContext(ChapterContext);
  const router = useRouter();

  if (!settingContext || !chapterContext) {
    return false;
  }

  const { setCurrentChapter } = chapterContext;
  const { objSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const shortenName = (username: string) => {
    if (!username) return "No name!";

    if (username.length > 10) {
      return username.substring(0, 9) + "...";
    }

    return username;
  };

  useEffect(() => {
    (async () => {
      const profileData = await getStoreData("PROFILE");
      if (profileData) setProfile(profileData);
    })();
  }, []);

  const userName = profile?.name ?? "";
  const genderedName =
    profile?.gender === "male"
      ? profile.maleTitle ?? "Achi"
      : profile?.gender === "female"
        ? "Achot"
        : "";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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
            {[genderedName, shortenName(userName)].filter(Boolean).join(" ")}
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
      {(currentFeast || nextFeast || currentNewMoon || nextNewMoon || isTefillahTime()) && (
        <View style={styles.sectionHeading}>
          <Icon name="calendar" size={19} color={themeColors.primary} />
          <View>
            <Text
              allowFontScaling={false}
              style={[styles.sectionTitle, { color: themeColors.primaryText }]}
            >
              Schedules
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.sectionSubtitle, { color: themeColors.secondaryText }]}
            >
              Mga paparating na iskedyul
            </Text>
          </View>
        </View>
      )}

      {(currentFeast || nextFeast) && (
        <View
          style={[
            styles.reminderCard,
            { backgroundColor: themeColors.card },
          ]}
        >
          <View style={styles.scheduleHeading}>
            <Icon name="sun" size={18} color={themeColors.primary} />
            <Text
              allowFontScaling={false}
              style={[styles.scheduleTitle, { color: themeColors.primaryText }]}
            >
              Feast Schedule
            </Text>
          </View>

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
            { backgroundColor: themeColors.card },
          ]}
        >
          <View style={styles.scheduleHeading}>
            <Icon name="moon" size={18} color={themeColors.primary} />
            <Text
              allowFontScaling={false}
              style={[styles.scheduleTitle, { color: themeColors.primaryText }]}
            >
              New Moon Schedule
            </Text>
          </View>

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
            { backgroundColor: themeColors.card },
          ]}
        >
          <View style={styles.scheduleHeading}>
            <Icon name="bell" size={18} color={themeColors.primary} />
            <Text
              allowFontScaling={false}
              style={[styles.scheduleTitle, { color: themeColors.primaryText }]}
            >
              Tefillah Reminder
            </Text>
          </View>
          <Text style={{ color: themeColors.secondaryText }}>
            Shalom! {[genderedName, userName].filter(Boolean).join(" ")}, Tefillah Time na po!
          </Text>
        </View>
      )}

      <View style={[styles.sectionHeading, styles.dailySectionHeading]}>
        <Icon name="book-open" size={19} color={themeColors.primary} />
        <View>
          <Text
            allowFontScaling={false}
            style={[styles.sectionTitle, { color: themeColors.primaryText }]}
          >
            Daily Verses
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.sectionSubtitle, { color: themeColors.secondaryText }]}
          >
            Mga talata ngayong araw
          </Text>
        </View>
      </View>
      {isMorningVerseAvailable && dailyVerses.morning && (
        <DailyVerseItem
          title="Morning Verse · 7:00 AM"
          titleTl="Talata sa Umaga · 7:00 AM"
          verse={dailyVerses.morning.verse}
          themeColors={themeColors}
          onView={() => {
            setCurrentChapter(dailyVerses.morning!.index);
            router.push("/view-chapter");
          }}
        />
      )}
      {isEveningVerseAvailable && dailyVerses.evening && (
        <DailyVerseItem
          title="Evening Verse · 7:00 PM"
          titleTl="Talata sa Gabi · 7:00 PM"
          verse={dailyVerses.evening.verse}
          themeColors={themeColors}
          onView={() => {
            setCurrentChapter(dailyVerses.evening!.index);
            router.push("/view-chapter");
          }}
        />
      )}
    </ScrollView>
  );
};

const DailyVerseItem = ({
  title,
  titleTl,
  verse,
  themeColors,
  onView,
}: {
  title: string;
  titleTl: string;
  verse: Verse;
  themeColors: (typeof COLORS)["light"];
  onView: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.dailyVerseItem,
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={styles.dailyVerseToggle}
      >
        <View style={styles.dailyVerseHeading}>
          <Icon
            name={title.startsWith("Morning") ? "sunrise" : "sunset"}
            size={18}
            color={themeColors.primary}
          />
          <View style={styles.dailyVerseHeadingText}>
            <Text
              allowFontScaling={false}
              style={[styles.dailyVerseTime, { color: themeColors.primaryText }]}
            >
              {title}
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.dailyVerseTimeTl, { color: themeColors.secondaryText }]}
            >
              {titleTl}
            </Text>
          </View>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={themeColors.secondaryText}
          />
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.dailyVerseReference, { color: themeColors.primary }]}
        >
          Chapter {verse.chapter} · Verse {verse.verse}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <>
          <Text
            allowFontScaling={false}
            style={[styles.dailyVerseText, { color: themeColors.secondaryText }]}
          >
            {verse.content.trim()}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onView}
            style={[styles.viewVerseButton, { backgroundColor: themeColors.primary }]}
          >
            <Icon name="book-open" size={16} color={COLORS.white} />
            <Text allowFontScaling={false} style={styles.viewVerseButtonText}>
              View Verse · Tingnan ang Talata
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 17,
  },
  sectionSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 1,
  },
  dailySectionHeading: {
    marginTop: 26,
  },
  scheduleHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 5,
  },
  scheduleTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
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
    marginBottom: 10,
  },
  image: {
    height: 70,
    width: 70,
  },
  dailyVerseItem: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  dailyVerseToggle: {
    width: "100%",
  },
  dailyVerseHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dailyVerseHeadingText: {
    flex: 1,
  },
  dailyVerseTime: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  dailyVerseTimeTl: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
    marginTop: 1,
  },
  dailyVerseReference: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    marginTop: 8,
  },
  dailyVerseText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  viewVerseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  viewVerseButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
});

export default Home;
