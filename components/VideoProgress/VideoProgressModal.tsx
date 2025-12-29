// components/VideoProgressModal.tsx
import { VideoProgress } from '@/services/videoService/videoService.types';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  View,
} from 'react-native';
import videoProgressStyles from './VideoProgressModal.styles';

interface VideoProgressModalProps {
  visible: boolean;
  progress: VideoProgress | null;
  onCancel: () => void;
}

export default function VideoProgressModal({
  visible,
  progress,
  onCancel,
}: VideoProgressModalProps) {
  const getStageEmoji = (stage: string) => {
    switch (stage) {
      case 'preparing':
        return '📸';
      case 'processing':
        return '🎬';
      case 'finalizing':
        return '💾';
      case 'complete':
        return '✅';
      default:
        return '⏳';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <videoProgressStyles.ModalOverlay>
        <videoProgressStyles.ModalContent>
          <videoProgressStyles.IconContainer>
            <videoProgressStyles.StageEmoji>
              {progress ? getStageEmoji(progress.stage) : '⏳'}
            </videoProgressStyles.StageEmoji>
          </videoProgressStyles.IconContainer>

          <videoProgressStyles.Title>
            {progress?.stage === 'complete' ? 'Done!' : 'Creating video...'}
          </videoProgressStyles.Title>

          <videoProgressStyles.Message>
            {progress?.message || 'Initializing...'}
          </videoProgressStyles.Message>

          {/* Progress Bar */}
          <videoProgressStyles.ProgressBarContainer>
            <videoProgressStyles.ProgressBar $width={progress?.progress || 0} />
          </videoProgressStyles.ProgressBarContainer>

          <videoProgressStyles.PercentageText>
            {Math.round(progress?.progress || 0)}%
          </videoProgressStyles.PercentageText>

          {progress?.stage !== 'complete' && (
            <View style={{ marginVertical: 16 }}>
              <ActivityIndicator
                size="large"
                color="#2196F3"
              />
            </View>
          )}

          {/* Stage Information */}
          <videoProgressStyles.StageInfo>
            <StageItem
              label="Preparing"
              active={progress?.stage === 'preparing'}
              complete={
                progress?.stage === 'processing' ||
                progress?.stage === 'finalizing' ||
                progress?.stage === 'complete'
              }
            />
            <StageItem
              label="Processing"
              active={progress?.stage === 'processing'}
              complete={
                progress?.stage === 'finalizing' || progress?.stage === 'complete'
              }
            />
            <StageItem
              label="Finalizing"
              active={progress?.stage === 'finalizing'}
              complete={progress?.stage === 'complete'}
            />
          </videoProgressStyles.StageInfo>

          {/* Cancel Button */}
          {progress?.stage !== 'complete' && (
            <videoProgressStyles.CancelButton onPress={onCancel}>
              <videoProgressStyles.CancelButtonText>Cancel</videoProgressStyles.CancelButtonText>
            </videoProgressStyles.CancelButton>
          )}
        </videoProgressStyles.ModalContent>
      </videoProgressStyles.ModalOverlay>
    </Modal>
  );
}

interface StageItemProps {
  label: string;
  active: boolean;
  complete: boolean;
}

function StageItem({ label, active, complete }: StageItemProps) {
  return (
    <videoProgressStyles.StageItem>
      <videoProgressStyles.StageIndicator $active={active} $complete={complete}>
        {complete && <videoProgressStyles.Checkmark>✓</videoProgressStyles.Checkmark>}
      </videoProgressStyles.StageIndicator>
      <videoProgressStyles.StageLabel $active={active || complete}>
        {label}
      </videoProgressStyles.StageLabel>
    </videoProgressStyles.StageItem>
  );
}
