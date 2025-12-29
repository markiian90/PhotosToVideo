// components/VideoPreviewModal.tsx
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform
} from 'react-native';
import videoPreviewStyles from './VideoPreviewModal.styles';

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

  // Normalize video URI for Android
  useEffect(() => {
    if (visible && videoUri) {
      const normalizeUri = async () => {
        try {
          let uri = videoUri;
          
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
              // Check file size (video cannot be less than 1KB)
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
      <videoPreviewStyles.ModalOverlay>
        <videoPreviewStyles.ModalContent>
          {/* Header */}
          <videoPreviewStyles.Header>
            <videoPreviewStyles.Title>Your video is ready! 🎉</videoPreviewStyles.Title>
            <videoPreviewStyles.CloseButton onPress={onClose}>
              <videoPreviewStyles.CloseButtonText>✕</videoPreviewStyles.CloseButtonText>
            </videoPreviewStyles.CloseButton>
          </videoPreviewStyles.Header>

          {/* Video Player */}
          <videoPreviewStyles.VideoContainer>
            {error ? (
              <videoPreviewStyles.ErrorContainer>
                <videoPreviewStyles.ErrorText>⚠️ {error}</videoPreviewStyles.ErrorText>
                <videoPreviewStyles.ErrorSubtext>URI: {videoUri}</videoPreviewStyles.ErrorSubtext>
              </videoPreviewStyles.ErrorContainer>
            ) : videoSource ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: videoSource }}
                  style={{ width: '100%', height: '100%' }}
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
                  <videoPreviewStyles.PlayOverlay onPress={handlePlayPause}>
                    <videoPreviewStyles.PlayButton>
                      <videoPreviewStyles.PlayButtonText>▶</videoPreviewStyles.PlayButtonText>
                    </videoPreviewStyles.PlayButton>
                  </videoPreviewStyles.PlayOverlay>
                )}
              </>
            ) : (
              <videoPreviewStyles.LoadingContainer>
                <videoPreviewStyles.LoadingText>Downloading video...</videoPreviewStyles.LoadingText>
              </videoPreviewStyles.LoadingContainer>
            )}
          </videoPreviewStyles.VideoContainer>

          {/* Video Controls */}
          <videoPreviewStyles.Controls>
            {/* Progress Bar */}
            <videoPreviewStyles.ProgressContainer>
              <videoPreviewStyles.ProgressBar>
                <videoPreviewStyles.ProgressFill $width={progress * 100} />
              </videoPreviewStyles.ProgressBar>
              <videoPreviewStyles.TimeContainer>
                <videoPreviewStyles.TimeText>{formatTime(currentTime)}</videoPreviewStyles.TimeText>
                <videoPreviewStyles.TimeText>{formatTime(duration)}</videoPreviewStyles.TimeText>
              </videoPreviewStyles.TimeContainer>
            </videoPreviewStyles.ProgressContainer>

            {/* Control Buttons */}
            <videoPreviewStyles.ControlButtons>
              <videoPreviewStyles.ControlButton onPress={handlePlayPause}>
                <videoPreviewStyles.ControlButtonText>
                  {isPlaying ? '⏸' : '▶'}
                </videoPreviewStyles.ControlButtonText>
              </videoPreviewStyles.ControlButton>

              <videoPreviewStyles.ControlButton onPress={handleReplay}>
                <videoPreviewStyles.ControlButtonText>↻</videoPreviewStyles.ControlButtonText>
              </videoPreviewStyles.ControlButton>
            </videoPreviewStyles.ControlButtons>
          </videoPreviewStyles.Controls>

          {/* Action Buttons */}
          <videoPreviewStyles.ActionButtons>
            <videoPreviewStyles.SaveButton onPress={handleSaveToGallery}>
              <videoPreviewStyles.ActionButtonText>💾 Save</videoPreviewStyles.ActionButtonText>
            </videoPreviewStyles.SaveButton>

            <videoPreviewStyles.ShareButton onPress={handleShare}>
              <videoPreviewStyles.ActionButtonText>↗️ Share</videoPreviewStyles.ActionButtonText>
            </videoPreviewStyles.ShareButton>
          </videoPreviewStyles.ActionButtons>

          {/* Info */}
          <videoPreviewStyles.InfoContainer>
            <videoPreviewStyles.InfoText>
              ✓ Video saved to gallery
            </videoPreviewStyles.InfoText>
            <videoPreviewStyles.InfoSubtext>
              Format: MP4 • 16:9 • {status?.isLoaded && status.durationMillis ? Math.round(status.durationMillis / 1000) : 0}s
            </videoPreviewStyles.InfoSubtext>
          </videoPreviewStyles.InfoContainer>
        </videoPreviewStyles.ModalContent>
      </videoPreviewStyles.ModalOverlay>
    </Modal>
  );
}
