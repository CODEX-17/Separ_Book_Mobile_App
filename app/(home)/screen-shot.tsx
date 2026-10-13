import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Profile, Verse } from "../types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import { showToast } from "../Utils/toast";
import { getStoreData, storeData } from "../Utils/storage";
import { findingRankStatus, rankMapping } from "../Utils/rankUtils";

interface ScreenShotProps {
  selectedVerse: Verse | null;
  setIsShowPreview: (value: boolean) => void;
  autoSaveRequestId?: number | null;
  onAutoSaveHandled?: () => void;
}

const ScreenShot: React.FC<ScreenShotProps> = ({
  selectedVerse,
  setIsShowPreview,
  autoSaveRequestId = null,
  onAutoSaveHandled,
}) => {
  const imageRef = useRef(null);
  const processedAutoSaveRequestId = useRef(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [logoLoadedFor, setLogoLoadedFor] = useState("");
  const [rankLoadedFor, setRankLoadedFor] = useState("");

  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const autoCaptureFontSize = useMemo(() => {
    if (!selectedVerse) return 18;

    const contentLength = selectedVerse.content.trim().length;
    const baseSize = 22;
    const reduction = Math.floor(contentLength / 120);

    return Math.max(12, baseSize - reduction);
  }, [selectedVerse]);

  const rankStatus = findingRankStatus(profile?.level);
  const rankImagePath = rankMapping(rankStatus);
  const captureAssetKey = `${objSetting.theme}:${rankStatus}`;
  const isCaptureAssetsReady =
    logoLoadedFor === captureAssetKey && rankLoadedFor === captureAssetKey;

  const ImagePath =
    objSetting.theme === "dark"
      ? require("../../assets/images/white-logo-icon.png")
      : require("../../assets/images/logo-icon.png");

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
    setIsCapturing(true);
    setImageUri(null);

    if (!selectedVerse || !isCaptureAssetsReady) {
      return () => {
        isMounted = false;
      };
    }

    const convertingVerseIntoImage = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

        if (!selectedVerse || !imageRef.current || !isMounted) return;

        const localUri = await captureRef(imageRef, {
          quality: 1,
          format: "png",
        });

        if (localUri && isMounted) {
          setImageUri(localUri);
        }
      } catch (error) {
        console.error("Error capturing image:", error);
        if (isMounted) {
          showToast({
            type: "error",
            title: "Capture failed",
            message: "The verse image could not be created. Please try again.",
          });
        }
      } finally {
        if (isMounted) setIsCapturing(false);
      }
    };

    convertingVerseIntoImage();

    return () => {
      isMounted = false;
    };
  }, [selectedVerse, profile, isCaptureAssetsReady]);

  const onSaveImageAsync = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      if (!imageUri) {
        showToast({
          type: "error",
          title: "Image not ready",
          message: "Please wait for the verse image to finish preparing.",
        });
        return;
      }

      const MediaLibrary = await import("expo-media-library/legacy");
      const { status } = await MediaLibrary.requestPermissionsAsync(true);

      if (status !== "granted") {
        showToast({
          type: "error",
          title: "Permission required",
          message: "Allow photo access to save the verse image.",
        });
        return;
      }

      await MediaLibrary.saveToLibraryAsync(imageUri);
      Alert.alert(
        "Image saved",
        "The verse image has been saved to your gallery. To share it, tap Share now and choose Facebook or Messenger from the Android share menu.",
        [
          { text: "Not now", style: "cancel" },
          {
            text: "Share now",
            onPress: () => {
              void handleShare();
            },
          },
        ],
      );
    } catch (error) {
      console.error("Error saving verse image:", error);
      showToast({
        type: "error",
        title: "Save failed",
        message: "The verse image could not be saved. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (
      autoSaveRequestId === null ||
      autoSaveRequestId === processedAutoSaveRequestId.current ||
      !imageUri ||
      isCapturing
    ) {
      return;
    }

    processedAutoSaveRequestId.current = autoSaveRequestId;
    void onSaveImageAsync();
    onAutoSaveHandled?.();
  }, [autoSaveRequestId, imageUri, isCapturing]);

  const handleShare = async () => {
    if (isSharing) return;

    if (!imageUri) {
      showToast({
        type: "error",
        title: "Image not ready",
        message: "Please wait for the verse image to finish preparing.",
      });
      return;
    }

    try {
      setIsSharing(true);
      if (!(await Sharing.isAvailableAsync())) {
        showToast({
          type: "error",
          title: "Sharing unavailable",
          message: "Sharing is not available on this device.",
        });
        return;
      }

      await Sharing.shareAsync(imageUri, {
        dialogTitle: "Share Verse Image",
        mimeType: "image/png",
      });

      const storedProfile = await getStoreData("PROFILE");
      const currentProfile = storedProfile ?? profile;
      if (!currentProfile) {
        throw new Error("User profile is unavailable; share points were not saved.");
      }

      const updatedProfile = {
        ...currentProfile,
        level: currentProfile.level + 2,
      };
      await storeData("PROFILE", updatedProfile);
      setProfile(updatedProfile);

      showToast({
        type: "success",
        title: "Verse shared",
        message: "The verse image was shared. You earned 2 points!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      showToast({
        type: "error",
        title: "Share failed",
        message: "The verse image could not be shared. Please try again.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedVerse) return null;

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
      <ScrollView
        style={styles.previewScroll}
        contentContainerStyle={styles.previewScrollContent}
        showsVerticalScrollIndicator
      >
        <View
          style={[styles.display, { backgroundColor: themeColors.background }]}
          ref={imageRef}
          collapsable={false}
        >
          <View style={styles.verseHeading}>
            <Text
              allowFontScaling={false}
              style={[styles.chapter, { color: themeColors.primaryText }]}
            >{`Chapter ${selectedVerse.chapter}`}</Text>
            <Text
              allowFontScaling={false}
              style={[styles.verse, { color: themeColors.secondaryText }]}
            >{`Verse ${selectedVerse.verse}`}</Text>
          </View>

          <Text
            allowFontScaling={false}
            style={[
              styles.contentText,
              {
                color: themeColors.primaryText,
                fontSize: autoCaptureFontSize,
                lineHeight: autoCaptureFontSize + 8,
              },
            ]}
          >
            {selectedVerse.content}
          </Text>
          <View style={styles.footer}>
            <Image
              source={ImagePath}
              style={styles.logo}
              onLoad={() => setLogoLoadedFor(captureAssetKey)}
            />
            <Text
              allowFontScaling={false}
              style={[styles.attribution, { color: themeColors.primaryText }]}
            >
              {profile ? `Captured by: ${profile.name}` : "- Anonymous"}
            </Text>
            <View style={styles.rankRow}>
              <Image
                style={styles.image}
                source={rankImagePath}
                onLoad={() => setRankLoadedFor(captureAssetKey)}
              />
              <View style={styles.rankBadge}>
                <Text allowFontScaling={false} style={styles.rankText}>
                  {`Lvl. ${profile?.level ?? 0} - ${rankStatus}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => setIsShowPreview(false)}>
          <Icon name="chevron-left" color={themeColors.primaryText} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSaveImageAsync}
          disabled={!imageUri || isCapturing || isSaving}
          accessibilityLabel="Save verse image"
        >
          <Icon
            name={isSaving ? "loader" : "download"}
            color={
              imageUri && !isCapturing && !isSaving
                ? themeColors.primaryText
                : themeColors.secondaryText
            }
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          disabled={!imageUri || isCapturing || isSharing}
          accessibilityLabel="Share verse image"
        >
          <Icon
            name={isSharing ? "loader" : "external-link"}
            color={
              imageUri && !isCapturing && !isSharing
                ? themeColors.primaryText
                : themeColors.secondaryText
            }
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
    textAlign: "center",
    width: "100%",
  },
  image: {
    height: 20,
    width: 20,
  },
  previewScroll: {
    flex: 1,
    width: "100%",
  },
  previewScrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  display: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    maxWidth: 360,
    minHeight: 640,
    flexShrink: 0,
    padding: 24,
    borderRadius: 24,
  },
  verseHeading: {
    alignItems: "center",
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
  attribution: {
    fontFamily: "Poppins-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  rankRow: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  rankBadge: {
    backgroundColor: COLORS.yellow,
    borderRadius: 5,
    paddingHorizontal: 5,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 8,
    lineHeight: 12,
    textAlign: "center",
  },
  menu: {
    flexDirection: "row",
    flexShrink: 0,
    height: 48,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: 30,
    paddingRight: 30,
  },
});

export default ScreenShot;
