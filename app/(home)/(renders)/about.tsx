import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "../../context/SettingContext";
import COLORS from "../../constants/colors";
import { APP_FEATURES } from "../../data/appFeatures";

const FAQ_ITEMS = [
  {
    icon: "trending-up",
    question: "How do I earn levels?",
    questionTl: "Paano ako makakakuha ng level?",
    answer:
      "Spend at least 20 seconds reading a verse in Chapters to earn 1 level. Each verse can reward you once every 12 hours.",
    answerTl:
      "Magbasa ng isang talata sa Chapters nang hindi bababa sa 20 segundo para makakuha ng 1 level. Maaari kang makakuha ulit ng reward sa parehong talata pagkalipas ng 12 oras.",
  },
  {
    icon: "share-2",
    question: "Can I earn levels by sharing a verse?",
    questionTl: "Makakakuha ba ako ng level sa pag-share ng talata?",
    answer:
      "Yes. Share a verse image to earn 2 levels when the share is eligible. The same verse can earn a share reward again after 12 hours, and you can earn rewards from up to 10 shares per day.",
    answerTl:
      "Oo. Mag-share ng larawan ng talata para makakuha ng 2 levels kung kwalipikado ang share. Maaari kang makakuha ulit ng reward sa parehong talata pagkalipas ng 12 oras. Hanggang 10 share rewards lang ang puwede mong makuha bawat araw.",
  },
  {
    icon: "clock",
    question: "Why didn’t I receive a share reward?",
    questionTl: "Bakit wala akong nakuhang reward sa pag-share?",
    answer:
      "The verse may still be within its 12-hour cooldown, or you may have already earned rewards from 10 shares today. Saving an image without sharing it does not count as a share reward.",
    answerTl:
      "Maaaring hindi pa lumilipas ang 12 oras mula nang huli kang nakakuha ng reward sa talatang iyon, o nakakuha ka na ng reward mula sa 10 shares ngayong araw. Hindi binibilang na share ang pag-save lang ng larawan.",
  },
  {
    icon: "award",
    question: "How do I improve my rank?",
    questionTl: "Paano tataas ang rank ko?",
    answer:
      "Keep earning levels by reading verses and sharing eligible verse images. Your rank increases automatically as your total level reaches the rank milestones.",
    answerTl:
      "Patuloy na mag-ipon ng levels sa pagbabasa ng mga talata at pag-share ng mga kwalipikadong larawan ng talata. Awtomatikong tataas ang rank mo kapag naabot ng kabuuang level mo ang mga itinakdang antas.",
  },
  {
    icon: "globe",
    question: "Where can I find app updates and resources?",
    questionTl: "Saan ko makikita ang mga update at iba pang resources ng app?",
    answer:
      "Open Website from the menu to visit the app’s website and find the latest updates and available resources.",
    answerTl:
      "Piliin ang Website sa menu para bisitahin ang website ng app at makita ang pinakabagong mga update at available na resources.",
  },
];

const FACEBOOK_PAGES = [
  {
    name: "Tribo at Aryahu Farm",
    url: "https://www.facebook.com/triboataryahufarm",
  },
  {
    name: "Yahwism Tribe",
    url: "https://www.facebook.com/yahwismtribe",
  },
];

