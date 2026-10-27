import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import COLORS from "@/app/constants/colors";
import { FONTS } from "@/app/constants/fontStyle";
import { SettingContext } from "@/app/context/SettingContext";

const ANNOUNCEMENTS_URL = "https://ataryahu-website.vercel.app/";

const Announcements = () => {
  const settingContext = useContext(SettingContext);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!settingContext) return null;

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <WebView
        key={loadAttempt}
        source={{ uri: ANNOUNCEMENTS_URL }}
        style={styles.webView}
        onLoadStart={() => {
          setHasLoadError(false);
          setIsLoading(true);
        }}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setHasLoadError(true)}
        onHttpError={() => setHasLoadError(true)}
      />
      {isLoading && !hasLoadError && (
        <View
          style={[styles.message, { backgroundColor: themeColors.background }]}
        >
          <ActivityIndicator color={themeColors.highlight} />
          <Text
            style={[styles.messageText, { color: themeColors.primaryText }]}
          >
            Loading announcements...
          </Text>
        </View>
      )}
      {hasLoadError && (
        <View
          style={[styles.message, { backgroundColor: themeColors.background }]}
        >
          <Text
            style={[
              styles.messageText,
              { color: themeColors.primaryText, textAlign: "center" },
            ]}
          >
            Hindi ma-load ang Announcements. Siguraduhing naka-on ang internet
            para ma-access ang website.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setHasLoadError(false);
              setIsLoading(true);
              setLoadAttempt((attempt) => attempt + 1);
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Subukan muli</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  message: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#0943AF",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
});

export default Announcements;
