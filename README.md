# Meditation Journey PWA

A beautiful, minimalist meditation journey with synthesized bell sounds.

## Features

- **Adjustable duration**: 1-120 minutes
- **Deep bell** at start and end of session
- **Light bell** at each minute interval
- **Progress ring** showing time elapsed
- **Breathing indicator** during meditation
- **Works offline** once installed
- **Installable** on Android (and iOS)

## Quick Start (Easiest Method)

### Option 1: GitHub Pages (Free Hosting)

1. Create a free [GitHub](https://github.com) account if you don't have one
2. Create a new repository (click the + icon → New repository)
3. Name it something like `meditation-timer`
4. Upload all the files from this folder:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
5. Go to repository **Settings** → **Pages**
6. Under "Source", select **main** branch and click Save
7. Your app will be live at: `https://yourusername.github.io/meditation-timer`

### Option 2: Netlify (Even Easier)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire `meditation-app` folder
3. You'll get a live URL instantly!

## Installing on Your Android Phone

1. Open Chrome on your Android phone
2. Visit your hosted URL
3. Chrome should show "Add to Home Screen" prompt
   - If not, tap the menu (⋮) → "Add to Home Screen" or "Install app"
4. The app will appear on your home screen with the icon

## Installing on iPhone

1. Open Safari on your iPhone
2. Visit your hosted URL
3. Tap the Share button (square with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add"

## How It Works

- **Deep bell**: Plays at the very start and very end of your session
- **Light bell**: Plays once each minute during meditation (e.g., for a 10-minute session, you'll hear 9 interval bells)
- The bells are generated using the Web Audio API — no sound files needed!

## Files Included

| File | Purpose |
|------|---------|
| `index.html` | The main app (HTML, CSS, JavaScript all-in-one) |
| `manifest.json` | PWA manifest for installation |
| `sw.js` | Service worker for offline functionality |
| `icon-192.png` | App icon (192×192) |
| `icon-512.png` | App icon (512×512) |

## Customization

Want to change the colors or bells? Edit `index.html`:

- **Colors**: Look for the `:root` CSS section at the top
- **Bell tones**: Modify `playDeepBell()` and `playLightBell()` functions
  - Change frequency values to adjust pitch
  - Adjust gain values to change volume

Enjoy your meditation practice! 🧘
