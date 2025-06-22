"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Button, SegmentedButtons, TextInput, Card } from "react-native-paper"
import SimpleModal from "./SimpleModal"
import { theme } from "../theme/theme"

const FilterModal = ({ visible, onDismiss, onApply, onClear, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters || {})

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "Planejada", label: "Planejada" },
    { value: "Em Andamento", label: "Em Andamento" },
    { value: "Pausada", label: "Pausada" },
    { value: "Concluída", label: "Concluída" },
  ]

  const handleApply = () => {
    onApply(filters)
  }

  const handleClear = () => {
    setFilters({})
    onClear()
  }

  return (
    <SimpleModal visible={visible} onDismiss={onDismiss}>
      <Card.Content>
        <Text variant="headlineSmall" style={styles.title}>
          Filtros
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Status
        </Text>
        <SegmentedButtons
          value={filters.status || ""}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
          buttons={statusOptions.slice(0, 3)}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Responsável"
          value={filters.responsavel || ""}
          onChangeText={(value) => setFilters({ ...filters, responsavel: value })}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleClear} style={styles.button}>
            Limpar
          </Button>
          <Button mode="contained" onPress={handleApply} style={styles.button}>
            Aplicar
          </Button>
        </View>
      </Card.Content>
    </SimpleModal>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.colors.primary,
  },
  sectionTitle: {
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
})

export default FilterModal
