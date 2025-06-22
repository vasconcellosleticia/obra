import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"
import { requestCameraPermission, requestMediaLibraryPermission } from "./permissions"

export const showImagePickerOptions = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Selecionar Foto",
      "Escolha uma opção:",
      [
        {
          text: "Câmera",
          onPress: () => resolve("camera"),
        },
        {
          text: "Galeria",
          onPress: () => resolve("gallery"),
        },
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    )
  })
}

export const takePhoto = async () => {
  try {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      return null
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled && result.assets[0]) {
      return `data:image/jpeg;base64,${result.assets[0].base64}`
    }

    return null
  } catch (error) {
    console.error("Error taking photo:", error)
    Alert.alert("Erro", "Não foi possível tirar a foto.")
    return null
  }
}

export const pickImageFromGallery = async () => {
  try {
    const hasPermission = await requestMediaLibraryPermission()
    if (!hasPermission) {
      return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled && result.assets[0]) {
      return `data:image/jpeg;base64,${result.assets[0].base64}`
    }

    return null
  } catch (error) {
    console.error("Error picking image:", error)
    Alert.alert("Erro", "Não foi possível selecionar a imagem.")
    return null
  }
}

export const handleImageSelection = async () => {
  const option = await showImagePickerOptions()

  if (!option) {
    return null
  }

  if (option === "camera") {
    return await takePhoto()
  } else if (option === "gallery") {
    return await pickImageFromGallery()
  }

  return null
}
