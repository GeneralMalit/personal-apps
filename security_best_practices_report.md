# Security Best Practices Report

## Executive summary

No critical or high severity findings were identified in the current scaffold. The repository is currently designed as an offline-first local utility with no remote API access, no telemetry, and a conservative permission set. Residual risk is centered on clipboard misuse by future features, extension permission creep, and Tauri capability drift if the app grows beyond its current single-purpose scope.

## Critical findings

None at this time.

## High findings

None at this time.

## Medium findings

### SEC-001 Extension clipboard writes depend on an offscreen document path that should stay tightly scoped

- Location: `apps/extension/src/background.ts`, `apps/extension/src/offscreen.ts`
- Impact: If future work broadens the message protocol or starts accepting arbitrary payloads from untrusted sources, the extension could become a clipboard abuse surface.
- Current assessment: safe in the current scaffold because only the internal service worker sends a fixed message shape and there are no external message listeners.
- Recommended guardrail: keep the message schema narrow, avoid `externally_connectable`, and never add clipboard-read behavior without a new review.

### SEC-002 Windows tray app permissions should remain minimal as Tauri features expand

- Location: `apps/windows/src-tauri/capabilities/default.json`, `apps/windows/src-tauri/src/main.rs`
- Impact: Tauri apps can become powerful local shells quickly if new plugins or wide window permissions are added casually.
- Current assessment: low-complexity setup with a single hidden window, clipboard write only, tray events, and a global shortcut.
- Recommended guardrail: review every new plugin and capability entry before adding it; prefer explicit allow permissions instead of broad defaults.

## Low findings

### SEC-003 Browser shortcut management is guidance-only by design

- Location: `apps/extension/src/options/OptionsApp.tsx`
- Impact: Users may assume the extension can fully enable or disable Chromium commands programmatically, which it cannot.
- Current assessment: the options page is honest about guidance and directs users to browser shortcut settings instead of pretending to control the platform.
- Recommended guardrail: keep this limitation documented and avoid building misleading toggles.

### SEC-004 Tooling audit warnings remain in bundled npm internals used by release tooling

- Location: root `package-lock.json` transitive dependencies through `semantic-release` and bundled `npm`
- Impact: the current `npm audit` output reports `brace-expansion` and `picomatch` issues inside bundled package-manager internals. These are build and release toolchain dependencies, not runtime dependencies of the extension or tray app.
- Current assessment: no direct runtime exposure in the shipped application path, but the warnings should still be revisited when upstream packages publish refreshed bundled npm versions.
- Recommended guardrail: keep `semantic-release` and npm tooling updated and re-check audit output during dependency maintenance.

## Secure defaults already present

- No `innerHTML` or `dangerouslySetInnerHTML`
- No remote network dependencies in runtime behavior
- No secret material committed into frontend code
- No telemetry endpoints
- No clipboard read functionality
- No success notifications that could leak copied values into visible OS surfaces
- Browser extension permissions limited to local operation needs

## Follow-up recommendations

1. Keep extension permissions minimal and review any new permission request before merging.
2. Add an end-to-end extension smoke test if the extension grows beyond its current single action.
3. Re-run a security review before adding auto-start, update channels, cloud sync, or any network feature.
