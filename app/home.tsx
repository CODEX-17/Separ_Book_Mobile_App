import React, { use, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getStoreData } from "./Utils/storage";
import { SettingContext } from "./context/SettingContext";
import COLORS from "./constants/colors";
import isTefillahTime from "./Utils/tifillahTime";
import { Profile } from "./types/interfaces";
import { ranks } from "./data/ranking";
import { findingRankStatus, rankMapping } from "./Utils/rankUtils";

const Home = () => {
  const [userName, setUserName] = useState<string>("");
  const today = new Date();
  const day = today.getDay();
  const [profile, setProfile] = useState<Profile>();

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
