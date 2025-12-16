import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Verse } from "../types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";

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

  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  if (status === null) {
    requestPermission();
  }

  if (!selectedVerse) return null;

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
      <View style={styles.display} ref={imageRef} collapsable={false}>
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
