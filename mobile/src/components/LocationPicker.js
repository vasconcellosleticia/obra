import { View, StyleSheet } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import { getCurrentLocation } from "../utils/permissions"
import { formatCoordinates } from "../utils/formatters"
import { theme } from "../theme/theme"

const LocationPicker = ({ selectedLocation, onLocationSelected, showCurrentLocationButton = false }) => {
  const handleGetCurrentLocation = async () => {
    const location = await getCurrentLocation()
    if (location) {
      onLocationSelected(location)
    }
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        {selectedLocation ? (
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={24} color={theme.colors.primary} />
            <View style={styles.locationInfo}>
              <Text variant="bodyMedium" style={styles.coordinates}>
                {formatCoordinates(selectedLocation.latitude, selectedLocation.longitude)}
              </Text>
              <Text variant="bodySmall" style={styles.locationLabel}>
                Localização selecionada
              </Text>
            </View>
            <Button mode="outlined" onPress={handleGetCurrentLocation} compact>
              Alterar
            </Button>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name="location-off" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={styles.placeholderText}>
              Nenhuma localização selecionada
            </Text>
            <Button mode="outlined" onPress={handleGetCurrentLocation} style={styles.selectButton}>
              Obter Localização Atual
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  coordinates: {
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  locationLabel: {
    color: theme.colors.onSurfaceVariant,
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

export default LocationPicker
