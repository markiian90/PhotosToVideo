import cors from "cors";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
const videoDir = path.join(__dirname, "videos");

try {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });
} catch (error) {
  console.error('❌ Error creating directories:', error);
  process.exit(1);
}

app.use('/videos', express.static(videoDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `img_${uniqueSuffix}_${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 20 
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif',
      'image/heic',
      'image/heif'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimes.join(', ')}`));
    }
  }
});

function buildSimpleFilter(files, resolution, imageDuration, frameRate) {
  const filterParts = files.map((file, index) => {
    return `[${index}:v]loop=loop=-1:size=1:start=0,scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${imageDuration},fps=${frameRate},setpts=PTS-STARTPTS[v${index}]`;
  });
  const concatInputs = files.map((_, index) => `[v${index}]`).join('');
  return filterParts.join(';') + `;${concatInputs}concat=n=${files.length}:v=1:a=0[out]`;
}

function buildFadeFilter(files, resolution, imageDuration, frameRate, transitionDuration) {
  const filterParts = files.map((file, index) => {
    const fadeIn = index === 0 ? '' : `,fade=t=in:st=0:d=${transitionDuration}`;
    const fadeOut = index === files.length - 1 ? '' : `,fade=t=out:st=${imageDuration - transitionDuration}:d=${transitionDuration}`;
    
    return `[${index}:v]loop=loop=-1:size=1:start=0,scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${imageDuration},fps=${frameRate},setpts=PTS-STARTPTS${fadeIn}${fadeOut}[v${index}]`;
  });
  const concatInputs = files.map((_, index) => `[v${index}]`).join('');
  return filterParts.join(';') + `;${concatInputs}concat=n=${files.length}:v=1:a=0[out]`;
}

function buildKenBurnsFilter(files, resolution, imageDuration, frameRate, transitionDuration, zoomIntensity = 'medium') {
  const totalFrames = Math.ceil(imageDuration * frameRate);
  const [width, height] = resolution.split(':').map(Number);
  
  // Settings for zoom intensity
  const zoomSettings = {
    'subtle': { start: 1.0, end: 1.08 },  
    'light': { start: 1.0, end: 1.12 },   
    'medium': { start: 1.0, end: 1.15 },  
    'strong': { start: 1.0, end: 1.20 }, 
    'dramaic': { start: 1.0, end: 1.30 } 
  };
  
  const zoom = zoomSettings[zoomIntensity] || zoomSettings['medium'];
  const zoomStart = zoom.start;
  const zoomEnd = zoom.end;
    
  const filterParts = [];
  
  for (let i = 0; i < files.length; i++) {
    const fadeIn = i === 0 ? '' : `,fade=t=in:st=0:d=${transitionDuration}`;
    const fadeOut = i === files.length - 1 ? '' : `,fade=t=out:st=${imageDuration - transitionDuration}:d=${transitionDuration}`;
    
    const progress = `(on/${totalFrames})`;
    const zoomFormula = `'${zoomStart}+(${zoomEnd}-${zoomStart})*${progress}'`;
    
    const filter = 
      `[${i}:v]` +
      `loop=loop=-1:size=1:start=0,` +
      `scale=w=${width}:h=${height}:force_original_aspect_ratio=increase,` +
      `crop=${width}:${height},` +
      `setsar=1,` +
      `zoompan=z=${zoomFormula}:d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}:fps=${frameRate},` +
      `trim=duration=${imageDuration},` +
      `setpts=PTS-STARTPTS` +
      fadeIn +
      fadeOut +
      `[v${i}]`;
    
    filterParts.push(filter);
  }
  
  const concatInputs = files.map((_, i) => `[v${i}]`).join('');
  return filterParts.join(';') + `;${concatInputs}concat=n=${files.length}:v=1:a=0[out]`;
}

function buildSlideFilter(files, resolution, imageDuration, frameRate, transitionDuration, slideDirection = 'alternate') {
  const [width, height] = resolution.split(':').map(Number);
  
  if (files.length === 1) {
    return `[0:v]loop=loop=-1:size=1:start=0,scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${imageDuration},fps=${frameRate},setpts=PTS-STARTPTS[out]`;
  }
  
  const directionMap = {
    'left': 'slideleft',
    'right': 'slideright',
    'up': 'slideup',
    'down': 'slidedown',
    'alternate': ['slideleft', 'slideright'], 
    'random': ['slideleft', 'slideright', 'slideup', 'slidedown']
  };
  
  const prepareFilters = files.map((file, index) => {
    return `[${index}:v]loop=loop=-1:size=1:start=0,scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,trim=duration=${imageDuration},fps=${frameRate},setpts=PTS-STARTPTS[v${index}]`;
  }).join(';');
  
  const getTransition = (index) => {
    if (Array.isArray(directionMap[slideDirection])) {
      return directionMap[slideDirection][index % directionMap[slideDirection].length];
    }
    return directionMap[slideDirection] || 'slideleft';
  };
  
  let xfadeChain = '';
  let currentLabel = '';
  
  for (let i = 0; i < files.length - 1; i++) {
    const transition = getTransition(i);
    const offset = imageDuration - transitionDuration;
    
    if (i === 0) {
      xfadeChain = `[v0][v1]xfade=transition=${transition}:duration=${transitionDuration}:offset=${offset}[x1]`;
      currentLabel = 'x1';
    } else {
      const prevLabel = currentLabel;
      currentLabel = `x${i + 1}`;
      xfadeChain += `;[${prevLabel}][v${i + 1}]xfade=transition=${transition}:duration=${transitionDuration}:offset=${offset}[${currentLabel}]`;
    }
  }
  
  return `${prepareFilters};${xfadeChain};[${currentLabel}]copy[out]`;
}

