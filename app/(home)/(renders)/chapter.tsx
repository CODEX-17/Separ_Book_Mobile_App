import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { separ as chapters } from "../../data/chapters";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import { ChapterContext } from "../../context/ChapterContex";
import { useRouter } from "expo-router";
import { SettingContext } from "@/app/context/SettingContext";
import COLORS from "@/app/constants/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ChapterScreen = () => {
  const router = useRouter();

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);

  if (!settingContext || !chapterContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const { currentChapter, setCurrentChapter } = chapterContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const scrollViewRef = useRef<any>(null);

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const chapterList: number[] = [
    ...new Set(chapters.map((data) => data.chapter)),
  ];
  const [verseList, setVerseList] = useState<number[] | null>(null);

  // Create a ref to store animation values
  const animationsRef = useRef(chapterList.map(() => useSharedValue(0)));

  useEffect(() => {
    animationsRef.current.forEach((anim, index) => {
      setTimeout(() => {
        anim.value = withSpring(1, { stiffness: 150, damping: 10 });
      }, index * 100); // Delayed animation
    });
  }, []);

  // Generate animated styles only once and store them
  const animatedStyles = animationsRef.current.map((anim) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: anim.value }],
    }))
  );

  const [loading, setLoading] = useState(false);

  const handleSelect = (data: number) => {
    setLoading(true);
    setSelectedChapter(data);

    setVerseList(() => {
      return chapters
        .filter((chp) => chp.chapter === data)
        .map((data) => data.verse);
    });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSelectVerse = (data: number) => {
    setLoading(true);
    const chapter = selectedChapter;
    const verse = data;
    if (chapter && verse) {
      const selectedIndex = chapters.findIndex(
        (data) => data.chapter === chapter && data.verse === verse
      );

      setCurrentChapter(selectedIndex);

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      router.push("/view-chapter");
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.primaryText }]}>
          {selectedChapter ? "Select Verse" : "Select Chapter"}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
          {selectedChapter
            ? `Chapter ${selectedChapter}`
            : "Easily navigate through the sacred writings. Browse and select chapters to explore divine wisdom at your own pace."}
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          {selectedChapter && (
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 5 }}
              onPress={() => {
                setVerseList(null), setSelectedChapter(null);
              }}
            >
              <AntDesign name="back" color={themeColors.primary} size={20} />
              <Text
                style={{ fontSize: 15, color: themeColors.primaryText }}
              >{`Back`}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ flexDirection: "row", gap: 5 }}
            onPress={scrollToBottom}
          >
            <Text
              style={{ fontSize: 15, color: themeColors.primaryText }}
            >{`Scroll to End`}</Text>
            <AntDesign name="down" color={themeColors.primary} size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.menuList}>
        {loading ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottieView
              source={require("../../../assets/animation/loader.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        ) : (
          <ScrollView ref={scrollViewRef}>
            <View style={styles.scroll}>
              {(verseList || chapterList).map((data, index) => (
                <Animated.View
                  style={[styles.btn, animatedStyles[index]]}
                  key={index}
                >
                  <TouchableOpacity
                    onPress={() =>
                      verseList ? handleSelectVerse(data) : handleSelect(data)
                    }
                  >
                    <Text
                      style={[
                        styles.btnTitle,
                        { color: themeColors.background },
                      ]}
                    >
                      {selectedChapter ? "Verse" : "Chapter"}
                    </Text>
                    <Text
                      style={[
                        styles.btnNumber,
                        { color: themeColors.background },
                      ]}
                    >
                      {data}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "trasparent",
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 25,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 12,
    textAlign: "center",
  },
  header: {
    height: "auto",
    width: "100%",
    paddingBottom: 20,
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
    marginBottom: 10,
  },
  btnTitle: {
    fontFamily: "Poppins-Regular",
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
  },
  btnNumber: {
    fontFamily: "Poppins-Bold",
    fontSize: 35,
    textAlign: "center",
    color: "#fff",
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "red",
    borderWidth: 10,
    backgroundColor: "#fff",
  },
  lottie: {
    width: 300,
    height: 300,
  },
});

export default ChapterScreen;
