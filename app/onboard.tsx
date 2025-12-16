import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomizeButton from "./components/CustomizeButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const contentList = [
  {
    index: 0,
    title: "Welcome to Separ The Book of Remembrance",
    subtitle:
      "A sacred collection of divine verses to inspire, guide, and uplift your soul. Begin your journey of reflection and wisdom.",
    imagePath: require("../assets/images/book-story.png"),
  },
  {
    index: 1,
    title: "Find Wisdom Instantly",
    subtitle:
      "Easily search for verses that resonate with your heart. Filter by topic, keyword, or theme to find divine guidance.",
    imagePath: require("../assets/images/search-story.png"),
  },
  {
    index: 2,
    title: "Observe the New Moon for Sacred Worship",
    subtitle:
      "Observe the new moon phases as a guide for Shabbath worship, following the sacred traditions practiced by the Hebrews.",
    imagePath: require("../assets/images/pray-story.png"),
  },
  {
    index: 3,
    title: "A Verse for Every Day",
    subtitle:
      "Receive an inspiring verse daily to start your day with light and wisdom. Let the words guide your path.",
    imagePath: require("../assets/images/notif-story.png"),
  },
  {
    index: 4,
    title: "Let Divine Guidance Choose for You",
    subtitle:
      "Need inspiration? Pick a random verse and let divine wisdom find you when you need it the most.",
    imagePath: require("../assets/images/select-story.png"),
  },
];

const OnBoardScreen = () => {
  const router = useRouter();
  const [selectedContent, setSelectedContent] = useState(contentList[0]);

  // Animation values
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.1);

  const popAnimation = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: scale.value }],
  }));

  // Trigger animation on content change
  useEffect(() => {
    progress.value = withSpring(1, { damping: 10, stiffness: 364 });
    scale.value = withSpring(1, { damping: 10, stiffness: 364 });
  }, [selectedContent]);

  const handleNextContent = () => {
    const currentIndex = selectedContent.index;

    if (currentIndex < contentList.length - 1) {
      // Reset animation
      progress.value = 0;
      scale.value = 0.8;

      // Delay state update to avoid race condition with Reanimated
      setTimeout(() => {
        setSelectedContent(contentList[currentIndex + 1]);
      }, 50);
    } else {
      router.push("/(home)");
    }
  };

  const { index, title, subtitle, imagePath } = selectedContent;

  return (
    <ImageBackground
      source={require("../assets/images/bg-white.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Animated.View style={[popAnimation, { flexShrink: 0 }]}>
            <Image
              source={imagePath}
              style={{ width: 300, height: 300, resizeMode: "contain" }}
            />
          </Animated.View>

          <Animated.View style={[popAnimation, { marginBottom: 20 }]}>
            <Text allowFontScaling={false} style={styles.title}>
              {title}
            </Text>
            <Text allowFontScaling={false} style={styles.subtitle}>
              {subtitle}
            </Text>
          </Animated.View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
            }}
          >
            <CustomizeButton
              title={index < contentList.length - 1 ? "Next" : "Finish"}
              icons={<Icon name="navigate-next" color="#fff" size={25} />}
              onPress={handleNextContent}
              width={250}
              styleButton={[
                {
                  borderRadius: 50,
                  backgroundColor: "#003092",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  elevation: 10,
                },
              ]}
              styleText={{ color: "#fff" }}
            />
            {index < 4 && (
              <View style={styles.btnSkip}>
                <TouchableOpacity onPress={() => router.push("/(home)")}>
                  <Text
                    allowFontScaling={false}
                    style={[styles.subtitle, { fontSize: 15 }]}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
                <Icon name="navigate-next" color="#343434" size={25} />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  btnSkip: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 10,
    textAlign: "center",
  },
});

export default OnBoardScreen;
