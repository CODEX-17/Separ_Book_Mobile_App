import COLORS from "@/app/constants/colors";
import { SettingContext } from "@/app/context/SettingContext";
import LottieView from "lottie-react-native";
import React, { Component, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

const OnProgress = () => {
  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.primary }]}>
        This tab is still cooking...
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.primary }]}>
        Please check back later
      </Text>
      <LottieView
        source={require("../../../assets/animation/codding-animation.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    marginBottom: 20,
  },
  lottie: {
    width: 250,
    height: 200,
  },
});

export default OnProgress;
