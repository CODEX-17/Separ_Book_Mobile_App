import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  Alert,
  PanResponder,
  DeviceEventEmitter,
} from "react-native";
import { ChapterContext } from "./context/ChapterContex";
import { separ as chapterList } from "./data/chapters";
import ScreenShot from "./(home)/screen-shot";
import { useRouter, useGlobalSearchParams, usePathname } from "expo-router";
import { SettingContext } from "./context/SettingContext";
import { BottomNavigationContext } from "./context/BottomNavigationContext";
import COLORS from "./constants/colors";
import { getStoreData, storeData, removeStorageData } from "./Utils/storage";
import { Profile, Setting, Verse, VerseHighlight } from "./types/interfaces";
import Icon from "react-native-vector-icons/Feather";
import { useLevelTimer } from "./Utils/useLevelTimer";
import { SafeAreaView } from "react-native-safe-area-context";
import { showToast } from "./Utils/toast";

const ViewChapter = () => {
  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 48;
  const router = useRouter();
  const params = useGlobalSearchParams();
  const pathname = usePathname();

  const settingContext = useContext(SettingContext);
  const chapterContext = useContext(ChapterContext);
  const bottomNavigationContext = useContext(BottomNavigationContext);

  if (!chapterContext || !settingContext || !bottomNavigationContext)
    return null;

  const { currentChapter, setCurrentChapter } = chapterContext;
  const { objSetting, handleChangeSetting } = settingContext;
  const { bottomNavigation, setBottomNavigation } = bottomNavigationContext;

  const themeColors = objSetting.theme === "dark" ? COLORS.dark : COLORS.light;
  const fontSize = objSetting.fontSize;
  const fontStyle = objSetting.fontStyle || "Poppins-Regular";

  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  const autoFontSize = useMemo(() => {
    if (!selectedVerse) return fontSize ?? 30;

    const contentLength = selectedVerse.content.trim().length;
    const baseSize = Math.max(MIN_FONT_SIZE, fontSize ?? 30);
    const sizeReduction = Math.floor(contentLength / 120);

    return Math.max(MIN_FONT_SIZE, baseSize - sizeReduction);
  }, [selectedVerse, fontSize]);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [autoSaveRequestId, setAutoSaveRequestId] = useState<number | null>(
    null,
  );
  const screenshotRequestSequence = useRef(0);
  const [favoriteList, setFavoriteList] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [profile, setProfile] = useState<Profile>();
  const [noteText, setNoteText] = useState("");
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [hasVerseNote, setHasVerseNote] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [showShareTutorial, setShowShareTutorial] = useState(false);
  const [verseHighlights, setVerseHighlights] = useState<VerseHighlight[]>([]);
  const [isSelectingHighlight, setIsSelectingHighlight] = useState(false);
  const [selectedTextRange, setSelectedTextRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [highlightColor, setHighlightColor] = useState("#FFF176");
  const [fontSliderWidth, setFontSliderWidth] = useState(0);

  useEffect(() => {
    if (pathname !== "/view-chapter") return;

    let lastCaptureHandledAt = 0;
    const subscription = DeviceEventEmitter.addListener(
      "onAndroidScreenshotDetected",
      () => {
        const now = Date.now();
        if (!selectedVerse || now - lastCaptureHandledAt < 1500) return;
        lastCaptureHandledAt = now;
        screenshotRequestSequence.current += 1;
        setAutoSaveRequestId(screenshotRequestSequence.current);
        setIsShowPreview(true);
        showToast({
          type: "info",
          title: "Screenshot detected",
          message: "Saving the current verse image to your gallery...",
        });
      },
    );

    return () => subscription.remove();
  }, [pathname, selectedVerse]);

  const highlightColors = [
    { name: "Yellow", value: "#FFF176" },
    { name: "Green", value: "#A5D6A7" },
    { name: "Blue", value: "#90CAF9" },
    { name: "Pink", value: "#F48FB1" },
    { name: "Purple", value: "#CE93D8" },
  ];

  const level = useLevelTimer(30000);

  const updateFontSizeFromSlider = (locationX: number) => {
    const usableWidth = fontSliderWidth - 18;
    if (usableWidth <= 0) return;

    const fraction = Math.max(0, Math.min(1, (locationX - 9) / usableWidth));
    const newFontSize = Math.round(
      MIN_FONT_SIZE + fraction * (MAX_FONT_SIZE - MIN_FONT_SIZE),
    );
    if (newFontSize !== fontSize) {
      handleChangeSetting({ ...objSetting, fontSize: newFontSize });
    }
  };

  const fontSliderPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) =>
          updateFontSizeFromSlider(event.nativeEvent.locationX),
        onPanResponderMove: (event) =>
          updateFontSizeFromSlider(event.nativeEvent.locationX),
      }),
    [fontSliderWidth, fontSize, objSetting, handleChangeSetting],
  );

  // Sync selectedVerse whenever currentChapter changes
  useEffect(() => {
    console.log("verse 1:", chapterList[0]);
    console.log("Current Chapter changed:", currentChapter);

    if (
      (currentChapter !== null && currentChapter !== undefined) ||
      currentChapter === 0
    ) {
      console.log("yes");
      setSelectedVerse(chapterList[currentChapter]);
    } else {
      console.log("no");
    }
  }, [currentChapter]);

  const getVerseKey = (verse: Verse | null) =>
    verse ? `${verse.chapter}:${verse.verse}` : "";

  // Load profile on mount
  useEffect(() => {
    (async () => {
      const profileData = await getStoreData("PROFILE");
      if (profileData) setProfile(profileData);
    })();
  }, []);

  useEffect(() => {
    let isCurrentVerse = true;

    const loadCurrentVerseNote = async () => {
      if (!selectedVerse) {
        setNoteText("");
        setHasVerseNote(false);
        setVerseHighlights([]);
        return;
      }

      const verseKey = getVerseKey(selectedVerse);
      const [notes, highlights] = await Promise.all([
        getStoreData("VERSE_NOTES"),
        getStoreData("VERSE_HIGHLIGHTS"),
      ]);
      if (!isCurrentVerse) return;

      const savedNote = notes?.[verseKey] ?? "";
      setNoteText(savedNote);
      setHasVerseNote(Boolean(savedNote.trim()));
      setVerseHighlights(highlights?.[verseKey] ?? []);
      setIsSelectingHighlight(false);
      setSelectedTextRange(null);
    };

    loadCurrentVerseNote();

    return () => {
      isCurrentVerse = false;
    };
  }, [selectedVerse]);

  const highlightedSegments = useMemo(() => {
    if (!selectedVerse) return [];

    const content = selectedVerse.content;
    const validHighlights = [...verseHighlights]
      .filter(
        (highlight) =>
          Number.isInteger(highlight.start) &&
          Number.isInteger(highlight.end) &&
          highlight.start >= 0 &&
          highlight.end <= content.length &&
          highlight.start < highlight.end,
      )
      .sort((a, b) => a.start - b.start);

    const segments: { text: string; color?: string }[] = [];
    let cursor = 0;

    validHighlights.forEach((highlight) => {
      if (highlight.start > cursor) {
        segments.push({ text: content.slice(cursor, highlight.start) });
      }
      segments.push({
        text: content.slice(Math.max(cursor, highlight.start), highlight.end),
        color: highlight.color,
      });
      cursor = Math.max(cursor, highlight.end);
    });

    if (cursor < content.length) {
      segments.push({ text: content.slice(cursor) });
    }

    return segments;
  }, [selectedVerse, verseHighlights]);

  const hasHighlightInSelectedRange = useMemo(
    () =>
      Boolean(
        selectedTextRange &&
          verseHighlights.some(
            (highlight) =>
              highlight.start < selectedTextRange.end &&
              highlight.end > selectedTextRange.start,
          ),
      ),
    [selectedTextRange, verseHighlights],
  );

  // Load favorite list whenever currentChapter changes
  useEffect(() => {
    const getAllFavorites = async () => {
      const favorites: any = await getStoreData("FAVORITE");
      if (!favorites) return;

      if (
        JSON.stringify(favoriteList) !== JSON.stringify(favorites.verseIndex)
      ) {
        setFavoriteList(favorites.verseIndex);
      }

      const isFav = favorites.verseIndex.includes(currentChapter ?? -1);
      if (isFav !== isFavorite) setIsFavorite(isFav);
    };

    getAllFavorites();
  }, [currentChapter]);

  useEffect(() => {
    if (level === 1 && profile) {
      setProfile((prevProfile) => {
        if (!prevProfile) return prevProfile;
        const updatedProfile = { ...prevProfile, level: prevProfile.level + 1 };
        storeData("PROFILE", updatedProfile);
        return updatedProfile;
      });
    }
  }, [level]);

  // Update profile level when reach user 20 sec in every chapter
  useEffect(() => {
    console.log("⏳ Timer started");

    const timer = setTimeout(() => {
      console.log("✅ User spent 20 seconds in ViewChapter");
      setProfile((prevProfile) => {
        if (!prevProfile) return prevProfile;
        const updatedProfile = { ...prevProfile, level: prevProfile.level + 1 };
        storeData("PROFILE", updatedProfile);
        return updatedProfile;
      });

      showToast({
        type: "success",
        title: "Level Up",
        message: "You gained +1 level.",
      });
    }, 20000); // 20 seconds

    return () => {
      clearTimeout(timer);
      console.log("🧹 Timer cleared (component unmounted)");
    };
  }, [currentChapter]);

  if (
    currentChapter === null ||
    currentChapter === undefined ||
    !selectedVerse ||
    !profile
  )
    return null;

  const handleSwitchVerse = (direction: "next" | "prev") => {
    const index =
      direction === "next" ? currentChapter + 1 : currentChapter - 1;
    if (index < 0 || index >= chapterList.length) return;
    setCurrentChapter(index);
  };

  const handleFavorite = async (verseNumber: number) => {
    try {
      const prevData: any = await getStoreData("FAVORITE");
      let newData: number[] = prevData?.verseIndex ?? [];

      if (isFavorite) {
        newData = newData.filter((v) => v !== verseNumber);
      } else {
        newData.push(verseNumber);
      }

      setFavoriteList(newData);
      setIsFavorite(!isFavorite);
      await storeData("FAVORITE", { verseIndex: [...new Set(newData)] });
    } catch (e) {
      alert("Error updating favorites");
    }
  };

  const handleTheme = () => {
    handleChangeSetting({
      ...objSetting,
      theme: objSetting.theme === "dark" ? "light" : "dark",
    });
  };

  const handleSave = async () => {
    setIsShowPreview(true);

    showToast({
      type: "info",
      title: "Download",
      message: "Preparing verse image...",
    });

    if (!profile) return;

    const updatedProfile = { ...profile, level: profile.level + 1 };
    setProfile(updatedProfile);
    await storeData("PROFILE", updatedProfile);

    showToast({
      type: "success",
      title: "Points",
      message: "+1 point added!",
    });
  };

  const handleSaveNote = async () => {
    if (!selectedVerse) return;

    const trimmedNote = noteText.trim();
    const notes: Record<string, string> = (await getStoreData("VERSE_NOTES")) ?? {};
    const verseKey = getVerseKey(selectedVerse);

    if (!trimmedNote) {
      delete notes[verseKey];
    } else {
      notes[verseKey] = trimmedNote;
    }

    await storeData("VERSE_NOTES", notes);
    setHasVerseNote(Boolean(trimmedNote));
    setShowNoteEditor(false);
    showToast({
      type: trimmedNote ? "success" : "info",
      title: trimmedNote ? "Note saved" : "Note removed",
      message: trimmedNote
        ? "Your verse note has been saved."
        : "This verse no longer has a saved note.",
    });
  };

  const handleDeleteNote = () => {
    if (!selectedVerse || !hasVerseNote) return;

    Alert.alert("Delete note?", "This will permanently remove the note for this verse.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const notes =
            (await getStoreData("VERSE_NOTES")) ?? {};
          delete notes[getVerseKey(selectedVerse)];
          await storeData("VERSE_NOTES", notes);
          setNoteText("");
          setHasVerseNote(false);
          setShowNoteEditor(false);
          showToast({
            type: "success",
            title: "Note deleted",
            message: "The note for this verse was removed.",
          });
        },
      },
    ]);
  };

  const handleTextSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    const { start, end } = event.nativeEvent.selection;
    const selectionStart = Math.min(start, end);
    const selectionEnd = Math.max(start, end);
    setSelectedTextRange(
      selectionEnd > selectionStart
        ? { start: selectionStart, end: selectionEnd }
        : null,
    );
  };

  const handleApplyHighlight = async () => {
    if (!selectedVerse || !selectedTextRange) return;

    const { start, end } = selectedTextRange;
    if (start < 0 || end > selectedVerse.content.length || start >= end) return;

    const verseKey = getVerseKey(selectedVerse);
    const allHighlights =
      (await getStoreData("VERSE_HIGHLIGHTS")) ?? {};
    const existingHighlights = allHighlights[verseKey] ?? verseHighlights;

    const updatedHighlights = existingHighlights
      .flatMap((highlight) => {
        if (highlight.end <= start || highlight.start >= end) {
          return [highlight];
        }

        const preserved: VerseHighlight[] = [];
        if (highlight.start < start) {
          preserved.push({ ...highlight, end: start });
        }
        if (highlight.end > end) {
          preserved.push({ ...highlight, start: end });
        }
        return preserved;
      })
      .concat({ start, end, color: highlightColor })
      .sort((a, b) => a.start - b.start);

    allHighlights[verseKey] = updatedHighlights;
    await storeData("VERSE_HIGHLIGHTS", allHighlights);
    setVerseHighlights(updatedHighlights);
    setSelectedTextRange(null);
    setIsSelectingHighlight(false);
    showToast({
      type: "success",
      title: "Text highlighted",
      message: "Your highlight was saved for this verse.",
    });
  };

  const handleCancelHighlight = () => {
    setSelectedTextRange(null);
    setIsSelectingHighlight(false);
  };

  const handleRemoveSelectedHighlight = async () => {
    if (!selectedVerse || !selectedTextRange || !hasHighlightInSelectedRange)
      return;

    const { start, end } = selectedTextRange;
    const verseKey = getVerseKey(selectedVerse);
    const allHighlights =
      (await getStoreData("VERSE_HIGHLIGHTS")) ?? {};
    const existingHighlights = allHighlights[verseKey] ?? verseHighlights;
    const updatedHighlights = existingHighlights
      .flatMap((highlight) => {
        if (highlight.end <= start || highlight.start >= end) {
          return [highlight];
        }

        const preserved: VerseHighlight[] = [];
        if (highlight.start < start) {
          preserved.push({ ...highlight, end: start });
        }
        if (highlight.end > end) {
          preserved.push({ ...highlight, start: end });
        }
        return preserved;
      })
      .filter((highlight) => highlight.start < highlight.end);

    if (updatedHighlights.length > 0) {
      allHighlights[verseKey] = updatedHighlights;
    } else {
      delete allHighlights[verseKey];
    }

    await storeData("VERSE_HIGHLIGHTS", allHighlights);
    setVerseHighlights(updatedHighlights);
    setSelectedTextRange(null);
    setIsSelectingHighlight(false);
    showToast({
      type: "success",
      title: "Highlight removed",
      message: "The highlight in the selected text was removed.",
    });
  };

  const handleClearVerseHighlights = () => {
    if (!selectedVerse || verseHighlights.length === 0) return;

    Alert.alert(
      "Remove all highlights?",
      "This will remove every highlight from this verse.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove all",
          style: "destructive",
          onPress: async () => {
            const allHighlights =
              (await getStoreData("VERSE_HIGHLIGHTS")) ?? {};
            delete allHighlights[getVerseKey(selectedVerse)];
            await storeData("VERSE_HIGHLIGHTS", allHighlights);
            setVerseHighlights([]);
            setSelectedTextRange(null);
            setIsSelectingHighlight(false);
            showToast({
              type: "success",
              title: "Highlights removed",
              message: "All highlights from this verse were removed.",
            });
          },
        },
      ],
    );
  };

  const handleBack = () => {
    if (params.route === "random") {
      router.dismiss(2);
    } else {
      router.dismissTo("/(home)");
    }
  };

  const menuList = [
    {
      name: "prev",
      function: () => handleSwitchVerse("prev"),
      icon: <Icon name="skip-back" color={themeColors.primary} size={25} />,
    },
    {
      name: "next",
      function: () => handleSwitchVerse("next"),
      icon: <Icon name="skip-forward" color={themeColors.primary} size={25} />,
    },
    {
      name: "heart",
      function: () => handleFavorite(currentChapter),
      icon: (
        <Icon
          name="heart"
          color={isFavorite ? COLORS.red : themeColors.primary}
          size={25}
        />
      ),
    },
    {
      name: "note",
      function: () => setShowNoteEditor(true),
      icon: (
        <View style={styles.noteActionIconWrap}>
          <Icon
            name={hasVerseNote ? "file-text" : "file-plus"}
            color={themeColors.primary}
            size={25}
          />
          {hasVerseNote && <View style={styles.noteBadge} />}
        </View>
      ),
    },
    {
      name: "highlight",
      function: () => {
        setIsSelectingHighlight(true);
        setSelectedTextRange(null);
      },
      icon: (
        <View style={styles.noteActionIconWrap}>
          <Icon name="edit-3" color={themeColors.primary} size={25} />
          {verseHighlights.length > 0 && <View style={styles.highlightBadge} />}
        </View>
      ),
    },
    {
      name: "theme",
      function: handleTheme,
      icon:
        objSetting.theme === "dark" ? (
          <Icon name="sun" color={themeColors.primary} size={25} />
        ) : (
          <Icon name="moon" color={themeColors.primary} size={25} />
        ),
    },
    {
      name: "download",
      function: handleSave,
      icon: <Icon name="share" color={themeColors.primary} size={25} />,
    },
  ];

  const primaryActions = menuList.filter((item) =>
    ["prev", "next", "heart"].includes(item.name),
  );
  const moreActions = menuList.filter(
    (item) => !["prev", "next", "heart"].includes(item.name),
  );
  const moreActionLabels: Record<string, string> = {
    note: "Note",
    highlight: "Highlight",
    theme: objSetting.theme === "dark" ? "Light mode" : "Dark mode",
    download: "Share image",
  };
  const primaryActionLabels: Record<string, string> = {
    prev: "Previous",
    next: "Next",
    heart: isFavorite ? "Favorited" : "Favorite",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {isShowPreview && (
        <View style={styles.modal}>
          <ScreenShot
            selectedVerse={selectedVerse}
            setIsShowPreview={setIsShowPreview}
            autoSaveRequestId={autoSaveRequestId}
            onAutoSaveHandled={() => setAutoSaveRequestId(null)}
          />
        </View>
      )}
      {showNoteEditor && (
        <View style={styles.noteModalOverlay}>
          <View
            style={[
              styles.noteModal,
              { backgroundColor: themeColors.card, borderColor: themeColors.border },
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.noteTitle, { color: themeColors.primaryText }]}
            >
              Verse Note
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.noteSubtitle, { color: themeColors.secondaryText }]}
            >
              {`Chapter ${selectedVerse?.chapter}, Verse ${selectedVerse?.verse}`}
            </Text>
            <TextInput
              allowFontScaling={false}
              multiline
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Write your note for this verse..."
              placeholderTextColor={themeColors.secondaryText}
              style={[
                styles.noteInput,
                {
                  backgroundColor: themeColors.background,
                  color: themeColors.primaryText,
                  borderColor: themeColors.border,
                },
              ]}
              textAlignVertical="top"
            />
            <View style={styles.noteActions}>
              {hasVerseNote && (
                <TouchableOpacity
                  onPress={handleDeleteNote}
                  style={[
                    styles.noteActionButton,
                    styles.noteDeleteButton,
                    { borderColor: COLORS.red },
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[styles.noteActionText, { color: COLORS.red }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setShowNoteEditor(false)}
                style={[
                  styles.noteActionButton,
                  { backgroundColor: themeColors.background, borderColor: themeColors.border },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.noteActionText, { color: themeColors.primaryText }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNote}
                style={[
                  styles.noteActionButton,
                  {
                    backgroundColor: themeColors.primary,
                    borderColor: themeColors.primary,
                  },
                ]}
              >
                <Text allowFontScaling={false} style={styles.noteActionText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {showShareTutorial && (
        <View style={styles.noteModalOverlay}>
          <View
            style={[
              styles.shareTutorialModal,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.shareTutorialHeader}>
              <View
                style={[
                  styles.shareTutorialHeroIcon,
                  { backgroundColor: themeColors.primary },
                ]}
              >
                <Icon name="share-2" color="#fff" size={25} />
              </View>
              <TouchableOpacity
                onPress={() => setShowShareTutorial(false)}
                accessibilityRole="button"
                accessibilityLabel="Close sharing guide"
                style={styles.shareTutorialClose}
              >
                <Icon name="x" color={themeColors.secondaryText} size={22} />
              </TouchableOpacity>
            </View>
            <Text
              allowFontScaling={false}
              style={[styles.shareTutorialTitle, { color: themeColors.primaryText }]}
            >
              Share this verse
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.shareTutorialSubtitle,
                { color: themeColors.secondaryText },
              ]}
            >
              Create a verse image and share it on Facebook or another social app.
              {"\n"}
              (Gumawa ng larawan ng talata at ibahagi ito sa Facebook o ibang
              social app.)
            </Text>
            <View style={styles.shareTutorialSteps}>
              <View
                style={[
                  styles.shareTutorialStepIcon,
                  { backgroundColor: themeColors.background },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.shareTutorialStepNumber, { color: themeColors.primary }]}
                >
                  1
                </Text>
                <Icon name="image" color={themeColors.primary} size={21} />
              </View>
              <View style={styles.shareTutorialStepText}>
                <Text
                  allowFontScaling={false}
                  style={[styles.shareTutorialStepTitle, { color: themeColors.primaryText }]}
                >
                  Open the verse image
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.shareTutorialStepDescription,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  Tap More, then Share image.
                  {"\n"}
                  (Pindutin ang More, pagkatapos ay Share image.)
                </Text>
              </View>
            </View>
            <View style={styles.shareTutorialSteps}>
              <View
                style={[
                  styles.shareTutorialStepIcon,
                  { backgroundColor: themeColors.background },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.shareTutorialStepNumber, { color: themeColors.primary }]}
                >
                  2
                </Text>
                <Icon name="share" color={themeColors.primary} size={21} />
              </View>
              <View style={styles.shareTutorialStepText}>
                <Text
                  allowFontScaling={false}
                  style={[styles.shareTutorialStepTitle, { color: themeColors.primaryText }]}
                >
                  Tap the share button
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.shareTutorialStepDescription,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  It is the share icon at the bottom of the preview.
                  {"\n"}
                  (Pindutin ang share icon sa ibaba ng preview.)
                </Text>
              </View>
            </View>
            <View style={styles.shareTutorialSteps}>
              <View style={[styles.facebookMark, styles.shareTutorialStepIcon]}>
                <Text allowFontScaling={false} style={styles.facebookMarkText}>
                  f
                </Text>
              </View>
              <View style={styles.shareTutorialStepText}>
                <Text
                  allowFontScaling={false}
                  style={[styles.shareTutorialStepTitle, { color: themeColors.primaryText }]}
                >
                  Choose Facebook
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.shareTutorialStepDescription,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  Select Facebook in the share menu. If it is not listed, install the app or choose another sharing option.
                  {"\n"}
                  (Piliin ang Facebook sa menu. Kung wala ito, i-install ang app o
                  pumili ng ibang paraan ng pagbabahagi.)
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowShareTutorial(false);
                handleSave();
              }}
              accessibilityRole="button"
              style={[
                styles.shareTutorialButton,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Icon name="image" color="#fff" size={18} />
              <Text
                allowFontScaling={false}
                style={styles.shareTutorialButtonText}
                numberOfLines={1}
              >
                Share (Ibahagi)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.display}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack}>
                <Icon
                  name="chevron-left"
                  color={themeColors.primary}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "column" }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.chapter,
                    { color: themeColors.primaryText, fontFamily: fontStyle },
                  ]}
                >
                  {`Chapter ${selectedVerse.chapter}`}
                </Text>
                <View style={styles.verseRow}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.verse,
                      { color: themeColors.secondaryText, fontFamily: fontStyle },
                    ]}
                  >
                    {`Verse ${selectedVerse.verse}`}
                  </Text>
                  {hasVerseNote && (
                    <View style={styles.noteIndicator}>
                      <Text
                        allowFontScaling={false}
                        style={[styles.noteIndicatorText, { color: "#fff" }]}
                      >
                        Note
                      </Text>
                    </View>
                  )}
                  {profile && (
                    <View
                      style={[
                        styles.levelIndicator,
                        { backgroundColor: COLORS.yellow },
                      ]}
                    >
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.levelIndicatorText,
                          { color: COLORS.black },
                        ]}
                      >
                        {`Lvl. ${profile.level}`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  (setBottomNavigation("Settings"), router.push("/(home)"));
                }}
              >
                <Icon name="settings" color={themeColors.primary} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.displayContent}>
              <ScrollView
                style={{ padding: 10, width: "100%" }}
                keyboardShouldPersistTaps="handled"
              >
                {isSelectingHighlight ? (
                  <>
                    <TextInput
                      allowFontScaling={false}
                      multiline
                      editable
                      showSoftInputOnFocus={false}
                      scrollEnabled={false}
                      value={selectedVerse.content}
                      onChangeText={() => undefined}
                      onSelectionChange={handleTextSelectionChange}
                      selectionColor={themeColors.highlight}
                      style={[
                        styles.contentText,
                        styles.selectableContent,
                        {
                          fontSize: autoFontSize,
                          color: themeColors.primaryText,
                          fontFamily: fontStyle,
                        },
                      ]}
                      accessibilityLabel="Select verse text to highlight"
                    />
                    <View
                      style={[
                        styles.highlightPicker,
                        { backgroundColor: themeColors.card },
                      ]}
                    >
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.highlightPrompt,
                          { color: themeColors.secondaryText },
                        ]}
                      >
                        Select text, choose a color, then tap Highlight.
                      </Text>
                      <View style={styles.highlightColors}>
                        {highlightColors.map((color) => (
                          <TouchableOpacity
                            key={color.value}
                            accessibilityRole="radio"
                            accessibilityLabel={`${color.name} highlight`}
                            accessibilityState={{
                              selected: highlightColor === color.value,
                            }}
                            onPress={() => setHighlightColor(color.value)}
                            style={[
                              styles.highlightColorOption,
                              {
                                backgroundColor: color.value,
                                borderColor:
                                  highlightColor === color.value
                                    ? themeColors.primary
                                    : themeColors.border,
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.noteActions}>
                        {verseHighlights.length > 0 && (
                          <TouchableOpacity
                            onPress={handleClearVerseHighlights}
                            style={[
                              styles.noteActionButton,
                              styles.noteDeleteButton,
                              { borderColor: COLORS.red },
                            ]}
                          >
                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.noteActionText,
                                { color: COLORS.red },
                              ]}
                            >
                              Clear all
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={handleCancelHighlight}
                          style={[
                            styles.noteActionButton,
                            {
                              backgroundColor: themeColors.background,
                              borderColor: themeColors.border,
                            },
                          ]}
                        >
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.noteActionText,
                              { color: themeColors.primaryText },
                            ]}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleRemoveSelectedHighlight}
                          disabled={!hasHighlightInSelectedRange}
                          style={[
                            styles.noteActionButton,
                            styles.noteDeleteButton,
                            {
                              borderColor: hasHighlightInSelectedRange
                                ? COLORS.red
                                : themeColors.border,
                            },
                          ]}
                        >
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.noteActionText,
                              {
                                color: hasHighlightInSelectedRange
                                  ? COLORS.red
                                  : themeColors.secondaryText,
                              },
                            ]}
                          >
                            Remove highlight
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleApplyHighlight}
                          disabled={!selectedTextRange}
                          style={[
                            styles.noteActionButton,
                            {
                              backgroundColor: selectedTextRange
                                ? themeColors.primary
                                : themeColors.border,
                              borderColor: selectedTextRange
                                ? themeColors.primary
                                : themeColors.border,
                            },
                          ]}
                        >
                          <Text
                            allowFontScaling={false}
                            style={styles.noteActionText}
                          >
                            Highlight
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.contentText,
                      {
                        fontSize: autoFontSize,
                        color: themeColors.primaryText,
                        fontFamily: fontStyle,
                      },
                    ]}
                  >
                    {highlightedSegments.map((segment, index) => (
                      <Text
                        key={`${index}:${segment.text}`}
                        style={
                          segment.color
                            ? { backgroundColor: segment.color }
                            : undefined
                        }
                      >
                        {segment.text}
                      </Text>
                    ))}
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
          <View style={styles.menu}>
            {isMoreOptionsOpen && (
              <View
                style={[
                  styles.moreOptionsPanel,
                  {
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                {moreActions.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    onPress={() => {
                      setIsMoreOptionsOpen(false);
                      item.function();
                    }}
                    style={styles.moreOption}
                    accessibilityRole="button"
                    accessibilityLabel={moreActionLabels[item.name]}
                  >
                    {item.icon}
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={[
                        styles.moreOptionLabel,
                        { color: themeColors.primaryText },
                      ]}
                    >
                      {moreActionLabels[item.name]}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View
                  style={[
                    styles.shareGuideCard,
                    {
                      backgroundColor: themeColors.background,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shareGuideIcon,
                      { backgroundColor: themeColors.primary },
                    ]}
                  >
                    <Icon name="share-2" color="#fff" size={18} />
                  </View>
                  <View style={styles.shareGuideCopy}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.shareGuideTitle,
                        { color: themeColors.primaryText },
                      ]}
                    >
                      Share this verse
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.shareGuideDescription,
                        { color: themeColors.secondaryText },
                      ]}
                    >
                      See how to post it on Facebook
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsMoreOptionsOpen(false);
                      setShowShareTutorial(true);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="View social sharing tutorial"
                    style={styles.shareGuideButton}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.shareGuideButtonText,
                        { color: themeColors.primary },
                      ]}
                    >
                      How to
                    </Text>
                    <Icon name="chevron-right" color={themeColors.primary} size={17} />
                  </TouchableOpacity>
                </View>
                <View style={styles.fontSliderContainer}>
                  <View style={styles.fontSliderLabels}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.fontSliderLabel,
                        { color: themeColors.primaryText },
                      ]}
                    >
                      Text size
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.fontSliderValue,
                        { color: themeColors.secondaryText },
                      ]}
                    >
                      {`${fontSize ?? 30} pt`}
                    </Text>
                  </View>
                  <View
                    style={styles.fontSliderTouchArea}
                    onLayout={(event) =>
                      setFontSliderWidth(event.nativeEvent.layout.width)
                    }
                    {...fontSliderPanResponder.panHandlers}
                    accessible
                    accessibilityLabel={`Text size ${fontSize ?? 30}`}
                    accessibilityRole="adjustable"
                    accessibilityValue={{
                      min: MIN_FONT_SIZE,
                      max: MAX_FONT_SIZE,
                      now: fontSize ?? 30,
                    }}
                    accessibilityActions={[
                      { name: "increment", label: "Increase text size" },
                      { name: "decrement", label: "Decrease text size" },
                    ]}
                    onAccessibilityAction={(event) => {
                      const delta =
                        event.nativeEvent.actionName === "increment" ? 1 : -1;
                      handleChangeSetting({
                        ...objSetting,
                        fontSize: Math.max(
                          MIN_FONT_SIZE,
                          Math.min(MAX_FONT_SIZE, (fontSize ?? 30) + delta),
                        ),
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.fontSliderTrack,
                        { backgroundColor: themeColors.border },
                      ]}
                    >
                      <View
                        style={[
                          styles.fontSliderProgress,
                          {
                            width: `${
                              (((fontSize ?? 30) - MIN_FONT_SIZE) /
                                (MAX_FONT_SIZE - MIN_FONT_SIZE)) *
                              100
                            }%`,
                            backgroundColor: themeColors.primary,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.fontSliderThumb,
                          {
                            left: `${
                              (((fontSize ?? 30) - MIN_FONT_SIZE) /
                                (MAX_FONT_SIZE - MIN_FONT_SIZE)) *
                              100
                            }%`,
                            borderColor: themeColors.primary,
                            backgroundColor: themeColors.background,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.fontSliderRangeLabels}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.fontSliderRangeText,
                        { color: themeColors.secondaryText },
                      ]}
                    >
                      A
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.fontSliderRangeText,
                        styles.largeRangeText,
                        { color: themeColors.secondaryText },
                      ]}
                    >
                      A
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {primaryActions.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={item.function}
                accessibilityRole="button"
                accessibilityLabel={primaryActionLabels[item.name]}
                style={styles.primaryAction}
              >
                {item.icon}
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.primaryActionLabel,
                    {
                      color:
                        item.name === "heart" && isFavorite
                          ? COLORS.red
                          : themeColors.secondaryText,
                    },
                  ]}
                >
                  {primaryActionLabels[item.name]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setIsMoreOptionsOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityLabel={
                isMoreOptionsOpen ? "Close more options" : "More options"
              }
              accessibilityState={{ expanded: isMoreOptionsOpen }}
              style={styles.primaryAction}
            >
              <Icon
                name={isMoreOptionsOpen ? "x" : "more-horizontal"}
                color={isMoreOptionsOpen ? themeColors.highlight : themeColors.primary}
                size={25}
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.primaryActionLabel,
                  {
                    color: isMoreOptionsOpen
                      ? themeColors.highlight
                      : themeColors.secondaryText,
                  },
                ]}
              >
                More
              </Text>
            </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    position: "relative",
  },
  content: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  display: {
    height: "90%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    paddingTop: 20,
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  displayContent: {
    flex: 1,
    flexDirection: "row",
    height: "79%",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    position: "relative",
    flexDirection: "row",
    flexShrink: 0,
    minHeight: 74,
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  primaryAction: {
    minWidth: 56,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  primaryActionLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 9,
    marginTop: 2,
  },
  moreOptionsPanel: {
    position: "absolute",
    bottom: "100%",
    left: 12,
    right: 12,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  moreOption: {
    width: "30%",
    minWidth: 76,
    minHeight: 62,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  moreOptionLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
  },
  shareGuideCard: {
    width: "100%",
    minHeight: 66,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  shareGuideIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  shareGuideCopy: {
    flex: 1,
  },
  shareGuideTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  shareGuideDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    marginTop: 1,
  },
  shareGuideButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
  },
  shareGuideButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
  },
  shareTutorialModal: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  shareTutorialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shareTutorialHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  shareTutorialClose: {
    padding: 6,
  },
  shareTutorialTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    marginTop: 12,
  },
  shareTutorialSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
    marginBottom: 10,
  },
  shareTutorialSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
  },
  shareTutorialStepIcon: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  shareTutorialStepNumber: {
    position: "absolute",
    top: -5,
    left: -5,
    zIndex: 1,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#fff",
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    lineHeight: 17,
    overflow: "hidden",
  },
  shareTutorialStepText: {
    flex: 1,
  },
  shareTutorialStepTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  shareTutorialStepDescription: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },
  facebookMark: {
    backgroundColor: "#1877F2",
  },
  facebookMarkText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 31,
    lineHeight: 38,
  },
  shareTutorialButton: {
    minHeight: 46,
    borderRadius: 12,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareTutorialButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  fontSliderContainer: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.lightGray,
  },
  fontSliderLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fontSliderLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  fontSliderValue: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },
  fontSliderTouchArea: {
    height: 32,
    justifyContent: "center",
  },
  fontSliderTrack: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 9,
  },
  fontSliderProgress: {
    height: 4,
    borderRadius: 2,
  },
  fontSliderThumb: {
    position: "absolute",
    width: 18,
    height: 18,
    top: -7,
    marginLeft: -9,
    borderWidth: 2,
    borderRadius: 9,
    elevation: 2,
  },
  fontSliderRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  fontSliderRangeText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
  },
  largeRangeText: {
    fontSize: 18,
  },
  chapter: {
    fontFamily: "Poppins-Bold",
    color: "#343434",
    fontSize: 20,
    textAlign: "center",
  },
  verseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  verse: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 15,
    textAlign: "center",
  },
  noteIndicator: {
    marginLeft: 8,
    backgroundColor: COLORS.red,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  noteIndicatorText: {
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    lineHeight: 12,
  },
  levelIndicator: {
    marginLeft: 8,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  levelIndicatorText: {
    fontFamily: "Poppins-Bold",
    fontSize: 9,
    lineHeight: 12,
  },
  contentText: {
    fontFamily: "Poppins-Regular",
    color: "#343434",
    fontSize: 30,
    textAlign: "center",
    margin: 10,
  },
  modal: {
    width: "80%",
    height: "80%",
    position: "absolute",
    zIndex: 20,
  },
  noteActionIconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  noteBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.red,
  },
  highlightBadge: {
    position: "absolute",
    right: -2,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#FFC107",
  },
  selectableContent: {
    width: "100%",
    padding: 0,
    textAlignVertical: "top",
  },
  highlightPicker: {
    marginHorizontal: 10,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 12,
    padding: 12,
  },
  highlightPrompt: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  highlightColors: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  highlightColorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
  },
  noteModalOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
    padding: 20,
  },
  noteModal: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  noteTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    marginBottom: 4,
  },
  noteSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    marginBottom: 12,
  },
  noteInput: {
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    fontSize: 16,
  },
  noteActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  noteActionButton: {
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
  },
  noteDeleteButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
  },
  noteActionText: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#fff",
  },
});

export default ViewChapter;
function addfavorite(type: string, index: number) {
  throw new Error("Function not implemented.");
}
