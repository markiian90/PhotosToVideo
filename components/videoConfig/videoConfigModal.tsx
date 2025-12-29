// components/VideoConfigModal.tsx
import { Resolution, TransitionType, VideoConfig } from '@/services/videoService/videoService.types';
import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import videoConfigStyles from './videoConfig.styles';

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
      <videoConfigStyles.ModalOverlay>
        <videoConfigStyles.ModalContent>
          <videoConfigStyles.Header>
            <videoConfigStyles.Title>Video settings</videoConfigStyles.Title>
            <videoConfigStyles.CloseButton onPress={onClose}>
              <videoConfigStyles.CloseButtonText>✕</videoConfigStyles.CloseButtonText>
            </videoConfigStyles.CloseButton>
          </videoConfigStyles.Header>

          <videoConfigStyles.ScrollViewStyled>
            {/* Resolution */}
            <videoConfigStyles.Section>
              <videoConfigStyles.SectionTitle>Resolution</videoConfigStyles.SectionTitle>
              <videoConfigStyles.OptionsRow>
                <videoConfigStyles.OptionButton
                  $active={resolution === '720p'}
                  onPress={() => setResolution('720p')}
                >
                  <videoConfigStyles.OptionText $active={resolution === '720p'}>
                    720p (HD)
                  </videoConfigStyles.OptionText>
                </videoConfigStyles.OptionButton>
                <videoConfigStyles.OptionButton
                  $active={resolution === '1080p'}
                  onPress={() => setResolution('1080p')}
                >
                  <videoConfigStyles.OptionText $active={resolution === '1080p'}>
                    1080p (Full HD)
                  </videoConfigStyles.OptionText>
                </videoConfigStyles.OptionButton>
              </videoConfigStyles.OptionsRow>
            </videoConfigStyles.Section>

            {/* Image Duration */}
            <videoConfigStyles.Section>
              <videoConfigStyles.SectionTitle>Image duration</videoConfigStyles.SectionTitle>
              <videoConfigStyles.OptionsRow>
                {[2, 3, 4].map((duration) => (
                  <videoConfigStyles.OptionButton
                    key={duration}
                    $active={imageDuration === duration}
                    onPress={() => setImageDuration(duration)}
                  >
                    <videoConfigStyles.OptionText $active={imageDuration === duration}>
                      {duration} seconds
                    </videoConfigStyles.OptionText>
                  </videoConfigStyles.OptionButton>
                ))}
              </videoConfigStyles.OptionsRow>
            </videoConfigStyles.Section>

            {/* Transition Type */}
            <videoConfigStyles.Section>
              <videoConfigStyles.SectionTitle>Transition type</videoConfigStyles.SectionTitle>
              <videoConfigStyles.OptionsColumn>
                <videoConfigStyles.OptionButton
                  $full
                  $active={transitionType === 'fade'}
                  onPress={() => setTransitionType('fade')}
                >
                  <View>
                    <videoConfigStyles.OptionText $active={transitionType === 'fade'}>
                      Fade
                    </videoConfigStyles.OptionText>
                    <videoConfigStyles.OptionDescription>
                      Smooth fade between images
                    </videoConfigStyles.OptionDescription>
                  </View>
                </videoConfigStyles.OptionButton>

                <videoConfigStyles.OptionButton
                  $full
                  $active={transitionType === 'kenburns'}
                  onPress={() => setTransitionType('kenburns')}
                >
                  <View>
                    <videoConfigStyles.OptionText $active={transitionType === 'kenburns'}>
                      Ken Burns
                    </videoConfigStyles.OptionText>
                    <videoConfigStyles.OptionDescription>
                      Slow zoom and panning
                    </videoConfigStyles.OptionDescription>
                  </View>
                </videoConfigStyles.OptionButton>

                <videoConfigStyles.OptionButton
                  $full
                  $active={transitionType === 'slide'}
                  onPress={() => setTransitionType('slide')}
                >
                  <View>
                    <videoConfigStyles.OptionText $active={transitionType === 'slide'}>
                      Slide
                    </videoConfigStyles.OptionText>
                    <videoConfigStyles.OptionDescription>
                      Smooth slide between images
                    </videoConfigStyles.OptionDescription>
                  </View>
                </videoConfigStyles.OptionButton>
              </videoConfigStyles.OptionsColumn>
            </videoConfigStyles.Section>

            {/* Summary */}
            <videoConfigStyles.Summary>
              <videoConfigStyles.SummaryTitle>Summary:</videoConfigStyles.SummaryTitle>
              <videoConfigStyles.SummaryText>
                • Resolution: {resolution}
              </videoConfigStyles.SummaryText>
              <videoConfigStyles.SummaryText>
                • Image duration: {imageDuration} seconds
              </videoConfigStyles.SummaryText>
              <videoConfigStyles.SummaryText>
                • Transition type: {transitionType === 'fade' ? 'Fade' : transitionType === 'kenburns' ? 'Ken Burns' : 'Slide'}
              </videoConfigStyles.SummaryText>
            </videoConfigStyles.Summary>
          </videoConfigStyles.ScrollViewStyled>

          <videoConfigStyles.ConfirmButton onPress={handleConfirm}>
            <videoConfigStyles.ConfirmButtonText>Create video</videoConfigStyles.ConfirmButtonText>
          </videoConfigStyles.ConfirmButton>
        </videoConfigStyles.ModalContent>
      </videoConfigStyles.ModalOverlay>
    </Modal>
  );
}