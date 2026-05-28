import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "@/app/context/SettingContext";
import COLORS from "@/app/constants/colors";

type TermItem = {
  word: string;
  meaning: string;
};

const TERMS: TermItem[] = [
  { word: "Cohen", meaning: "Cohen means priest o pari in tagalog." },
  { word: "Shalom", meaning: "A Hebrew greeting meaning peace and wholeness." },
  {
    word: "Torah",
    meaning: "The divine teaching or law in the first five books.",
  },
  {
    word: "Mitzvah",
    meaning: "A commandment or good deed done in obedience to God.",
  },
  { word: "Sabbath", meaning: "A sacred day of rest and worship." },
  { word: "Tefillah", meaning: "Prayer or act of communicating with God." },
  { word: "Amen", meaning: "A declaration meaning truly, so be it." },
  {
    word: "Hallelujah",
    meaning: "An expression of praise meaning praise the Lord.",
  },
  { word: "Messiah", meaning: "The anointed one promised to bring salvation." },
  {
    word: "Covenant",
    meaning: "A sacred agreement between God and His people.",
  },
  {
    word: "Disciple",
    meaning: "A follower and learner of spiritual teachings.",
  },
  { word: "Grace", meaning: "Unmerited favor and kindness from God." },
  { word: "Mercy", meaning: "Compassion shown toward someone in need." },
  { word: "Faith", meaning: "Trust and confidence in God and His promises." },
  {
    word: "Wisdom",
    meaning: "The right application of knowledge with understanding.",
  },
  { word: "Prophet", meaning: "A messenger who speaks God’s word." },
  {
    word: "Redemption",
    meaning: "Deliverance from sin through divine intervention.",
  },
  { word: "Sanctify", meaning: "To set apart as holy for God." },
  {
    word: "Blessing",
    meaning: "A gift of favor, protection, or spiritual benefit.",
  },
  { word: "Kingdom", meaning: "The reign and rule of God over all creation." },
];

const Terms = () => {
  const [query, setQuery] = useState("");
  const settingContext = useContext(SettingContext);

  if (!settingContext) {
    return null;
  }

  const { objSetting } = settingContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return TERMS;
    }

    return TERMS.filter(
      (item) =>
        item.word.toLowerCase().includes(normalized) ||
        item.meaning.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          },
        ]}
      >
        <Icon name="search" size={18} color={themeColors.secondaryText} />
        <TextInput
          allowFontScaling={false}
          style={[styles.searchInput, { color: themeColors.primaryText }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search word or meaning"
          placeholderTextColor={themeColors.secondaryText}
        />
      </View>

      <Text
        allowFontScaling={false}
        style={[styles.resultLabel, { color: themeColors.secondaryText }]}
      >
        Results: {filteredTerms.length}
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item) => (
            <View
              key={item.word}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[styles.word, { color: themeColors.primaryText }]}
              >
                {item.word}
              </Text>
              <Text
                allowFontScaling={false}
                style={[styles.meaning, { color: themeColors.secondaryText }]}
              >
                {item.meaning}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.emptyText, { color: themeColors.secondaryText }]}
            >
              No matching terms found.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "transparent",
  },
  searchContainer: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  resultLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  word: {
    fontFamily: "Poppins-Bold",
    fontSize: 15,
    marginBottom: 4,
  },
  meaning: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontSize: 13,
  },
});

export default Terms;
