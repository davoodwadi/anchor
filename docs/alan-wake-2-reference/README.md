# Alan Wake 2 — typography, UI & manuscript reference

Reference board for borrowing the *Alan Wake 2* (Remedy, 2023) look. Images in
`images/` are © Remedy Entertainment / Epic Games ("All Rights Reserved") and are
here for **internal design reference only** — don't ship them in the app or
publish them.

## Typefaces

Identified by [Fonts In Use](https://fontsinuse.com/uses/63024/alan-wake-2-video-game):

| Use | Typeface | Notes |
| --- | --- | --- |
| Logo (`ALAN WAKE II`) | **Compacta** (bold, condensed) | `01-logo-compacta.png` |
| Chapter title cards | **Compacta** | Huge, all caps, centered over gameplay (`05`, `06`) |
| Chapter kicker (`RETURN 1`, `INITIATION 5`) | **Aktiv Grotesk Condensed** | Small caps, wide letter-spacing |
| Menus, HUD, inventory, Mind Place | **Aktiv Grotesk Condensed** Regular, Bold sparingly | All-caps for nav/labels, sentence case for body |
| Website / promo | Aktiv Grotesk + Aktiv Grotesk Extended | `08`, `09` |
| Manuscript pages | Typewriter face (Courier-like, slab serifs, uneven ink) | Exact font not documented; looks like a scanned/typed texture, not a UI font |
| Manuscript annotations | Handwritten all-caps marker | Alan's margin notes (`17`) |

Compacta and Aktiv Grotesk are commercial (Aktiv via Dalton Maag / Adobe Fonts).
Free stand-ins that get close:

- Compacta → **Anton**, **Bebas Neue** (lighter), **Oswald 700** (Google Fonts)
- Aktiv Grotesk Condensed → **Barlow Condensed**, **Roboto Condensed**, **IBM Plex Sans Condensed**
- Typewriter → **Courier Prime**, **Special Elite** (more worn ink), **IBM Plex Mono** (cleaner)
- Handwriting → **Permanent Marker**, **Rock Salt** (rougher), **Gochi Hand**

## Color

Sampled from compressed screenshots, so treat as approximate.

| Token | Hex | Where |
| --- | --- | --- |
| Brand sage green | `#95A99D` | Saga's title cards, brand-wide washed-out green |
| Wake red | `#AF2626` | Alan's (Dark Place) title cards |
| Menu text | `~#969996` | Muted grey-green caps on near-black |
| Menu background | `#0E0E0E`–`#1C1E1D` | Not pure black |
| Manuscript paper | `#807368`-ish | Grey-brown, mottled, stained |
| Mind Place paper | `#907E61` / `#6C5E45` | Warmer yellowed paper under desk lamp |

Two-story color coding: **Saga = sage green**, **Alan = red**. Same layout, same
type; only the color flips.

## UI patterns

- **Main menu (`02`)** — a top-down shot of Alan's desk (typewriter, lamp) in a pool
  of light; a centered stack of all-caps condensed items underneath. No boxes or
  buttons, just type.
- **Options (`03`)** — left-aligned list, tabbed header (`GAMEPLAY CONTROLS GRAPHICS…`)
  with keycap hints (`Q` / `E`) at the ends; selected tab/value gets a thin
  underline and brighter white. Right column shows a preview image plus
  sentence-case description.
- **HUD / inventory (`04`)** — top-right grid of dark translucent tiles with
  small numeric counts; goals panel top-left with a checkbox; item description in
  plain sentence case. Health is a red vignette over the whole screen, not a bar.
  Flashlight battery is a thin segmented bar bottom center.
- **Keycap chips** — tiny rounded grey rectangles with the key letter (`ESC`, `TAB`,
  `Q`, `E`, `ENTER`) sitting next to a label. Used everywhere.
- **Unread markers** — small yellow/amber dots next to new items.
- **Chapter title cards (`05`, `06`)** — gameplay keeps running behind; a kicker in
  small tracked caps above or below a massive Compacta word that spans ~70% of the
  screen width.

## Manuscript pages

What the pages actually look like (`10`, `15`–`17`):

- **Paper**: letter-size proportions (~1000×1296), grey-brown mottled texture with
  darker edges and stains. No header, title, or page number on the page itself.
- **Type**: typewriter monospace, ~11 words per line, **very loose double spacing**,
  first-line paragraph indent, hyphenated line breaks (`resem-` / `bled`).
  Ink density varies letter to letter.
- **Edits** (Return drafts): heavy black scribble-outs over whole phrases,
  handwritten all-caps insertions between lines, margin notes with arrows and
  asterisk callouts. The page reads like a draft being fought over.
- **Prose voice**: short, clipped noir sentences in past tense. "Saga blinked.
  Shook the feeling from her head."
- **In the Mind Place (`07`)** — the collected page lies on the desk at an angle on
  the right; a clean, readable transcript in Aktiv Grotesk is overlaid left of it;
  chapter list on the left (`RETURN 1 - INVITATION 5/6`); bottom actions
  `PLAY NARRATION [ENTER]` / `CLOSE [F]`. So readability comes from the UI layer,
  and the page itself is atmosphere.
- **In the world (`11`)** — pages are physical objects pinned or lying in the level,
  lit by the flashlight.
- **Paper texture (`12`)** — the in-game base color texture, useful as a background.
- **Book (`13`, `14`)** — the in-fiction *Return* novel jacket and cover.

## Image index

| File | What | Source |
| --- | --- | --- |
| `00-key-art.jpg` | Key art | Epic Games Store via Fonts In Use |
| `01-logo-compacta.png` | Logo | Wikimedia via Fonts In Use |
| `02-main-menu.png` | Main menu | Fonts In Use |
| `03-settings-menu.jpg` | Options menu | Fonts In Use |
| `04-hud-inventory.jpg` | HUD + inventory | Fonts In Use |
| `05-title-card-saga.jpg` | Saga chapter card (green) | Fonts In Use |
| `06-title-card-wake.jpg` | Alan chapter card (red) | Fonts In Use |
| `07-manuscript-mind-place.jpg` | Reading a page in the Mind Place | Fonts In Use |
| `08-website-main.png` | alanwake.com home | Fonts In Use |
| `09-website-news.png` | alanwake.com news | Fonts In Use |
| `10-manuscript-page-deja-vu.webp` | Clean typed page | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/Saga_Anderson%27s_Deja_Vu) |
| `11-manuscript-page-in-world.webp` | Page as in-world object | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/Manuscript_Pages_(Alan_Wake_2)) |
| `12-manuscript-paper-texture.webp` | Paper base color texture | Alan Wake Wiki |
| `13-return-book-jacket.webp` | *Return* book jacket | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/Return_(manuscript)) |
| `14-return-cover.webp` | *Return* cover | Alan Wake Wiki |
| `15-manuscript-page-general-store.webp` | Typed page | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/Saga_At_The_General_Store) |
| `16-manuscript-page-safe-haven.webp` | Typed page | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/Saga_Finds_A_Safe_Haven) |
| `17-manuscript-page-the-message.webp` | Edited draft: scribbles + handwritten notes | [Alan Wake Wiki](https://alanwake.fandom.com/wiki/The_Message) |

## Sources

- [Fonts In Use — Alan Wake 2 video game](https://fontsinuse.com/uses/63024/alan-wake-2-video-game)
- [Alan Wake Wiki — Manuscript Pages (Alan Wake 2)](https://alanwake.fandom.com/wiki/Manuscript_Pages_(Alan_Wake_2))
- [Alan Wake Wiki — Return (manuscript)](https://alanwake.fandom.com/wiki/Return_(manuscript))
- [Remedy — GDC 2024 talks on creating Alan Wake 2](https://www.remedygames.com/article/explore-remedys-gdc2024-talks-on-creating-alan-wake-2) (art/narrative; no UI talk)
