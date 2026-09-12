# Freqtrade Neobroker Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-iOS%20%26%20Android-purple.svg)](https://web.dev/progressive-web-apps/)
[![Freqtrade](https://img.shields.io/badge/Freqtrade-Compatible-blue.svg)](https://www.freqtrade.io/)

A modern, ultra-clean, and minimalist Web Dashboard & Progressive Web App (PWA) inspired by **Trade Republic** and **Apple Wallet** for monitoring [Freqtrade](https://www.freqtrade.io/) algorithmic crypto trading bots.

Designed mobile-first for **iOS Safari ("Add to Home Screen")** with zero horizontal scrolling and instant native app feel, while looking gorgeous on desktop screens.

---

## ✨ Features

- **Trade Republic & Apple Wallet Aesthetic**: Pure OLED dark mode (`#000000` / `#0D0E12`), glassmorphic frosted cards, crisp typography (SF Pro / Inter), and neon profit/loss indicators (`#00C805` / `#FF3B30`).
- **Live Portfolio Hero**: Oversized balance with dynamic performance pill badge (e.g. `🟢 +0,42 € (+0,68 %) Heute`).
- **Interactive Smooth Sparkline Curve**: Minimalist Catmull-Rom Bezier line chart without distracting axis clutter. Features touch-scrubbing with a gliding hairline cursor that updates your portfolio balance in real-time to historical points.
- **Active Position Cards**: High-density cards for open crypto trades (e.g. `ETH/EUR`) displaying entry rate, current market rate, live PnL, strategy name, and a dedicated safety badge (`🛡️ Stop-Loss geschützt bei 1.754 €`). Tap any card to open a detailed order & execution inspection modal.
- **Asset Allocation Bar**: Proportional split bar visualizing free EUR cash vs. capital locked in active crypto positions.
- **Bot Performance KPI Grid**: Live tracking of Winrate, Profit Factor, Total Trades, and Max Drawdown.
- **Trade History**: Compact log of recently closed trades with exit reasons (`roi`, `stop_loss`, `trailing_stop_loss`).
- **PWA & iOS Safari Optimized**: Full standalone web app support with safe-area notch padding (`viewport-fit=cover`), touch feedback, and apple-touch-icon.
- **100% Privacy & Zero-Leak Design**: Private IPs, server credentials, and tokens are stored solely in your local browser `localStorage` and an untracked `.env.local`. **Zero private credentials ever touch Git.**
- **Instant Demo Mode**: Test-drive the dashboard immediately without a running Freqtrade bot using realistic simulated data.
- **Multi-Server & Network Switching**: Effortlessly toggle between **Tailscale**, **LAN**, **Localhost**, or custom remote URLs with 1 tap.
- **Built-in Proxy Support**: Avoid CORS or mixed-content hurdles with the integrated Vite/Node reverse proxy.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/jonashuberts/freqtrade-neobroker-dashboard.git
cd freqtrade-neobroker-dashboard

# Install dependencies
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` (which is strictly ignored by Git):

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Freqtrade API settings:

```env
VITE_FREQTRADE_URL=http://192.168.1.6:8080
VITE_FREQTRADE_USER=your_username
VITE_FREQTRADE_PASSWORD=your_password
VITE_POLL_INTERVAL=12000
VITE_DEMO_MODE=false
```

*(Note: You can also configure or change these anytime directly within the in-app Settings modal!)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker Deployment

Run the dashboard with Docker Compose in 1 command:

```bash
docker compose up -d --build
```

The dashboard will be served on port `3000` (`http://localhost:3000`).

---

## 📱 iOS Safari: Install as Native App

1. Open your dashboard URL in **Safari** on your iPhone or iPad.
2. Tap the **Share** button (the square with the upward arrow).
3. Scroll down and tap **"Add to Home Screen"** (*"Zum Home-Bildschirm"*).
4. Launch the app from your home screen for full-screen, native Trade Republic style immersion without browser chrome.

---

## ⚙️ Freqtrade Configuration

To allow this dashboard to connect to your Freqtrade bot, ensure the API server is enabled in your `config.json`:

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

> **Tip:** If you prefer not to set `CORS_origins: ["*"]` on your Freqtrade bot, simply turn on **"Lokalen Proxy nutzen"** in the dashboard settings or run via the Vite dev server!

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Design System**: Apple Human Interface Guidelines & Trade Republic Neobroker UI

---

## 🔒 Security & Privacy

This application was engineered with a strict **Zero-Leak Security Policy**:
- No external analytics, trackers, or telemetry.
- Direct client-to-bot communication over your private network (LAN or Tailscale).
- Credentials and endpoints are never committed to source control.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) - see the LICENSE file for details.
