"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { TextInput, Button, Text, Card, HelperText, SegmentedButtons } from "react-native-paper"
import { useForm, Controller } from "react-hook-form"
import Toast from "react-native-toast-message"

import { useObra } from "../context/ObraContext"
import ImagePickerComponent from "../components/ImagePickerComponent"
import LocationPicker from "../components/LocationPicker"
import DatePickerComponent from "../components/DatePickerComponent"
import LoadingSpinner from "../components/LoadingSpinner"
import { getCurrentLocation } from "../utils/permissions"
import { theme } from "../theme/theme"

const CreateFiscalizacaoScreen = ({ route, navigation }) => {
  const { obraId } = route.params
  const { createFiscalizacao, loading } = useObra()
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      data: new Date(),
      status: "Em dia",
      observacoes: "",
      fiscal: {
        nome: "",
        registro: "",
      },
      temperatura: "",
      condicaoClimatica: "Ensolarado",
      nivelRisco: "Baixo",
    },
  })

  const statusOptions = [
    { value: "Em dia", label: "Em dia" },
    { value: "Atrasada", label: "Atrasada" },
    { value: "Parada", label: "Parada" },
    { value: "Concluída", label: "Concluída" },
  ]

  const condicaoOptions = [
    { value: "Ensolarado", label: "Ensolarado" },
    { value: "Nublado", label: "Nublado" },
    { value: "Chuvoso", label: "Chuvoso" },
    { value: "Tempestade", label: "Tempestade" },
    { value: "Neblina", label: "Neblina" },
  ]

  const riscoOptions = [
    { value: "Baixo", label: "Baixo" },
    { value: "Médio", label: "Médio" },
    { value: "Alto", label: "Alto" },
    { value: "Crítico", label: "Crítico" },
  ]

  const handleGetCurrentLocation = async () => {
    const location = await getCurrentLocation()
    if (location) {
      setSelectedLocation(location)
    }
  }

  const onSubmit = async (data) => {
    if (!selectedImage) {
      Alert.alert("Erro", "Por favor, selecione uma foto da fiscalização")
      return
    }

    if (!selectedLocation) {
      Alert.alert("Erro", "Por favor, selecione a localização da fiscalização")
      return
    }

    try {
      const fiscalizacaoData = {
        ...data,
        foto: selectedImage,
        localizacao: selectedLocation,
        obra: obraId,
        temperatura: data.temperatura ? Number.parseFloat(data.temperatura) : undefined,
      }

      await createFiscalizacao(fiscalizacaoData)

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Fiscalização criada com sucesso",
      })

      navigation.goBack()
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message || "Não foi possível criar a fiscalização",
      })
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Nova Fiscalização
          </Text>

          <Controller
            control={control}
            name="data"
            rules={{ required: "Data é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <DatePickerComponent
                label="Data da Fiscalização *"
                value={value}
                onChange={onChange}
                error={!!errors.data}
                maximumDate={new Date()}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.data}>
            {errors.data?.message}
          </HelperText>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Status da Obra *
          </Text>
          <Controller
            control={control}
            name="status"
            rules={{ required: "Status é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={statusOptions}
                style={styles.segmentedButtons}
              />
            )}
          />

          <Controller
            control={control}
            name="observacoes"
            rules={{
              required: "Observações são obrigatórias",
              minLength: { value: 10, message: "Observações devem ter pelo menos 10 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Observações *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.observacoes}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.observacoes}>
            {errors.observacoes?.message}
          </HelperText>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Dados do Fiscal
          </Text>

          <Controller
            control={control}
            name="fiscal.nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome do Fiscal"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={styles.input}
                mode="outlined"
              />
            )}
          />

          <Controller
            control={control}
            name="fiscal.registro"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Registro Profissional"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={styles.input}
                mode="outlined"
                placeholder="Ex: CREA-SP 123456"
              />
            )}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Condições Ambientais
          </Text>

          <Controller
            control={control}
            name="temperatura"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Temperatura (°C)"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
              />
            )}
          />

          <Text variant="bodyMedium" style={styles.fieldLabel}>
            Condição Climática
          </Text>
          <Controller
            control={control}
            name="condicaoClimatica"
            render={({ field: { onChange, value } }) => (
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={condicaoOptions.slice(0, 3)}
                style={styles.segmentedButtons}
              />
            )}
          />

          <Text variant="bodyMedium" style={styles.fieldLabel}>
            Nível de Risco
          </Text>
          <Controller
            control={control}
            name="nivelRisco"
            render={({ field: { onChange, value } }) => (
              <SegmentedButtons
                value={value}
                onValueChange={onChange}
                buttons={riscoOptions}
                style={styles.segmentedButtons}
              />
            )}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Foto da Fiscalização *
          </Text>
          <ImagePickerComponent selectedImage={selectedImage} onImageSelected={setSelectedImage} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Localização *
          </Text>
          <LocationPicker
            selectedLocation={selectedLocation}
            onLocationSelected={setSelectedLocation}
            showCurrentLocationButton={true}
            onGetCurrentLocation={handleGetCurrentLocation}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
          Cancelar
        </Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
          Criar Fiscalização
        </Button>
      </View>
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
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.onSurface,
    fontWeight: "bold",
  },
  fieldLabel: {
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
  },
  segmentedButtons: {
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

export default CreateFiscalizacaoScreen
