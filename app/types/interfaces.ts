import { RankingTypes } from "./type";

export interface Verse {
  chapter: number;
  verse: number;
  content: string;
}

export interface Setting {
  theme: "dark" | "light";
  fontScale?: number;
  notificationsEnabled?: boolean;
  [key: string]: any;
}

export interface Profile {
  name: string;
  gender?: "male" | "female";
  rank: RankingTypes;
  level: number;
}

export interface Favorite {
  verseIndex: number[];
}

export interface VerseHighlight {
  start: number;
  end: number;
  color: string;
}

export interface NotificationSchedule {
  name: string;
  content?: string;
  value?: any;
  time?: string;
}

export type ScheduleNotificationDailyType = {
  name: string;
  content: string;
  value?: any;
};
