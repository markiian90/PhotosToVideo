import { colors } from "@/constants/color";
import styled from "styled-components/native";

const HomeStyles = {
  Container: styled.ScrollView`
    flex: 1;
    background-color: #f5f5f5;
  `,
  Header: styled.View`
    padding: 20px;
    padding-top: 60px;
    background-color: ${colors.blue};
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
    background-color: ${colors.placeholder};
    border-radius:8px 10px;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 55px;
  `,
  PlaceholderText: styled.Text`
    color: ${colors.placeholderText};
    font-size: 16px;
  `,
  SelectedImage: styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 10px;
    margin-bottom: 10px;
  `,
  ImageCard: styled.View`
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 3;
  `,
  ImageThumbnail: styled.Image`
    width: 100%;
    height: 120px;
    border-radius: 8px;
    margin-bottom: 10px;
  `,
  ImageActions: styled.View`
    flex-direction: row;
    gap: 8px;
  `,
  ViewButton: styled.TouchableOpacity`
    background-color: ${colors.blue};
    flex: 1;
    padding-vertical: 8px;
    padding-horizontal: 12px;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  `,
  DeleteButton: styled.TouchableOpacity`
    background-color: ${colors.red};
    flex: 1;
    padding-vertical: 8px;
    padding-horizontal: 12px;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
  `,
  ActionButtonText: styled.Text`
    color: white;
    font-size: 14px;
    font-weight: 600;
  `,
  ImagesContainer: styled.ScrollView`
    gap: 10px;
    margin-bottom: 15px;
    margin-top: 55px;
  `,
  ButtonContainer: styled.View`
    gap: 15px;
  `,
  Button: styled.TouchableOpacity`
    background-color: ${colors.blue};
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    align-items: center;
  `,
  ButtonDisabled: styled.TouchableOpacity`
    background-color: ${colors.gray};
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 10px;
    align-items: center;
  `,
  ConvertButton: styled.TouchableOpacity`
    background-color:${colors.secondary};
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
    color: ${colors.blue};
    font-size: 16px;
    text-decoration-line: underline;
  `,
  ModalContainer: styled.View`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.9);
    justify-content: center;
    align-items: center;
  `,
  ModalImage: styled.Image`
    width: 90%;
    height: 70%;
    border-radius: 10px;
  `,
  CloseButton: styled.TouchableOpacity`
    position: absolute;
    top: 50px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    padding: 10px;
  `,
  CloseButtonText: styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
  `,
};

export default HomeStyles;