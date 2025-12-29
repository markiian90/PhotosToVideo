import { SERVER_URL } from "@/constants/server";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { VideoConfig, VideoProgress } from "./videoService.types";

let isCancelled = false;
let currentAbortController: AbortController | null = null;

export const cancelRendering = (): void => {
  isCancelled = true;
  if (currentAbortController) {
    currentAbortController.abort();
  }
};

export const createVideo = async (
  imageUris: string[],
  config: VideoConfig,
  onProgress: (progress: VideoProgress) => void
): Promise<string | null> => {
  isCancelled = false;
  currentAbortController = new AbortController();

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Media library permission not granted");
    }

    // Stage 1: Upload images to server
    onProgress({
      progress: 0,
      stage: "preparing",
      message: "Uploading images to server...",
    });

    const videoUrl = await uploadAndCreateVideo(
      imageUris,
      config,
      (p, message) => {
        const progress = p * 80;

        onProgress({
          progress: Math.min(Math.max(progress, 0), 80),
          stage: p < 0.5 ? "preparing" : "processing",
          message:
            message ||
            (p < 0.5
              ? "Uploading images to server..."
              : "Creating video on server..."),
        });
      }
    );

    if (isCancelled || !videoUrl) {
      return null;
    }

    // Stage 2: Download video from server
    onProgress({
      progress: 80,
      stage: "finalizing",
      message: "Downloading video from server...",
    });

    const videoPath = await downloadVideo(videoUrl, (p) => {
      const progress = 80 + p * 15;
      onProgress({
        progress: Math.min(progress, 95),
        stage: "finalizing",
        message:
          p < 1
            ? `Downloading video... ${Math.round(p * 100)}%`
            : "Video downloaded!",
      });
    });

    if (isCancelled) {
      try {
        await FileSystem.deleteAsync(videoPath, { idempotent: true });
      } catch (e) {
        console.error("Error deleting video:", e);
      }
      return null;
    }

    // Stage 3: Save to gallery
    onProgress({
      progress: 95,
      stage: "finalizing",
      message: "Saving video to gallery...",
    });

    const fileInfo = await FileSystem.getInfoAsync(videoPath);
    if (!fileInfo.exists) {
      throw new Error(
        "Video file does not exist. Please try creating the video again."
      );
    }

    try {
      await MediaLibrary.createAssetAsync(videoPath);
    } catch (mediaError: any) {
      if (
        mediaError.message?.includes("permission") ||
        mediaError.message?.includes("Permission")
      ) {
        throw new Error(
          "Permission denied. Please grant access to the media library in settings."
        );
      }
      throw new Error(
        `Failed to save video to gallery: ${
          mediaError.message || "Unknown error"
        }`
      );
    }

    onProgress({
      progress: 100,
      stage: "complete",
      message: "Done!",
    });

    return videoPath;
  } catch (error: any) {
    console.error("Error creating video:", error);

    if (
      error.message?.includes("permission") ||
      error.message?.includes("Permission")
    ) {
      throw error;
    }

    if (error.message?.includes("file") || error.message?.includes("File")) {
      throw error;
    }

    if (
      error.message?.includes("Network error") ||
      error.message?.includes("connect")
    ) {
      throw error;
    }

    if (error.message) {
      throw error;
    }

    throw new Error("Failed to create video. Please try again.");
  } finally {
    currentAbortController = null;
  }
};

