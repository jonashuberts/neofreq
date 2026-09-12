# NeoFreq

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/jonashuberts/neofreq/actions/workflows/deploy.yml/badge.svg)](https://github.com/jonashuberts/neofreq/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue)](https://jonashuberts.github.io/neofreq/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com)

A minimalist, high-performance web dashboard and Progressive Web App (PWA) for monitoring [Freqtrade](https://www.freqtrade.io/) algorithmic cryptocurrency trading bots.

Live Web App: **[https://jonashuberts.github.io/neofreq/](https://jonashuberts.github.io/neofreq/)**

---

## Overview

NeoFreq provides a distraction-free, typography-focused interface to monitor live crypto positions, account balances, and bot performance metrics in real time.

It is built mobile-first for iOS Safari (PWA standalone mode) and responsive across desktop and laptop screens (MacBook).

### Key Capabilities

- **Real-Time Portfolio Overview**: Clean hero valuation with dynamic performance badge (absolute and percentage return).
- **Interactive Sparkline Curve**: Minimalist Catmull-Rom Bezier line chart with touch and pointer scrubbing to inspect historical points.
- **Active Positions**: Open trades displaying live market rates, current valuation, entry price, profit/loss, and stop-loss thresholds. Tapping any position opens a detailed execution and order sheet.
- **Asset Allocation**: Segmented visualization of free cash versus capital locked in crypto assets.
- **Performance Metrics**: Win rate, profit factor, trade volume, total trades, and maximum drawdown.
- **Trade History**: Compact list of closed trades with exit reasons and realized returns.
- **Bilingual Interface (DE / EN)**: Native English and German localization with instant language switching and locale-aware number and currency formatting.
- **Demo Mode**: Instant test drive with realistic simulated data without needing an active bot connection.
- **Zero-Leak Privacy Architecture**: Server endpoints and authentication credentials are stored strictly in local browser storage or an untracked `.env.local` file. No personal IPs or credentials are ever committed to version control.

---

## Quick Start

### Installation

```bash
git clone https://github.com/jonashuberts/neofreq.git
cd neofreq
npm install
```

### Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your Freqtrade API server connection details in `.env.local`:

```env
VITE_FREQTRADE_URL=http://localhost:8080
VITE_FREQTRADE_USER=
VITE_FREQTRADE_PASSWORD=
VITE_POLL_INTERVAL=12000
VITE_DEMO_MODE=false
```

*(You can also configure or change these anytime directly in the in-app Settings drawer).*

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Docker Deployment

Build and run using Docker Compose:

```bash
docker compose up -d --build
```

The dashboard will be served on port 3000 (`http://localhost:3000`).

---

## Freqtrade Configuration

To allow NeoFreq to connect to your Freqtrade bot, ensure the API server is enabled in your `config.json`:

```json
"api_server": {
    "enabled": true,
    "listen_ip_address": "0.0.0.0",
    "listen_port": 8080,
    "verbosity": "info",
    "enable_openapi": false,
    "jwt_secret_key": "YOUR_SECRET_KEY",
    "CORS_origins": ["*"],
    "username": "your_username",
    "password": "your_password"
}
```

If you prefer not to enable wildcard CORS on your Freqtrade instance, use the built-in **Local Proxy** mode in the dashboard settings or via the Vite development server.

---

## iOS Safari: Add to Home Screen

1. Open the dashboard URL in **Safari** on iOS.
2. Tap the **Share** button in the Safari toolbar.
3. Select **Add to Home Screen**.
4. Launch NeoFreq from your home screen for full-screen standalone app mode.

---

## Tech Stack

- **Framework**: React 19, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide
- **CI/CD**: GitHub Actions (GitHub Pages deployment)

---

## License

This project is licensed under the [MIT License](./LICENSE).
