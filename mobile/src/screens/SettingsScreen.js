"use client"

import { ScrollView, StyleSheet, Alert, Linking } from "react-native"
import { Text, Card, List, Switch, Button, Divider } from "react-native-paper"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import { theme } from "../theme/theme"

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true)
  const [autoLocation, setAutoLocation] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleClearCache = async () => {
    Alert.alert("Limpar Cache", "Tem certeza que deseja limpar o cache do aplicativo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: async () => {
          try {
            await AsyncStorage.clear()
            Toast.show({
              type: "success",
              text1: "Sucesso",
              text2: "Cache limpo com sucesso",
            })
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Erro",
              text2: "Não foi possível limpar o cache",
            })
          }
        },
      },
    ])
  }

  const handleOpenSupport = () => {
    Linking.openURL("mailto:suporte@obras.com?subject=Suporte - App Obras")
  }

  const handleOpenPrivacy = () => {
    Linking.openURL("https://obras.com/privacy")
  }

  const handleOpenTerms = () => {
    Linking.openURL("https://obras.com/terms")
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant="headlineSmall" style={styles.title}>
        Configurações
      </Text>

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Configurações do App
          </Text>

          <List.Item
            title="Notificações"
            description="Receber notificações sobre obras e fiscalizações"
            left={(props) => <List.Icon {...props} icon="notifications" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} color={theme.colors.primary} />}
          />

          <Divider />

          <List.Item
            title="Localização Automática"
            description="Obter localização automaticamente ao criar registros"
            left={(props) => <List.Icon {...props} icon="location-on" />}
            right={() => <Switch value={autoLocation} onValueChange={setAutoLocation} color={theme.colors.primary} />}
          />

          <Divider />

          <List.Item
            title="Modo Escuro"
            description="Usar tema escuro no aplicativo"
            left={(props) => <List.Icon {...props} icon="dark-mode" />}
            right={() => <Switch value={darkMode} onValueChange={setDarkMode} color={theme.colors.primary} />}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Gerenciamento de Dados
          </Text>

          <List.Item
            title="Limpar Cache"
            description="Remove dados temporários armazenados"
            left={(props) => <List.Icon {...props} icon="delete-sweep" />}
            onPress={handleClearCache}
          />

          <Divider />

          <List.Item
            title="Backup de Dados"
            description="Fazer backup dos dados locais"
            left={(props) => <List.Icon {...props} icon="backup" />}
            onPress={() =>
              Toast.show({
                type: "info",
                text1: "Em Desenvolvimento",
                text2: "Funcionalidade será implementada em breve",
              })
            }
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sobre o App
          </Text>

          <List.Item title="Versão" description="1.0.0" left={(props) => <List.Icon {...props} icon="info" />} />

          <Divider />

          <List.Item
            title="Suporte"
            description="Entre em contato conosco"
            left={(props) => <List.Icon {...props} icon="support" />}
            onPress={handleOpenSupport}
          />

          <Divider />

          <List.Item
            title="Política de Privacidade"
            description="Leia nossa política de privacidade"
            left={(props) => <List.Icon {...props} icon="privacy-tip" />}
            onPress={handleOpenPrivacy}
          />

          <Divider />

          <List.Item
            title="Termos de Uso"
            description="Leia os termos de uso do aplicativo"
            left={(props) => <List.Icon {...props} icon="description" />}
            onPress={handleOpenTerms}
          />
        </Card.Content>
      </Card>

      {/* Developer Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações do Desenvolvedor
          </Text>

          <Text variant="bodyMedium" style={styles.developerText}>
            Sistema de Cadastro de Obras
          </Text>
          <Text variant="bodySmall" style={styles.developerSubtext}>
            Desenvolvido para gerenciamento eficiente de obras e fiscalizações
          </Text>

          <Button
            mode="outlined"
            onPress={() =>
              Toast.show({
                type: "success",
                text1: "Obrigado!",
                text2: "Por usar nosso aplicativo",
              })
            }
            style={styles.thanksButton}
          >
            Avaliar App
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    color: theme.colors.onSurface,
    fontWeight: "bold",
  },
  developerText: {
    textAlign: "center",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  developerSubtext: {
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  thanksButton: {
    alignSelf: "center",
  },
})

export default SettingsScreen
