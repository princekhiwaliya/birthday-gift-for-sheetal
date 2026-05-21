# A Birthday Gift — For Sheetal, With Love ♥

A personal, mobile-first birthday gift website built for Sheetal's 22nd birthday (22 · 05 · 2026).

Six little pages. One whole heart.

## Pages

| # | Page | Theme |
|---|---|---|
| — | `index.html` | Landing — soft pink, links to all pages |
| 01 | `1-happy-birthday.html` | Birthday card · Dancing Script + soft pink |
| 02 | `2-memories.html` | Scrapbook · scattered polaroids + handwritten captions |
| 03 | `3-queen.html` | Royal edition · dark black + gold, solo photos |
| 04 | `4-magazine.html` | Editorial spread · Bodoni Moda · "US." cover story |
| 05 | `5-heart-mosaic.html` | 26 photos arranged in the shape of a heart |
| 06 | `6-timeline.html` | A love letter in 5 chapters |

## Features

- **Mobile-first** — 480px max container, looks great on phones
- **Image gallery viewer** — click any photo → fullscreen lightbox with zoom, swipe nav, romantic styling
- **Hindi + English (Hinglish)** writing throughout
- **Data-driven** — all text and image assignments controlled by `data.js`
- **Admin dashboard** (`/admin/`) for editing text + swapping photos + uploading new ones
- **Auto-save** to browser localStorage
- **Export `data.js`** to make changes permanent

## Structure

```
/
├── index.html               ← landing page
├── 1-happy-birthday.html    ← Page 1
├── 2-memories.html          ← Page 2
├── 3-queen.html             ← Page 3
├── 4-magazine.html          ← Page 4
├── 5-heart-mosaic.html      ← Page 5
├── 6-timeline.html          ← Page 6
├── data.js                  ← all editable content + image slot map
├── app.js                   ← hydrates pages from data.js + localStorage
├── gallery.js               ← romantic lightbox viewer
├── admin/                   ← admin dashboard at /admin/
│   └── index.html
└── images/                  ← 172 photos
```

## Admin

Open `/admin/` in your browser. From there you can:

- Edit any text (names, titles, captions, quotes, signatures)
- Swap photos in any slot (browse from 172 photos in a visual picker)
- Upload new photos (saved in browser localStorage, embedded in exported `data.js`)
- Fix face cropping with `object-position` presets (↑ • ↕ ↓)
- Reset all changes
- Download a customized `data.js` to make changes permanent

The admin button has been **removed** from the public site — access only via the `/admin/` URL.

## Credits

Built with love by **Prince Khiwaliya** for **Sheetal**, 22 · 05 · 2026.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
