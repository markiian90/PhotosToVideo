# Image to Video Server

Node.js server for converting images to video using FFmpeg.

## 📋 Requirements

- Node.js 18+ 
- FFmpeg installed on the system

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:
```bash
choco install ffmpeg
```

Verify installation:
```bash
ffmpeg -version
```

## 🚀 Installation and Running

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

The server will be available at `http://localhost:3000`

## 📡 API Endpoints

### POST /create-video

Creates a video from uploaded images.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `images`: array of image files (maximum 20)
  - `imageDuration`: duration to show each image in seconds (optional, default 2)
  - `fps`: video FPS (optional, default 1)
  - `resolution`: resolution in `WIDTH:HEIGHT` format (optional, default `1280:720`)
  - `crf`: video quality 18-28, lower = better (optional, default 23)

**Response:**
```json
{
  "success": true,
  "videoUrl": "/videos/video_1234567890.mp4",
  "videoPath": "/path/to/video.mp4"
}
```

## 📁 Structure

```
server/
├── uploads/     # Temporary images (automatically deleted)
├── videos/      # Generated video files
├── index.js     # Main server file
└── package.json
```

## 📝 Notes

- Server automatically deletes temporary files after processing
- Video files are stored in the `videos/` directory
- For production, configure CORS and add authentication
