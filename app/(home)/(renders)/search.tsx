import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { separ as chapterList } from "@/app/data/chapters";
import Fuse from "fuse.js";
import { ChapterContext } from "@/app/context/ChapterContex";
import { useRouter } from "expo-router";
import { getChapter } from "@/app/Utils/getChapter";
import { SettingContext } from "@/app/context/SettingContext";
import COLORS from "@/app/constants/colors";
import Icon from "react-native-vector-icons/Feather";

const MyComponent = () => {
  type SearchLevel = "Exact" | "Balanced" | "Broad";

  type Verse = {
    chapter: number;
    verse: number;
    content: string;
  };

  const [text, setText] = useState("");
  const [resultList, setResultList] = useState<Verse[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [searchLevel, setSearchLevel] = useState<SearchLevel>("Balanced");

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);

  if (!settingContext || !chapterContext) {
    return null;
  }
  const { objSetting } = settingContext;
  const { currentChapter, setCurrentChapter } = chapterContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(chapterList, {
        shouldSort: true,
        threshold: searchLevel === "Broad" ? 0.6 : 0.35,
        ignoreLocation: true,
        minMatchCharLength: 1,
        keys: ["content"],
      }),
    [searchLevel],
  );

  useEffect(() => {
    const terms = normalizeSearchText(text).split(" ").filter(Boolean);
    if (terms.length === 0) {
      setResultList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      const exactResults = chapterList.filter((verse) => {
        const content = normalizeSearchText(verse.content);
        return terms.every((term) =>
          content.split(" ").some((word) => word.includes(term)),
        );
      });

      if (exactResults.length > 0 || searchLevel === "Exact") {
        setResultList(exactResults);
        setLoading(false);
        return;
      }

      const resultsByTerm = terms.map((term) =>
        new Map(
          fuse.search(term).map(({ item }) => [
            `${item.chapter}:${item.verse}`,
            item,
          ]),
        ),
      );
      const firstTermResults = [...resultsByTerm[0].entries()];
      const fuzzyResults = firstTermResults
        .filter(([verseKey]) =>
          resultsByTerm
            .slice(1)
            .every((termResults) => termResults.has(verseKey)),
        )
        .map(([, item]) => item);

      setResultList(fuzzyResults);
      setLoading(false);
    }, 120);

    return () => clearTimeout(timeout);
  }, [text, fuse, searchLevel]);

  const handleSearch = (value: string) => {
    setText(value);
  };

  const handleSelectVerse = (chapter: number, verse: number) => {
    const result = getChapter(chapter, verse);

    if (result) {
      setCurrentChapter(result.index);
      router.push("/view-chapter");
    } else {
      console.error("Result is null");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputContainer, { backgroundColor: themeColors.card }]}
      >
        <Icon name="search" size={20} color={themeColors.primary} />
        <TextInput
          allowFontScaling={false}
          style={[styles.input, { color: themeColors.primaryText }]}
          onChangeText={handleSearch}
          placeholder="Search"
          placeholderTextColor="#ccc"
          value={text}
        />
      </View>
      <View style={styles.searchLevelSection}>
        <Text
          allowFontScaling={false}
          style={[styles.searchLevelLabel, { color: themeColors.primaryText }]}
        >
          Search level
        </Text>
        <View style={styles.searchLevels}>
          {(["Exact", "Balanced", "Broad"] as const).map((level) => {
            const isSelected = searchLevel === level;
            return (
              <TouchableOpacity
                key={level}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSearchLevel(level)}
                style={[
                  styles.searchLevelButton,
                  {
                    backgroundColor: isSelected
                      ? themeColors.primary
                      : themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.searchLevelButtonText,
                    {
                      color: isSelected
                        ? COLORS.white
                        : themeColors.secondaryText,
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.searchLevelHint, { color: themeColors.secondaryText }]}
        >
          Exact: eksaktong salita · Balanced: karaniwang tugma · Broad: mas malawak na tugma
        </Text>
      </View>
      <Text
        allowFontScaling={false}
        style={[styles.label, { color: themeColors.primaryText }]}
      >
        Search Result: {resultList.length}
      </Text>
      <ScrollView style={styles.cardList}>
        {resultList.length > 0 ? (
          resultList.map((data, index) => (
            <TouchableOpacity
              key={`${data.chapter}:${data.verse}`}
              onPress={() => handleSelectVerse(data.chapter, data.verse)}
            >
              <View
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
                  style={[
                    styles.chapterText,
                    { color: themeColors.primaryText },
                  ]}
                >{`Chapter ${data.chapter}`}</Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.verseText,
                    { color: themeColors.secondaryText },
                  ]}
                >{`Verse ${data.verse}`}</Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.verseContent,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  {getHighlightedSnippet(data.content, text)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <LottieView
              source={require("../../../assets/animation/searching-loading-animation.json")}
              autoPlay
              loop
              style={styles.searchLoading}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              allowFontScaling={false}
              style={[styles.verseText, { color: themeColors.primaryText }]}
            >
              No Result
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

function getHighlightedSnippet(content: string, query: string) {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  const normalizedCharacters: { character: string; start: number; end: number }[] =
    [];
  let sourceOffset = 0;

  Array.from(content).forEach((character) => {
    const start = sourceOffset;
    sourceOffset += character.length;
    const normalized = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();

    for (const normalizedCharacter of normalized) {
      if (/[\p{L}\p{N}]/u.test(normalizedCharacter)) {
        normalizedCharacters.push({
          character: normalizedCharacter,
          start,
          end: start + character.length,
        });
      }
    }
  });

  const normalizedContent = normalizedCharacters
    .map(({ character }) => character)
    .join("");
  const ranges: { start: number; end: number }[] = [];

  terms.forEach((term) => {
    let index = normalizedContent.indexOf(term);
    while (index !== -1) {
      const start = normalizedCharacters[index]?.start;
      const end = normalizedCharacters[index + term.length - 1]?.end;
      if (start !== undefined && end !== undefined) {
        ranges.push({ start, end });
      }
      index = normalizedContent.indexOf(term, index + term.length);
    }
  });

  const firstMatch = ranges.reduce<{ start: number; end: number } | null>(
    (first, range) => (!first || range.start < first.start ? range : first),
    null,
  );
  const snippetStart = firstMatch ? Math.max(0, firstMatch.start - 40) : 0;
  const snippetEnd = Math.min(
    content.length,
    Math.max(snippetStart + 140, firstMatch?.end ?? 0),
  );
  const visibleRanges = ranges
    .filter((range) => range.start < snippetEnd && range.end > snippetStart)
    .map((range) => ({
      start: Math.max(range.start, snippetStart),
      end: Math.min(range.end, snippetEnd),
    }))
    .sort((a, b) => a.start - b.start);

  const segments: { text: string; highlighted: boolean }[] = [];
  let cursor = snippetStart;

  visibleRanges.forEach((range) => {
    if (range.start > cursor) {
      segments.push({
        text: content.slice(cursor, range.start),
        highlighted: false,
      });
    }
    if (range.end > cursor) {
      segments.push({
        text: content.slice(Math.max(cursor, range.start), range.end),
        highlighted: true,
      });
      cursor = range.end;
    }
  });

  if (cursor < snippetEnd) {
    segments.push({ text: content.slice(cursor, snippetEnd), highlighted: false });
  }

  return (
    <>
      {snippetStart > 0 ? "..." : ""}
      {segments.map((segment, index) => (
        <Text
          key={`${index}:${segment.text}`}
          style={
            segment.highlighted
              ? styles.highlightedSearchText
              : undefined
          }
        >
          {segment.text}
        </Text>
      ))}
      {snippetEnd < content.length ? "..." : ""}
    </>
  );
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    padding: 40,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: "90%",
    height: "100%",
    paddingLeft: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 0,
    borderColor: "#ccc",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  searchLevelSection: {
    width: "100%",
    marginBottom: 16,
  },
  searchLevelLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    marginBottom: 8,
  },
  searchLevels: {
    flexDirection: "row",
    gap: 8,
  },
  searchLevelButton: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 5,
  },
  searchLevelButtonText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  searchLevelHint: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },
  label: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
    marginBottom: 10,
  },
  cardList: {
    flex: 1,
    paddingBottom: 20,
    width: "100%",
  },
  card: {
    width: "100%",
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  chapterText: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 20,
    textAlign: "left",
  },
  verseText: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 15,
    textAlign: "left",
  },
  verseContent: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 15,
    textAlign: "left",
  },
  highlightedSearchText: {
    backgroundColor: "#FFE082",
    color: "#222222",
    fontFamily: "Poppins-Bold",
  },
  searchLoading: {
    width: 250,
    height: 250,
  },
});

export default MyComponent;
