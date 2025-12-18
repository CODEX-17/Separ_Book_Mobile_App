import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Profile, Verse } from "../types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import { showToast } from "../Utils/toast";
import { getStoreData } from "../Utils/storage";

interface ScreenShotProps {
  selectedVerse: Verse | null;
  setIsShowPreview: (value: boolean) => void;
}

const ScreenShot: React.FC<ScreenShotProps> = ({
  selectedVerse,
  setIsShowPreview,
}) => {
  const imageRef = useRef(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [profile, setProfile] = useState<Profile | null>(null);

  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const ImagePath =
    objSetting.theme === "dark"
      ? require("../../assets/images/white-logo-icon.png")
      : require("../../assets/images/logo-icon.png");

  if (status === null) {
    requestPermission();
  }

  if (!selectedVerse) return null;

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const result = await getStoreData("PROFILE");

        if (result) {
          setProfile(result);
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    getProfileData();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const convertingVerseIntoImage = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!imageRef.current || !isMounted) return;

        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
          format: "png",
        });

        if (localUri && isMounted) {
          setImageUri(localUri);
          console.log("Image captured successfully!");
        }
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    };

    convertingVerseIntoImage();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSaveImageAsync = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Permission denied");
        return;
      }

      if (!imageUri) {
        alert("No image available to save.");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(imageUri);
      showToast({
        type: "success",
        title: "Image Saved",
        message: "The verse image has been saved to your gallery.",
      });
      ToastAndroid.show("Saved!", ToastAndroid.SHORT);
    } catch (e) {
      console.log(e);
    }
  };

  const handleShare = async () => {
    if (!imageUri) {
      alert("No image available to share.");
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing not available");
      return;
    }

    try {
      await Sharing.shareAsync(imageUri, {
        dialogTitle: "Share Verse Image",
        mimeType: "image/png",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
          boxShadow:
            objSetting.theme === "dark"
              ? "0 4px 8px rgba(235, 235, 235, 0.2)"
              : "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      ]}
    >
      <View
        style={[styles.display, { backgroundColor: themeColors.background }]}
        ref={imageRef}
        collapsable={false}
      >
        <View style={{ flexDirection: "column" }}>
          <Text
            allowFontScaling={false}
            style={[styles.chapter, { color: themeColors.primaryText }]}
          >{`Chapter ${selectedVerse?.chapter}`}</Text>
          <Text
            allowFontScaling={false}
            style={[styles.verse, { color: themeColors.secondaryText }]}
          >{`Verse ${selectedVerse?.verse}`}</Text>
        </View>

        <Text
          allowFontScaling={false}
          style={[styles.contentText, { color: themeColors.primaryText }]}
        >
          {selectedVerse?.content}
        </Text>
        <View style={{ width: "100%" }}>
          <Image
            source={ImagePath}
            style={{
              width: 100,
              height: 60,
              resizeMode: "contain",
            }}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.contentText,
              {
                color: themeColors.primaryText,
                fontSize: 8,
                fontFamily: "Poppins-Bold",
              },
            ]}
          >
            {profile ? `Captured by: ${profile.name}` : "- Anonymous"}
          </Text>
        </View>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => setIsShowPreview(false)}>
          <Icon name="chevron-left" color={themeColors.primaryText} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSaveImageAsync}>
          <Icon name="download" color={themeColors.primaryText} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icon
            name="external-link"
            color={themeColors.primaryText}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 1,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  chapter: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 30,
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
    fontSize: 15,
    textAlign: "center",
  },
  displayContent: {
    height: "79%",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  display: {
    flex: 9,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  menu: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingLeft: 30,
    paddingRight: 30,
  },
});

export default ScreenShot;
