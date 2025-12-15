import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ImageBackground } from "react-native";

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

const WelcomeScreen = () => {
  const router = useRouter();

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

  if (!settingContext) {
    return null;
  }

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

          <CustomizeButton
            title={"Explore"}
            icons={<Icon name="navigate-next" color="#003092" size={25} />}
            onPress={handleStart}
            width={250}
            styleButton={[{ borderRadius: 50, backgroundColor: "#fff" }]}
            styleText={{ color: "#003092" }}
          />
          <Text style={[styles.text, { fontSize: 15 }]}>Version 1.0.0</Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.text, { fontSize: 9 }]}>
            Develop by Rumar Pamparo
          </Text>
          <Text style={styles.text}>@All Right Reserved 2025</Text>
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
    display: "flex",
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
    height: 40,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default WelcomeScreen;
