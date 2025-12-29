import styled from "styled-components/native";

interface ProgressBarProps {
  $width: number;
}

interface StageIndicatorProps {
  $active?: boolean;
  $complete?: boolean;
}

interface StageLabelProps {
  $active?: boolean;
}

const videoProgressStyles = {
  ModalOverlay: styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    padding: 20px;
  `,
  ModalContent: styled.View`
    background-color: #fff;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    max-width: 400px;
    align-items: center;
  `,
  IconContainer: styled.View`
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background-color: #f0f0f0;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
  `,
  StageEmoji: styled.Text`
    font-size: 40px;
  `,
  Title: styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    text-align: center;
  `,
  Message: styled.Text`
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
    text-align: center;
  `,
  ProgressBarContainer: styled.View`
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
  `,
  ProgressBar: styled.View<ProgressBarProps>`
    height: 100%;
    width: ${props => props.$width}%;
    background-color: #2196F3;
    border-radius: 4px;
  `,
  PercentageText: styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: #2196F3;
    margin-bottom: 24px;
  `,
  StageInfo: styled.View`
    width: 100%;
    margin-top: 16px;
    margin-bottom: 24px;
  `,
  StageItem: styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
  `,
  StageIndicator: styled.View<StageIndicatorProps>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border-width: 2px;
    border-color: ${props => 
      props.$complete ? '#4CAF50' : 
      props.$active ? '#2196F3' : 
      '#e0e0e0'};
    background-color: ${props => 
      props.$complete ? '#4CAF50' : 
      props.$active ? '#e3f2fd' : 
      '#fff'};
    margin-right: 12px;
    justify-content: center;
    align-items: center;
  `,
  Checkmark: styled.Text`
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  `,
  StageLabel: styled.Text<StageLabelProps>`
    font-size: 14px;
    color: ${props => props.$active ? '#333' : '#999'};
    font-weight: ${props => props.$active ? '600' : 'normal'};
  `,
  CancelButton: styled.TouchableOpacity`
    width: 100%;
    padding-vertical: 14px;
    border-radius: 8px;
    background-color: #f5f5f5;
    align-items: center;
  `,
  CancelButtonText: styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #666;
  `,
};

export default videoProgressStyles;

