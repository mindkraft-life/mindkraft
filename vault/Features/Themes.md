---
type: feature
sources: [app.js, index.html, style.css]
last_verified: 2026-10-05
---
# Themes

**In one line:** Mindkraft ships two theme presets — Dark (default) and Light — chosen in Settings and saved to `settings.theme`; a full custom-colour and gradient editor exists in the code but is locked ("coming soon") except for accounts that already had a custom theme.

## How it works
- `THEMES` = Dark (`default`) and Light, each with `mode`, `bg`, `card`, `accent`, `progress`. `applyThemePreset(id, el)` previews; `saveTheme()` persists to `settings.theme`.
- `loadTheme()` (called from `loadSettings`) applies CSS variables, `data-theme-mode` on `<html>`, glow gradients and the swatch row. `loadUserData` applies the mode early to avoid a flash.
- Custom editor: `CUSTOM_COLOR_VARS` (eleven CSS variables), `GRADIENT_PRESETS` (Aurora, Ember, Ocean, Sakura, Verdant, Dusk, Ice, None), three background glows with opacity and angle, saved slots (`settings.savedThemes`, `saveCustomSlot`, `loadSavedThemeSlot`, `deleteSavedThemeSlot`). The Custom swatch is clickable only if the active theme is already `custom`.
- Berserk Mode adds its own colour class; a wrapper on `applyThemePreset` keeps it.
- The bottom-navigation style is chosen in the same Settings card but stored in localStorage, not Firestore ([[Bottom Navigation]]).

## Key functions
- `loadTheme`, `applyThemePreset`, `saveTheme`, `_applyThemeMode`, `previewThemeColor`, `activateCustomTheme`, `toggleCustomThemePanel`, `buildColorGrid`, `buildGradientPresets`, `applyGradientPreset`, `updateGradientPreview`, `onCustomColorInput`, `onColorHexTextInput`, `onGlowColorInput`, `onGlowHexInput`, `copyHex`, `applyBgGlow`, `saveCustomSlot`, `loadSavedThemeSlot`, `deleteSavedThemeSlot`, `renderSavedThemeSlots`, `adjustColor`, `normalizeToHex`, `hexToRgb`.

## Data it touches
- [[users]] (`settings.theme`, `settings.savedThemes`)

## Connected to
- [[Settings Page]], [[Berserk Mode]], [[Bottom Navigation]], [[Level-Up Share Card]], [[Nav Browser Test]]

## If you change this
- The in-app guide (Settings › How to Use) still calls custom theming "coming soon", consistent with the lock; the editor code (~400 lines) only serves grandfathered accounts.
- Every nav style must paint correctly in both themes (asserted by the nav test).

## Where in the code
- app.js — `THEMES`, `CUSTOM_COLOR_VARS`, `GRADIENT_PRESETS` and theme functions (after the Settings handlers, before `processStreakSystem`).
- index.html — Settings "Theme" card.
