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
  it("describes browser shortcut guidance on Linux", () => {
    expect(getShortcutGuidance("linux")).toEqual({
      browserShortcutRecommended: true,
      summary: "Browser shortcut is optional and useful on Linux",
      details: "On Linux, the extension is always active, and a browser shortcut can be enabled if you want a faster copy path."
    });
  });

  it("describes tray shortcut guidance on Windows", () => {
    expect(getShortcutGuidance("windows")).toEqual({
      browserShortcutRecommended: false,
      summary: "Use the tray app first on Windows",
      details:
        "On Windows, the browser extension still works from the toolbar, but the tray app shortcut is usually the cleaner hotkey."
    });
  });

  it("returns a neutral fallback for other platforms", () => {
    expect(getShortcutGuidance("mac")).toEqual({
      browserShortcutRecommended: true,
      summary: "Browser shortcut is optional",
      details:
        "The extension always works from the toolbar. If you want a keyboard path, you can enable and assign the browser shortcut separately."
    });
  });
});
