# Sound Pads

An interactive soundboard web app — an expandable grid of colourful pads that play sound effects. Comes with 8 default meme sounds; add your own custom pads with custom colours, keybinds, and audio files (MP3, WAV, OGG, FLAC, AAC, M4A, WebM). Built with React 19 and Vite.

[![Demo](./media/demo-video.gif)](./media/demo-video.mp4)

## ▶️ Live Demo

<a href="https://gotham-citizen.github.io/Sound-Pads/">
  <img src="./media/demo.png" alt="Sound Pads Screenshot" width="600">
</a>

Click the image above or [here](https://gotham-citizen.github.io/Sound-Pads/) to try it!

## Features

- **Interactive pads** in a responsive CSS Grid layout (8/4/3/2 columns), each with a unique colour and sound
- **Click to toggle** — click a pad to play/stop its sound
- **Keyboard shortcuts** — press assigned keys to toggle pads (when not focused on an input)
- **Visual feedback** — pads glow at full opacity when active, dim when off
- **Global volume slider** — adjust playback volume (0–100%, default 50%)
- **Volume keyboard controls** — Arrow keys increment/decrement volume by 5%
- **Custom pads** — add your own pads via the AddPad form: set a name, colour, keybinding, and upload an audio file (max 4 MB)
- **Persistent storage** — custom pads are saved to localStorage automatically
- **Delete custom pads** — hover (or tap on touch devices) a custom pad to reveal its delete button
- **Drag reorder** — drag custom pads to reorder them (works on mobile via Pointer Events)

## Resource Usage & Browser Compatibility

| Metric | Value |
|---|---|
| localStorage (no custom pads) | 0 KB |
| RAM (no custom pads) | ~0.156 GB |
| Browser localStorage limit | ~5 MB |
| Max audio file size per pad | 4 MB (enforced) |
| Max custom pads storage | ~5 MB (limited by browser) |
| localStorage requirement | Required for adding custom pads |

Default pads are loaded from source code, not localStorage, so zero storage is consumed until you add a custom pad. Since localStorage is capped at ~5 MB across all major browsers, the total space available for custom pad audio data is approximately 5 MB.

> **Note:** Adding custom pads **requires localStorage**. If localStorage is disabled, full, or unavailable (e.g., private browsing with strict restrictions), the Add Pad form will silently fail and your custom pads will not be saved. The app will display a warning when storage is full.

### Tested Browsers

| Browser | Version |
|---|---|
| Google Chrome | 150.0.7871.129 |
| Brave | 1.92.141 |
| Firefox | 152.0.6 |

## Tech Stack

| Technology | Version |
|---|---|
| React | 19.2.7 |
| Vite | 8.1.1 |
| CSS Grid + Flexbox | — |
| HTML5 Audio | — |

## Project Structure

```
Sound Pads/
├── components/
│   ├── Pad.jsx              # Individual sound pad component
│   └── AddPad.jsx           # Custom pad form (name, colour, key, MP3 upload)
├── src/
│   ├── App.jsx              # Main app component (state, keyboard handling)
│   ├── Index.jsx            # React entry point (mounts to #root)
│   └── pads.js              # Pad configuration (colours, sounds, keys)
├── styles/
│   └── Index.css            # Global styles (dark theme, grid layout)
├── public/
│   └── sounds/              # 8 MP3 sound effect files
│       ├── amaterasu.mp3
│       ├── dexter-meme.mp3
│       ├── fahhhhhhhhhhhhhh.mp3
│       ├── jojos-bizarre-adventure-ay-ay-ay-ay-_-sound-effect.mp3
│       ├── loading-lost-connection-green-screen-with-sound-effect-2_K8HORkT.mp3
│       ├── oh-no_7.mp3
│       ├── okachan.mp3
│       └── spiderman-meme-song.mp3
├── media/
│   └── demo-video.mp4
│   └── demo.gif
│   └── demo.png
├── Index.html               # HTML shell
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint flat config
└── package.json             # Project metadata & scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### Build & Preview

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Usage

| Action | Method |
|---|---|
| Toggle pad on/off | Click a pad button |
| Toggle pad via keyboard | Press the pad's assigned key |
| Adjust volume | Drag the slider |
| Increase volume | Arrow Right / Arrow Up |
| Decrease volume | Arrow Left / Arrow Down |
| Open AddPad form | Click the **+** / **−** button |
| Add a custom pad | Fill in the form fields and click **Add Pad** |
| Delete a custom pad | Hover (or tap on mobile) the pad and click **×** |
| Reorder custom pads | Drag a custom pad to a new position (touch supported) |

## Configuration

Edit `src/pads.js` to change default pads. Each pad object has these properties:

| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier |
| `color` | `string` | Hex colour code |
| `on` | `boolean` | Initial state |
| `sound` | `string` | Path to MP3 file in `/public/sounds/` |
| `key` | `string` | Keyboard key for triggering |

Custom pads added via the AddPad form are stored in `localStorage` under the key `sound-pads-custom` and persist across sessions. Each custom pad includes:

| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier (timestamp-based) |
| `color` | `string` | Hex colour code |
| `label` | `string` | Display name shown on the pad |
| `key` | `string` | Keyboard key for triggering (optional) |
| `soundDataUrl` | `string` | Base64-encoded data URL of the uploaded audio file |
| `on` | `boolean` | Initial state (always `false`) |
| `isCustom` | `boolean` | Always `true` |

The app loads up to 8 default pads plus any saved custom pads. The grid wraps to additional rows as needed. The AddPad form accepts common audio formats: **MP3, WAV, OGG, FLAC, AAC, M4A, WebM** (max 4 MB).