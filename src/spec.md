# Specification

## Summary
**Goal:** Fix the pet overlay so it smoothly follows the user during active sessions, renders only a single sprite frame (not the full sprite sheet), and update the browser icon/favicon to a single-pet pixel-art icon.

**Planned changes:**
- Update PetOverlay positioning logic so, during an active focus/break session, the overlay tracks pointer movement smoothly, stays fully within the viewport, and remains non-blocking to page interactions except for its own controls.
- Fix PetOverlay sprite rendering so only one 128x128 frame is visible at a time (no adjacent frames), while keeping the speech bubble and mute icon correctly anchored relative to the visible pet.
- Replace the app favicon/app icon assets/config so the browser tab (and any existing manifest/PWA icons) use a single-pet pixel-art icon instead of any sprite sheet/strip.

**User-visible outcome:** During sessions, the pet overlay follows the user’s movement smoothly without blocking the app, shows one pet (not a strip of frames), and the browser tab icon displays a single pet.
