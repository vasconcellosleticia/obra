import { View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { handleImageSelection } from "../utils/imageUtils"
import { theme } from "../theme/theme"

const ImagePickerComponent = ({ selectedImage, onImageSelected }) => {
  const handleSelectImage = async () => {
    const imageUri = await handleImageSelection()
    if (imageUri) {
      onImageSelected(imageUri)
    }
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.changeButton} onPress={handleSelectImage}>
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="add-a-photo" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={styles.placeholderText}>
              Nenhuma foto selecionada
            </Text>
            <Button mode="outlined" onPress={handleSelectImage} style={styles.selectButton}>
              Selecionar Foto
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  changeButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  placeholderContainer: {
    alignItems: "center",
    padding: 32,
  },
  placeholderText: {
    marginVertical: 16,
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
  },
  selectButton: {
    marginTop: 8,
  },
})

export default ImagePickerComponent
