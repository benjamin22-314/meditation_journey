# Meditation Journey

A 30-day meditation journey PWA with synthesized gong sounds, progress tracking, and a calming stone-grid visual.

## How It Works

### The 30-Day Journey

On first launch, you choose a daily meditation goal (1-120 minutes, default 10). This starts a 30-day journey that advances one day per calendar day. Your progress is shown as a 6x5 grid of stones, one per day.

### Stone Colors

Each stone's color reflects your progress:

| State | Color | Meaning |
|-------|-------|---------|
| **Future** | Light warm gray | Day not yet reached |
| **Current** | Slate blue (with glowing ring) | Today's day |
| **Completed** | Soft sage green | Goal was met |
| **Missed** | Warm beige/tan | Day passed without meeting goal |

### Meditation Sessions

- Tap **Meditate** to start a session. Pick a duration (1-120 min) and begin.
- A **circular progress ring** fills as the timer counts down, with a **breathing indicator** as a focus point.
- A synthesized **gong** plays at the start, at each minute mark, and at session end (with a second gong 3 seconds after completion). Each gong is accompanied by a full-screen bell flash.
- **Only sessions where the timer runs to zero count toward your goal.** Ending a session early logs it but does not add time to your daily total.
- Multiple completed sessions in a day accumulate. Two 5-minute sessions = 10 minutes credited.

### Missing a Day

If you don't meet your goal for a day, the stone turns warm beige/tan. There is no punishment, lockout, or streak penalty -- you simply continue the next day. There is no way to go back and retroactively complete a missed day.

### Journey Completion

After 30 calendar days, the journey completes regardless of how many days you meditated. A summary shows your **days goal met**, **total minutes**, and **completed sessions**. You can then start a new journey from scratch.

### Settings

Your daily goal can be adjusted mid-journey via the settings (gear) icon.

## Features

- **30-day stone grid** tracking daily progress
- **Adjustable duration**: 1-120 minutes per session
- **Synthesized gong** at start, each minute, and end of session
- **Progress ring** and **breathing indicator** during meditation
- **Works offline** as a PWA once installed
- **Installable** on Android and iOS
- **Mobile-first** responsive layout with safe-area support

## Hosting with GitHub Pages

1. Push this repository to GitHub
2. Go to repository **Settings** > **Pages**
3. Under "Source", select **main** branch and click Save
4. Your app will be live at: `https://yourusername.github.io/repository-name`

## Installing on Your Phone

### Android
1. Open Chrome and visit your hosted URL
2. Chrome should show an "Add to Home Screen" prompt
   - If not, tap the menu > "Add to Home Screen" or "Install app"

### iPhone
1. Open Safari and visit your hosted URL
2. Tap the Share button (square with arrow)
3. Tap "Add to Home Screen"

## Project Structure

```
index.html              Main HTML with four views + settings modal
manifest.json           PWA manifest for installation
sw.js                   Service worker for offline caching
css/styles.css          All styling, colors, and animations
js/core/journey.js      Journey data model and day progression
js/core/timer.js        Countdown timer
js/core/audio.js        Synthesized gong via Web Audio API
js/core/storage.js      localStorage persistence
js/utils/date-helpers.js  Date math utilities
js/ui/app.js            Main application controller
js/ui/onboarding-view.js  Goal-setting onboarding
js/ui/journey-view.js   Stone grid and progress bar
js/ui/timer-view.js     Timer UI and session handling
js/ui/completion-view.js  End-of-journey stats
tests/                  Vitest unit tests
icon-192.png            App icon (192x192)
icon-512.png            App icon (512x512)
```

## Customization

- **Colors**: Edit the CSS custom properties in `css/styles.css` under `:root`
- **Gong sound**: Modify the oscillator frequencies and envelope in `js/core/audio.js`

## Data Storage

All data is stored locally in the browser via `localStorage`. Nothing is sent to a server. Clearing browser data will reset your journey.
