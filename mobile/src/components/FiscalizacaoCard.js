import { View, Image, StyleSheet } from "react-native"
import { Card, Text, Chip } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { formatDateTime, getStatusColor, getStatusIcon } from "../utils/formatters"
import { theme } from "../theme/theme"

const FiscalizacaoCard = ({ fiscalizacao, onPress }) => {
  const statusColor = getStatusColor(fiscalizacao.status)
  const statusIcon = getStatusIcon(fiscalizacao.status)

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: fiscalizacao.foto }}
            style={styles.image}
            defaultSource={{
              uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            }}
          />
          <View style={styles.headerInfo}>
            <Text variant="titleSmall" style={styles.date}>
              {formatDateTime(fiscalizacao.data)}
            </Text>
            <Chip
              icon={() => <MaterialIcons name={statusIcon} size={14} color="white" />}
              style={[styles.statusChip, { backgroundColor: statusColor }]}
              textStyle={styles.statusText}
              compact
            >
              {fiscalizacao.status}
            </Chip>
            {fiscalizacao.fiscal?.nome && (
              <Text variant="bodySmall" style={styles.fiscal}>
                {fiscalizacao.fiscal.nome}
              </Text>
            )}
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.observacoes} numberOfLines={2}>
          {fiscalizacao.observacoes}
        </Text>

        <View style={styles.footer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="location-on" size={14} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.infoText}>
              {fiscalizacao.localizacao.latitude.toFixed(4)}, {fiscalizacao.localizacao.longitude.toFixed(4)}
            </Text>
          </View>

          {fiscalizacao.temperatura && (
            <View style={styles.infoItem}>
              <MaterialIcons name="thermostat" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.infoText}>
                {fiscalizacao.temperatura}°C
              </Text>
            </View>
          )}

          {fiscalizacao.nivelRisco && (
            <View style={styles.infoItem}>
              <MaterialIcons name="warning" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.infoText}>
                {fiscalizacao.nivelRisco}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  date: {
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  statusText: {
    color: "white",
    fontSize: 10,
  },
  fiscal: {
    color: theme.colors.onSurfaceVariant,
  },
  observacoes: {
    color: theme.colors.onSurface,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 4,
    color: theme.colors.onSurfaceVariant,
  },
})

export default FiscalizacaoCard
