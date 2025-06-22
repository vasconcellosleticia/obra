import * as Location from "expo-location"
import { Camera } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"

export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permissão Negada", "É necessário permitir o acesso à localização para usar esta funcionalidade.", [
        { text: "OK" },
      ])
      return false
    }

    return true
  } catch (error) {
    console.error("Error requesting location permission:", error)
    return false
  }
}

export const requestCameraPermission = async () => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permissão Negada", "É necessário permitir o acesso à câmera para tirar fotos.", [{ text: "OK" }])
      return false
    }

    return true
  } catch (error) {
    console.error("Error requesting camera permission:", error)
    return false
  }
}

export const requestMediaLibraryPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permissão Negada", "É necessário permitir o acesso à galeria para selecionar fotos.", [
        { text: "OK" },
      ])
      return false
    }

    return true
  } catch (error) {
    console.error("Error requesting media library permission:", error)
    return false
  }
}

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission()
    if (!hasPermission) {
      return null
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  } catch (error) {
    console.error("Error getting current location:", error)
    Alert.alert("Erro de Localização", "Não foi possível obter a localização atual. Verifique se o GPS está ativado.", [
      { text: "OK" },
    ])
    return null
  }
}
