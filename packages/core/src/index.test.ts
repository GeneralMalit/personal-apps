import { describe, expect, it } from "vitest";

import {
  formatCurrentTimestamp,
  formatTimestamp,
  getCurrentSystemTime,
  getShortcutGuidance,
  normalizePlatform
} from "./index";

describe("formatTimestamp", () => {
  it("formats morning timestamps", () => {
    expect(formatTimestamp(new Date("2026-04-02T01:56:07"))).toBe("1:56:07AM");
  });

  it("formats noon correctly", () => {
    expect(formatTimestamp(new Date("2026-04-02T12:00:00"))).toBe("12:00:00PM");
  });

  it("formats midnight correctly", () => {
    expect(formatTimestamp(new Date("2026-04-02T00:00:00"))).toBe("12:00:00AM");
  });

  it("pads minutes and seconds", () => {
    expect(formatTimestamp(new Date("2026-04-02T21:04:02"))).toBe("9:04:02PM");
  });
});

describe("formatCurrentTimestamp", () => {
  it("uses the provided system clock provider", () => {
    const now = () => new Date("2026-04-02T15:45:09");

    expect(getCurrentSystemTime(now).toISOString()).toBe("2026-04-02T07:45:09.000Z");
    expect(formatCurrentTimestamp(now)).toBe("3:45:09PM");
  });
});

describe("normalizePlatform", () => {
  it("maps known platforms", () => {
    expect(normalizePlatform("win32")).toBe("windows");
    expect(normalizePlatform("linux")).toBe("linux");
    expect(normalizePlatform("darwin")).toBe("mac");
    expect(normalizePlatform("android")).toBe("android");
    expect(normalizePlatform("ios")).toBe("ios");
  });

  it("falls back to unknown", () => {
    expect(normalizePlatform(undefined)).toBe("unknown");
    expect(normalizePlatform("freebsd")).toBe("unknown");
  });
});

describe("getShortcutGuidance", () => {
  it("recommends browser shortcuts on Linux", () => {
    expect(getShortcutGuidance("linux")).toEqual({
      browserShortcutRecommended: true,
      summary: "Browser shortcut recommended",
      details:
        "On Linux, the extension shortcut is often the fastest path because there is no Windows tray app to take over the copy action."
    });
  });

  it("recommends tray shortcuts on Windows", () => {
    expect(getShortcutGuidance("windows")).toEqual({
      browserShortcutRecommended: false,
      summary: "Windows tray shortcut recommended",
      details:
        "On Windows, prefer the tray app shortcut so the browser shortcut does not compete with the desktop shortcut while Chromium is focused."
    });
  });

  it("returns a neutral fallback for other platforms", () => {
    expect(getShortcutGuidance("mac")).toEqual({
      browserShortcutRecommended: true,
      summary: "Choose the shortcut path that fits this device",
      details:
        "If this machine has a dedicated desktop companion app, prefer that. Otherwise, configuring the browser shortcut is reasonable."
    });
  });
});
