import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ChapterContext } from "./context/ChapterContex";
import { separ as chapterList } from "./data/chapters";
import ScreenShot from "./(home)/screen-shot";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { SettingContext } from "./context/SettingContext";
import COLORS from "./constants/colors";
import { getStoreData, storeData, removeStorageData } from "./Utils/storage";
import { Setting, Verse } from "./types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";

const ViewChapter = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);

  if (!chapterContext || !settingContext) {
    return false;
  }

  const { currentChapter, setCurrentChapter } = chapterContext;
  const { objSetting, handleChangeSetting } = settingContext;

  if (!currentChapter) return null;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(
    chapterList[currentChapter]
  );

  const fontSize = objSetting.fontSize;

  const [currentIndexChapter, setCurrentIndexChapter] = useState<number | null>(
    null
  );
  const [isShowPreview, setIsShowPreview] = useState(false);

  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

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
      function: () => handleTheme(),
      icon:
        objSetting.theme === "dark" ? (
          <Icon name="sun" color={themeColors.primary} size={25} />
        ) : (
          <Icon name="moon" color={themeColors.primary} size={25} />
        ),
    },
    {
      name: "download",
      function: () => handleSave(),
      icon: <Icon name="share" color={themeColors.primary} size={25} />,
    },
  ];

  useEffect(() => {
    //removeStorageData('FAVORITE')

    const getAllFavorites = async () => {
      const favorites: any = await getStoreData("FAVORITE");
      setFavoriteList(favorites.verseIndex);

      if (favorites) {
        const isFav = favorites.verseIndex.find(
          (item: number) => item === currentChapter
        );
        setIsFavorite(isFav ? true : false);
      }
    };

    getAllFavorites();
  }, [favoriteList]);

  useEffect(() => {
    const getData = async () => {
      const result = await getStoreData("SETTING");
    };

    getData();
  }, [handleChangeSetting]);

  useEffect(() => {
    if (!selectedVerse) router.back();
  }, [params]);

  const handleAddFontSize = (type: string) => {
    const changeSetting = {
      ...objSetting,
      fontSize: type === "add" ? fontSize + 1 : fontSize - 1,
    };
    handleChangeSetting(changeSetting);
  };

  const handleSwitchVerse = (type: string) => {
    const index =
      type === "next" ? (currentChapter ?? 0) + 1 : (currentChapter ?? 0) - 1;

    if (index < 0 || index >= chapterList.length - 1) return;

    setCurrentIndexChapter(index);
    setCurrentChapter(index);
    setSelectedVerse(chapterList[index]);
  };

  const handleSave = () => {
    setIsShowPreview(true);
  };

  const handleback = () => {
    if (params.route === "random") {
      router.dismiss(2);
    }

    router.dismissTo("/(home)");
  };

  const handleTheme = () => {
    const newTheme: Setting = {
      ...objSetting,
      theme: objSetting.theme === "dark" ? "light" : "dark",
    };
    handleChangeSetting(newTheme);
  };

  const handleFavorite = async (verseNumber: number) => {
    try {
      const prevData = await getStoreData("FAVORITE");

      let newData: number[] = [];

      if (!prevData) {
        newData.push(verseNumber);
        setFavoriteList((old) => [...old, verseNumber]);
        storeData("FAVORITE", { verseIndex: newData });
        return;
      }

      if (isFavorite) {
        newData = prevData.verseIndex.filter(
          (item: number) => item !== verseNumber
        );
      } else {
        newData = [...prevData.verseIndex, verseNumber];
      }

      const updatedData = [...new Set(newData)];

      setFavoriteList((old) => [...old, verseNumber]);
      await storeData("FAVORITE", { verseIndex: updatedData });
    } catch (e) {
      alert("Error adding favorite");
    }
  };

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
              <TouchableOpacity onPress={() => handleback()}>
                <Icon
                  name="chevron-left"
                  color={themeColors.primary}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[styles.chapter, { color: themeColors.primaryText }]}
                >{`Chapter ${selectedVerse && selectedVerse?.chapter}`}</Text>
                <Text
                  style={[styles.verse, { color: themeColors.secondaryText }]}
                >{`Verse ${selectedVerse && selectedVerse?.verse}`}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/setting")}>
                <Icon name="settings" color={themeColors.primary} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.displayContent}>
              {selectedVerse && selectedVerse.content.length > 400 ? (
                <ScrollView style={{ padding: 10 }}>
                  <Text
                    style={[
                      styles.contentText,
                      {
                        fontSize: objSetting.fontSize,
                        color: themeColors.primaryText,
                      },
                    ]}
                  >
                    {selectedVerse?.content}
                  </Text>
                </ScrollView>
              ) : (
                <Text
                  style={[
                    styles.contentText,
                    {
                      fontSize: objSetting.fontSize,
                      color: themeColors.primaryText,
                    },
                  ]}
                >
                  {selectedVerse?.content}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.menu}>
            {menuList.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => item.function()}>
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
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    padding: 20,
  },
  display: {
    height: "95%",
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
    height: "79%",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    flexDirection: "row",
    height: "10%",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  chapter: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 40,
    textAlign: "center",
  },
  verse: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 20,
    textAlign: "center",
  },
  contentText: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 30,
    textAlign: "center",
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
