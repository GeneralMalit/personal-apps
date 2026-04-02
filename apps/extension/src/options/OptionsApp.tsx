import { useEffect, useState, type ChangeEvent } from "react";

import { getShortcutGuidance, type ShortcutGuidance } from "@timestamp-copy/core";

type CommandInfo = chrome.commands.Command;

type RuntimeState = {
  browserName: string;
  platform: string;
  commandShortcut: string | null;
  shortcutEnabled: boolean;
  guidance: ShortcutGuidance;
};

const SHORTCUT_ENABLED_STORAGE_KEY = "shortcutEnabled";

function detectBrowserName(): string {
  const agent = navigator.userAgent.toLowerCase();

  if (agent.includes("brave")) {
    return "Brave";
  }

  if (agent.includes("edg/")) {
    return "Microsoft Edge";
  }

  if (agent.includes("chrome/")) {
    return "Chromium browser";
  }

  return "Chromium-based browser";
}

async function loadRuntimeState(): Promise<RuntimeState> {
  const platformInfo = await chrome.runtime.getPlatformInfo();
  const commands = await chrome.commands.getAll();
  const copyCommand = commands.find((command: CommandInfo) => command.name === "copy-timestamp");
  const storedSettings = await chrome.storage.local.get({
    [SHORTCUT_ENABLED_STORAGE_KEY]: false
  });

  return {
    browserName: detectBrowserName(),
    platform: platformInfo.os,
    commandShortcut: copyCommand?.shortcut ?? null,
    shortcutEnabled: Boolean(storedSettings[SHORTCUT_ENABLED_STORAGE_KEY]),
    guidance: getShortcutGuidance(platformInfo.os)
  };
}

async function openShortcutManager(): Promise<void> {
  try {
    await chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch (error) {
    console.error("Unable to open browser shortcut settings", error);
  }
}

async function setShortcutEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({
    [SHORTCUT_ENABLED_STORAGE_KEY]: enabled
  });
}

export function OptionsApp() {
  const [runtimeState, setRuntimeState] = useState<RuntimeState | null>(null);
  const [savingShortcut, setSavingShortcut] = useState(false);

  useEffect(() => {
    void loadRuntimeState().then(setRuntimeState);
  }, []);

  if (!runtimeState) {
    return (
      <main className="page-shell">
        <section className="panel">
          <p className="muted">Loading settings...</p>
        </section>
      </main>
    );
  }

  const { browserName, commandShortcut, guidance, platform, shortcutEnabled } = runtimeState;

  async function handleShortcutToggle(event: ChangeEvent<HTMLInputElement>) {
    const nextEnabled = event.target.checked;
    setSavingShortcut(true);

    try {
      await setShortcutEnabled(nextEnabled);
      setRuntimeState((current) =>
        current
          ? {
              ...current,
              shortcutEnabled: nextEnabled
            }
          : current
      );
    } finally {
      setSavingShortcut(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="panel stack">
        <div className="section-header">
          <h1>timestamp-copy settings</h1>
          <p className="muted">
            Toolbar click copies immediately. This page controls the optional browser shortcut.
          </p>
        </div>

        <div className="grid">
          <article className="card stack">
            <h2>Environment</h2>
            <dl className="facts">
              <div>
                <dt>Browser</dt>
                <dd>{browserName}</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>{platform}</dd>
              </div>
              <div>
                <dt>Configured browser shortcut</dt>
                <dd>{commandShortcut ?? "Not configured"}</dd>
              </div>
            </dl>
          </article>

          <article className="card stack">
            <h2>Browser shortcut</h2>
            <label className="toggle">
              <span className="toggle-text">
                <strong>Enable browser shortcut handling</strong>
                <span className="muted">
                  The extension stays active either way. Turn this on if you have assigned a browser hotkey and want the extension to respond to it.
                </span>
              </span>
              <input
                checked={shortcutEnabled}
                disabled={savingShortcut}
                onChange={(event) => void handleShortcutToggle(event)}
                type="checkbox"
              />
            </label>
            <p className="status">{guidance.summary}</p>
            <p className="muted">{guidance.details}</p>
            <button className="button" type="button" onClick={() => void openShortcutManager()}>
              Open browser shortcut settings
            </button>
          </article>
        </div>

        <article className="note">
          <h2>How to use this extension well</h2>
          <ul>
            <li>Click the extension icon any time you want an instant timestamp copy.</li>
            <li>If you want a keyboard path, turn on the shortcut toggle and assign a browser hotkey in Chromium or Brave.</li>
            <li>Do not use Ctrl+Shift+T for this extension. Chromium reserves that combo for reopening closed tabs.</li>
            <li>Alt+Shift+T is a safer browser shortcut choice if you want one.</li>
            <li>On Linux, the browser shortcut is often the most useful shortcut path.</li>
            <li>On Windows, the tray app shortcut is usually the cleaner option when it is running.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
