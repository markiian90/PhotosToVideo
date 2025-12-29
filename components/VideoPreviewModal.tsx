// components/VideoPreviewModal.tsx
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface VideoPreviewModalProps {
  visible: boolean;
  videoUri: string;
  onClose: () => void;
}

export default function VideoPreviewModal({
  visible,
  videoUri,
  onClose,
}: VideoPreviewModalProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Нормалізуємо URI для Android
  useEffect(() => {
    if (visible && videoUri) {
      const normalizeUri = async () => {
        try {
          let uri = videoUri;
          
          // Якщо це файловий шлях без file:// префіксу, додаємо його
          if (uri.startsWith('/') && !uri.startsWith('file://')) {
            uri = `file://${uri}`;
          }
          
          if (Platform.OS === 'android' && uri.startsWith('file://')) {
            try {
              const fileInfo = await FileSystem.getInfoAsync(uri);
              if (!fileInfo.exists) {
                setError('Video file not found');
                return;
              }
              // Перевіряємо розмір файлу (відео не може бути менше 1KB)
              if (fileInfo.size && fileInfo.size < 1024) {
                console.warn('Video file seems too small:', fileInfo.size, 'bytes');
                setError('Video file is corrupted or not fully downloaded');
                return;
              }
            } catch (err) {
              console.error('Error checking file info:', err);
            }
          }
          
          setVideoSource(uri);
          setError(null);
        } catch (err) {
          console.error('Error normalizing video URI:', err);
          setError('Error downloading video');
        }
      };
      
      normalizeUri();
    }
  }, [visible, videoUri]);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;
    await videoRef.current.replayAsync();
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          'Sharing unavailable',
          'Sharing function is not available on this device.'
        );
        return;
      }

      if (!videoUri || (!videoUri.startsWith('file://') && !videoUri.startsWith('/'))) {
        Alert.alert(
          'Invalid video format',
          'Video file format is invalid. Please try creating the video again.'
        );
        return;
      }

      const fileUri = videoUri.startsWith('file://') ? videoUri : `file://${videoUri}`;

      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          Alert.alert(
            'Video not found',
            'Video file was not found. Please try creating the video again.'
          );
          return;
        }
      } catch (fileCheckError) {
        console.error('Error checking file:', fileCheckError);
        Alert.alert(
          'Error',
          'Unable to verify video file. Please try again.'
        );
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Share video',
        UTI: 'public.movie',
      });
    } catch (error: any) {
      console.error('Error sharing video:', error);
      const errorMessage = error?.message || 'Failed to share video. Please try again.';
      Alert.alert('Error sharing video', errorMessage);
    }
  };

  const handleSaveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Access to the gallery is required to save the video. Please grant permission in settings.'
        );
        return;
      }

      if (!videoUri || (!videoUri.startsWith('file://') && !videoUri.startsWith('/'))) {
        Alert.alert(
          'Invalid video format',
          'Video file format is invalid. Please try creating the video again.'
        );
        return;
      }

      try {
        const fileInfo = await FileSystem.getInfoAsync(videoUri);
        if (!fileInfo.exists) {
          Alert.alert(
            'Video not found',
            'Video file was not found. Please try creating the video again.'
          );
          return;
        }
        if (fileInfo.size === 0 || (fileInfo.size && fileInfo.size < 1024)) {
          Alert.alert(
            'Invalid video file',
            'Video file appears to be corrupted or empty. Please try creating the video again.'
          );
          return;
        }
      } catch (fileCheckError) {
        console.error('Error checking file:', fileCheckError);
        Alert.alert(
          'Error',
          'Unable to verify video file. Please try again.'
        );
        return;
      }

      await MediaLibrary.createAssetAsync(videoUri);
      Alert.alert('Success!', 'Video saved to gallery.');
    } catch (error: any) {
      console.error('Error saving to gallery:', error);
      let errorMessage = 'Failed to save video.';
      if (error?.message) {
        if (error.message.includes('permission') || error.message.includes('Permission')) {
          errorMessage = 'Permission denied. Please grant access to the media library in settings.';
        } else if (error.message.includes('file') || error.message.includes('File')) {
          errorMessage = 'Video file error. Please try creating the video again.';
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert('Error saving video', errorMessage);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
    }
  };

  useEffect(() => {
    if (!visible) {
      if (videoRef.current) {
        videoRef.current.pauseAsync().catch((err) => {
          console.error('Error pausing video:', err);
        });
      }
      setStatus(null);
      setIsPlaying(false);
      setVideoSource(null);
      setError(null);
    }
  }, [visible]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTime = status?.isLoaded ? status.positionMillis : 0;
  const duration = status?.isLoaded ? status.durationMillis || 0 : 0;
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your video is ready! 🎉</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Video Player */}
          <View style={styles.videoContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <Text style={styles.errorSubtext}>URI: {videoUri}</Text>
              </View>
            ) : videoSource ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: videoSource }}
                  style={styles.video}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                  isLooping={false}
                  useNativeControls={false}
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                  onError={(error) => {
                    console.error('Video error:', error);
                    setError('Error playing video');
                  }}
                />

                {/* Play/Pause Overlay */}
                {!isPlaying && (
                  <TouchableOpacity
                    style={styles.playOverlay}
                    onPress={handlePlayPause}
                  >
                    <View style={styles.playButton}>
                      <Text style={styles.playButtonText}>▶</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Downloading video...</Text>
              </View>
            )}
          </View>

          {/* Video Controls */}
          <View style={styles.controls}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handlePlayPause}
              >
                <Text style={styles.controlButtonText}>
                  {isPlaying ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleReplay}
              >
                <Text style={styles.controlButtonText}>↻</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveToGallery}
            >
              <Text style={styles.actionButtonText}>💾 Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
            >
              <Text style={styles.actionButtonText}>↗️ Share</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              ✓ Video saved to gallery
            </Text>
            <Text style={styles.infoSubtext}>
              Format: MP4 • 16:9 • {status?.isLoaded && status.durationMillis ? Math.round(status.durationMillis / 1000) : 0}s
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 32,
    color: '#2196F3',
    marginLeft: 4,
  },
  controls: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  controlButtonText: {
    fontSize: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  shareButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoContainer: {
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
  },
});