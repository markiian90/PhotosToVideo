# Image to Video 🎬

Expo app for converting images to video using a Node.js server and FFmpeg.

## 🏗️ Architecture

```
Expo App (Android/iOS)
    ↓ (upload images)
Node.js Server (Express)
    ↓ (FFmpeg processing)
MP4 Video
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

**Important:** Make sure FFmpeg is installed on your system:
```bash
ffmpeg -version
```

If FFmpeg is not installed:
- **macOS:** `brew install ffmpeg`
- **Linux:** `sudo apt-get install ffmpeg`
- **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 3. Start the Server

In a separate terminal:

```bash
cd server
npm start
```

The server will be available at `http://localhost:3000`

### 4. Configure Server URL in the App

#### For Emulators/Simulators:
Automatically detected:
- **iOS Simulator:** `http://localhost:3000`
- **Android Emulator:** `http://10.0.2.2:3000`

#### For Real Devices (Expo Go):
**Important:** On a real device, `localhost` doesn't work! You need to use your computer's IP address.

**Option 1: Via Environment Variable (Recommended)**

Create a `.env` file in the project root:
```bash
EXPO_PUBLIC_SERVER_URL=http://YOUR_COMPUTER_IP:3000
```

Find your computer's IP address:
- **macOS/Linux:** `ifconfig | grep "inet "` or `ip addr show`
- **Windows:** `ipconfig` (look for IPv4 address in local network)

Example:
```bash
EXPO_PUBLIC_SERVER_URL=http://192.168.1.100:3000
```

**Option 2: Manually in Code**

Edit `constants/server.ts` and replace `localhost` with IP address:
```typescript
return 'http://192.168.1.100:3000'; // Replace with your IP
```

**Make sure that:**
- Computer and phone are on the same Wi-Fi network
- Firewall doesn't block port 3000
- Server is running on your computer

### 5. Run Expo App

```bash
npx expo start
```

## 📱 Usage

1. Select 3-5 images from gallery
2. Configure video parameters (resolution, duration, transition)
3. Create video - images will be uploaded to server, processed by FFmpeg and returned as MP4
4. Preview and save video to gallery

## 📁 Project Structure

```
ImagetoVideo/
├── app/              # Expo Router app
├── components/       # React components
├── services/         # Business logic (videoService.ts)
├── constants/        # Configuration (server.ts)
├── server/           # Node.js server
│   ├── index.js     # Express server with FFmpeg
│   ├── uploads/     # Temporary images
│   └── videos/      # Generated videos
└── package.json
```

## 🔧 Configuration

Detailed server instructions can be found in [server/README.md](server/README.md)

## 🎬 Video Rendering Approach

The project uses **FFmpeg on a Node.js server** for rendering videos from images. This approach was chosen for the following reasons:

1. **FFmpeg Power**: FFmpeg is an industry standard for video processing with support for complex filters and transitions
2. **Flexibility**: Ability to implement different types of transitions (fade, Ken Burns, slide) through FFmpeg filters
3. **Quality**: High quality output video with CRF and preset configuration
4. **Performance**: Processing on the server doesn't burden the mobile device

### Implemented Transitions:
- **Fade**: Smooth fade in/out between images
- **Ken Burns**: Pan and zoom effect (zoom + pan)
- **Slide**: Sliding images in different directions

### Technical Details:
- Uses `fluent-ffmpeg` to work with FFmpeg
- Video is encoded in H.264 (libx264) with yuv420p format for compatibility
- Resolution: 720p (1280×720) or 1080p (1920×1080)
- Aspect ratio: 16:9 (achieved through padding)

## ⚠️ Known Limitations and Issues

1. **Server Dependency**: Video rendering requires a running Node.js server with FFmpeg. This means:
   - Cannot use the app without connection to the server
   - For production, the server needs to be deployed separately

2. **File Size**: Maximum upload image size is 10MB

3. **Network Dependency**: Requires stable internet connection to upload images and download the finished video

4. **Platform**: Currently tested on iOS Simulator and Android Emulator. On real devices, you'll need your device's IP address for correct operation

## ⏱️ Time Spent

**Total Development Time**: ~10-12 hours

Time Breakdown:
- **Project and Architecture Setup**: ~1 hour
- **Image Selection Implementation**: ~2 hours
- **UI Components Creation**: ~3-4 hours
- **Server and FFmpeg Setup**: ~4 hours
- **Error Handling and Testing**: ~1-2 hours

## 📝 Notes

- Server automatically deletes temporary files after processing
- Videos are stored on the server in `server/videos/`
- For production, configure CORS and add authentication
