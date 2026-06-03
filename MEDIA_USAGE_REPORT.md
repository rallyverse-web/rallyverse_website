# Media Usage Report

This report details the audit of all media assets in the RallyVerse codebase to ensure safe cleanup.

## Asset Reference Table

| Asset Path | Referenced By | Status | Action |
| :--- | :--- | :--- | :--- |
| `public/logo_transparent.png` | `app/layout.tsx` | Active | **Keep** |
| `public/logo/logo_transparent.png` | `components/ThemedLogo.tsx` | Active | **Keep** |
| `public/logo/black_logo_text_transparent.png` | `components/ThemedLogo.tsx` | Active | **Keep** |
| `public/logo/black_logo.png` | None | Unused | **Safe to Delete** |
| `public/logo/only_logo_black.png` | None | Unused | **Safe to Delete** |
| `public/posters/banner-coming-soon.png` | `lib/assets.ts` (`PLACEHOLDER_BANNER`) | Active | **Keep** (Placeholder) |
| `public/posters/poster-coming-soon.png` | `lib/assets.ts` (`PLACEHOLDER_POSTER`) | Active | **Keep** (Placeholder) |
| `public/posters/rally-series-01-bengaluru-badminton-tournament-2026-poster.png` | Dynamic mapping in `lib/assets.ts` (`getEventPosterPath`) | Active | **Keep** (Event Media) |
| `public/posters/rally-series-01-bengaluru-badminton-tournament-2026-poster-bw.png` | Dynamic mapping in `lib/assets.ts` (`getEventPosterBwPath`) | Active | **Keep** (Event Media) |
| `public/profile_pics/nirmal_jian.png` | `data/believers.ts` | Active | **Keep** |
| `public/sponsors/happywise-financial-services-bg-white.png` | None | Unused | **Safe to Delete** |
| `public/whatsapp_icon.svg` | None | Unused | **Safe to Delete** |
| `public/qrcode.jpeg` | None (previously `components/PaymentQR.tsx`, deleted) | Unused | **Safe to Delete** (Deleted) |
| `logo_transparent.png` (root-level duplicate) | None (outside of `public/` folder) | Unused | **Safe to Delete** |

## Audit Summary
- **Total Assets Evaluated**: 14
- **Active / Keep**: 8
- **Unused / Safe to Delete**: 6
