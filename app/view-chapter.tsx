import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { ChapterContext } from "./context/ChapterContex";
import { separ as chapterList } from "./data/chapters";
import ScreenShot from "./(home)/screen-shot";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { SettingContext } from "./context/SettingContext";
import { BottomNavigationContext } from "./context/BottomNavigationContext";
import COLORS from "./constants/colors";
import { getStoreData, storeData, removeStorageData } from "./Utils/storage";
import { Profile, Setting, Verse } from "./types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import { useLevelTimer } from "./Utils/useLevelTimer";
import { SafeAreaView } from "react-native-safe-area-context";

const ViewChapter = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);
  const bottomNavigationContext = useContext(BottomNavigationContext);

  if (!chapterContext || !settingContext || !bottomNavigationContext)
    return null;

  const { currentChapter, setCurrentChapter } = chapterContext;
  const { objSetting, handleChangeSetting } = settingContext;
  const { bottomNavigation, setBottomNavigation } = bottomNavigationContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;
  const fontSize = objSetting.fontSize;

  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [profile, setProfile] = useState<Profile>();

  const level = useLevelTimer(30000);

  // Sync selectedVerse whenever currentChapter changes
  useEffect(() => {
    console.log("verse 1:", chapterList[0]);
    console.log("Current Chapter changed:", currentChapter);

    if (
      (currentChapter !== null && currentChapter !== undefined) ||
      currentChapter === 0
    ) {
      console.log("yes");
      setSelectedVerse(chapterList[currentChapter]);
    } else {
      console.log("no");
    }
  }, [currentChapter]);

  // Load profile on mount
  useEffect(() => {
    (async () => {
      const profileData = await getStoreData("PROFILE");
      if (profileData) setProfile(profileData);
    })();
  }, []);

  // Load favorite list whenever currentChapter changes
  useEffect(() => {
    const getAllFavorites = async () => {
      const favorites: any = await getStoreData("FAVORITE");
      if (!favorites) return;

      if (
        JSON.stringify(favoriteList) !== JSON.stringify(favorites.verseIndex)
      ) {
        setFavoriteList(favorites.verseIndex);
      }

      const isFav = favorites.verseIndex.includes(currentChapter ?? -1);
      if (isFav !== isFavorite) setIsFavorite(isFav);
    };

    getAllFavorites();
  }, [currentChapter]);

  useEffect(() => {
    if (level === 1 && profile) {
      setProfile((prevProfile) => {
        if (!prevProfile) return prevProfile;
        const updatedProfile = { ...prevProfile, level: prevProfile.level + 1 };
        storeData("PROFILE", updatedProfile);
        return updatedProfile;
      });
    }
  }, [level]);

  // Update profile level when reach user 20 sec in every chapter
  useEffect(() => {
    console.log("⏳ Timer started");

    const timer = setTimeout(() => {
      console.log("✅ User spent 20 seconds in ViewChapter");
      setProfile((prevProfile) => {
        if (!prevProfile) return prevProfile;
        const updatedProfile = { ...prevProfile, level: prevProfile.level + 1 };
        storeData("PROFILE", updatedProfile);
        return updatedProfile;
      });

      ToastAndroid.show(`Level up! ${profile?.level}`, ToastAndroid.SHORT);
    }, 20000); // 20 seconds

    return () => {
      clearTimeout(timer);
      console.log("🧹 Timer cleared (component unmounted)");
    };
  }, [currentChapter]);

  if (
    currentChapter === null ||
    currentChapter === undefined ||
    !selectedVerse ||
    !profile
  )
    return null;

  const handleAddFontSize = (type: "add" | "minus") => {
    handleChangeSetting({
      ...objSetting,
      fontSize: type === "add" ? fontSize + 1 : fontSize - 1,
    });
  };

  const handleSwitchVerse = (direction: "next" | "prev") => {
    const index =
      direction === "next" ? currentChapter + 1 : currentChapter - 1;
    if (index < 0 || index >= chapterList.length) return;
    setCurrentChapter(index);
  };

  const handleFavorite = async (verseNumber: number) => {
    try {
      const prevData: any = await getStoreData("FAVORITE");
      let newData: number[] = prevData?.verseIndex ?? [];

      if (isFavorite) {
        newData = newData.filter((v) => v !== verseNumber);
      } else {
        newData.push(verseNumber);
      }

      setFavoriteList(newData);
      setIsFavorite(!isFavorite);
      await storeData("FAVORITE", { verseIndex: [...new Set(newData)] });
    } catch (e) {
      alert("Error updating favorites");
    }
  };

  const handleTheme = () => {
    handleChangeSetting({
      ...objSetting,
      theme: objSetting.theme === "dark" ? "light" : "dark",
    });
  };

  const handleSave = () => setIsShowPreview(true);

  const handleBack = () => {
    if (params.route === "random") {
      router.dismiss(2);
    } else {
      router.dismissTo("/(home)");
    }
  };

  const menuList = [
    {
      name: "prev",
      function: () => handleSwitchVerse("prev"),
      icon: <Icon name="skip-back" color={themeColors.primary} size={25} />,
    },
    {
      name: "next",
      function: () => handleSwitchVerse("next"),
      icon: <Icon name="skip-forward" color={themeColors.primary} size={25} />,
    },
    {
      name: "heart",
      function: () => handleFavorite(currentChapter),
      icon: (
        <Icon
          name="heart"
          color={isFavorite ? COLORS.red : themeColors.primary}
          size={25}
        />
      ),
    },
    {
      name: "addFontSize",
      function: () => handleAddFontSize("add"),
      icon: (
        <Icon1
          name="format-font-size-increase"
          color={themeColors.primary}
          size={25}
        />
      ),
    },
    {
      name: "minusFontSize",
      function: () => handleAddFontSize("minus"),
      icon: (
        <Icon1
          name="format-font-size-decrease"
          color={themeColors.primary}
          size={25}
        />
      ),
    },
    {
      name: "theme",
      function: handleTheme,
      icon:
        objSetting.theme === "dark" ? (
          <Icon name="sun" color={themeColors.primary} size={25} />
        ) : (
          <Icon name="moon" color={themeColors.primary} size={25} />
        ),
    },
    {
      name: "download",
      function: handleSave,
      icon: <Icon name="share" color={themeColors.primary} size={25} />,
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {isShowPreview && (
        <View style={styles.modal}>
          <ScreenShot
            selectedVerse={selectedVerse}
            setIsShowPreview={setIsShowPreview}
          />
        </View>
      )}
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.display}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack}>
                <Icon
                  name="chevron-left"
                  color={themeColors.primary}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "column" }}>
                <Text
                  allowFontScaling={false}
                  style={[styles.chapter, { color: themeColors.primaryText }]}
                >
                  {`Chapter ${selectedVerse.chapter}`}
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[styles.verse, { color: themeColors.secondaryText }]}
                >
                  {`Verse ${selectedVerse.verse}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setBottomNavigation("Settings"), router.push("/(home)");
                }}
              >
                <Icon name="settings" color={themeColors.primary} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.displayContent}>
              <ScrollView style={{ padding: 10 }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.contentText,
                    {
                      fontSize: objSetting.fontSize,
                      color: themeColors.primaryText,
                    },
                  ]}
                >
                  {selectedVerse.content}
                </Text>
              </ScrollView>
            </View>
          </View>
          <View style={styles.menu}>
            {menuList.map((item, idx) => (
              <TouchableOpacity key={idx} onPress={item.function}>
                {item.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    position: "relative",
  },
  content: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  display: {
    height: "90%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    paddingTop: 20,
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  displayContent: {
    flex: 1,
    flexDirection: "row",
    height: "79%",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    width: "100%",
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  chapter: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 20,
    textAlign: "center",
  },
  verse: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 15,
    textAlign: "center",
  },
  contentText: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 30,
    textAlign: "center",
    margin: 10,
  },
  modal: {
    width: "80%",
    height: "80%",
    position: "absolute",
    zIndex: 20,
  },
});

export default ViewChapter;
function addfavorite(type: string, index: number) {
  throw new Error("Function not implemented.");
}
