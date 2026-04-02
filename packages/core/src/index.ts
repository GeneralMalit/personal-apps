export type SupportedPlatform = "windows" | "linux" | "mac" | "android" | "ios" | "unknown";

export type ShortcutGuidance = {
  browserShortcutRecommended: boolean;
  summary: string;
  details: string;
};

export function formatTimestamp(date: Date): string {
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const meridiem = hours24 >= 12 ? "PM" : "AM";

  return `${hours12}:${minutes}:${seconds}${meridiem}`;
}

export function getCurrentSystemTime(now: () => Date = () => new Date()): Date {
  return now();
}

export function formatCurrentTimestamp(now: () => Date = () => new Date()): string {
  return formatTimestamp(getCurrentSystemTime(now));
}

export function normalizePlatform(platform: string | undefined): SupportedPlatform {
  if (!platform) {
    return "unknown";
  }

  const value = platform.toLowerCase();

  if (value.includes("mac") || value.includes("darwin")) {
    return "mac";
  }

  if (value.includes("win")) {
    return "windows";
  }

  if (value.includes("linux")) {
    return "linux";
  }

  if (value.includes("android")) {
    return "android";
  }

  if (value.includes("ios")) {
    return "ios";
  }

  return "unknown";
}

export function getShortcutGuidance(platform: string | undefined): ShortcutGuidance {
  const normalized = normalizePlatform(platform);

  if (normalized === "linux") {
    return {
      browserShortcutRecommended: true,
      summary: "Browser shortcut is optional and useful on Linux",
      details:
        "On Linux, the extension is always active, and a browser shortcut can be enabled if you want a faster copy path."
    };
  }

  if (normalized === "windows") {
    return {
      browserShortcutRecommended: false,
      summary: "Use the tray app first on Windows",
      details:
        "On Windows, the browser extension still works from the toolbar, but the tray app shortcut is usually the cleaner hotkey."
    };
  }

  return {
    browserShortcutRecommended: true,
    summary: "Browser shortcut is optional",
    details:
      "The extension always works from the toolbar. If you want a keyboard path, you can enable and assign the browser shortcut separately."
  };
}
