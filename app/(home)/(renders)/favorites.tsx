import COLORS from "@/app/constants/colors";
import { SettingContext } from "@/app/context/SettingContext";
import { Verse } from "@/app/types/interfaces";
import React, { useContext, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getStoreData, storeData } from "@/app/Utils/storage";
import { separ as verseList } from "@/app/data/chapters";
import { stylesList } from "@/app/data/style";
import { shortenText } from "@/app/Utils/textUtils";
import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ChapterContext } from "@/app/context/ChapterContex";

const Favorites = () => {
  const router = useRouter();

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);

  if (!settingContext || !settingContext.objSetting || !chapterContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const { currentChapter, setCurrentChapter } = chapterContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const [favoriteList, setFavoriteList] = useState<number[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getFavoriteData = async () => {
      try {
        const result = await getStoreData("FAVORITE");
        if (result?.verseIndex) {
          if (Array.isArray(result?.verseIndex)) {
            setFavoriteList(result?.verseIndex);
          } else {
            setFavoriteList([]);
          }
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    };

    getFavoriteData();
  }, []);

  const handleRemoveFavorite = (item: number) => {
    const updated = favoriteList.filter((data) => data != item);

    storeData("FAVORITE", { verseIndex: updated });

    setFavoriteList(updated);
  };

  const handleViewFavorite = (index: number) => {
    setCurrentChapter(index);

    router.push("/view-chapter");
  };

  return (
    <View style={styles.container}>
      <Text
        allowFontScaling={false}
        style={{ ...stylesList.title, color: themeColors.primaryText }}
      >
        Favorite Verse List
      </Text>

      {!isLoading ? (
        (console.log("favoriteList", favoriteList),
        favoriteList.length > 0 ? (
          <View>
            <ScrollView
              style={{
                flex: 1,
                padding: 20,
                marginBottom: 20,
              }}
            >
              {favoriteList.map((item, index) => {
                const currentVerse = verseList[item];

                return (
                  <View
                    style={[
                      styles.card,
                      {
                        backgroundColor: themeColors.card,
                        marginBottom: 20,
                      },
                    ]}
                    key={index}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...stylesList.title,
                        color: themeColors.primaryText,
                        fontSize: 13,
                      }}
                    >
                      Chapter {currentVerse.chapter}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...stylesList.subtitle,
                        color: themeColors.primaryText,
                        fontSize: 13,
                      }}
                    >
                      Verse {currentVerse.verse}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...stylesList.subtitle,
                        color: themeColors.primaryText,
                        fontSize: 13,
                      }}
                    >
                      {shortenText(currentVerse.content, 50)}
                    </Text>
                    <View
                      style={{ flexDirection: "row", marginTop: 10, gap: 10 }}
                    >
                      <TouchableOpacity
                        onPress={() => handleRemoveFavorite(item)}
                      >
                        <Icon1
                          name="delete"
                          color={themeColors.primaryText}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleViewFavorite(item)}
                      >
                        <Icon
                          name="eye"
                          color={themeColors.primaryText}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View>
            <Text allowFontScaling={false}>No data.</Text>
          </View>
        ))
      ) : (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../../assets/animation/loading-list-animation.json")}
            autoPlay
            loop
            style={styles.loading}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    width: 350,
    height: 350,
    alignSelf: "center",
  },
  card: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "transparent",
  },
});

export default Favorites;
