<div align="center">

# ▶️ PlayTube (NextTube)
### The Ultimate Open-Source YouTube Experience for Web & Android
**Zero Ads • 100% Authentic Live Data • In-App Downloads • Native Mobile UX**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![APK Download](https://img.shields.io/badge/Download-Android%20APK%20(4.20MB)-red?logo=android&logoColor=white)](https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk)

<br/>

<a href="https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk">
  <img src="https://img.shields.io/badge/📥_DOWNLOAD_LATEST_APK-PlayTube.apk_(4.20MB)-E50914?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" />
</a>

<p align="center">
  <b>Enjoy uninterrupted video streaming, real live comments, official related video recommendations, vertical shorts with smooth swipe gestures, and in-app MP4/MP3 downloads.</b>
</p>

</div>

---

## 📱 Latest Android APK Download

You can download and install the ready-to-use Android APK directly on your phone:

<div align="center">

<a href="https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk">
  <img src="https://img.shields.io/badge/📲_Download_Latest_APK-PlayTube.apk_(4.20MB)-E50914?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" />
</a>

<br/><br/>

👉 **[Direct Download: PlayTube.apk (4.20 MB)](https://github.com/palnirupam/NextTube/raw/main/PlayTube.apk)**

</div>

### 🌟 What's New in the Latest Build:
- 💬 **Authentic YouTube Mobile Comments Drawer:** Tapping the comments teaser card slides up a native bottom sheet drawer with full comments, likes, replies, and sorting. Closing it returns right to the video.
- 📜 **Instant Related Videos Scroll:** When not viewing comments, the Related Videos feed is displayed immediately beneath the video & description for seamless browsing without scrolling past comments!
- 🎧 **YouTube Premium Background & Screen-Off Playback:** Music and videos continue playing seamlessly even when the screen is turned off or locked, with lock-screen notification media controls!
- 🌐 **Vercel Serverless Proxy & Universal Embed:** Web deployment on Vercel (`next-tube-sigma.vercel.app`) loads all live YouTube feeds, comments, and high-definition video playback with zero black screens or CORS issues.
- 🎥 **Official 1080p HD Quality Switcher:** Crystal clear streaming. Use the ⚙️ Gear icon on the player to switch freely between 1080p60, 720p, 480p, and 4K!
- 🔄 **Native Fullscreen & Auto-Landscape:** Tapping fullscreen rotates Android device automatically into immersive landscape view without black borders or quality degradation.
- ♾️ **Unlimited Infinite Shorts (Reels):** Continuous vertical scrolling with auto-pagination and zero video limit.
- ⚡ **100% Authentic Live YouTube Engine:** Official InnerTube live comments, real view counts, channel avatars, and up-next queues.
- ⬇️ **In-App Downloader:** Download 1080p MP4 videos or 320kbps MP3 audio directly to your device storage.

> **Installation Tip:** Download the `.apk` file, tap to install on your Android device, and enable *Install from Unknown Sources* if prompted.

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

### 📱 4. YouTube Shorts with Unlimited Infinite Scrolling
- Immersive, full-screen vertical reels player with **unlimited continuous pagination**.
- Automatic pre-fetching of next viral batches before reaching the bottom (infinite reels feed).
- Smooth CSS snap-scrolling touch gestures for mobile & swipe physics.
- Desktop navigation controls (Up/Down arrow keys + on-screen navigation buttons).
- Double-tap heart animation for likes, real creator badges, and live comments.

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

### 🎧 8. YouTube Premium Background & Screen-Off Playback
- **Zero Interruption Screen-Off Listening:** Turn off or lock your Android phone screen, and the music/audio continues streaming without pausing.
- **Lock-Screen Media Notification:** Control playback (Play, Pause, Skip, Rewind) directly from the Android lock-screen and notification shade via `navigator.mediaSession`.
- **Picture-in-Picture (PiP):** Minimize the app and keep watching your video in a floating window.

### 🌐 9. High-Performance Vercel Serverless Proxy
- Automated cloud proxy at `api/yt.js` with server-side InnerTube desktop spoofing.
- Delivers 100% authentic YouTube home feeds, trending charts, and live comments on Vercel (`next-tube-sigma.vercel.app`) with zero CORS errors.

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
