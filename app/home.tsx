import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStoreData } from "./Utils/storage";
import { SettingContext } from "./context/SettingContext";
import COLORS from "./constants/colors";

const Home = () => {
  const [userName, setUserName] = useState<string>("");
  const today = new Date();
  const day = today.getDay();

  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return false;
  }

  const { objSetting, handleChangeSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

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
      <Text
        style={{
          color: themeColors.primaryText,
          fontSize: 20,
        }}
      >
        {day === 6 ? "Shabbat Shalom!" : "Shalom!"}
      </Text>
      <Text
        style={{
          color: themeColors.primaryText,
          fontSize: 50,
          fontWeight: "bold",
        }}
      >
        {userName}
      </Text>
      <Text
        style={{
          color: themeColors.secondaryText,
          fontSize: 15,
        }}
      >
        {today.toDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    color: "#343434",
  },
});

export default Home;
