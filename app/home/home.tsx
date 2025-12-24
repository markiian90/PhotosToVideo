import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { HomeStyles as Styled } from './home.styles';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const pickImage = () => {
    console.log('pickImage');
  };

  const convertToVideo = async () => {
    console.log('convertToVideo');
  };

  return (
    <Styled.Container>
      <StatusBar style="auto" />

      <Styled.Header>
        <Styled.Title>🎬 Image to Video</Styled.Title>
      </Styled.Header>

      <Styled.Content>
        {!selectedImage ? (
          <Styled.Placeholder>
            <Styled.PlaceholderText>No image selected</Styled.PlaceholderText>
          </Styled.Placeholder>
        ) : (
          <Styled.SelectedImage source={{ uri: selectedImage }} />
        )}

        <Styled.ButtonContainer>
          <Styled.Button onPress={pickImage}>
            <Styled.ButtonText>
              Select image
            </Styled.ButtonText>
          </Styled.Button>

          {(!selectedImage || isConverting) ? (
            <Styled.ButtonDisabled onPress={convertToVideo} disabled>
              <Styled.ConvertButtonText>
                {isConverting ? 'Converting...' : 'Convert to video'}
              </Styled.ConvertButtonText>
            </Styled.ButtonDisabled>
          ) : (
            <Styled.ConvertButton onPress={convertToVideo}>
              <Styled.ConvertButtonText>
                Convert to video
              </Styled.ConvertButtonText>
            </Styled.ConvertButton>
          )}
        </Styled.ButtonContainer>
      </Styled.Content>
    </Styled.Container>
  );
}

