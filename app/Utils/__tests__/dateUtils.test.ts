/// <reference types="jest" />

import { convertDateFormatIntoString } from "../dateUtils";

describe("convertDateFormatIntoString", () => {
  it("formats QR dates with four-digit years", () => {
    expect(convertDateFormatIntoString("01/20/2026")).toBe("Jan. 20, 2026");
  });

  it("preserves formatting for ISO and two-digit-year dates", () => {
    expect(convertDateFormatIntoString("2026-01-20")).toBe("Jan. 20, 2026");
    expect(convertDateFormatIntoString("1/20/26")).toBe("Jan. 20, 2026");
  });
});
