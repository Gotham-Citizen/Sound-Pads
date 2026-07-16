# Sound Pads

An interactive soundboard web app — an expandable grid of colourful pads that play sound effects. Comes with 8 default meme sounds; add your own custom pads with custom colours, keybinds, and MP3 files. Built with React 19 and Vite.

[![Demo](./media/demo-video.gif)](./media/demo-video.mp4)

## ▶️ Live Demo

<a href="https://gotham-citizen.github.io/Sound-Pads/">
  <img src="./media/demo.png" alt="Sound Pads Screenshot" width="600">
</a>

Click the image above or [here](https://gotham-citizen.github.io/Sound-Pads/) to try it!

## Features

- **Interactive pads** in an 8-column CSS Grid layout, each with a unique colour and sound
- **Click to toggle** — click a pad to play/stop its sound
- **Keyboard shortcuts** — press assigned keys to toggle pads (when not focused on an input)
- **Visual feedback** — pads glow at full opacity when active, dim when off
- **Global volume slider** — adjust playback volume (0–100%, default 50%)
- **Volume keyboard controls** — Arrow keys increment/decrement volume by 5%
- **Custom pads** — add your own pads via the AddPad form: set a name, colour, keybinding, and upload an MP3 file (max 4 MB)
- **Persistent storage** — custom pads are saved to localStorage automatically
- **Delete custom pads** — hover a custom pad to reveal its delete button
- **Drag reorder** — drag custom pads to reorder them

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
|---|---|---|
| Toggle pad on/off | Click a pad button |
| Toggle pad via keyboard | Press the pad's assigned key |
| Adjust volume | Drag the slider |
| Increase volume | Arrow Right / Arrow Up |
| Decrease volume | Arrow Left / Arrow Down |
| Open AddPad form | Click the **+** button |
| Add a custom pad | Fill in the form fields and click **Add Pad** |
| Delete a custom pad | Hover the pad and click **×** |
| Reorder custom pads | Drag a custom pad to a new position |

## Configuration

Edit `src/pads.js` to change default pads. Each pad object has these properties:

| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier |
| `color` | `string` | Hex colour code |
| `on` | `boolean` | Initial state (always `false`) |
| `sound` | `string` | Path to MP3 file in `/public/sounds/` |
| `key` | `string` | Keyboard key for triggering |

Custom pads added via the AddPad form are stored in `localStorage` under the key `sound-pads-custom` and persist across sessions. Each custom pad includes the same properties plus `isCustom: true`. The app loads up to 8 default pads plus any saved custom pads. The 8-column grid wraps to additional rows as needed.