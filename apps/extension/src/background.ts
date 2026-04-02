import { formatCurrentTimestamp } from "@timestamp-copy/core";

const COPY_MESSAGE_TYPE = "copy-timestamp";
const OFFSCREEN_DOCUMENT_PATH = "offscreen.html";

let offscreenDocumentPromise: Promise<void> | null = null;

async function ensureOffscreenDocument(): Promise<void> {
  if (offscreenDocumentPromise) {
    return offscreenDocumentPromise;
  }

  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
  const runtimeWithContexts = chrome.runtime as typeof chrome.runtime & {
    getContexts?: (options: {
      contextTypes: string[];
      documentUrls: string[];
    }) => Promise<Array<{ documentUrl?: string }>>;
  };

  const existingContexts = runtimeWithContexts.getContexts
    ? await runtimeWithContexts.getContexts({
        contextTypes: ["OFFSCREEN_DOCUMENT"],
        documentUrls: [offscreenUrl]
      })
    : [];

  if (existingContexts.length > 0) {
    return;
  }

  offscreenDocumentPromise = chrome.offscreen
    .createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.CLIPBOARD],
      justification: "Copy the current local time to the clipboard from the extension action and command."
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);

      if (!message.includes("single offscreen")) {
        throw error;
      }
    })
    .finally(() => {
      offscreenDocumentPromise = null;
    });

  return offscreenDocumentPromise;
}

async function copyTimestamp(): Promise<void> {
  await ensureOffscreenDocument();

  const response = await chrome.runtime.sendMessage({
    type: COPY_MESSAGE_TYPE,
    value: formatCurrentTimestamp()
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "Unable to copy timestamp to the clipboard.");
  }
}

chrome.action.onClicked.addListener(() => {
  void copyTimestamp().catch((error) => {
    console.error("timestamp-copy action failed", error);
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== COPY_MESSAGE_TYPE) {
    return;
  }

  void copyTimestamp().catch((error) => {
    console.error("timestamp-copy command failed", error);
  });
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    void chrome.runtime.openOptionsPage();
  }
});
