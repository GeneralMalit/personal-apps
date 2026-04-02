import { formatCurrentTimestamp } from "@timestamp-copy/core";

export type ClipboardWriter = (value: string) => Promise<void>;

export async function copyCurrentTimestamp(
  writeText: ClipboardWriter,
  now: () => Date = () => new Date()
): Promise<string> {
  const value = formatCurrentTimestamp(now);
  await writeText(value);
  return value;
}
