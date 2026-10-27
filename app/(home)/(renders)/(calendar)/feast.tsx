import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SettingContext } from "../../../context/SettingContext";
import COLORS from "../../../constants/colors";
import { feast as feastlList } from "../../../data/feastDateList";
import { convertDateFormatIntoString } from "../../../Utils/dateUtils";

const Feast = () => {
  const settingContext = useContext(SettingContext);
  if (!settingContext) return null;

  const themeColors =
    settingContext.objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const getFeastIcon = (name: string): keyof typeof MaterialIcons.glyphMap => {
    const normalizedName = name.toLowerCase();
    if (normalizedName.includes("trumpet")) return "music-note";
    if (normalizedName.includes("atonement")) return "favorite";
    if (normalizedName.includes("tabernacles")) return "home";
    if (normalizedName.includes("passover")) return "wb-sunny";
    if (normalizedName.includes("harvest") || normalizedName.includes("weeks"))
      return "card-giftcard";
    return "celebration";
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {feastlList.map((item) => (
          <View
            key={item.name}
            style={[
              styles.feastCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View
              style={[styles.feastIcon, { backgroundColor: themeColors.primary }]}
            >
              <MaterialIcons
                name={getFeastIcon(item.name)}
                size={24}
                color={COLORS.white}
              />
            </View>
            <View style={styles.feastDetails}>
              <Text
                allowFontScaling={false}
                style={[styles.feastName, { color: themeColors.primaryText }]}
              >
                {item.name}
              </Text>
              <View style={styles.dateRow}>
                <MaterialIcons
                  name="event"
                  size={17}
                  color={themeColors.primary}
                />
                <Text
                  allowFontScaling={false}
                  style={[styles.feastDate, { color: themeColors.secondaryText }]}
                >
                  {item.date
                    ? convertDateFormatIntoString(item.dateSting)
                    : `${convertDateFormatIntoString(item.dateStringFrom)} - ${convertDateFormatIntoString(item.dateStringTo)}`}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  feastCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  feastIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  feastDetails: {
    flex: 1,
    gap: 5,
  },
  feastName: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feastDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
});

export default Feast;
