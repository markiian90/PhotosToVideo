import styled from "styled-components/native";

export const HomeStyles = {
  Container: styled.ScrollView`
    flex: 1;
    background-color: #f5f5f5;
  `,
  Header: styled.View`
    padding: 20px;
    padding-top: 60px;
    background-color: #007aff;
    align-items: center;
  `,
  Title: styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: white;
    margin-bottom: 5px;
  `,
  Subtitle: styled.Text`
    font-size: 16px;
    color: rgba(255,255,255,0.8);
  `,
  Content: styled.View`
    flex: 1;
    padding: 20px;
  `,
  Placeholder: styled.View`
    height: 200px;
    background-color: #e0e0e0;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  `,
  PlaceholderText: styled.Text`
    color: #666;
    font-size: 16px;
  `,
  SelectedImage: styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 10px;
    margin-bottom: 20px;
  `,
  ButtonContainer: styled.View`
    gap: 15px;
  `,
  Button: styled.TouchableOpacity`
    background-color: #007aff;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    align-items: center;
  `,
  ButtonDisabled: styled.TouchableOpacity`
    background-color: #ccc;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    align-items: center;
  `,
  ConvertButton: styled.TouchableOpacity`
    background-color: #34c759;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    align-items: center;
  `,
  ButtonText: styled.Text`
    color: white;
    font-size: 16px;
    font-weight: 600;
  `,
  ConvertButtonText: styled.Text`
    color: white;
    font-size: 16px;
    font-weight: 600;
  `,
  ExploreLink: styled.View`
    align-self: center;
    margin-top: 10px;
  `,
  ExploreLinkText: styled.Text`
    color: #007aff;
    font-size: 16px;
    text-decoration-line: underline;
  `,
};
