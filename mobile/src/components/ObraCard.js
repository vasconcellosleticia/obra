import { View, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Card, Text, Chip, ProgressBar } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { formatDate, formatCurrency, formatPercentage, getStatusColor, getStatusIcon } from "../utils/formatters"
import { theme } from "../theme/theme"

const ObraCard = ({ obra, onPress, onEdit, onDelete }) => {
  const statusColor = getStatusColor(obra.status)
  const statusIcon = getStatusIcon(obra.status)

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        {/* Header with image and basic info */}
        <View style={styles.header}>
          <Image
            source={{ uri: obra.foto }}
            style={styles.image}
            defaultSource={{
              uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            }}
          />
          <View style={styles.headerInfo}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
              {obra.nome}
            </Text>
            <Text variant="bodySmall" style={styles.responsavel}>
              {obra.responsavel}
            </Text>
            <Chip
              icon={() => <MaterialIcons name={statusIcon} size={16} color="white" />}
              style={[styles.statusChip, { backgroundColor: statusColor }]}
              textStyle={styles.statusText}
              compact
            >
              {obra.status}
            </Chip>
          </View>
        </View>

        {/* Progress and dates */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="bodySmall" style={styles.progressLabel}>
              Progresso: {formatPercentage(obra.progresso)}
            </Text>
            <Text variant="bodySmall" style={styles.dateRange}>
              {formatDate(obra.dataInicio)} - {formatDate(obra.dataFim)}
            </Text>
          </View>
          <ProgressBar progress={obra.progresso / 100} color={statusColor} style={styles.progressBar} />
        </View>

        {/* Additional info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialIcons name="location-on" size={16} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={styles.infoText}>
              {obra.localizacao.latitude.toFixed(4)}, {obra.localizacao.longitude.toFixed(4)}
            </Text>
          </View>

          {obra.orcamento && (
            <View style={styles.infoItem}>
              <MaterialIcons name="attach-money" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.infoText}>
                {formatCurrency(obra.orcamento)}
              </Text>
            </View>
          )}

          {obra.fiscalizacoes && (
            <View style={styles.infoItem}>
              <MaterialIcons name="assignment" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.infoText}>
                {obra.fiscalizacoes.length} fiscalizações
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(obra)}>
            <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(obra)}>
            <MaterialIcons name="delete" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: theme.colors.surfaceVariant,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  responsavel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontSize: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  infoSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    color: theme.colors.onSurfaceVariant,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: 8,
  },
  editButton: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 24,
  },
})

export default ObraCard
