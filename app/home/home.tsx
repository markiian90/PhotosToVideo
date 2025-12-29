import VideoPreviewModal from "@/components/VideoPreview/VideoPreviewModal";
import VideoProgressModal from "@/components/VideoProgress/VideoProgressModal";
import Navigation from "@/components/navigation/navigation";
import VideoConfigModal from "@/components/videoConfig/videoConfigModal";
import videoService from "@/services/videoService/videoService";
import { VideoConfig, VideoProgress } from "@/services/videoService/videoService.types";
import { useImageStore } from "@/store/image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeStyles from "./home.styles";

export default function HomeScreen() {
  const [selectedImageForView, setSelectedImageForView] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  
  const [videoProgress, setVideoProgress] = useState<VideoProgress | null>(null);
  const [generatedVideoUri, setGeneratedVideoUri] = useState<string | null>(null);

  const { images: addedImages, isLoaded, loadImages } = useImageStore();
  const insert = useSafeAreaInsets();

  useEffect(() => {
    loadImages();
  }, []);

  const openImageModal = (imageUri: string) => {
    setSelectedImageForView(imageUri);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImageForView(null);
  };
  
  const selectNewImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission denied",
          "Access to the gallery is required to select images. Please grant permission in settings."
        );
        return;
      }

      const remainingSlots = 5 - addedImages.length;
      if (remainingSlots <= 0) {
        Alert.alert(
          "Maximum reached",
          "You have already selected 5 images. Remove some to add new ones.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (!result.assets || result.assets.length === 0) {
          Alert.alert("Error", "No images were selected. Please try again.");
          return;
        }

        const imageUris = result.assets.map((asset) => asset.uri);
        imageUris.forEach((image) => {
          if (image) {
            useImageStore.getState().addImage(image);
          }
        });
      }
    } catch (error: any) {
      console.error("Error in selectNewImages:", error);
      const errorMessage = error?.message || "Failed to select images. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const pickImage = async () => {
    try {
      await selectNewImages();
    } catch (error: any) {
      console.error("Error picking images:", error);
      const errorMessage = error?.message || "Unable to select images. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  // Validate image count and open config modal
  const handleConvertPress = () => {
    if (addedImages.length < 3) {
      Alert.alert(
        "Not enough images",
        "Please select at least 3 images to create a video.",
        [{ text: "OK" }]
      );
      return;
    }

    if (addedImages.length > 5) {
      Alert.alert(
        "Too many images",
        "Maximum 5 images allowed. Please remove some images.",
        [{ text: "OK" }]
      );
      return;
    }

    setConfigModalVisible(true);
  };

  // Start video creation process with selected config
  const handleConfigConfirm = async (config: VideoConfig) => {
    setConfigModalVisible(false);
    setProgressModalVisible(true);
    setVideoProgress({
      progress: 0,
      stage: 'preparing',
      message: 'Starting...'
    });

    try {
      const videoUri = await videoService.createVideo(
        addedImages,
        config,
        (progress) => {
          setVideoProgress(progress);
        }
      );

      if (videoUri) {
        setGeneratedVideoUri(videoUri);
        setProgressModalVisible(false);
        
        setTimeout(() => {
          setPreviewModalVisible(true);
        }, 500);
      } else {
        setProgressModalVisible(false);
        Alert.alert("Cancelled", "Video creation was cancelled.");
      }
    } catch (error: any) {
      console.error("Error creating video:", error);
      setProgressModalVisible(false);
      
      // Categorize and format error messages for user-friendly display
      setTimeout(() => {
        let errorMessage = "Unable to create video.";
        let errorTitle = "Error";
        
        if (error.message) {
          if (error.message.includes('cancelled')) {
            errorTitle = "Cancelled";
            errorMessage = "Video creation was cancelled.";
          }
          else if (error.message.includes('Network error') || error.message.includes('connect') || error.message.includes('Cannot connect')) {
            errorTitle = "Connection error";
            const fullMessage = error.message;
            
            if (fullMessage.includes('EXPO_PUBLIC_SERVER_URL') || fullMessage.includes('IP address')) {
              errorMessage = "Cannot connect to server.\n\n" +
                "On a real device:\n" +
                "1. Set EXPO_PUBLIC_SERVER_URL=http://YOUR_IP:3000 in .env\n" +
                "2. Same Wi-Fi network\n" +
                "3. Server must be running";
            } else {
              errorMessage = fullMessage.length > 150 
                ? fullMessage.substring(0, 150) + "..."
                : fullMessage;
            }
          }
          else if (error.message.includes('permission') || error.message.includes('Permission')) {
            errorTitle = "Permission denied";
            errorMessage = "Access to the media library is required. Please grant permission in settings.";
          }
          else if (error.message.includes('file') || error.message.includes('File')) {
            errorTitle = "File error";
            errorMessage = error.message.length > 150 
              ? error.message.substring(0, 150) + "..."
              : error.message;
          }
          else if (error.message.includes('Invalid request') || error.message.includes('too large') || error.message.includes('check your settings')) {
            errorTitle = "Invalid settings";
            errorMessage = error.message.length > 150 
              ? error.message.substring(0, 150) + "..."
              : error.message;
          }
          else if (error.message.includes('Server error') || error.message.includes('Server error occurred') || error.message.includes('Unable to process')) {
            errorTitle = "Server error";
            errorMessage = "A server error occurred. Please try again later.";
          }
          else {
            errorMessage = error.message.length > 200 
              ? error.message.substring(0, 200) + "..."
              : error.message;
          }
        }
        
        Alert.alert(
          errorTitle, 
          errorMessage, 
          [{ text: "OK", style: "default" }],
          { cancelable: true }
        );
      }, 100);
    }
  };


  const handleCancelRendering = () => {
    try {
      videoService.cancelRendering();
    } catch (error: any) {
      console.error("Error canceling rendering:", error);
      Alert.alert("Error", error.message);
    } finally {
      setProgressModalVisible(false);
    }
  };

  const canConvert = addedImages.length >= 3 && addedImages.length <= 5;

  return (
    <>
      <HomeStyles.Container>
        <StatusBar style="auto" />

        <HomeStyles.Header style={{ paddingTop: insert.top + 20 }}>
          <HomeStyles.Title>🎬 Image to Video</HomeStyles.Title>
        </HomeStyles.Header>

        <HomeStyles.Content>
          {addedImages.length === 0 ? (
            <HomeStyles.Placeholder>
              <HomeStyles.PlaceholderText>
                Choose images to create a video
              </HomeStyles.PlaceholderText>
            </HomeStyles.Placeholder>
          ) : (
            <HomeStyles.ImagesContainer
              horizontal={true}
              contentContainerStyle={{ gap: 12 }}
            >
              {addedImages.map((image, index) => (
                <HomeStyles.ImageCard key={index}>
                  <HomeStyles.ImageThumbnail source={{ uri: image }} />
                  <HomeStyles.ImageActions>
                    <HomeStyles.ViewButton onPress={() => openImageModal(image)}>
                      <HomeStyles.ActionButtonText>
                        View
                      </HomeStyles.ActionButtonText>
                    </HomeStyles.ViewButton>
                    <HomeStyles.DeleteButton
                      onPress={() => {
                        Alert.alert(
                          "Delete image",
                          "Are you sure you want to delete this image?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () =>
                                useImageStore.getState().removeImage(image),
                            },
                          ]
                        );
                      }}
                    >
                      <HomeStyles.ActionButtonText>
                        Delete
                      </HomeStyles.ActionButtonText>
                    </HomeStyles.DeleteButton>
                  </HomeStyles.ImageActions>
                </HomeStyles.ImageCard>
              ))}
            </HomeStyles.ImagesContainer>
          )}

          <HomeStyles.ButtonContainer>
            <HomeStyles.Button 
              onPress={pickImage}
              style={{ opacity: addedImages.length >= 5 ? 0.5 : 1 }}
              disabled={addedImages.length >= 5}
            >
              <HomeStyles.ButtonText>
                {addedImages.length === 0
                  ? "Choose images (3-5)"
                  : addedImages.length >= 5
                  ? "All 5 images chosen"
                  : `Add more (${addedImages.length}/5)`}
              </HomeStyles.ButtonText>
            </HomeStyles.Button>

            <HomeStyles.ConvertButton
              style={{ opacity: canConvert ? 1 : 0.3 }}
              onPress={handleConvertPress}
              disabled={!canConvert}
            >
              <HomeStyles.ConvertButtonText>
                {addedImages.length < 3
                  ? `Need ${3 - addedImages.length} more images`
                  : "Create video"}
              </HomeStyles.ConvertButtonText>
            </HomeStyles.ConvertButton>
          </HomeStyles.ButtonContainer>
        </HomeStyles.Content>

        {/* Image View Modal */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeImageModal}
        >
          <HomeStyles.ModalContainer>
            <HomeStyles.CloseButton onPress={closeImageModal}>
              <HomeStyles.CloseButtonText>✕</HomeStyles.CloseButtonText>
            </HomeStyles.CloseButton>

            {selectedImageForView && (
              <HomeStyles.ModalImage
                source={{ uri: selectedImageForView }}
                resizeMode="contain"
              />
            )}
          </HomeStyles.ModalContainer>
        </Modal>

        {/* Video Configuration Modal */}
        <VideoConfigModal
          visible={configModalVisible}
          onClose={() => setConfigModalVisible(false)}
          onConfirm={handleConfigConfirm}
        />

        {/* Video Progress Modal */}
        <VideoProgressModal
          visible={progressModalVisible}
          progress={videoProgress}
          onCancel={handleCancelRendering}
        />

        {/* Video Preview Modal */}
        {generatedVideoUri && (
          <VideoPreviewModal
            visible={previewModalVisible}
            videoUri={generatedVideoUri}
            onClose={() => setPreviewModalVisible(false)}
          />
        )}
      </HomeStyles.Container>

      <Navigation activeTab="home" />
    </>
  );
}