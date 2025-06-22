import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Text } from "react-native-paper"
import { theme } from "../theme/theme"

const LoadingSpinner = ({ message = "Carregando..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  message: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
  },
})

export default LoadingSpinner
