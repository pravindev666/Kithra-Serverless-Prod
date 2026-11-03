# Kithra — Reworked Premium OG & Favicon Kit (2026-11-04)

This is the **redesigned set**, deliberately different from the landing page. Simple premium color backgrounds, high-contrast editorial typography, subtle interwoven motifs, and no full landing-page screenshots.

## What is inside

- `01_OG_Cards/` — 10 Open Graph compositions (6 primary + 4 ivory alternatives), each at *exact* 1200×630 and 2400×1260 PNG dimensions.
- `02_Favicons/` — simplified crisp icon artwork at browser sizes (16–1024), SVG, ICO, Apple Touch, Android and a premium rendered app-icon alternative.
- `03_Preview/` — preview contact sheet.
- `04_Source_Generated/` — unmodified high-resolution image-generated masters. These are raster sources, **not vector originals**; higher-resolution exports are Lanczos resampled.
- `05_Integration/` — Vite-ready static assets plus HTML metadata.

## Install to Kithra

1. Copy the contents of `05_Integration/public/assets/kithra/` into `C:\Users\hp\Desktop\Kithra\public\assets\kithra\`.
2. Merge the tags from `05_Integration/HEAD_METADATA_SNIPPET.html` into the existing `index.html`. Remove/merge previous duplicate `og:image`, favicon and manifest tags.
3. Replace `https://YOUR-REAL-DOMAIN` with your verified published domain. Social bots need absolute public image URLs.
4. Use the default `Kithra_Main_Dark_OG_1200x630.png` for the website and the four named images for each intentionally public social-share route. Static HTML must have the corresponding metadata at response time; React-only metadata changes may not be read by crawlers.
5. After deployment, verify assets load with HTTP 200 and correct content type. Clear the social preview cache if an old OG card remains.

Do **not** treat any social OG card as an on-page interactive button or copy all `04_Source_Generated` masters into public assets.

## Important production quality note

The OG compositions were originally generated as raster artwork at about 1731×909. The exact 1200×630 exports are optimized downscales; the 2400×1260 PNGs are upscaled convenience variants, not true native vectors. The favicon.svg is a separately drawn simplified small-size version of the interwoven-loop leaf mark; the detailed rendered app icon is included as an optional alternative.
