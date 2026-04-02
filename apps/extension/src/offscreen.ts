type CopyMessage = {
  type: "copy-timestamp";
  value: string;
};

async function writeClipboardText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.append(textArea);
  textArea.select();

  const successful = document.execCommand("copy");
  textArea.remove();

  if (!successful) {
    throw new Error("Clipboard write fallback failed.");
  }
}

chrome.runtime.onMessage.addListener((message: CopyMessage, _sender, sendResponse) => {
  if (message.type !== "copy-timestamp") {
    return undefined;
  }

  void writeClipboardText(message.value)
    .then(() => sendResponse({ ok: true }))
    .catch((error: unknown) => {
      const safeMessage = error instanceof Error ? error.message : "Clipboard write failed.";
      sendResponse({ ok: false, error: safeMessage });
    });

  return true;
});