app.post("/create-video", upload.array("images", 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  const imageDuration = parseFloat(req.body.imageDuration) || 3;
  const fps = parseFloat(req.body.fps) || 30;
  const resolution = req.body.resolution || "1280:720";
  const crf = parseInt(req.body.crf) || 23;
  const transitionType = req.body.transitionType || "fade";
  const transitionDuration = parseFloat(req.body.transitionDuration) || 0.5;
  const slideDirection = req.body.slideDirection || "alternate";
  const zoomIntensity = req.body.zoomIntensity || "medium";

  const files = req.files.map(f => f.path).filter(filePath => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      console.error(`Error checking file ${filePath}:`, err);
      return false;
    }
  }).sort();

  if (files.length === 0) {
    return res.status(400).json({ error: "No valid image files found" });
  }

  const outputFileName = `video_${Date.now()}.mp4`;
  const outputPath = path.join(videoDir, outputFileName);

  const command = ffmpeg();
  
  const frameRate = transitionType === 'kenburns' 
    ? Math.max(24, Math.min(30, Math.ceil(fps))) 
    : Math.max(1, Math.min(30, Math.ceil(fps)));
  
  files.forEach((file) => {
    command.input(file);
  });
  
  let filterComplex;
  
  try {
    if (transitionType === 'kenburns') {
      filterComplex = buildKenBurnsFilter(files, resolution, imageDuration, frameRate, transitionDuration, zoomIntensity);
    } else if (transitionType === 'fade') {
      filterComplex = buildFadeFilter(files, resolution, imageDuration, frameRate, transitionDuration);
    } else if (transitionType === 'slide') {
      filterComplex = buildSlideFilter(files, resolution, imageDuration, frameRate, transitionDuration, slideDirection);
    } else {
      filterComplex = buildSimpleFilter(files, resolution, imageDuration, frameRate);
    }
  } catch (error) {
    console.error('❌ Error building filter:', error);
    return res.status(500).json({ error: 'Failed to build video filter', details: error.message });
  }
  
  command
    .complexFilter(filterComplex)
    .outputOptions([
      "-map", "[out]",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-crf", crf.toString(),
      "-preset", "medium",
      "-r", frameRate.toString(),
      "-fps_mode", "cfr"
    ])
    .output(outputPath)
    .on("start", () => {
      console.log('📝 FFmpeg started...\n');
    })
    .on("progress", (progress) => {
      const percent = Math.round(progress.percent || 0);
      if (percent > 0 && percent % 20 === 0) {
        console.log(`⏳ ${percent}%`);
      }
    })
    .on("end", () => {
      console.log("✅ Video created!\n");
      
      try {
        if (!fs.existsSync(outputPath)) {
          throw new Error('Video file was not created');
        }
        const stats = fs.statSync(outputPath);
        if (stats.size === 0) {
          throw new Error('Video file is empty');
        }
      } catch (err) {
        console.error('❌ Error verifying video file:', err);
        files.forEach(file => {
          try {
            if (fs.existsSync(file)) fs.unlinkSync(file);
          } catch (e) {
            console.error(`Error deleting file ${file}:`, e);
          }
        });
        if (!res.headersSent) {
          return res.status(500).json({ 
            error: "Video file verification failed",
            message: err.message 
          });
        }
        return;
      }
      
      files.forEach(file => {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        } catch (err) {
          console.error(`Warning: Could not delete temporary file ${file}:`, err);
        }
      });

      if (!res.headersSent) {
        res.json({ 
          success: true,
          videoUrl: `/videos/${outputFileName}`,
          duration: files.length * imageDuration,
          resolution: resolution,
          transitionType: transitionType,
          fps: frameRate
        });
      }
    })
    .on("error", (err, stdout, stderr) => {
      console.error("\n❌ FFmpeg error:", err.message);
      if (stderr) {
        console.error("FFmpeg stderr:", stderr);
      }
      if (stdout) {
        console.error("FFmpeg stdout:", stdout);
      }
      
      files.forEach(file => {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        } catch (e) {
          console.error(`Error deleting file ${file}:`, e);
        }
      });

      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (e) {
        console.error(`Error deleting output file ${outputPath}:`, e);
      }

      if (!res.headersSent) {
        res.status(500).json({ 
          error: "Video generation failed",
          message: err.message,
          details: stderr || undefined
        });
      }
    })
    .run();
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB per file.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 20 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' });
    }
    console.error('❌ Multer error:', error);
    return res.status(400).json({ error: `File upload error: ${error.message}` });
  }
  
  if (error && error.message && error.message.includes('Invalid file type')) {
    console.error('❌ File type error:', error.message);
    return res.status(400).json({ error: error.message });
  }
  
  // Інші помилки запитів
  if (error) {
    console.error('❌ Request error:', error);
    return res.status(400).json({ error: error.message || 'Invalid request' });
  }
  
  next();
});

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Image to Video Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 http://${HOST}:${PORT}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
}); 