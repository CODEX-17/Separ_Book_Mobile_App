export type ScannedCalendar =
  | {
      type: "newMoon";
      entries: { date: string; time: string }[];
    }
  | {
      type: "feast";
      entries: { name: string; date: string }[];
    };

const isValidCalendarDate = (date: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (!match) return false;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1000) return false;

  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

export const parseCalendarQr = (data: string): ScannedCalendar | null => {
  const newMoonEntries: { date: string; time: string }[] = [];
  const newMoonPattern =
    /(?:^|[^0-9])(\d{2}\/\d{2}\/\d{4})\s+(1[0-2]|0?[1-9]):([0-5]\d)(am|pm)\b/gi;
  let newMoonMatch: RegExpExecArray | null;

  while ((newMoonMatch = newMoonPattern.exec(data)) !== null) {
    const [, date, hour, minute, period] = newMoonMatch;
    if (!isValidCalendarDate(date)) continue;

    newMoonEntries.push({
      date,
      time: `${hour}:${minute}${period.toLowerCase()}`,
    });
  }

  const feastEntries: { name: string; date: string }[] = [];
  const feastPattern =
    /(?:^|[^A-Za-z])(Feast of [A-Za-z][A-Za-z ]*?)\s+(\d{2}\/\d{2}\/\d{4})(?!\d)/gi;
  let feastMatch: RegExpExecArray | null;

  while ((feastMatch = feastPattern.exec(data)) !== null) {
    const [, name, date] = feastMatch;
    if (!isValidCalendarDate(date)) continue;

    feastEntries.push({ name: name.trim(), date });
  }

  if (newMoonEntries.length && feastEntries.length) return null;
  if (newMoonEntries.length) {
    return { type: "newMoon", entries: newMoonEntries };
  }
  if (feastEntries.length) {
    return { type: "feast", entries: feastEntries };
  }

  return null;
};
