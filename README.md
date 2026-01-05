# Nindra Nandan

A single-page, production-ready Night Entry Page for Nindra Nandan—a sync-sleep night companion that can be lent for one night.

## Overview

This is a ritual surface, not a marketing site. The page provides a calm, minimal experience for receiving and sharing Nindra Nandan during nighttime moments.

## Features

- **Silent video introduction** (when arriving from ad source)
- **Sync-sleep audio experience**
- **One-time share functionality**
- **Minimal, distraction-free interface**
- **No scrolling, no forms, no signups**

## File Structure

```
nindra-nandan/
├── index.html          # Main HTML structure
├── style.css           # Styling and transitions
├── app.js              # State management and UX flow
├── analytics.js        # Analytics hooks
├── assets/
    ├── audio/
    │   └── snoozie-night-1.m4a
    └── visuals/
        ├── nindra_nandan_center.jpeg
        └── nindra_nandan animated.mp4
```

## Usage

Open `index.html` in a web browser. The page will:

1. Show the character image on arrival
2. If arriving from an ad (`?src=ad`), play a silent video introduction
3. On "Receive" click, transition through calming messages
4. Play sync-sleep audio
5. Offer share option mid-audio (20-25 seconds)
6. Show final message after audio completes

## Technical Details

- **No frameworks** - Plain HTML, CSS, and JavaScript
- **No build tools** - Direct file serving
- **No routing** - Single page experience
- **Minimal analytics** - Hook functions only (no third-party scripts)

## Browser Support

Modern browsers with support for:
- HTML5 video/audio
- CSS transitions
- ES6 JavaScript
- Web Share API (with fallback)

## License

Private - All rights reserved

