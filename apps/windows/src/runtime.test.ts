import { describe, expect, it, vi } from "vitest";

import { copyCurrentTimestamp } from "./runtime";

describe("copyCurrentTimestamp", () => {
  it("formats the system time and writes it to the clipboard", async () => {
    const writeText = vi.fn(async () => undefined);
    const now = () => new Date("2026-04-02T15:56:07");

    await expect(copyCurrentTimestamp(writeText, now)).resolves.toBe("3:56:07PM");
    expect(writeText).toHaveBeenCalledWith("3:56:07PM");
  });

  it("bubbles clipboard failures", async () => {
    const writeText = vi.fn(async () => {
      throw new Error("clipboard unavailable");
    });

    await expect(copyCurrentTimestamp(writeText, () => new Date("2026-04-02T09:04:02"))).rejects.toThrow(
      "clipboard unavailable"
    );
  });
});
