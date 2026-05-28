import React, { use, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SettingContext } from "./context/SettingContext";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "./constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoreData, storeData } from "./Utils/storage";
import { Profile } from "./types/interfaces";
import { RankingTypes } from "./types/type";
import { showToast } from "./Utils/toast";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = () => {
  const router = useRouter();
  const settingContext = useContext(SettingContext);
  const [modalVisible, setModalVisible] = useState<number>(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fonstSizeInput, setFontSizeInput] = useState<number>(0);
  const [fontStyleInput, setFontStyleInput] =
    useState<string>("Poppins-Regular");
  const [genderInput, setGenderInput] = useState<"male" | "female">("male");

  const fontOptions = [
    { label: "Poppins Regular", value: "Poppins-Regular" },
    { label: "Poppins Light", value: "Poppins-Light" },
    { label: "Poppins Bold", value: "Poppins-Bold" },
    { label: "Sans", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Monospace", value: "monospace" },
  ];

  if (!settingContext) return false;

  const { objSetting, handleChangeSetting } = settingContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const handleSaveChangeSetting = () => {
    if (userName !== "" && userName !== null) {
      storeData("PROFILE", {
        name: userName,
        gender: genderInput,
        rank: profile?.rank || ("Newcomer" as RankingTypes),
        level: profile?.level || 1,
      });
    } else {
      showToast({
        type: "error",
        title: "Username Required",
        message: "Please enter a valid username.",
      });
      return;
    }

    if (isNaN(fonstSizeInput) || fonstSizeInput < 10 || fonstSizeInput > 100)
      return;
    const updatedSettings = {
      ...objSetting,
      fontSize: fonstSizeInput,
      fontStyle: fontStyleInput,
    };
    handleChangeSetting(updatedSettings);

    showToast({
      type: "success",
      title: "Settings Saved",
      message: "Your settings have been successfully saved.",
    });
  };

  useEffect(() => {
    if (objSetting) {
      setFontSizeInput(objSetting.fontSize);
      setFontStyleInput(objSetting.fontStyle || "Poppins-Regular");
    }

    const getData = async () => {
      const profileData = await getStoreData("PROFILE");

      if (profileData) {
        setProfile(profileData);
        setUserName(profileData.name);
        setGenderInput(profileData.gender || "male");
      } else {
        return null;
      }
    };
    getData();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <SafeAreaView>
        <View style={styles.content}>
          <View style={[styles.modal, { opacity: modalVisible }]}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: themeColors.background,
                  boxShadow:
                    objSetting.theme === "dark"
                      ? "0 4px 8px rgba(235, 235, 235, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 20,
                  textAlign: "center",
                  fontFamily: "Poppins-Bold",
                  color: themeColors.primaryText,
                }}
              >
                Are you sure you want to reset all data?
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 12,
                  marginBottom: 20,
                  textAlign: "center",
                  fontFamily: "Poppins-Regular",
                  color: themeColors.primaryText,
                }}
              >
                This will permanently delete your Favorite Verses, Settings, and
                all saved progress.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "50%",
                    backgroundColor: "#ccc7c7ff",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    AsyncStorage.multiRemove(["FAVORITE", "SETTING"]);
                    setModalVisible(0);
                    showToast({
                      type: "success",
                      title: "Reset Successful",
                      message: "Your settings have been successfully reset.",
                    });
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: "50%",
                    backgroundColor: "#319166ff",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => setModalVisible(0)}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.display}>
            <View style={styles.header}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  {
                    fontSize: 20,
                    marginBottom: 10,
                    color: themeColors.primaryText,
                    fontFamily: "Poppins-Bold",
                  },
                ]}
              >
                General Setting
              </Text>
            </View>

            {/* Username */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                marginTop: 20,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  { fontSize: 16, color: themeColors.primaryText },
                ]}
              >
                Username
              </Text>

              <TextInput
                allowFontScaling={false}
                style={[
                  styles.input,
                  {
                    width: "60%",
                    backgroundColor: themeColors.card,
                    color: themeColors.primaryText,
                  },
                ]}
                onChangeText={(text) => setUserName(text)}
                value={userName || ""}
              />
            </View>

            {/* Gender */}
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  {
                    fontSize: 16,
                    color: themeColors.primaryText,
                    textAlign: "left",
                  },
                ]}
              >
                Gender
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setGenderInput("male")}
                  style={[
                    styles.genderButton,
                    {
                      backgroundColor:
                        genderInput === "male" ? "#319166ff" : themeColors.card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        genderInput === "male"
                          ? "#fff"
                          : themeColors.primaryText,
                      fontFamily: "Poppins-Regular",
                      fontSize: 12,
                    }}
                  >
                    Male (Achi)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setGenderInput("female")}
                  style={[
                    styles.genderButton,
                    {
                      backgroundColor:
                        genderInput === "female"
                          ? "#319166ff"
                          : themeColors.card,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        genderInput === "female"
                          ? "#fff"
                          : themeColors.primaryText,
                      fontFamily: "Poppins-Regular",
                      fontSize: 12,
                    }}
                  >
                    Female (Achot)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FontSize */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                marginTop: 20,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  { fontSize: 16, color: themeColors.primaryText },
                ]}
              >
                Font Size
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setFontSizeInput(fonstSizeInput + 1)}
                >
                  <Icon name="plus" color="#003092" size={20} />
                </TouchableOpacity>
                <TextInput
                  allowFontScaling={false}
                  style={[
                    styles.input,
                    {
                      backgroundColor: themeColors.card,
                      color: themeColors.primaryText,
                    },
                  ]}
                  onChangeText={(text) => {
                    if (text === "") return setFontSizeInput(10);
                    const parsedValue = parseInt(text, 10);
                    if (!isNaN(parsedValue)) setFontSizeInput(parsedValue);
                  }}
                  value={fonstSizeInput.toString()}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={() => setFontSizeInput(fonstSizeInput - 1)}
                >
                  <Icon name="minus" color="#003092" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Font Style */}
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.title,
                  {
                    fontSize: 16,
                    color: themeColors.primaryText,
                    textAlign: "left",
                  },
                ]}
              >
                Font Style
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {fontOptions.map((option) => {
                  const isActive = fontStyleInput === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFontStyleInput(option.value)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: isActive
                          ? "#319166ff"
                          : themeColors.card,
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? "#fff" : themeColors.primaryText,
                          fontFamily: option.value,
                          fontSize: 12,
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Save Changes Button */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                marginTop: 40,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { height: 50, backgroundColor: "#319166ff" },
                ]}
                onPress={() => handleSaveChangeSetting()}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Reset All Data Button */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 5,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setModalVisible(1)}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Reset All Data
                </Text>
              </TouchableOpacity>
            </View>
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
    position: "relative",
    backgroundColor: "transparent",
    padding: 20,
  },
  content: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  modal: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "80%",
    height: "auto",
    alignSelf: "center",
    zIndex: 10,
    borderRadius: 10,
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    width: "100%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#fb8282ff",
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
  display: {
    height: "90%",
    alignItems: "center",
  },
  input: {
    height: 35,
    width: "50%",
    color: "#343434",
    borderRadius: 10,
    fontSize: 13,
    textAlign: "center",
  },
  title: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 30,
    textAlign: "center",
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  verse: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 15,
    textAlign: "center",
  },
});

export default Setting;
