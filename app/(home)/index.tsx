import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./header";
import { BottomNavigationContext } from "../context/BottomNavigationContext";
import ChapterScreen from "./(renders)/chapter";
import Navigation from "./navigation";
import RandomPick from "./(renders)/random";
import Search from "./(renders)/search";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Calendar from "./(renders)/(calendar)/index";
import { StatusBar } from "expo-status-bar";
import Menu from "./menu";
import Music from "./(renders)/music";
import Setting from "../setting";
import Favorites from "./(renders)/favorites";
import Home from "../home";
import Developer from "./(renders)/developer";
import Terms from "./(renders)/terms";
import AnnouncementModal from "./announcement-modal";
import Notes from "./(renders)/notes";
import Announcements from "./(renders)/announcements";
import About from "./(renders)/about";
import Room from "./(renders)/Room";

const HomeLayout = () => {
  const bottomNavigationContext = useContext(BottomNavigationContext);
  const settingContext = useContext(SettingContext);

  if (!settingContext || !bottomNavigationContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const { bottomNavigation } = bottomNavigationContext;

  const renderTab = () => {
    switch (bottomNavigation) {
      case "Home":
        return <Home />;
      case "Chapters":
        return <ChapterScreen />;
      case "Menu":
        return <Menu />;
      case "Search":
        return <Search />;
      case "Favorites":
        return <Favorites />;
      case "Music":
        return <Music />;
      case "Room":
        return <Room />;
      case "Developer":
        return <Developer />;
      case "Settings":
        return <Setting />;
      case "Calendar":
        return <Calendar />;
      case "Random":
        return <RandomPick />;
      case "Terms":
        return <Terms />;
      case "Notes":
        return <Notes />;
      case "Website":
        return <Announcements />;
      case "About":
        return <About />;
      default:
        return <Music />; // Fallback UI
    }
  };

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

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <Animated.View style={[styles.container, backgroundAnimation]}>
      <StatusBar
        animated={true}
        hidden={false}
        style={objSetting.theme === "dark" ? "light" : "dark"}
      />
      <SafeAreaView style={[styles.safeArea, { flex: 1 }]}>
        <AnnouncementModal />
        <View style={styles.header}>
          <Header setModalVisible={setModalVisible} />
        </View>
        <View style={styles.content}>{renderTab()}</View>
        <View style={styles.bottonNavigation}>
          <Navigation />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
    position: "relative",
  },
  header: {
    height: 50,
    width: "100%",
    backgroundColor: "transparent",
  },
  content: {
    width: "100%",
    height: "80%",
    position: "relative",
  },
  bottonNavigation: {
    flex: 1,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default HomeLayout;
