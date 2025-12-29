import styled from "styled-components/native";

interface OptionButtonProps {
  $active?: boolean;
  $full?: boolean;
}

interface OptionTextProps {
  $active?: boolean;
}

const videoConfigStyles = {
  ModalOverlay: styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
  `,
  ModalContent: styled.View`
    background-color: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding-top: 20px;
    padding-bottom: 40px;
    max-height: 80%;
  `,
  Header: styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: 20px;
    padding-bottom: 20px;
    border-bottom-width: 1px;
    border-bottom-color: #e0e0e0;
  `,
  Title: styled.Text`
    font-size: 24px;
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
  ScrollViewStyled: styled.ScrollView`
    padding-horizontal: 20px;
  `,
  Section: styled.View`
    margin-top: 24px;
  `,
  SectionTitle: styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  `,
  OptionsRow: styled.View`
    flex-direction: row;
    gap: 10px;
  `,
  OptionsColumn: styled.View`
    gap: 10px;
  `,
  OptionButton: styled.TouchableOpacity<OptionButtonProps>`
    ${props => props.$full ? '' : 'flex: 1;'}
    padding-vertical: 12px;
    padding-horizontal: 16px;
    border-radius: 8px;
    background-color: ${props => props.$active ? '#e3f2fd' : '#f5f5f5'};
    border-width: 2px;
    border-color: ${props => props.$active ? '#2196F3' : '#f5f5f5'};
  `,
  OptionText: styled.Text<OptionTextProps>`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$active ? '#2196F3' : '#666'};
    text-align: center;
  `,
  OptionDescription: styled.Text`
    font-size: 12px;
    color: #999;
    margin-top: 4px;
    text-align: center;
  `,
  Summary: styled.View`
    margin-top: 24px;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
  `,
  SummaryTitle: styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  `,
  SummaryText: styled.Text`
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  `,
  ConfirmButton: styled.TouchableOpacity`
    margin-horizontal: 20px;
    margin-top: 20px;
    padding-vertical: 16px;
    background-color: #2196F3;
    border-radius: 8px;
    align-items: center;
  `,
  ConfirmButtonText: styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  `,
};

export default videoConfigStyles;
