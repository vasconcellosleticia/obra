"use client"

import { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Text, TextInput, Button, HelperText, Card } from "react-native-paper"
import { useForm, Controller } from "react-hook-form"
import Toast from "react-native-toast-message"
import { useObra } from "../context/ObraContext"
import SimpleModal from "./SimpleModal"
import { theme } from "../theme/theme"

const EmailModal = ({ visible, onDismiss, itemType, itemId, itemName }) => {
  const { sendObraByEmail, sendFiscalizacaoByEmail } = useObra()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      message: "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (itemType === "obra") {
        await sendObraByEmail(itemId, data.email, data.message)
      } else if (itemType === "fiscalizacao") {
        await sendFiscalizacaoByEmail(itemId, data.email, data.message)
      }

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Email enviado com sucesso",
      })

      reset()
      onDismiss()
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message || "Não foi possível enviar o email",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onDismiss()
  }

  return (
    <SimpleModal visible={visible} onDismiss={handleClose}>
      <Card.Content>
        <Text variant="headlineSmall" style={styles.title}>
          Enviar por Email
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          {itemName}
        </Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email do destinatário *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.email}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email?.message}
        </HelperText>

        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Mensagem (opcional)"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Adicione uma mensagem personalizada..."
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleClose} style={styles.button} disabled={loading}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button} loading={loading}>
            Enviar
          </Button>
        </View>
      </Card.Content>
    </SimpleModal>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.colors.onSurfaceVariant,
  },
  input: {
    marginBottom: 8,
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

export default EmailModal