const uploadAndCreateVideo = async (
  imageUris: string[],
  config: VideoConfig,
  onProgress: (progress: number, message?: string) => void
): Promise<string | null> => {
  try {
    const formData = new FormData();
    const totalImages = imageUris.length;

    for (let i = 0; i < imageUris.length; i++) {
      if (isCancelled) return null;

      const imageUri = imageUris[i];
      const filename = imageUri.split("/").pop() || `image_${i}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      
      let type = "image/jpeg";
      if (match) {
        const ext = match[1].toLowerCase();
        if (ext === 'heic' || ext === 'heif') {
          type = `image/${ext}`;
        } else if (ext === 'jpg' || ext === 'jpeg') {
          type = 'image/jpeg';
        } else {
          type = `image/${ext}`;
        }
      }

      formData.append("images", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      const uploadProgress = ((i + 1) / totalImages) * 0.4;
      onProgress(
        uploadProgress,
        `Uploading image ${i + 1} of ${totalImages}...`
      );
    }

    const resolution = config.resolution === "1080p" ? "1920:1080" : "1280:720";
    const fps = 1;

    formData.append("imageDuration", config.imageDuration.toString());
    formData.append("fps", fps.toString());
    formData.append("resolution", resolution);
    formData.append("crf", "23");
    formData.append("transitionType", config.transitionType);
    formData.append("transitionDuration", config.transitionDuration.toString());

    onProgress(0.45, "Sending to server...");

    let response: Response;
    try {
      response = await fetch(`${SERVER_URL}/create-video`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: currentAbortController?.signal,
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error;
      }
      
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Network request failed")) {
          const isLocalhost = SERVER_URL.includes("localhost") || SERVER_URL.includes("127.0.0.1");
          if (isLocalhost) {
            throw new Error(
              "Network error: Cannot connect to server. " +
              "If you're using Expo Go on a real device, make sure:\n" +
              "1. Your computer and phone are on the same Wi-Fi network\n" +
              "2. Server is running on your computer\n" +
              "3. Use your computer's IP address instead of localhost\n" +
              "Set EXPO_PUBLIC_SERVER_URL=http://YOUR_IP:3000 in .env file"
            );
          }
          throw new Error(
            "Network error: Could not connect to server. " +
            "Please check:\n" +
            "1. Your internet connection\n" +
            "2. Server is running\n" +
            "3. Server URL is correct"
          );
        }
      }
      
      if (error.message?.includes("Network request failed") || 
          error.message?.includes("Failed to connect") ||
          error.message?.includes("ECONNREFUSED")) {
        const isLocalhost = SERVER_URL.includes("localhost") || SERVER_URL.includes("127.0.0.1");
        if (isLocalhost) {
          throw new Error(
            "Cannot connect to server. " +
            "On a real device, use your computer's IP address instead of localhost. " +
            "Example: http://192.168.1.100:3000"
          );
        }
        throw new Error(
          "Network error: Could not connect to server. " +
          "Please check your connection and server status."
        );
      }
      
      throw new Error(`Network error: ${error.message || "Unknown network error"}`);
    }

    if (!response.ok) {
      let userFriendlyMessage = "Server error occurred";

      try {
        const errorData = await response.json();
        console.error("Server error details:", errorData);

        if (response.status === 400) {
          userFriendlyMessage =
            errorData.error || "Invalid request. Please check your settings.";
        } else if (response.status === 413) {
          userFriendlyMessage =
            "Files are too large. Please use smaller images.";
        } else if (response.status === 500) {
          userFriendlyMessage =
            "Server error occurred. Please try again later.";
        } else {
          userFriendlyMessage = "Unable to process request. Please try again.";
        }
      } catch (e) {
        console.error("Error parsing server response:", e);
        if (response.status === 500) {
          userFriendlyMessage =
            "Server error occurred. Please try again later.";
        } else {
          userFriendlyMessage = "Unable to process request. Please try again.";
        }
      }
      throw new Error(userFriendlyMessage);
    }

    onProgress(0.5, "Processing video on server...");

    const result = await response.json();

    onProgress(1.0, "Video created successfully!");

    if (!result.success || !result.videoUrl) {
      console.error("Server response error:", result);
      throw new Error("Server error occurred. Please try again later.");
    }

    const videoUrl = result.videoUrl.startsWith("http")
      ? result.videoUrl
      : `${SERVER_URL}${result.videoUrl}`;

    return videoUrl;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Upload cancelled");
      return null;
    }
    console.error("Error uploading images:", error);
    throw error;
  }
};

const downloadVideo = async (
  videoUrl: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const outputPath = `${FileSystem.cacheDirectory}video_${Date.now()}.mp4`;

  console.log("Downloading video from:", videoUrl);
  console.log("Output path:", outputPath);

  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      outputPath,
      {},
      (downloadProgress) => {
        if (isCancelled) {
          return;
        }
        if (downloadProgress.totalBytesExpectedToWrite > 0) {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          onProgress(Math.min(Math.max(progress, 0), 1));
        } else {
          onProgress(0);
        }
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (!result || !result.uri) {
      throw new Error("Failed to download video: No file URI returned");
    }

    const fileInfo = await FileSystem.getInfoAsync(result.uri);
    if (!fileInfo.exists) {
      throw new Error("Downloaded video file does not exist");
    }

    if (fileInfo.size === 0) {
      throw new Error(
        "Downloaded video file is empty. The video may be corrupted."
      );
    }

    if (fileInfo.size < 1024) {
      throw new Error(
        "Downloaded video file is too small. The video may be corrupted."
      );
    }

    return result.uri;
  } catch (error: any) {
    if (error.message === "Download cancelled") {
      throw error;
    }
    console.error("Error downloading video:", error);

    throw new Error("Failed to download video. Please try again.");
  }
};

const videoService = {
  createVideo,
  cancelRendering,
};

export default videoService;
