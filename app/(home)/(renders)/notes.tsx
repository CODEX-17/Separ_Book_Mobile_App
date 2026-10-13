import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import COLORS from "@/app/constants/colors";
import { ChapterContext } from "@/app/context/ChapterContex";
import { SettingContext } from "@/app/context/SettingContext";
import { separ as verses } from "@/app/data/chapters";
import { Verse } from "@/app/types/interfaces";
import { getStoreData, storeData } from "@/app/Utils/storage";

type VerseNote = {
  verseIndex: number;
  verse: Verse;
  note: string;
};

const Notes = () => {
  const router = useRouter();
  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);
  const [notes, setNotes] = useState<VerseNote[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  if (!settingContext || !chapterContext) return null;

  const { objSetting } = settingContext;
  const { setCurrentChapter } = chapterContext;
  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        const storedNotes = (await getStoreData("VERSE_NOTES")) ?? {};
        const noteEntries = Object.entries(storedNotes)
          .map(([key, note]) => {
            const [chapterText, verseText] = key.split(":");
            const chapter = Number(chapterText);
            const verseNumber = Number(verseText);
            const verseIndex = verses.findIndex(
              (item) => item.chapter === chapter && item.verse === verseNumber,
            );

            if (
              !Number.isInteger(chapter) ||
              !Number.isInteger(verseNumber) ||
              verseIndex < 0 ||
              typeof note !== "string" ||
              !note.trim()
            ) {
              return null;
            }

            return {
              verseIndex,
              verse: verses[verseIndex],
              note,
            };
          })
          .filter((item): item is VerseNote => item !== null)
          .sort((a, b) => a.verseIndex - b.verseIndex);

        if (isMounted) setNotes(noteEntries);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return notes;

    return notes.filter(({ verse, note }) =>
      [
        `chapter ${verse.chapter}`,
        `verse ${verse.verse}`,
        verse.content,
        note,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [notes, query]);

  const openVerse = (verseIndex: number) => {
    setCurrentChapter(verseIndex);
    router.push("/view-chapter");
  };

  const confirmDeleteNote = (verse: Verse) => {
    Alert.alert(
      "Delete note?",
      `Remove the note for Chapter ${verse.chapter}, Verse ${verse.verse}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const storedNotes = (await getStoreData("VERSE_NOTES")) ?? {};
            delete storedNotes[`${verse.chapter}:${verse.verse}`];
            await storeData("VERSE_NOTES", storedNotes);
            setNotes((currentNotes) =>
              currentNotes.filter(
                (item) =>
                  item.verse.chapter !== verse.chapter ||
                  item.verse.verse !== verse.verse,
              ),
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text
        allowFontScaling={false}
        style={[styles.title, { color: themeColors.primaryText }]}
      >
        My Verse Notes
      </Text>

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
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes or verse"
          placeholderTextColor={themeColors.secondaryText}
          style={[styles.searchInput, { color: themeColors.primaryText }]}
          accessibilityLabel="Search verse notes"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery("")}
            accessibilityLabel="Clear note search"
          >
            <Icon name="x" size={18} color={themeColors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        allowFontScaling={false}
        style={[styles.resultCount, { color: themeColors.secondaryText }]}
      >
        {isLoading ? "Loading notes..." : `${filteredNotes.length} notes`}
      </Text>

      {!isLoading && filteredNotes.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Icon
            name={query ? "search" : "file-text"}
            size={28}
            color={themeColors.secondaryText}
          />
          <Text
            allowFontScaling={false}
            style={[styles.emptyText, { color: themeColors.secondaryText }]}
          >
            {query
              ? "No notes match your search."
              : "Your saved verse notes will appear here."}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotes.map(({ verseIndex, verse, note }) => (
            <View
              key={`${verse.chapter}:${verse.verse}`}
              style={[
                styles.noteCard,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View style={styles.noteHeader}>
                <TouchableOpacity
                  onPress={() => openVerse(verseIndex)}
                  style={styles.noteTitleButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Open note for chapter ${verse.chapter}, verse ${verse.verse}`}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.verseTitle,
                      { color: themeColors.primaryText },
                    ]}
                  >
                    {`Chapter ${verse.chapter} · Verse ${verse.verse}`}
                  </Text>
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={themeColors.secondaryText}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDeleteNote(verse)}
                  style={styles.deleteButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete note for chapter ${verse.chapter}, verse ${verse.verse}`}
                >
                  <Icon name="trash-2" size={18} color={COLORS.red} />
                </TouchableOpacity>
              </View>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={[styles.verseText, { color: themeColors.secondaryText }]}
              >
                {verse.content}
              </Text>
              <View style={styles.noteBody}>
                <Icon name="edit-3" size={15} color={themeColors.primary} />
                <Text
                  allowFontScaling={false}
                  style={[styles.noteText, { color: themeColors.primaryText }]}
                >
                  {note}
                </Text>
              </View>
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
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    marginBottom: 14,
  },
  searchContainer: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    paddingVertical: 0,
  },
  resultCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 6,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 18,
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginVertical: 7,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  noteTitleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  verseTitle: {
    flex: 1,
    fontFamily: "Poppins-Bold",
    fontSize: 14,
  },
  verseText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  noteBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.lightGray,
    paddingTop: 10,
    marginTop: 10,
  },
  noteText: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Notes;
