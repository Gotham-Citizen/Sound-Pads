# Sound Pads

A React-based web application for playing sound pads with a colorful grid interface.

## Features

- 8 colorful sound pads arranged in a grid layout
- Toggle pads on/off to play sounds
- Visual feedback when pads are activated
- Built with React 19 and Vite

## Tech Stack

- **React** 19.2.7
- **Vite** 6.0.3
- **CSS Grid** for layout

## Project Structure

```
Sound Pads/
├── components/
│   └── Pad.jsx          # Individual sound pad component
├── src/
│   ├── App.jsx          # Main application component
│   ├── Index.jsx        # Entry point
│   └── pads.js          # Pad configuration data
├── styles/
│   └── Index.css        # Global styles
├── Index.html           # HTML template
└── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Usage

Click on any pad to toggle it on/off. When a pad is turned on, it will play its associated sound and light up with its assigned color.

## Configuration

Pads are configured in `src/pads.js` with the following properties:
- `id`: Unique identifier
- `color`: Hex color code for the pad
- `on`: Initial state (true/false)
