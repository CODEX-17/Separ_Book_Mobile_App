import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../constants/colors";
import { SettingContext } from "../../context/SettingContext";

const Room = () => {
  const settingContext = useContext(SettingContext);
  if (!settingContext) return null;

  const themeColors =
    settingContext.objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: themeColors.activeCard },
        ]}
      >
        <Icon name="users" size={30} color={themeColors.primary} />
      </View>
      <Text
        allowFontScaling={false}
        style={[styles.title, { color: themeColors.primaryText }]}
      >
        Room
      </Text>
      <Text
        allowFontScaling={false}
        style={[styles.subtitle, { color: themeColors.secondaryText }]}
      >
        This feature is currently in development.
      </Text>
      <Text
        allowFontScaling={false}
        style={[styles.subtitleTl, { color: themeColors.secondaryText }]}
      >
        Ginagawa pa ang feature na ito.
      </Text>
      <LottieView
        source={require("../../../assets/animation/codding-animation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  subtitleTl: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
  },
  animation: {
    width: 250,
    height: 200,
  },
});

export default Room;
