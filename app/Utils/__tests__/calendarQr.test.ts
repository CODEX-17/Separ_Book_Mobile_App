/// <reference types="jest" />

import { parseCalendarQr } from "../calendarQr";

describe("parseCalendarQr", () => {
  it("parses a multi-line New Moon calendar", () => {
    expect(parseCalendarQr("01/19/2026 4:00am\n02/20/2026 6:00am")).toEqual({
      type: "newMoon",
      entries: [
        { date: "01/19/2026", time: "4:00am" },
        { date: "02/20/2026", time: "6:00am" },
      ],
    });
  });

  it("parses a Feast date", () => {
    expect(parseCalendarQr("Feast of Passover 02/01/2026")).toEqual({
      type: "feast",
      entries: [{ name: "Feast of Passover", date: "02/01/2026" }],
    });
  });

  it("extracts calendar entries and ignores surrounding text", () => {
    expect(
      parseCalendarQr(
        "New Moon Schedule\nJanuary observation: 01/19/2026 4:00am\nMore info at example.com"
      )
    ).toEqual({
      type: "newMoon",
      entries: [{ date: "01/19/2026", time: "4:00am" }],
    });

    expect(
      parseCalendarQr(
        "Annual calendar\nPassover details: Feast of Passover 02/01/2026\nEnd of schedule"
      )
    ).toEqual({
      type: "feast",
      entries: [{ name: "Feast of Passover", date: "02/01/2026" }],
    });
  });

  it("rejects malformed, impossible, and mixed calendar content", () => {
    expect(parseCalendarQr("01/19/2026 4:00 am")).toBeNull();
    expect(parseCalendarQr("02/30/2026 6:00am")).toBeNull();
    expect(parseCalendarQr("Event 101/19/2026 4:00am")).toBeNull();
    expect(
      parseCalendarQr("01/19/2026 4:00am\nFeast of Passover 02/01/2026")
    ).toBeNull();
  });
});
