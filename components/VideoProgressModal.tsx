// components/VideoProgressModal.tsx
import { VideoProgress } from '@/services/videoService/videoService.types';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.stageEmoji}>
              {progress ? getStageEmoji(progress.stage) : '⏳'}
            </Text>
          </View>

          <Text style={styles.title}>
            {progress?.stage === 'complete' ? 'Done!' : 'Creating video...'}
          </Text>

          <Text style={styles.message}>
            {progress?.message || 'Initializing...'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${progress?.progress || 0}%` },
              ]}
            />
          </View>

          <Text style={styles.percentageText}>
            {Math.round(progress?.progress || 0)}%
          </Text>

          {progress?.stage !== 'complete' && (
            <ActivityIndicator
              size="large"
              color="#2196F3"
              style={styles.activityIndicator}
            />
          )}

          {/* Stage Information */}
          <View style={styles.stageInfo}>
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
          </View>

          {/* Cancel Button */}
          {progress?.stage !== 'complete' && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    <View style={styles.stageItem}>
      <View
        style={[
          styles.stageIndicator,
          active && styles.stageIndicatorActive,
          complete && styles.stageIndicatorComplete,
        ]}
      >
        {complete && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text
        style={[
          styles.stageLabel,
          (active || complete) && styles.stageLabelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 24,
  },
  activityIndicator: {
    marginVertical: 16,
  },
  stageInfo: {
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIndicatorActive: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  stageIndicatorComplete: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stageLabel: {
    fontSize: 14,
    color: '#999',
  },
  stageLabelActive: {
    color: '#333',
    fontWeight: '600',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});