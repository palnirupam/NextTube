<div align="center">

# ▶️ PlayTube (NextTube)
### The Ultimate Open-Source YouTube Experience for Web & Android
**Zero Ads • 100% Authentic Live Data • In-App Downloads • Native Mobile UX**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![APK Download](https://img.shields.io/badge/Download-Android%20APK%20(4.55MB)-red?logo=android&logoColor=white)](https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk)

<br/>

<a href="https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk">
  <img src="https://img.shields.io/badge/📥_DOWNLOAD_LATEST_APK-PlayTube.apk_(4.55MB)-E50914?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" />
</a>

<p align="center">
  <b>Enjoy uninterrupted video streaming, real live comments, official related video recommendations, vertical shorts with smooth swipe gestures, and in-app MP4/MP3 downloads.</b>
</p>

</div>

---

## 📱 Quick Download

You can download and install the ready-to-use Android APK directly:

👉 **[Download PlayTube.apk (4.55 MB)](https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk)**

> **Installation Tip:** Transfer the `.apk` to your Android device, tap to install, and allow *Unknown Sources* if prompted.

---

## ✨ Key Features

### ⚡ 1. 100% Authentic YouTube InnerTube Engine (REA)
- **No Google API Key or Login required.**
- Directly communicates with YouTube's official **InnerTube endpoints** (`/youtubei/v1/search`, `/youtubei/v1/next`, `/youtubei/v1/browse`).
- Delivers real channel avatars from `yt3.ggpht.com`, exact subscriber counts, official view counts, and live upload dates.
- Zero fake or hardcoded dummy lists during normal streaming.

### 💬 2. Real Live YouTube Comments System
- Fetches real-time comments directly via InnerTube continuation tokens.
- Supports YouTube's modern `entityBatchUpdate` protobuf mutation store.
- Displays commenter avatars, verified creator badges, formatted time stamps, exact like counts, and expandable reply threads.
- In-app comment posting with optimistic UI updates.

### 🎛️ 3. Smart "Up Next" & Interactive Filter Chips
- Automatically extracts YouTube's algorithmic `secondaryResults` for the currently playing video.
- **Working filter chips:**
  - **All**: Shows the complete real recommendation queue.
  - **From related artist**: Filters videos by creator/channel name.
  - **Related**: Groups videos matching the current content category.
  - **Recently uploaded**: Chronological sorting by upload freshness.
- Integrated **Autoplay Next Queue** with smooth transition when the current video finishes.

### 📱 4. YouTube Shorts with Vertical Gestures
- Immersive, full-screen vertical reels player.
- Smooth snap-scrolling touch gestures for mobile.
- Keyboard navigation (Up/Down arrow keys on desktop).
- Double-tap heart animation for likes.

### ⬇️ 5. In-App Video & Audio Downloader
- **No external redirects or popup spam.**
- Download MP4 video up to 1080p Full HD directly to device storage.
- Audio extraction (MP3 320kbps) for offline music listening.
- HD cover artwork saver (1920x1080 thumbnail extraction).
- One-click clean stream link copy for external downloaders (IDM, yt-dlp, Snaptube).

### 🎨 6. Pixel-Perfect Light & Dark Themes
- True AMOLED Dark theme (`#0f0f0f` and `#212121`) for battery savings on OLED screens.
- Clean Modern Light theme with high-contrast text and accessible contrast ratios.
- Instant toggle with persistence in `localStorage`.

### 🔍 7. Real-Time Search Autocomplete & Voice Search
- Instant search suggestions powered by Google Suggest queries JSONP.
- Built-in Voice Search with live speech-to-text recognition.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with Dual Light/Dark palettes |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Mobile Runtime** | [Capacitor 8](https://capacitorjs.com/) (Android WebView + Native HTTP) |
| **API & Networking** | YouTube InnerTube Engine + CapacitorHttp (Bypasses CORS natively on mobile) |
| **Downloader** | cobalt.tools stream tunnel API integration |

---

## 🚀 Getting Started (Web Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the repository
```bash
git clone https://github.com/palnirupam/NextTube.git
cd NextTube
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to start exploring!

### 4. Build for production
```bash
npm run build
```

---

## 📱 Building the Android APK

PlayTube uses Capacitor to compile the web app into a lightweight, high-performance Android APK.

### 1. Sync web assets with Capacitor
```bash
npm run build
npx cap sync android
```

### 2. Build Debug APK with Gradle
```bash
cd android
./gradlew assembleDebug
```
*(On Windows PowerShell, use `.\android\gradlew.bat assembleDebug -p android`)*

The compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📂 Project Structure

```
NextTube/
├── android/                 # Native Android Capacitor wrapper & Gradle setup
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Sidebar, CategoryChips, DownloadModal, ShareModal
│   │   ├── player/          # VideoPlayer, CommentsSection, RelatedVideos
│   │   └── shorts/          # ShortCard, ShortsPlayer
│   ├── context/             # AppContext (theme, history, liked, library, bookmarks)
│   ├── pages/               # HomePage, WatchPage, SearchPage, ShortsPage, ChannelPage, ExplorePage
│   ├── services/            # api.js (Reverse-Engineered InnerTube Engine)
│   └── utils/               # formatters.js (views, time, duration helpers)
├── PlayTube.apk             # Ready-to-install Android APK (4.4MB)
├── vite.config.js           # Vite config with YouTube InnerTube proxy
└── package.json
```

---

## 🤝 Contributing

Contributions, feature suggestions, and bug reports are welcome!
Feel free to open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/palnirupam">Nirupam Pal</a></b>
</div>
