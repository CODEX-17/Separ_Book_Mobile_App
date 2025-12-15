import React, { Component, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/colors";
import { SettingContext } from "../context/SettingContext";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { TabsRoutes } from "../types/type";
import { BottomNavigationContext } from "../context/BottomNavigationContext";
import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/FontAwesome6";

const Menus = () => {
  const bottomNavigationContext = useContext(BottomNavigationContext);
  const settingContext = useContext(SettingContext);

  if (!settingContext || !bottomNavigationContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const { bottomNavigation, setBottomNavigation } = bottomNavigationContext;

  const fadeAnim = useSharedValue(0);

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  // Animated style for background fade effect
  const backgroundAnimation = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    backgroundColor: themeColors.background,
  }));

  interface ButtonListType {
    title: TabsRoutes;
    icon: (isActive: boolean) => JSX.Element;
  }

  const buttonList: ButtonListType[] = [
    {
      title: "Search",
      icon: (isActive: boolean) => (
        <Icon name="search" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Calendar",
      icon: (isActive: boolean) => (
        <Icon name="calendar" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Chapters",
      icon: (isActive: boolean) => (
        <Icon name="book" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Room",
      icon: (isActive: boolean) => (
        <Icon2 name="person-praying" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Random",
      icon: (isActive: boolean) => (
        <Icon1 name="random" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Music",
      icon: (isActive: boolean) => (
        <Icon name="music" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Favorites",
      icon: (isActive: boolean) => (
        <Icon name="heart" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Settings",
      icon: (isActive: boolean) => (
        <Icon name="settings" color={COLORS.white} size={25} />
      ),
    },
    {
      title: "Developer",
      icon: (isActive: boolean) => (
        <Icon2 name="code" color={COLORS.white} size={25} />
      ),
    },
  ];

  return (
    <View style={[styles.container, backgroundAnimation]}>
      <Text
        allowFontScaling={false}
        style={[styles.title, { color: themeColors.primary }]}
      >
        Other Menu
      </Text>
      <View style={styles.menuList}>
        <ScrollView>
          <View style={styles.scroll}>
            {buttonList.map((item, index) => (
              <TouchableOpacity
                onPress={() => setBottomNavigation(item.title)}
                key={index}
              >
                <View key={index} style={styles.btn}>
                  {item.icon(true)}
                  <Text allowFontScaling={false} style={styles.text}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
  },
  menuList: {
    width: "100%",
    height: "80%",
  },
  scroll: {
    width: "100%",
    height: "100%",
    // justifyContent: 'center',
    flexDirection: "row",
    flexWrap: "wrap", // Wrap items to next row
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 10,
  },
  btn: {
    backgroundColor: "#0943AF",
    width: "30%", // 3 columns
    aspectRatio: 1, // Keep it square
    height: 80,
    borderRadius: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 10,
    fontFamily: "Poppins-Bold",
  },
});

export default Menus;
