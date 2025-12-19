import React, { FC, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { BottomNavigationContext } from "../context/BottomNavigationContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from "react-native-reanimated";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import { Setting } from "../types/interfaces";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";

// Define the type for the props
interface HeaderProps {
  setModalVisible: (visible: boolean) => void;
}

const Header: FC<HeaderProps> = ({ setModalVisible }) => {
  const router = useRouter();

  const bottomNavigationContext = useContext(BottomNavigationContext);
  const settingContext = useContext(SettingContext);

  if (!bottomNavigationContext || !settingContext) {
    return false;
  }

  const { bottomNavigation, setBottomNavigation } = bottomNavigationContext;
  const { objSetting, handleChangeSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const progress = useSharedValue<number>(0);
  const rotate = useSharedValue<number>(0);
  const position = useSharedValue<number>(-100);

  const rotateStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  }, []);

  const translateXAnimation = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ translateX: position.value }],
    };
  });

  const audioSource = require("../../assets/sound/am.mp3");
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const [isAudioPlay, setIsAudioPlay] = useState<boolean>(false);

  const rotateAnimation = () => {
    progress.value = withSpring(1, {
      stiffness: 300,
      damping: 20, // optional
      mass: 1, // optional
      overshootClamping: false,
    });
    rotate.value = withSpring(100, {
      stiffness: 200,
      damping: 20, // optional
      mass: 1, // optional
      overshootClamping: false,
    });
  };

  const translateAnimation = () => {
    position.value = withSpring(1, {
      stiffness: 300,
      damping: 20, // optional
      mass: 1, // optional
      overshootClamping: false,
    });
    position.value = withSpring(0, {
      stiffness: 200,
      damping: 20, // optional
      mass: 1, // optional
      overshootClamping: false,
    });
  };

  const handleTheme = () => {
    const newTheme: Setting = {
      ...objSetting,
      theme: objSetting.theme === "dark" ? "light" : "dark",
    };
    handleChangeSetting(newTheme);
  };

  useEffect(() => {
    rotateAnimation();
    translateAnimation();

    // Define an async function inside useEffect
    const setup = async () => {
      // Configure audio for background playback with mixing
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });
    };

    setup(); // call the async function
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={translateXAnimation}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            name="chevron-left"
            color={themeColors.secondaryText}
            size={25}
          />
        </TouchableOpacity>
      </Animated.View>
      <Text
        allowFontScaling={false}
        style={[styles.text, { color: themeColors.primary }]}
      >
        {bottomNavigation}
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setIsAudioPlay(!isAudioPlay);
            if (isAudioPlay) {
              player.play();
              player.loop = true;
              ToastAndroid.show("Sound Playing!", ToastAndroid.SHORT);
            } else {
              player.pause();
              ToastAndroid.show("Sound Paused!", ToastAndroid.SHORT);
            }
          }}
        >
          <Icon name="music" color={themeColors.secondaryText} size={25} />
        </TouchableOpacity>
        <Animated.View style={[rotateStyleAnimation]}>
          <TouchableOpacity onPress={handleTheme}>
            {objSetting.theme === "dark" ? (
              <Icon name="sun" color={themeColors.secondaryText} size={25} />
            ) : (
              <Icon name="moon" color={themeColors.secondaryText} size={25} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#0943AF",
  },
});

export default Header;
