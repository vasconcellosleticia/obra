import { View, StyleSheet } from "react-native"
import { Text, Button } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { theme } from "../theme/theme"

const EmptyState = ({ icon, title, subtitle, actionText, onAction }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={64} color={theme.colors.onSurfaceVariant} />
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {subtitle}
      </Text>
      {actionText && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionText}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    color: theme.colors.onSurface,
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
  },
  button: {
    marginTop: 16,
  },
})

export default EmptyState
