// components/VideoConfigModal.tsx
import { Resolution, TransitionType, VideoConfig } from '@/services/videoService/videoService';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface VideoConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (config: VideoConfig) => void;
}

export default function VideoConfigModal({
  visible,
  onClose,
  onConfirm,
}: VideoConfigModalProps) {
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const [imageDuration, setImageDuration] = useState<number>(3);
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');

  const handleConfirm = () => {
    onConfirm({
      resolution,
      imageDuration,
      transitionType,
      transitionDuration: 0.5,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Налаштування відео</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Resolution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Роздільна здатність</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    resolution === '720p' && styles.optionButtonActive,
                  ]}
                  onPress={() => setResolution('720p')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      resolution === '720p' && styles.optionTextActive,
                    ]}
                  >
                    720p (HD)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    resolution === '1080p' && styles.optionButtonActive,
                  ]}
                  onPress={() => setResolution('1080p')}
                >
                  <Text
                    style={[
                      styles.optionText,
                      resolution === '1080p' && styles.optionTextActive,
                    ]}
                  >
                    1080p (Full HD)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Тривалість показу</Text>
              <View style={styles.optionsRow}>
                {[2, 3, 4].map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.optionButton,
                      imageDuration === duration && styles.optionButtonActive,
                    ]}
                    onPress={() => setImageDuration(duration)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        imageDuration === duration && styles.optionTextActive,
                      ]}
                    >
                      {duration} сек
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Transition Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Тип переходу</Text>
              <View style={styles.optionsColumn}>
                <TouchableOpacity
                  style={[
                    styles.optionButtonFull,
                    transitionType === 'fade' && styles.optionButtonActive,
                  ]}
                  onPress={() => setTransitionType('fade')}
                >
                  <View>
                    <Text
                      style={[
                        styles.optionText,
                        transitionType === 'fade' && styles.optionTextActive,
                      ]}
                    >
                      Fade (Затухання)
                    </Text>
                    <Text style={styles.optionDescription}>
                      Плавне затухання між зображеннями
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButtonFull,
                    transitionType === 'kenburns' && styles.optionButtonActive,
                  ]}
                  onPress={() => setTransitionType('kenburns')}
                >
                  <View>
                    <Text
                      style={[
                        styles.optionText,
                        transitionType === 'kenburns' && styles.optionTextActive,
                      ]}
                    >
                      Ken Burns
                    </Text>
                    <Text style={styles.optionDescription}>
                      Повільне масштабування та панорамування
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionButtonFull,
                    transitionType === 'slide' && styles.optionButtonActive,
                  ]}
                  onPress={() => setTransitionType('slide')}
                >
                  <View>
                    <Text
                      style={[
                        styles.optionText,
                        transitionType === 'slide' && styles.optionTextActive,
                      ]}
                    >
                      Slide (Ковзання)
                    </Text>
                    <Text style={styles.optionDescription}>
                      Плавне ковзання між зображеннями
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Підсумок:</Text>
              <Text style={styles.summaryText}>
                • Роздільна здатність: {resolution}
              </Text>
              <Text style={styles.summaryText}>
                • Кожне зображення: {imageDuration} секунд
              </Text>
              <Text style={styles.summaryText}>
                • Перехід: {transitionType === 'fade' ? 'Затухання' : transitionType === 'kenburns' ? 'Ken Burns' : 'Ковзання'}
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Створити відео</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
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
  scrollView: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionsColumn: {
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  optionButtonFull: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  optionButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#2196F3',
  },
  optionDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  summary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});