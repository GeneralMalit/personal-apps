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
      summary: "Browser shortcut recommended",
      details:
        "On Linux, the extension shortcut is often the fastest path because there is no Windows tray app to take over the copy action."
    };
  }

  if (normalized === "windows") {
    return {
      browserShortcutRecommended: false,
      summary: "Windows tray shortcut recommended",
      details:
        "On Windows, prefer the tray app shortcut so the browser shortcut does not compete with the desktop shortcut while Chromium is focused."
    };
  }

  return {
    browserShortcutRecommended: true,
    summary: "Choose the shortcut path that fits this device",
    details:
      "If this machine has a dedicated desktop companion app, prefer that. Otherwise, configuring the browser shortcut is reasonable."
  };
}
