import { useEffect, useState } from "react";

import { getShortcutGuidance, type ShortcutGuidance } from "@timestamp-copy/core";

type CommandInfo = chrome.commands.Command;

type RuntimeState = {
  browserName: string;
  platform: string;
  commandShortcut: string | null;
  guidance: ShortcutGuidance;
};

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

  return {
    browserName: detectBrowserName(),
    platform: platformInfo.os,
    commandShortcut: copyCommand?.shortcut ?? null,
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

export function OptionsApp() {
  const [runtimeState, setRuntimeState] = useState<RuntimeState | null>(null);

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

  const { browserName, commandShortcut, guidance, platform } = runtimeState;

  return (
    <main className="page-shell">
      <section className="panel stack">
        <div className="section-header">
          <h1>timestamp-copy settings</h1>
          <p className="muted">
            Toolbar click copies immediately. This page is only for shortcut guidance and install-time notes.
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
            <h2>Recommendation</h2>
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
            <li>On Linux, configuring the browser shortcut is usually the best shortcut path.</li>
            <li>On Windows, use the tray app shortcut first when it is running.</li>
            <li>Keep only one shortcut path active per focused environment when possible.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
