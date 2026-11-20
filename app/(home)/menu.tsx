import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import COLORS from "../constants/colors";
import { SettingContext } from "../context/SettingContext";
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

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  interface ButtonListType {
    title: TabsRoutes;
    icon: (isActive: boolean) => React.ReactElement;
  }

  const buttonList: ButtonListType[] = [
    {
      title: "Search",
      icon: (isActive: boolean) => (
        <Icon name="search" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Calendar",
      icon: (isActive: boolean) => (
        <Icon name="calendar" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Chapters",
      icon: (isActive: boolean) => (
        <Icon name="book" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Room",
      icon: (isActive: boolean) => (
        <Icon2 name="person-praying" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Random",
      icon: (isActive: boolean) => (
        <Icon1 name="random" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Music",
      icon: (isActive: boolean) => (
        <Icon name="music" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Favorites",
      icon: (isActive: boolean) => (
        <Icon name="heart" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Notes",
      icon: (isActive: boolean) => (
        <Icon name="file-text" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Settings",
      icon: (isActive: boolean) => (
        <Icon name="settings" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Terms",
      icon: (isActive: boolean) => (
        <Icon name="book-open" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Website",
      icon: (isActive: boolean) => (
        <Icon name="globe" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "About",
      icon: (isActive: boolean) => (
        <Icon name="info" color={themeColors.primary} size={25} />
      ),
    },
    {
      title: "Developer",
      icon: (isActive: boolean) => (
        <Icon2 name="code" color={themeColors.primary} size={25} />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(350)} style={styles.heading}>
      <Text
        allowFontScaling={false}
        style={[styles.title, { color: themeColors.primary }]}
      >
        Other Menu
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>Lahat ng kailangan mo, isang tap lang.</Text>
      </Animated.View>
      <View style={styles.menuList}>
        <ScrollView>
          <View style={styles.scroll}>
            {buttonList.map((item, index) => (
              <TouchableOpacity
                onPress={() => setBottomNavigation(item.title)}
                key={index}
                style={styles.cardWrapper}
              >
                <Animated.View entering={FadeInDown.delay(index * 35).springify()} key={index} style={[styles.btn, { backgroundColor: themeColors.primary, borderColor: themeColors.primary }]}>
                  <View style={[styles.iconBox, { backgroundColor: COLORS.white }]}>{item.icon(true)}</View>
                  <Text allowFontScaling={false} style={[styles.text, { color: COLORS.white }]}>
                    {item.title}
                  </Text>
                </Animated.View>
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
    marginBottom: 2,
  },
  heading: { width: "100%", paddingHorizontal: 20, marginTop: 20 },
  subtitle: { fontFamily: "Poppins-Regular", fontSize: 12, marginBottom: 18 },
  menuList: {
    width: "100%",
    flex: 1,
  },
  scroll: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap", // Wrap items to next row
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
  },
  btn: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 16,
  },
  cardWrapper: {
    width: "48%",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginTop: "auto",
  },
});

export default Menus;
