import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "../context/SettingContext";
import COLORS from "../constants/colors";
import { getStoreData, storeData } from "../Utils/storage";

const FEATURES = [
  "Fixed verse text and other verses.",
  "Updated new moon and feast dates.",
  "Added notes for individual verses.",
  "Added definitions for terms.",
  "Earn 2 points when sharing a verse.",
  "Highlight verses to make important passages easy to find.",
  "Cleaner, easier-to-use navigation buttons while viewing verses.",
  "Instructions for sharing verses on social media.",
  "A slider to adjust verse font size.",
];

const AnnouncementModal = () => {
  const settingContext = useContext(SettingContext);
  const [visible, setVisible] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAnnouncementPreference = async () => {
      const dismissed = await getStoreData("ANNOUNCEMENT_DISMISSED_V1");
      if (isMounted && !dismissed) {
        setVisible(true);
      }
    };

    checkAnnouncementPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!settingContext) return null;

  const themeColors =
    settingContext.objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const handleClose = async () => {
    if (doNotShowAgain) {
      await storeData("ANNOUNCEMENT_DISMISSED_V1", true);
    }
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.heading}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Icon name="star" size={22} color={COLORS.white} />
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.title, { color: themeColors.primaryText }]}
            >
              What’s new
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.subtitle, { color: themeColors.secondaryText }]}
            >
              Check out the latest updates
            </Text>
          </View>

          <ScrollView
            style={styles.featuresList}
            showsVerticalScrollIndicator={false}
          >
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <Icon
                  name="check-circle"
                  size={19}
                  color={themeColors.primary}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.featureText,
                    { color: themeColors.primaryText },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityState={{ checked: doNotShowAgain }}
            onPress={() => setDoNotShowAgain((checked) => !checked)}
            style={styles.preferenceRow}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: themeColors.primary,
                  backgroundColor: doNotShowAgain
                    ? themeColors.primary
                    : "transparent",
                },
              ]}
            >
              {doNotShowAgain && (
                <Icon name="check" size={14} color={COLORS.white} />
              )}
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.preferenceText, { color: themeColors.primaryText }]}
            >
              Don’t show this again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleClose}
            style={[
              styles.doneButton,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Text allowFontScaling={false} style={styles.doneButtonText}>
              Got it
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
  },
  heading: {
    alignItems: "center",
    marginBottom: 18,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginTop: 2,
  },
  featuresList: {
    flexShrink: 1,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },
  featureText: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  preferenceText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  doneButton: {
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  doneButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
});

export default AnnouncementModal;
