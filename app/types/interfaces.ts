import { RankingTypes } from "./type";

export interface Verse {
  chapter: number;
  verse: number;
  content: string;
}

export interface Setting {
  fontSize: number;
  theme: "light" | "dark";
}

export interface Profile {
  name: string;
  rank: RankingTypes;
  level: number;
}

export interface Favorite {
  verseIndex: number[];
}
