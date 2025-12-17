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
import OnProgress from "./(renders)/on-progress";
import Setting from "../setting";
import UpdateNotification from "../updated-notification";
import Toast from "react-native-toast-message";
import Favorites from "./(renders)/favorites";
import Home from "../home";
import Developer from "./(renders)/developer";

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
        return <OnProgress />;
      case "Developer":
        return <Developer />;
      case "Settings":
        return <Setting />;
      case "Calendar":
        return <Calendar />;
      case "Random":
        return <RandomPick />;
      default:
        return <OnProgress />; // Fallback UI
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
        {/* Toast */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Toast />
        </View>

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
