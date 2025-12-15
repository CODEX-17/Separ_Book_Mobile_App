import COLORS from "@/app/constants/colors";
import { FONTS } from "@/app/constants/fontStyle";
import { SettingContext } from "@/app/context/SettingContext";
import React, { Component, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon1 from "react-native-vector-icons/Entypo";

const Developer = () => {
  const settingContext = useContext(SettingContext);

  if (!settingContext) return null;

  const { objSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;
  const imageSource =
    objSetting.theme !== "dark"
      ? require("../../../assets/images/codex-dark.png")
      : require("../../../assets/images/codex.png");

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Image style={styles.image} source={imageSource} />
      <Text
        allowFontScaling={false}
        style={[styles.title, { fontSize: 16, color: themeColors.primaryText }]}
      >
        The Developer (C0D3X)
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          color: themeColors.primaryText,
          fontSize: 12,
          textAlign: "center",
          marginTop: 10,
          fontFamily: FONTS.regular,
        }}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.boldText,
            {
              color: objSetting.theme === "dark" ? COLORS.yellow : COLORS.blue,
            },
          ]}
        >
          Rumar Pamparo
        </Text>{" "}
        is a dedicated web and mobile application developer committed to
        building purposeful and meaningful digital solutions. This application
        was carefully developed exclusively for the members of the Ataryahu
        Tribe. Its purpose is to provide a digitalized version of{" "}
        <Text
          allowFontScaling={false}
          style={[
            styles.boldText,
            {
              color: objSetting.theme === "dark" ? COLORS.yellow : COLORS.blue,
            },
          ]}
        >
          Sephar ni YHWH – The Book of Remembrance
        </Text>{" "}
        , preserving its teachings in a secure and accessible format. Any terms
        or teachings that may not be familiar are encouraged to be clarified
        through the Cohen’s, ensuring proper understanding and guidance within
        the community.
      </Text>

      <Text
        allowFontScaling={false}
        style={[
          styles.title,
          { fontSize: 15, color: themeColors.primaryText, marginTop: 20 },
        ]}
      >
        Contact Me.
      </Text>
      <View style={{ flexDirection: "row", gap: 30 }}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.facebook.com/rumar.pamparo")
          }
        >
          <View style={styles.btn}>
            <Icon
              name="facebook"
              color={objSetting.theme === "dark" ? COLORS.white : COLORS.blue}
              size={25}
            />
            <Text
              allowFontScaling={false}
              style={[
                styles.boldText,
                {
                  color: themeColors.primaryText,
                  fontSize: 10,
                },
              ]}
            >
              Facebook
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.instagram.com/pamparorumar/")
          }
        >
          <View style={styles.btn}>
            <Icon1
              name="instagram-with-circle"
              color={objSetting.theme === "dark" ? COLORS.white : COLORS.red}
              size={25}
            />
            <Text
              allowFontScaling={false}
              style={[
                styles.boldText,
                {
                  color: themeColors.primaryText,
                  fontSize: 10,
                },
              ]}
            >
              Instagram
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://github.com/CODEX-17")}
        >
          <View style={styles.btn}>
            <Icon
              name="github"
              color={
                objSetting.theme === "dark"
                  ? COLORS.white
                  : themeColors.primaryText
              }
              size={25}
            />
            <Text
              allowFontScaling={false}
              style={[
                styles.boldText,
                {
                  color: themeColors.primaryText,
                  fontSize: 10,
                },
              ]}
            >
              Github
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  btn: {
    paddingVertical: 5,
    alignItems: "center",
    gap: 5,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 500,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  title: {
    fontFamily: FONTS.bold,
    color: "#343434",
    fontSize: 20,
    textAlign: "center",
  },
});

export default Developer;
