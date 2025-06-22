"use client"

import React from "react"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert, Image } from "react-native"
import { Text, Card, Button, Chip, Portal } from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"
import Toast from "react-native-toast-message"

import { useObra } from "../context/ObraContext"
import LoadingSpinner from "../components/LoadingSpinner"
import EmailModal from "../components/EmailModal"
import { formatDateTime, getStatusColor, getStatusIcon } from "../utils/formatters"
import { theme } from "../theme/theme"

const FiscalizacaoDetailsScreen = ({ route, navigation }) => {
  const { fiscalizacaoId } = route.params
  const { selectedFiscalizacao, loading, fetchFiscalizacaoById, deleteFiscalizacao } = useObra()
  const [emailModalVisible, setEmailModalVisible] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      loadFiscalizacaoDetails()
    }, [fiscalizacaoId]),
  )

  const loadFiscalizacaoDetails = async () => {
    try {
      await fetchFiscalizacaoById(fiscalizacaoId)
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os detalhes da fiscalização",
      })
    }
  }

  const handleEdit = () => {
    navigation.navigate("EditFiscalizacao", { fiscalizacao: selectedFiscalizacao })
  }

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta fiscalização? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFiscalizacao(selectedFiscalizacao._id)
              Toast.show({
                type: "success",
                text1: "Sucesso",
                text2: "Fiscalização excluída com sucesso",
              })
              navigation.goBack()
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não foi possível excluir a fiscalização",
              })
            }
          },
        },
      ],
    )
  }

  const handleSendEmail = () => {
    setEmailModalVisible(true)
  }

  if (loading || !selectedFiscalizacao) {
    return <LoadingSpinner />
  }

  const statusColor = getStatusColor(selectedFiscalizacao.status)
  const statusIcon = getStatusIcon(selectedFiscalizacao.status)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Image source={{ uri: selectedFiscalizacao.foto }} style={styles.headerImage} />
              <View style={styles.headerInfo}>
                <Text variant="headlineSmall" style={styles.title}>
                  Fiscalização
                </Text>
                <Text variant="bodyMedium" style={styles.date}>
                  {formatDateTime(selectedFiscalizacao.data)}
                </Text>
                <Chip
                  icon={() => <Icon name={statusIcon} size={16} color="white" />}
                  style={[styles.statusChip, { backgroundColor: statusColor }]}
                  textStyle={styles.statusText}
                >
                  {selectedFiscalizacao.status}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Obra Info Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Obra Relacionada
            </Text>
            <Text variant="bodyLarge" style={styles.obraName}>
              {selectedFiscalizacao.obra?.nome}
            </Text>
            <Text variant="bodyMedium" style={styles.obraResponsavel}>
              Responsável: {selectedFiscalizacao.obra?.responsavel}
            </Text>
          </Card.Content>
        </Card>

        {/* Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Detalhes da Fiscalização
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Icon name="location-on" size={20} color={theme.colors.primary} />
                <View style={styles.infoText}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Localização
                  </Text>
                  <Text variant="bodyMedium">
                    {selectedFiscalizacao.localizacao.latitude.toFixed(6)},{" "}
                    {selectedFiscalizacao.localizacao.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>

              {selectedFiscalizacao.fiscal?.nome && (
                <View style={styles.infoItem}>
                  <Icon name="person" size={20} color={theme.colors.primary} />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>
                      Fiscal
                    </Text>
                    <Text variant="bodyMedium">{selectedFiscalizacao.fiscal.nome}</Text>
                    {selectedFiscalizacao.fiscal.registro && (
                      <Text variant="bodySmall" style={styles.registro}>
                        {selectedFiscalizacao.fiscal.registro}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {selectedFiscalizacao.temperatura && (
                <View style={styles.infoItem}>
                  <Icon name="thermostat" size={20} color={theme.colors.primary} />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>
                      Temperatura
                    </Text>
                    <Text variant="bodyMedium">{selectedFiscalizacao.temperatura}°C</Text>
                  </View>
                </View>
              )}

              {selectedFiscalizacao.condicaoClimatica && (
                <View style={styles.infoItem}>
                  <Icon name="wb-sunny" size={20} color={theme.colors.primary} />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>
                      Condição Climática
                    </Text>
                    <Text variant="bodyMedium">{selectedFiscalizacao.condicaoClimatica}</Text>
                  </View>
                </View>
              )}

              {selectedFiscalizacao.nivelRisco && (
                <View style={styles.infoItem}>
                  <Icon name="warning" size={20} color={theme.colors.primary} />
                  <View style={styles.infoText}>
                    <Text variant="bodySmall" style={styles.infoLabel}>
                      Nível de Risco
                    </Text>
                    <Text variant="bodyMedium">{selectedFiscalizacao.nivelRisco}</Text>
                  </View>
                </View>
              )}
            </View>

            <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
              Observações
            </Text>
            <Text variant="bodyMedium" style={styles.observacoes}>
              {selectedFiscalizacao.observacoes}
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button mode="outlined" onPress={handleEdit} icon="edit" style={styles.actionButton}>
            Editar
          </Button>
          <Button mode="outlined" onPress={handleSendEmail} icon="email" style={styles.actionButton}>
            Enviar por Email
          </Button>
          <Button
            mode="outlined"
            onPress={handleDelete}
            icon="delete"
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Excluir
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <EmailModal
          visible={emailModalVisible}
          onDismiss={() => setEmailModalVisible(false)}
          itemType="fiscalizacao"
          itemId={selectedFiscalizacao._id}
          itemName={`Fiscalização - ${selectedFiscalizacao.obra?.nome}`}
        />
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  date: {
    color: theme.colors.onSurfaceVariant,
    marginVertical: 8,
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
  },
  card: {
    margin: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 12,
  },
  obraName: {
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  obraResponsavel: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  registro: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  observacoes: {
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 16,
    flexWrap: "wrap",
  },
  actionButton: {
    marginVertical: 4,
    minWidth: 100,
  },
})

export default FiscalizacaoDetailsScreen
