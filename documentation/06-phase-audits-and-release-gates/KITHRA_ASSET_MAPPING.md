# Kithra Asset Mapping & Brand Integration Specification

## 1. Asset Inventory & Mapping

| Brand Kit Source (`Kithra_Reworked_OG_Favicon_Kit`) | Public Deployed Location (`public/assets/kithra/`) | Dimensions | Size | Purpose & Usage |
| :--- | :--- | :---: | :---: | :--- |
| `01_OG_Cards/Kithra_Main_Dark_OG_1200x630.png` | `Kithra_Main_Dark_OG_1200x630.png` | 1200 × 630 | 125.7 KB | Primary OpenGraph image for root domain and general links. |
| `01_OG_Cards/Kithra_Main_Ivory_OG_1200x630.png` | `Kithra_Main_Ivory_OG_1200x630.png` | 1200 × 630 | 136.8 KB | Ivory alternative for light-mode sharing contexts. |
| `01_OG_Cards/Kithra_Friendship_OG_1200x630.png` | `Kithra_Friendship_OG_1200x630.png` | 1200 × 630 | 128.0 KB | Dynamic OG card for `/friendship` links. |
| `01_OG_Cards/Kithra_Dating_OG_1200x630.png` | `Kithra_Dating_OG_1200x630.png` | 1200 × 630 | 81.5 KB | Dynamic OG card for `/dating` links. |
| `01_OG_Cards/Kithra_Matrimony_OG_1200x630.png` | `Kithra_Matrimony_OG_1200x630.png` | 1200 × 630 | 135.7 KB | Dynamic OG card for `/matrimony` links. |
| `01_OG_Cards/Kithra_Cofounders_OG_1200x630.png` | `Kithra_Cofounders_OG_1200x630.png` | 1200 × 630 | 164.4 KB | Dynamic OG card for `/cofounders` links. |
| `02_Favicons/favicon.svg` | `favicon.svg` & `/favicon.svg` | Vector | 816 B | Modern browser SVG favicon with theme-aware styling. |
| `02_Favicons/favicon.ico` | `favicon.ico` & `/favicon.ico` | Multi (16–48) | 12.8 KB | Universal legacy browser favicon fallback. |
| `02_Favicons/apple-touch-icon.png` | `apple-touch-icon.png` | 180 × 180 | 11.4 KB | iOS Safari home screen bookmark icon. |
| `02_Favicons/android-chrome-192x192.png` | `android-chrome-192x192.png` | 192 × 192 | 12.2 KB | Android PWA home screen icon. |
| `02_Favicons/android-chrome-512x512.png` | `android-chrome-512x512.png` | 512 × 512 | 39.5 KB | Android splash screen and high-res PWA icon. |
| `05_Integration/.../site.webmanifest` | `site.webmanifest` | JSON | 513 B | Web App Manifest for PWA installation. |

---

## 2. WhatsApp Optimization Guarantee

* **Maximum Threshold:** 500 KB (WhatsApp API and scraper cutoff)
* **Kithra Main Dark OG Card:** **125.7 KB** (75% below cutoff)
* **Kithra Dating OG Card:** **81.5 KB** (84% below cutoff)
* **Kithra Friendship OG Card:** **128.0 KB** (74% below cutoff)
* **Kithra Matrimony OG Card:** **135.7 KB** (73% below cutoff)
* **Kithra Cofounders OG Card:** **164.4 KB** (67% below cutoff)

All cards render crisply on mobile retina displays without triggering WhatsApp size rejections or blank preview placeholders.

