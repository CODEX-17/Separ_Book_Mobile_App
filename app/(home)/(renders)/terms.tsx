import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { SettingContext } from "@/app/context/SettingContext";
import COLORS from "@/app/constants/colors";

type TermItem = {
  word: string;
  meaning: string;
  tagalogMeaning?: string;
};

const TERMS: TermItem[] = [
  {
    word: "OHAYAH",
    meaning:
      "The highest form of praise that came from the mouths of newborns. (Psalms 8:2)",
    tagalogMeaning:
      "Ang pinakamataas na uri ng papuri na nanggagaling sa bibig ng mga sanggol. (Mga Awit 8:2)",
  },
  {
    word: "YADAH",
    meaning: "Give acknowledge",
    tagalogMeaning: "Magbigay ng pagkilala",
  },
  {
    word: "TODDAH RABBAH",
    meaning: "Express Thanksgiving",
    tagalogMeaning: "Magpahayag ng pasasalamat",
  },
  {
    word: "SHALEM/SHALOM",
    meaning: "Peace",
    tagalogMeaning: "Kapayapaan",
  },
  {
    word: "ACHI or AKI",
    meaning: "Brother",
    tagalogMeaning: "Kapatid na lalaki",
  },
  {
    word: "ACHOT or AKOT",
    meaning: "Sister",
    tagalogMeaning: "Kapatid na babae",
  },
  {
    word: "ELDER",
    meaning: "Jr. Kohens",
    tagalogMeaning: "Bunsong Kohen / Nakababagong Saserdote",
  },
  {
    word: "KOHEN",
    meaning: "Priest",
    tagalogMeaning: "Pari o Saserdote",
  },
  {
    word: "BERKAT KOHANIM",
    meaning: "Priestly Blessings",
    tagalogMeaning: "Mga Pagpapala ng mga Saserdote",
  },
  {
    word: "QUIRAAH",
    meaning: "Calling Forth",
    tagalogMeaning: "Pagtawag o Pagpapalabas",
  },
  {
    word: "SEPHAR or SEPAR",
    meaning: "Book of Remembrance",
    tagalogMeaning: "Aklat ng Alaala",
  },
  {
    word: "SHACHA",
    meaning: "Bow down",
    tagalogMeaning: "Yumukod o Magpatirapa",
  },
  {
    word: "ALYON",
    meaning: "ALMIGHTY ONE",
    tagalogMeaning: "ANG MAKAPANGYARIHAN SA LAHAT",
  },
  {
    word: "BRETHREN",
    meaning: "Members of the same spiritual family.",
    tagalogMeaning: "Mga miyembro ng iisang espirituwal na pamilya.",
  },
  {
    word: "BOKER TOV",
    meaning: "Good morning",
    tagalogMeaning: "Magandang umaga",
  },
  {
    word: "EREV TOV",
    meaning: "Good evening",
    tagalogMeaning: "Magandang gabi",
  },
  {
    word: "LAILA TOV",
    meaning: "Good night",
    tagalogMeaning: "Magandang gabi / Tulog nang mahimbing",
  },
  {
    word: "YAHBERCHEM",
    meaning: "Yahuweh's multiple blessings be unto you.",
    tagalogMeaning: "Ang saganang pagpapala ni Yahuweh ay sumaiyo.",
  },
  {
    word: "SHABACHADSHEYOM",
    meaning: "Joyous Blessed Sacred Seventh Day.",
    tagalogMeaning: "Masayang Pinagpalang Banal na Ikapitong Araw.",
  },
  {
    word: "SHAMEACH BARAK CHADOSH SHEBI YOM",
    meaning: "Shabachadsheyom",
    tagalogMeaning: "Masayang Pinagpalang Banal na Ikapitong Araw",
  },
  {
    word: "MASHIAC",
    meaning: "Messiah",
    tagalogMeaning: "Mesiyas / Ang Pinahidang Tagapagligtas",
  },
  {
    word: "MALAK",
    meaning: "Angel",
    tagalogMeaning: "Anghel",
  },
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
        item.meaning.toLowerCase().includes(normalized) ||
        (item.tagalogMeaning ?? "").toLowerCase().includes(normalized),
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
              {item.tagalogMeaning ? (
                <>
                  <Text
                    allowFontScaling={false}
                    style={[styles.tagalogLabel, { color: themeColors.primaryText }]}
                  >
                    Tagalog Meaning:
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[styles.tagalogMeaning, { color: themeColors.secondaryText }]}
                  >
                    {item.tagalogMeaning}
                  </Text>
                </>
              ) : null}
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
  tagalogLabel: {
    marginTop: 8,
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  tagalogMeaning: {
    marginTop: 2,
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
