import styled from "styled-components/native";

interface ProgressFillProps {
  $width: number;
}

const videoPreviewStyles = {
  ModalOverlay: styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.9);
    justify-content: center;
    padding: 20px;
  `,
  ModalContent: styled.View`
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;
    max-width: 600px;
    align-self: center;
    width: 100%;
  `,
  Header: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom-width: 1px;
    border-bottom-color: #e0e0e0;
  `,
  Title: styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
  `,
  CloseButton: styled.TouchableOpacity`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: #f0f0f0;
    justify-content: center;
    align-items: center;
  `,
  CloseButtonText: styled.Text`
    font-size: 20px;
    color: #666;
  `,
  VideoContainer: styled.View`
    aspect-ratio: 16/9;
    background-color: #000;
    position: relative;
  `,
  LoadingContainer: styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: #000;
  `,
  LoadingText: styled.Text`
    color: #fff;
    font-size: 16px;
  `,
  ErrorContainer: styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: #000;
    padding: 20px;
  `,
  ErrorText: styled.Text`
    color: #ff4444;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  `,
  ErrorSubtext: styled.Text`
    color: #999;
    font-size: 12px;
    text-align: center;
  `,
  PlayOverlay: styled.TouchableOpacity`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
  `,
  PlayButton: styled.View`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    justify-content: center;
    align-items: center;
  `,
  PlayButtonText: styled.Text`
    font-size: 32px;
    color: #2196F3;
    margin-left: 4px;
  `,
  Controls: styled.View`
    padding: 20px;
    background-color: #f9f9f9;
  `,
  ProgressContainer: styled.View`
    margin-bottom: 12px;
  `,
  ProgressBar: styled.View`
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  `,
  ProgressFill: styled.View<ProgressFillProps>`
    height: 100%;
    width: ${props => props.$width}%;
    background-color: #2196F3;
  `,
  TimeContainer: styled.View`
    flex-direction: row;
    justify-content: space-between;
  `,
  TimeText: styled.Text`
    font-size: 12px;
    color: #666;
  `,
  ControlButtons: styled.View`
    flex-direction: row;
    justify-content: center;
    gap: 16px;
  `,
  ControlButton: styled.TouchableOpacity`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-color: #e0e0e0;
  `,
  ControlButtonText: styled.Text`
    font-size: 24px;
  `,
  ActionButtons: styled.View`
    flex-direction: row;
    padding: 20px;
    gap: 12px;
  `,
  ActionButton: styled.TouchableOpacity`
    flex: 1;
    padding-vertical: 16px;
    border-radius: 8px;
    align-items: center;
  `,
  SaveButton: styled.TouchableOpacity`
    flex: 1;
    padding-vertical: 16px;
    border-radius: 8px;
    align-items: center;
    background-color: #4CAF50;
  `,
  ShareButton: styled.TouchableOpacity`
    flex: 1;
    padding-vertical: 16px;
    border-radius: 8px;
    align-items: center;
    background-color: #2196F3;
  `,
  ActionButtonText: styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  `,
  InfoContainer: styled.View`
    padding: 20px;
    padding-top: 0;
    align-items: center;
  `,
  InfoText: styled.Text`
    font-size: 14px;
    color: #4CAF50;
    font-weight: 600;
    margin-bottom: 4px;
  `,
  InfoSubtext: styled.Text`
    font-size: 12px;
    color: #999;
  `,
};

export default videoPreviewStyles;

