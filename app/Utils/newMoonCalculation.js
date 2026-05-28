const CHINESE_NEW_MOON_PH = {
  2025: [
    "2025-01-29T12:36:00+08:00",
    "2025-02-28T08:44:00+08:00",
    "2025-03-29T18:58:00+08:00",
    "2025-04-28T03:31:00+08:00",
    "2025-05-27T11:02:00+08:00",
    "2025-06-25T18:31:00+08:00",
    "2025-07-25T03:11:00+08:00",
    "2025-08-23T15:07:00+08:00",
    "2025-09-22T03:54:00+08:00",
    "2025-10-21T20:25:00+08:00",
    "2025-11-20T13:47:00+08:00",
    "2025-12-20T09:43:00+08:00",
  ],
  2026: [
    "2026-01-19T04:00:00+08:00",
    "2026-02-17T20:01:00+08:00",
    "2026-03-19T10:24:00+08:00",
    "2026-04-18T00:55:00+08:00",
    "2026-05-17T13:03:00+08:00",
    "2026-06-16T00:57:00+08:00",
    "2026-07-15T11:13:00+08:00",
    "2026-08-13T19:32:00+08:00",
    "2026-09-12T03:27:00+08:00",
    "2026-10-11T11:50:00+08:00",
    "2026-11-09T21:02:00+08:00",
    "2026-12-09T07:52:00+08:00",
  ],
};

const formatDatePH = (date) =>
  date.toLocaleDateString("en-US", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const formatTimePH = (date) =>
  date
    .toLocaleTimeString("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s/g, "")
    .toLowerCase();

export const newMoon = () => {
  const year = new Date().getFullYear();
  const list = CHINESE_NEW_MOON_PH[year] || [];

  return list.map((iso) => {
    const dt = new Date(iso);
    return {
      date: formatDatePH(dt),
      time: formatTimePH(dt),
      iso,
    };
  });
};
