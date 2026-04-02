import { useEffect, useState } from "react";

import { listen } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { copyCurrentTimestamp } from "./runtime";

export function TrayRuntimeApp() {
  const [lastCopied, setLastCopied] = useState<string>("Nothing copied yet.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    void listen("copy-request", async () => {
      try {
        const value = await copyCurrentTimestamp(writeText);
        setLastCopied(value);
        setErrorMessage(null);
      } catch (error) {
        const safeMessage = error instanceof Error ? error.message : "Unable to copy the timestamp.";
        setErrorMessage(safeMessage);
      }
    }).then((unlisten) => {
      cleanup = unlisten;
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <main className="shell">
      <section className="panel">
        <h1>timestamp-copy is running</h1>
        <p>The visible UI is only a hidden runtime surface for the tray app.</p>
        <dl>
          <div>
            <dt>Last copied value</dt>
            <dd>{lastCopied}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{errorMessage ?? "Ready for tray clicks and shortcut events."}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
