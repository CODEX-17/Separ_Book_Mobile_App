import AsyncStorage from "@react-native-async-storage/async-storage";
import { Favorite, Profile, Setting, VerseHighlight } from "../types/interfaces";

type AllowedKeys =
  | "SETTING"
  | "PROFILE"
  | "FAVORITE"
  | "NOTIFICATION"
  | "VERSE_NOTES"
  | "VERSE_HIGHLIGHTS"
  | "VERSE_LEVEL_COOLDOWN"
  | "VERSE_SHARE_REWARDS"
  | "CALENDAR_NEW_MOON"
  | "CALENDAR_FEAST"
  | "ANNOUNCEMENT_DISMISSED_V1";

interface NotificationSchedule {
  name: ("daily-verse-dayTime" | "daily-verse-nightTime")[];
}

type VerseNotesMap = Record<string, string>;

type KeyValueMap = {
  SETTING: Setting;
  PROFILE: Profile;
  FAVORITE: Favorite;
  NOTIFICATION: NotificationSchedule;
  VERSE_NOTES: VerseNotesMap;
  VERSE_HIGHLIGHTS: Record<string, VerseHighlight[]>;
  VERSE_LEVEL_COOLDOWN: Record<string, number>;
  VERSE_SHARE_REWARDS: {
    verseLastAwardedAt: Record<string, number>;
    dailyDate: string;
    dailyAwards: number;
  };
  CALENDAR_NEW_MOON: { date: string; time: string }[];
  CALENDAR_FEAST: { name: string; date: string }[];
  ANNOUNCEMENT_DISMISSED_V1: boolean;
};

export const storeData = async <K extends AllowedKeys>(
  key: K,
  value: KeyValueMap[K]
) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    alert("Failed to save data");
  }
};

export const getStoreData = async <K extends AllowedKeys>(
  key: K
): Promise<KeyValueMap[K] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? (JSON.parse(jsonValue) as KeyValueMap[K]) : null;
  } catch (e) {
    alert("Failed to load data");
    return null;
  }
};

export const removeStorageData = async (key: AllowedKeys) => {
  AsyncStorage.removeItem(key);

  const jsonValue = await AsyncStorage.getItem(key);
  console.log(jsonValue ? JSON.parse(jsonValue) : []);
};

export const logAsyncStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const stores = await AsyncStorage.multiGet(keys);

  console.log("📦 AsyncStorage:", JSON.stringify(stores, null, 2));
  console.table(stores);
};