const About = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const settingContext = useContext(SettingContext);

  if (!settingContext) return null;

  const { objSetting } = settingContext;
  const themeColors =
    objSetting.theme === "dark" ? COLORS.dark : COLORS.light;
  const logoSource =
    objSetting.theme === "dark"
      ? require("../../../assets/images/white-logo-icon.png")
      : require("../../../assets/images/logo-icon.png");

  const handleReportBug = async () => {
    const facebookUrl = "https://www.facebook.com/rumar.pamparo";

    try {
      await Linking.openURL(facebookUrl);
    } catch (error) {
      console.error("Unable to open Facebook bug-report page:", error);
      Alert.alert(
        "Unable to open Facebook",
        "Please try again or open facebook.com/rumar.pamparo manually.",
      );
    }
  };

  const handleOpenFacebookPage = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Unable to open Facebook page:", error);
      Alert.alert(
        "Unable to open Facebook",
        "Please try again or open the Facebook page in your browser.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.brandCard,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="View updated features"
            onPress={() => setFeaturesVisible(true)}
            style={[
              styles.featuresButton,
              { backgroundColor: themeColors.activeCard },
            ]}
          >
            <Icon name="star" size={19} color={themeColors.primary} />
          </TouchableOpacity>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <Text
            allowFontScaling={false}
            style={[styles.appName, { color: themeColors.primaryText }]}
          >
            Separ Book
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.tagline, { color: themeColors.secondaryText }]}
          >
            Your companion for reading, reflection, and remembrance.
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.taglineTranslation,
              { color: themeColors.secondaryText },
            ]}
          >
            Kasama mo sa pagbabasa, pagninilay, at pag-alala.
          </Text>
        </View>

      <View style={styles.sectionHeading}>
        <View
          style={[
            styles.sectionIcon,
            { backgroundColor: themeColors.primary },
          ]}
        >
          <Icon name="help-circle" size={19} color={COLORS.white} />
        </View>
        <View>
          <Text
            allowFontScaling={false}
            style={[styles.sectionTitle, { color: themeColors.primaryText }]}
          >
            Frequently asked questions
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.sectionTranslation,
              { color: themeColors.secondaryText },
            ]}
          >
            Mga madalas itanong
          </Text>
        </View>
      </View>

      {FAQ_ITEMS.map((item, index) => {
        const isExpanded = expandedQuestion === index;

        return (
          <View
            key={item.question}
            style={[
              styles.faqCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              onPress={() =>
                setExpandedQuestion(isExpanded ? null : index)
              }
              style={styles.questionRow}
            >
              <View
                style={[
                  styles.questionIcon,
                  { backgroundColor: themeColors.activeCard },
                ]}
              >
                <Icon
                  name={item.icon}
                  size={17}
                  color={themeColors.primary}
                />
              </View>
              <Text
                allowFontScaling={false}
                style={[styles.question, { color: themeColors.primaryText }]}
              >
                {item.question}
                {"\n"}
                <Text style={styles.questionTranslation}>{item.questionTl}</Text>
              </Text>
              <Icon
                name={isExpanded ? "minus" : "plus"}
                size={18}
                color={themeColors.primary}
              />
            </TouchableOpacity>
            {isExpanded && (
              <Text
                allowFontScaling={false}
                style={[
                  styles.answer,
                  { color: themeColors.secondaryText },
                ]}
              >
                {item.answer}
                {"\n\n"}
                <Text style={styles.answerTranslation}>{item.answerTl}</Text>
              </Text>
            )}
          </View>
        );
      })}
      <View style={[styles.visitUsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <View style={styles.visitUsHeading}>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Icon name="users" size={18} color={COLORS.white} />
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[styles.sectionTitle, { color: themeColors.primaryText }]}
            >
              Visit Us
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.sectionTranslation,
                { color: themeColors.secondaryText },
              ]}
            >
              Bisitahin kami
            </Text>
          </View>
        </View>
        {FACEBOOK_PAGES.map((page) => (
          <TouchableOpacity
            key={page.url}
            accessibilityRole="link"
            onPress={() => void handleOpenFacebookPage(page.url)}
            style={[
              styles.facebookLink,
              { backgroundColor: themeColors.activeCard },
            ]}
          >
            <FontAwesome name="facebook-square" size={24} color="#1877F2" />
            <Text
              allowFontScaling={false}
              style={[styles.facebookLinkText, { color: themeColors.primaryText }]}
            >
              {page.name}
            </Text>
            <Icon
              name="external-link"
              size={17}
              color={themeColors.secondaryText}
            />
          </TouchableOpacity>
        ))}
      </View>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleReportBug}
          style={[
            styles.reportBugCard,
            { backgroundColor: themeColors.primary },
          ]}
        >
          <View style={styles.reportBugIcon}>
            <Icon name="alert-circle" size={21} color={themeColors.primary} />
          </View>
          <View style={styles.reportBugTextContainer}>
            <Text allowFontScaling={false} style={styles.reportBugTitle}>
              Report a Bug
            </Text>
            <Text allowFontScaling={false} style={styles.reportBugTranslation}>
              Mag-ulat ng Problema
            </Text>
            <Text allowFontScaling={false} style={styles.reportBugHint}>
              Contact us on Facebook · I-message kami sa Facebook
            </Text>
          </View>
          <Icon name="external-link" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={featuresVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFeaturesVisible(false)}
      >
        <View style={styles.featuresOverlay}>
          <View
            style={[
              styles.featuresCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.featuresHeader}>
              <View
                style={[
                  styles.featuresHeaderIcon,
                  { backgroundColor: themeColors.primary },
                ]}
              >
                <Icon name="star" size={19} color={COLORS.white} />
              </View>
              <View style={styles.featuresHeaderText}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.featuresTitle,
                    { color: themeColors.primaryText },
                  ]}
                >
                  What’s New
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.featuresSubtitle,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  Mga bagong feature
                </Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close updated features"
                onPress={() => setFeaturesVisible(false)}
                style={styles.closeFeaturesButton}
              >
                <Icon name="x" size={20} color={themeColors.secondaryText} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.featuresList}
              showsVerticalScrollIndicator={false}
            >
              {APP_FEATURES.map((feature) => (
                <View key={feature} style={styles.featureRow}>
                  <Icon
                    name="check-circle"
                    size={17}
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
              accessibilityRole="button"
              onPress={() => setFeaturesVisible(false)}
              style={[
                styles.closeFeaturesAction,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Text style={styles.closeFeaturesText}>Got it · Naiintindihan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  brandCard: {
    position: "relative",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 24,
  },
  featuresButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  appName: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
  },
  tagline: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
    textAlign: "center",
  },
  taglineTranslation: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  sectionTranslation: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginTop: 1,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  faqCard: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
  questionTranslation: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  answer: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  answerTranslation: {
    fontFamily: "Poppins-Bold",
  },
  visitUsCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  visitUsHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  facebookLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 50,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  facebookLinkText: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
  },
  reportBugCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  reportBugIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  reportBugTextContainer: {
    flex: 1,
  },
  reportBugTitle: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  reportBugTranslation: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  reportBugHint: {
    color: COLORS.white,
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    marginTop: 2,
  },
  featuresOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },
  featuresCard: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "82%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  featuresHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  featuresHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  featuresHeaderText: {
    flex: 1,
  },
  featuresTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
  },
  featuresSubtitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  closeFeaturesButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  featuresList: {
    flexShrink: 1,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 12,
  },
  featureText: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  closeFeaturesAction: {
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 11,
    marginTop: 8,
  },
  closeFeaturesText: {
    color: COLORS.white,
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
});

export default About;
