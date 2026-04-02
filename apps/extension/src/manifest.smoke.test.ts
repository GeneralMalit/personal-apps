import { describe, expect, it } from "vitest";

import manifest from "../public/manifest.json";

describe("extension manifest smoke test", () => {
  it("keeps the manifest minimal and MV3-compatible", () => {
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe("timestamp-copy");
    expect(manifest.version).toBe("0.1.0");
    expect(manifest.action?.default_title).toBe("Copy current time");
    expect(manifest.background?.service_worker).toBe("background.js");
    expect(manifest.background?.type).toBe("module");
    expect(manifest.options_page).toBe("options.html");
    expect(manifest.minimum_chrome_version).toBe("116");
  });

  it("requests only the permissions needed for local clipboard behavior", () => {
    expect(manifest.permissions).toEqual(["offscreen", "clipboardWrite", "storage"]);
    expect(manifest.commands?.["copy-timestamp"]?.description).toBe("Copy current time to the clipboard");
  });
});
