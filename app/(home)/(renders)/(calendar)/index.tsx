import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { newMoon } from "../../../Utils/newMoonCalculation";
import COLORS from "@/app/constants/colors";
import LottieView from "lottie-react-native";
import { SettingContext } from "@/app/context/SettingContext";
import { feast as feastlList } from "../../../data/feastDateList";
import { convertDateFormatIntoString } from "../../../Utils/dateUtils";
import Icon from "react-native-vector-icons/Feather";
import { showToast } from "../../../Utils/toast";
import { getStoreData, storeData } from "../../../Utils/storage";
import { parseCalendarQr } from "../../../Utils/calendarQr";

const Calendar = () => {
  const dateList: { date: string; time: string; iso: string }[] = newMoon();
  const currentDate = new Date().getMonth();
  const settingContext = useContext(SettingContext);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNewMoonDates, setScannedNewMoonDates] = useState<
    { date: string; time: string }[] | null
  >(null);
  const [scannedFeastDates, setScannedFeastDates] = useState<
    { name: string; date: string }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMenu, setSelectedMenu] = useState<string>("New Moon");
  const [isFormatReminderVisible, setIsFormatReminderVisible] = useState(false);

  const themeColors =
    settingContext?.objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  useEffect(() => {
    let isActive = true;

    const loadScannedDates = async () => {
      const [newMoonDates, feastDates] = await Promise.all([
        getStoreData("CALENDAR_NEW_MOON"),
        getStoreData("CALENDAR_FEAST"),
      ]);
      if (!isActive) return;
      if (newMoonDates) setScannedNewMoonDates(newMoonDates);
      if (feastDates) setScannedFeastDates(feastDates);
    };

    void loadScannedDates();
    return () => {
      isActive = false;
    };
  }, []);

  const startScanning = async () => {
    try {
      const permission = cameraPermission?.granted
        ? cameraPermission
        : await requestCameraPermission();

      if (!permission.granted) {
        showToast({
          type: "error",
          title: "Camera Permission Required",
          message: "Allow camera access to scan a calendar QR code.",
        });
        return;
      }

      setIsScanning(true);
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to Open Camera",
        message:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!isScanning) return;
    setIsScanning(false);

    applyCalendarQr(data);
  };

  const applyCalendarQr = (data: string) => {
    console.log("Calendar QR content:", data);
    const scannedCalendar = parseCalendarQr(data);
    if (!scannedCalendar) {
      showToast({
        type: "error",
        title: "Invalid QR Code",
        message:
          "Use one format per QR: MM/DD/YYYY h:mmam (New Moon) or Feast of Passover MM/DD/YYYY.",
      });
      return;
    }

    if (scannedCalendar.type === "newMoon") {
      setScannedNewMoonDates(scannedCalendar.entries);
      void storeData("CALENDAR_NEW_MOON", scannedCalendar.entries);
      setSelectedMenu("New Moon");
    } else {
      setScannedFeastDates(scannedCalendar.entries);
      void storeData("CALENDAR_FEAST", scannedCalendar.entries);
      setSelectedMenu("Feast");
    }

    showToast({
      type: "success",
      title: "Calendar Updated",
      message: "The scanned dates are now displayed.",
    });
  };

  const uploadCalendarQr = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled) return;

      const [barcode] = await scanFromURLAsync(result.assets[0].uri, ["qr"]);
      if (!barcode) {
        showToast({
          type: "error",
          title: "Invalid QR Code",
          message: "No QR code was found in the selected image.",
        });
        return;
      }

      applyCalendarQr(barcode.data);
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to Read QR Image",
        message:
          error instanceof Error ? error.message : "Please try another image.",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedMenu]);

  const menuList = [
    {
      name: "New Moon",
      icon: (isActive: boolean) => (
        <Icon
          name="target"
          color={isActive ? COLORS.white : themeColors.primaryText}
          size={20}
        />
      ),
      description: `View monthly new moon dates to easily determine the exact time for observing the New Moon Sabbath.`,
    },
    {
      name: "Feast",
      icon: (isActive: boolean) => (
        <Icon
          name="feather"
          color={isActive ? COLORS.white : themeColors.primaryText}
          size={20}
        />
      ),
      description: `View annual biblical feast dates to easily determine the exact time for observing Alyon appointed festivals.`,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!settingContext) {
    return null;
  }

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        {cameraPermission?.granted ? (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <View style={styles.scannerHeader}>
              <TouchableOpacity
                style={styles.closeScanner}
                onPress={() => setIsScanning(false)}
              >
                <Icon name="x" color={COLORS.white} size={24} />
                <Text style={styles.scannerButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View pointerEvents="none" style={styles.scanFrame} />
            <View style={styles.scanInstructions}>
              <Text style={styles.scannerButtonText}>
                Scan a New Moon or Feast QR code
              </Text>
              <Text style={styles.scannerFormatText}>
                New Moon: 01/19/2026 4:00am
              </Text>
              <Text style={styles.scannerFormatText}>
                Feast: Feast of Passover 02/01/2026
              </Text>
              <Text style={styles.scannerFormatText}>
                Other text is ignored; include only one calendar type.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.permissionPrompt}>
            <Text
              style={[
                styles.subtitle,
                { color: themeColors.primaryText, marginBottom: 16 },
              ]}
            >
              Camera access is needed to scan a calendar QR code.
            </Text>
            <TouchableOpacity
              style={[
                styles.scanButton,
                { backgroundColor: themeColors.highlight },
              ]}
              onPress={startScanning}
            >
              <Text style={styles.scanButtonText}>Allow Camera Access</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsScanning(false)}
            >
              <Text style={[styles.title, { color: themeColors.primaryText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={isFormatReminderVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFormatReminderVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.formatReminder,
              styles.formatReminderModal,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.modalTitle, { color: themeColors.primaryText }]}
            >
              QR format reminder
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.formatText, { color: themeColors.secondaryText }]}
            >
              New Moon: 01/19/2026 4:00am
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.formatText, { color: themeColors.secondaryText }]}
            >
              Feast: Feast of Passover 02/01/2026
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.formatText,
                styles.formatReminderNote,
                { color: themeColors.secondaryText },
              ]}
            >
              Other text is ignored. Include one calendar type per QR; put
              multiple dates on separate lines.
            </Text>
            <TouchableOpacity
              style={[
                styles.modalAction,
                { backgroundColor: themeColors.highlight },
              ]}
              onPress={() => {
                setIsFormatReminderVisible(false);
                void startScanning();
              }}
            >
              <Icon name="camera" color={COLORS.white} size={18} />
              <Text style={styles.scanButtonText}>Scan with Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalAction,
                { backgroundColor: themeColors.highlight },
              ]}
              onPress={() => {
                setIsFormatReminderVisible(false);
                void uploadCalendarQr();
              }}
            >
              <Icon name="upload" color={COLORS.white} size={18} />
              <Text style={styles.scanButtonText}>Upload QR Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsFormatReminderVisible(false)}
            >
              <Text style={[styles.title, { color: themeColors.primaryText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            marginTop: 10,
          }}
        >
          {menuList.map((item, index) => {
            const isActive = selectedMenu === item.name;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedMenu(item.name)}
              >
                <View
                  style={[
                    styles.btnMenu,
                    {
                      backgroundColor: isActive
                        ? themeColors.highlight
                        : themeColors.card,
                    },
                  ]}
                >
                  {item.icon(isActive)}
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.title,
                      {
                        color: isActive
                          ? COLORS.white
                          : themeColors.primaryText,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.qrActions}>
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: themeColors.highlight }]}
          onPress={() => setIsFormatReminderVisible(true)}
        >
          <Icon name="camera" color={COLORS.white} size={18} />
          <Text style={styles.scanButtonText}>Scan or Upload QR</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", marginBottom: 20, alignItems: "center" }}>
        <Text
          allowFontScaling={false}
          style={[styles.title, { color: themeColors.primaryText }]}
        >
          {selectedMenu} Date List
        </Text>
        <Text
          allowFontScaling={false}
          style={[styles.subtitle, { color: themeColors.secondaryText }]}
        >
          {menuList[selectedMenu === "New Moon" ? 0 : 1].description}
        </Text>
      </View>

      {isLoading ? (
        <View
          style={{
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={require("../../../../assets/animation/loading-list-animation.json")}
            autoPlay
            loop
            style={styles.loading}
          />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {selectedMenu === "Feast"
            ? (scannedFeastDates
                ? scannedFeastDates.map((item) => ({
                    name: item.name,
                      dateLabel: convertDateFormatIntoString(item.date),
                    isCurrent: false,
                  }))
                : feastlList.map((item) => {
                    const date = item.dateStringFrom
                      ? item.dateStringFrom
                      : item.dateSting;
                    return {
                      name: item.name,
                      dateLabel: item.dateStringFrom
                        ? `${convertDateFormatIntoString(
                            item.dateStringFrom
                          )} - ${convertDateFormatIntoString(
                            item.dateStringTo
                          )}`
                        : convertDateFormatIntoString(item.dateSting),
                      isCurrent:
                        date &&
                        (parseInt(date.substring(5, 7)) === currentDate - 1
                          ? true
                          : false),
                    };
                  })
              ).map((item, index) => {
                  const isCurrentFeast = item.isCurrent;

                return (
                  <View
                    key={index}
                    style={[
                      styles.card,
                      {
                        backgroundColor: themeColors.card,
                        borderColor: themeColors.border,
                      },
                      isCurrentFeast && {
                        backgroundColor: themeColors.activeCard,
                        borderColor: themeColors.border,
                      },
                    ]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textDate,
                        { color: themeColors.primaryText },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textTime,
                        { color: themeColors.primaryText },
                      ]}
                    >
                      {item.dateLabel}
                    </Text>
                    {isCurrentFeast && (
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.textTime,
                          { color: themeColors.secondaryText },
                        ]}
                      >
                        (current new moon)
                      </Text>
                    )}
                  </View>
                );
              })
            : (scannedNewMoonDates
                ? scannedNewMoonDates.map((moon) => ({
                    ...moon,
                    date: convertDateFormatIntoString(moon.date),
                  }))
                : dateList
              ).map((moon, index) => (
                <View
                  key={index}
                  style={[
                    styles.card,
                    {
                      backgroundColor: themeColors.card,
                      borderColor: themeColors.border,
                    },
                    index === currentDate && {
                      backgroundColor: themeColors.activeCard,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.textDate,
                      { color: themeColors.primaryText },
                    ]}
                  >
                    {moon.date}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.textTime,
                      { color: themeColors.secondaryText },
                    ]}
                  >
                    {moon.time}
                  </Text>
                  {index === currentDate && (
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textTime,
                        { color: themeColors.secondaryText },
                      ]}
                    >
                      (current new moon)
                    </Text>
                  )}
                </View>
              ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 0,
    padding: 20,
  },
  btnMenu: {
    backgroundColor: "red",
    width: 150,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  scanButton: {
    alignSelf: "center",
    minHeight: 42,
    borderRadius: 22,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  qrActions: {
    alignItems: "center",
    marginBottom: 14,
  },
  scanButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  scannerHeader: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
  },
  closeScanner: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  scannerButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  scanFrame: {
    position: "absolute",
    width: 240,
    height: 240,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderRadius: 20,
    alignSelf: "center",
    top: "35%",
  },
  scanInstructions: {
    position: "absolute",
    alignSelf: "center",
    bottom: 40,
    gap: 4,
    paddingHorizontal: 20,
  },
  scannerFormatText: {
    color: COLORS.white,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    textAlign: "center",
  },
  formatReminder: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  formatReminderModal: {
    maxWidth: 420,
    padding: 20,
    gap: 8,
  },
  modalTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  formatReminderNote: {
    marginBottom: 8,
  },
  modalAction: {
    minHeight: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  formatTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  formatText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },
  permissionPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  cancelButton: {
    padding: 12,
    marginTop: 8,
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
  },
  textDate: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
  textTime: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  loading: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
});

export default Calendar;
