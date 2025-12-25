import { useImageStore } from "@/store/image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Modal } from "react-native";
import HomeStyles from "./home.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Navigation from "@/components/navigation/navigation";

export default function HomeScreen() {
  const [isConverting, setIsConverting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageForView, setSelectedImageForView] = useState<string | null>(null);

  const { images: addedImages, isLoaded, loadImages } = useImageStore();

  const insert = useSafeAreaInsets();

  useEffect(() => {
    loadImages();
  }, []);

  const openImageModal = (imageUri: string) => {
    setSelectedImageForView(imageUri);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImageForView(null);
  };

  const pickImage = async () => {
    try {
      await selectNewImages();
    } catch (error) {
      console.error("Error picking images:", error);
      alert("Error selecting images. Please try again.");
    }
  };

  const selectNewImages = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const remainingSlots = 5 - addedImages.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        "Maximum images reached",
        "You already have 5 images selected. Remove some images first to add new ones.",
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
      const imageUris = result.assets.map((asset) => asset.uri);

      imageUris.forEach((image) => {
        useImageStore.getState().addImage(image);
      });
    }
  };

  const convertToVideo = async () => {
    console.log("Converting images to video:", addedImages);
    setIsConverting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate conversion
      console.log("Video conversion completed");
    } catch (error) {
      console.error("Error converting to video:", error);
      alert("Error converting images to video. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
    <HomeStyles.Container>
      <StatusBar style="auto" />

      <HomeStyles.Header style={{paddingTop: insert.top + 20}}>
        <HomeStyles.Title>🎬 Image to Video</HomeStyles.Title>
      </HomeStyles.Header>

      <HomeStyles.Content>
        {addedImages.length === 0 ? (
          <HomeStyles.Placeholder>
              <HomeStyles.PlaceholderText>Select up to 5 images to convert to video</HomeStyles.PlaceholderText>
          </HomeStyles.Placeholder>
        ) : (
          <HomeStyles.ImagesContainer horizontal={true} contentContainerStyle={{ gap: 12 }}> 
            {addedImages.map((image, index) => (
              <HomeStyles.ImageCard key={index}>
                <HomeStyles.ImageThumbnail source={{ uri: image }} />
                <HomeStyles.ImageActions>
                    <HomeStyles.ViewButton onPress={() => openImageModal(image)}>
                    <HomeStyles.ActionButtonText>View</HomeStyles.ActionButtonText>
                  </HomeStyles.ViewButton>
                  <HomeStyles.DeleteButton onPress={() => {
                    Alert.alert(
                      "Delete Image",
                      "Are you sure you want to remove this image?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => useImageStore.getState().removeImage(image)
                        }
                      ]
                    );
                  }}>
                    <HomeStyles.ActionButtonText>Delete</HomeStyles.ActionButtonText>
                  </HomeStyles.DeleteButton>
                </HomeStyles.ImageActions>
              </HomeStyles.ImageCard>
            ))}
          </HomeStyles.ImagesContainer>
        )}

        <HomeStyles.ButtonContainer>
          <HomeStyles.Button onPress={pickImage}>
            <HomeStyles.ButtonText>
              {addedImages.length === 5
                ? "All 5 images selected"
                : `Select ${5 - addedImages.length} more image${5 - addedImages.length !== 1 ? 's' : ''}`}
            </HomeStyles.ButtonText>
          </HomeStyles.Button>

            <HomeStyles.ConvertButton style={{ opacity: addedImages.length === 5 ? 1 : 0.3 }} onPress={convertToVideo}>
              <HomeStyles.ConvertButtonText>
                Convert to video
              </HomeStyles.ConvertButtonText>
            </HomeStyles.ConvertButton>
        </HomeStyles.ButtonContainer>
      </HomeStyles.Content>

      <Modal
        visible={modalVisible}
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
    </HomeStyles.Container>

    <Navigation activeTab='home' />
    </>
  );
}
