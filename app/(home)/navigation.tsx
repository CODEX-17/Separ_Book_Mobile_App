import React, { useContext, useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { BottomNavigationContext } from "../context/BottomNavigationContext";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/FontAwesome";
import { TabsRoutes } from "../types/type";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const BottomNavigation = () => {
  const MenuButtons: TabsRoutes[] = [
    "Search",
    "Settings",
    "Music",
    "Favorites",
    "Developer",
    "Room",
    "Website",
    "About",
  ];

  const bottomNavigationContext = useContext(BottomNavigationContext);
  const settingContext = useContext(SettingContext);

  if (!bottomNavigationContext || !settingContext) {
    return false;
  }

  const { bottomNavigation, setBottomNavigation } = bottomNavigationContext;
  const { objSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  interface ButtonListType {
    title: TabsRoutes;
    icon: (isActive: boolean) => React.ReactElement;
  }

  const buttonList: ButtonListType[] = [
    {
      title: "Home",
      icon: (isActive: boolean) => (
        <Icon
          name="home"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={25}
        />
      ),
    },
    {
      title: "Calendar",
      icon: (isActive: boolean) => (
        <Icon
          name="calendar"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={25}
        />
      ),
    },
    {
      title: "Chapters",
      icon: (isActive: boolean) => (
        <Icon
          name="book"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={25}
        />
      ),
    },
    {
      title: "Random",
      icon: (isActive: boolean) => (
        <Icon1
          name="random"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={25}
        />
      ),
    },
    {
      title: "Notes",
      icon: (isActive: boolean) => (
        <Icon
          name="file-text"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={23}
        />
      ),
    },
    {
      title: "Menu",
      icon: (isActive: boolean) => (
        <Icon
          name="menu"
          color={isActive ? themeColors.highlight : themeColors.secondaryText}
          size={25}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
          shadowColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.navList}>
        {buttonList.map((btn, index) => {
          const isActive = () => {
            if (bottomNavigation === btn.title) {
              return true;
            }

            if (btn.title === "Menu") {
              if (!bottomNavigation) return false;
              return MenuButtons.includes(bottomNavigation);
            }

            return false;
          };

          return (
            <Pressable
              style={({ pressed }) => [
                isActive()
                  ? [styles.buttonActive, { backgroundColor: themeColors.card }]
                  : styles.button,
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              key={index}
              onPress={() => setBottomNavigation(btn.title)}
            >
              <AnimatedButtonContent active={isActive()} icon={btn.icon} title={btn.title} themeColors={themeColors} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const AnimatedButtonContent = ({ active, icon, title, themeColors }: { active: boolean; icon: (active: boolean) => React.ReactElement; title: string; themeColors: typeof COLORS.light }) => {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  React.useEffect(() => { scale.value = withSpring(active ? 1.08 : 1, { damping: 14, stiffness: 220 }); }, [active]);
  return <Animated.View style={[styles.buttonContent, style]}>{icon(active)}<Text allowFontScaling={false} style={[styles.buttonText, { color: active ? themeColors.highlight : themeColors.secondaryText }]}>{title}</Text></Animated.View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 1,
  },
  navList: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonActive: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9F0FF",
    borderRadius: 10,
    height: 60,
    width: 54,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 60,
    width: 54,
  },
  buttonText: {
    fontSize: 10,
    textAlign: "center",
    padding: 0,
    margin: 0,
    fontFamily: "Poppins-Bold",
    color: "#343434",
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomNavigation;
