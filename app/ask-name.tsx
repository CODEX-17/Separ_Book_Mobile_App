import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FONTS } from "./constants/fontStyle";
import COLORS from "./constants/colors";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { getStoreData, storeData } from "./Utils/storage";

const AskName = () => {
  const [userName, setUsername] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState<string>(`What's your name?`);
  const router = useRouter();

  const handleSearch = (text: string) => {
    if (userName) {
      setTimeout(() => {
        buttonProgress.value = withTiming("flex", {
          duration: 1000,
          easing: Easing.ease,
        });
        buttonPosition.value = withSpring(0, { damping: 10, stiffness: 50 });
        buttonPosition.value = withRepeat(
          withTiming(0, { duration: 800 }), // Fade in/out in 1s
          -1, // Infinite loop
          true // Reverse animation (fades in and out)
        );
      }, 1000);
    } else {
      buttonProgress.value = withTiming("none", {
        duration: 1000,
        easing: Easing.ease,
      });
      buttonPosition.value = 20;
    }

    setUsername(text);
  };

  //Animation
  const textProgress = useSharedValue<"none" | "flex">("none");
  const textScale = useSharedValue(0);
  const textGap = useSharedValue(0);
  const textFlexDirection = useSharedValue<
    "column" | "row" | "row-reverse" | "column-reverse"
  >("column");

  const inputProgress = useSharedValue<"none" | "flex">("none");
  const inputPosition = useSharedValue(-1000);

  const buttonProgress = useSharedValue<"none" | "flex">("none");
  const buttonPosition = useSharedValue(20);

  const textAnimation = useAnimatedStyle(() => ({
    display: textProgress.value,
    transform: [{ scale: textScale.value }],
    flexDirection: textFlexDirection.value,
    gap: textGap.value,
  }));

  const inputAnimation = useAnimatedStyle(() => ({
    display: inputProgress.value,
    translateX: inputPosition.value,
  }));

  const buttonAnimation = useAnimatedStyle(() => ({
    display: buttonProgress.value,
    translateY: buttonPosition.value,
  }));

  const handleSubmit = () => {
    textProgress.value = "none";
    textScale.value = 0;
    inputProgress.value = "none";
    buttonProgress.value = "none";

    console.log("User Name:", userName);

    setTextLabel(userName ?? "");

    if (!userName) return;

    storeData("PROFILE", { name: userName, rank: "Newcomer", level: 1 });

    setTimeout(() => {
      textProgress.value = "flex";
      textScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      textFlexDirection.value = "row";
      textGap.value = withDelay(
        1000,
        withSpring(10, { damping: 10, stiffness: 100 })
      );

      setTimeout(() => {
        router.push("/onboard");
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    textProgress.value = withSpring("flex", { damping: 10, stiffness: 364 });
    textScale.value = withSpring(1, { damping: 10, stiffness: 364 });
    inputProgress.value = withSpring("flex", { damping: 10, stiffness: 364 });
    inputPosition.value = withSpring(0, { damping: 10, stiffness: 364 });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.labelContainer, textAnimation]}>
        <Text allowFontScaling={false} style={styles.questionText}>
          Shalom!
        </Text>
        <Text allowFontScaling={false} style={styles.questionTextRegular}>
          {textLabel}
        </Text>
      </Animated.View>
      <Animated.View style={inputAnimation}>
        <TextInput
          allowFontScaling={false}
          style={[styles.input]}
          onChangeText={handleSearch}
          placeholder="ex. Salem"
          placeholderTextColor="#ccc"
        />
      </Animated.View>
      {userName && (
        <Animated.View style={buttonAnimation}>
          <TouchableOpacity style={{ marginTop: 50 }} onPress={handleSubmit}>
            <Icon name="arrow-right-circle" color={COLORS.blue} size={40} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  questionText: {
    fontSize: 25,
    fontFamily: FONTS.bold,
  },
  questionTextRegular: {
    fontSize: 25,
    fontFamily: FONTS.regular,
    marginTop: 0,
  },
  input: {
    width: 200,
    height: 40,
    padding: 10,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: COLORS.light.card,
    borderRadius: 100,
    marginTop: 20,
  },
});

export default AskName;
