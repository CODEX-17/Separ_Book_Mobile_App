import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingContext } from "./context/SettingContext";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "./constants/colors";

const Setting = () => {
  const router = useRouter();
  const settingContext = useContext(SettingContext);

  if (!settingContext) return false;

  const { objSetting, handleChangeSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const handleChangeFontSize = (value: number) => {
    if (isNaN(value) || value < 10 || value > 100) return;

    const updatedSettings = { ...objSetting, fontSize: value };
    handleChangeSetting(updatedSettings);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { fontSize: 20, color: themeColors.primaryText },
          ]}
        >
          General Setting
        </Text>
      </View>
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={[
              styles.title,
              { fontSize: 18, color: themeColors.primaryText },
            ]}
          >
            Font Size
          </Text>
          <TouchableOpacity
            onPress={() => handleChangeFontSize(objSetting.fontSize + 1)}
          >
            <Icon name="plus" color="#003092" size={25} />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themeColors.card,
                color: themeColors.primaryText,
              },
            ]}
            onChangeText={(text) => {
              if (text === "") return handleChangeFontSize(10);
              const parsedValue = parseInt(text, 10);
              if (!isNaN(parsedValue)) handleChangeFontSize(parsedValue);
            }}
            value={objSetting.fontSize.toString()}
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => handleChangeFontSize(objSetting.fontSize - 1)}
          >
            <Icon name="minus" color="#003092" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    height: 40,
    width: "30%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: "#343434",
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
  },
  title: {
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
});

export default Setting;
