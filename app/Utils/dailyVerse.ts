import { Verse } from "../types/interfaces";

type DailyVerseSelection = {
  verse: Verse;
  index: number;
};

export type DailyVerses = {
  morning: DailyVerseSelection | null;
  evening: DailyVerseSelection | null;
};

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const getStableIndex = (seed: string, length: number) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % length;
};

export function getDailyVerses(verses: Verse[], date = new Date()): DailyVerses {
  if (verses.length === 0) {
    return { morning: null, evening: null };
  }

  const dateKey = getDateKey(date);
  const morningIndex = getStableIndex(`${dateKey}-morning`, verses.length);
  let eveningIndex =
    verses.length > 1
      ? getStableIndex(`${dateKey}-evening`, verses.length)
      : morningIndex;

  if (verses.length > 1 && eveningIndex === morningIndex) {
    eveningIndex = (eveningIndex + 1) % verses.length;
  }

  return {
    morning: { verse: verses[morningIndex], index: morningIndex },
    evening: { verse: verses[eveningIndex], index: eveningIndex },
  };
}
