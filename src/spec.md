# Specification

## Summary
**Goal:** Add a pixel-art playground landscape background to the Home/Setup screen and make the core app flow work reliably end-to-end for both logged-in and logged-out users.

**Planned changes:**
- Add a new static pixel-art playground landscape background asset and reference it via a stable public path.
- Apply the new background to the Home/Setup screen with readability safeguards (e.g., tint/blur/solid panels), ensuring it doesn’t capture pointer events and doesn’t obscure the persistent PetOverlay during an active session.
- Fix end-to-end runtime and state issues across: Internet Identity login → profile setup (when missing) → start session → focus timer → break transition → save completed session (exactly once) → show session in Progress without refresh; handle unauthenticated usage without unauthorized errors breaking the UI.
- Synchronize saved user settings (focus duration, break duration, wasted platforms) so Home/Setup prefills from saved defaults when logged in, Progress settings changes persist and reflect back on Home/Setup, and distraction check-ins use the saved wastedPlatforms list; use local defaults when not logged in.

**User-visible outcome:** The Home/Setup screen shows a playground pixel-art background while remaining readable and interactive, and users can reliably complete the full session flow and see results in Progress, with settings consistently applied whether logged in or using the app unauthenticated.
