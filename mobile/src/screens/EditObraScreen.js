"use client"

import { useState } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { TextInput, Button, Text, Card, HelperText } from "react-native-paper"
import { useForm, Controller } from "react-hook-form"
import Toast from "react-native-toast-message"

import { useObra } from "../context/ObraContext"
import ImagePickerComponent from "../components/ImagePickerComponent"
import LocationPicker from "../components/LocationPicker"
import DatePickerComponent from "../components/DatePickerComponent"
import LoadingSpinner from "../components/LoadingSpinner"
import { theme } from "../theme/theme"

const EditObraScreen = ({ route, navigation }) => {
  const { obra } = route.params
  const { updateObra, loading } = useObra()
  const [selectedImage, setSelectedImage] = useState(obra.foto)
  const [selectedLocation, setSelectedLocation] = useState(obra.localizacao)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      nome: obra.nome,
      responsavel: obra.responsavel,
      dataInicio: new Date(obra.dataInicio),
      dataFim: new Date(obra.dataFim),
      descricao: obra.descricao,
      orcamento: obra.orcamento?.toString() || "",
      progresso: obra.progresso?.toString() || "0",
      status: obra.status,
    },
  })

  const dataInicio = watch("dataInicio")

  const onSubmit = async (data) => {
    if (!selectedImage) {
      Alert.alert("Erro", "Por favor, selecione uma foto da obra")
      return
    }

    if (!selectedLocation) {
      Alert.alert("Erro", "Por favor, selecione a localização da obra")
      return
    }

    try {
      const obraData = {
        ...data,
        foto: selectedImage,
        localizacao: selectedLocation,
        orcamento: data.orcamento ? Number.parseFloat(data.orcamento) : undefined,
        progresso: Number.parseFloat(data.progresso),
      }

      await updateObra(obra._id, obraData)

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Obra atualizada com sucesso",
      })

      navigation.goBack()
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.message || "Não foi possível atualizar a obra",
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
            Editar Obra
          </Text>

          <Controller
            control={control}
            name="nome"
            rules={{
              required: "Nome é obrigatório",
              minLength: { value: 3, message: "Nome deve ter pelo menos 3 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome da Obra *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.nome}
                style={styles.input}
                mode="outlined"
              />
            )}
          />
          <HelperText type="error" visible={!!errors.nome}>
            {errors.nome?.message}
          </HelperText>

          <Controller
            control={control}
            name="responsavel"
            rules={{
              required: "Responsável é obrigatório",
              minLength: { value: 3, message: "Nome deve ter pelo menos 3 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Responsável *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.responsavel}
                style={styles.input}
                mode="outlined"
              />
            )}
          />
          <HelperText type="error" visible={!!errors.responsavel}>
            {errors.responsavel?.message}
          </HelperText>

          <View style={styles.dateRow}>
            <View style={styles.dateColumn}>
              <Controller
                control={control}
                name="dataInicio"
                rules={{ required: "Data de início é obrigatória" }}
                render={({ field: { onChange, value } }) => (
                  <DatePickerComponent
                    label="Data de Início *"
                    value={value}
                    onChange={onChange}
                    error={!!errors.dataInicio}
                  />
                )}
              />
              <HelperText type="error" visible={!!errors.dataInicio}>
                {errors.dataInicio?.message}
              </HelperText>
            </View>

            <View style={styles.dateColumn}>
              <Controller
                control={control}
                name="dataFim"
                rules={{
                  required: "Data de fim é obrigatória",
                  validate: (value) => value > dataInicio || "Data de fim deve ser posterior à data de início",
                }}
                render={({ field: { onChange, value } }) => (
                  <DatePickerComponent
                    label="Data de Fim *"
                    value={value}
                    onChange={onChange}
                    error={!!errors.dataFim}
                    minimumDate={dataInicio}
                  />
                )}
              />
              <HelperText type="error" visible={!!errors.dataFim}>
                {errors.dataFim?.message}
              </HelperText>
            </View>
          </View>

          <Controller
            control={control}
            name="descricao"
            rules={{
              required: "Descrição é obrigatória",
              minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Descrição *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.descricao}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={4}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.descricao}>
            {errors.descricao?.message}
          </HelperText>

          <View style={styles.row}>
            <View style={styles.column}>
              <Controller
                control={control}
                name="orcamento"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Orçamento (R$)"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.column}>
              <Controller
                control={control}
                name="progresso"
                rules={{
                  min: { value: 0, message: "Progresso deve ser entre 0 e 100" },
                  max: { value: 100, message: "Progresso deve ser entre 0 e 100" },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Progresso (%)"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.progresso}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                )}
              />
              <HelperText type="error" visible={!!errors.progresso}>
                {errors.progresso?.message}
              </HelperText>
            </View>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Foto da Obra *
          </Text>
          <ImagePickerComponent selectedImage={selectedImage} onImageSelected={setSelectedImage} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Localização *
          </Text>
          <LocationPicker selectedLocation={selectedLocation} onLocationSelected={setSelectedLocation} />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
          Cancelar
        </Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
          Salvar Alterações
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
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.onSurface,
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

export default EditObraScreen
