import { colors } from "@/constants/color";
import { styled } from "styled-components/native";

const NavigationStyles = {
  Container: styled.View`
    flex: 1;
    background-color: #f5f5f5;


    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    border: 1px solid #00000030;
    padding-top: 10px;

  `,
  Content: styled.View`
    flex: 1;
    background-color: transparent;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

  `,
  Button: styled.TouchableOpacity`
    flex: 1;
    background-color: transparent;
    align-items: center;
    justify-content: center;

    gap: 2px;
  `,
  ButtonText: styled.Text`
    color: #00000090;
    font-size: 16px;
  `,
};

export default NavigationStyles;