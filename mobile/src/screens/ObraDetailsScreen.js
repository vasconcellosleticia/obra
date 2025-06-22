'use client';

import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Text, Card, Button, Chip, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useObra } from '../context/ObraContext';
import LoadingSpinner from '../components/LoadingSpinner';
import FiscalizacaoCard from '../components/FiscalizacaoCard';
import EmailModal from '../components/EmailModal';
import SimpleModal from '../components/SimpleModal';
import {
  formatDate,
  formatCurrency,
  formatPercentage,
  getStatusColor,
  getStatusIcon,
} from '../utils/formatters';
import { theme } from '../theme/theme';

const ObraDetailsScreen = ({ route, navigation }) => {
  const { obraId } = route.params;
  const {
    selectedObra,
    fiscalizacoes,
    loading,
    fetchObraById,
    fetchFiscalizacoesByObra,
    deleteObra,
    clearSelected,
  } = useObra();
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    loadObraDetails();

    // Cleanup function
    return () => {
      clearSelected();
    };
  }, [obraId]);

  const loadObraDetails = async () => {
    try {
      setLocalLoading(true);
      await fetchObraById(obraId);
      await fetchFiscalizacoesByObra(obraId);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os detalhes da obra',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditObra', { obra: selectedObra });
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a obra "${selectedObra.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteObra(selectedObra._id);
              Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Obra excluída com sucesso',
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível excluir a obra',
              });
            }
          },
        },
      ]
    );
  };

  const handleCreateFiscalizacao = () => {
    navigation.navigate('CreateFiscalizacao', { obraId: selectedObra._id });
  };

  const handleFiscalizacaoPress = (fiscalizacao) => {
    navigation.navigate('FiscalizacaoDetails', {
      fiscalizacaoId: fiscalizacao._id,
    });
  };

  const handleSendEmail = () => {
    setEmailModalVisible(true);
  };

  if (loading || localLoading || !selectedObra) {
    return <LoadingSpinner />;
  }

  const statusColor = getStatusColor(selectedObra.status);
  const statusIcon = getStatusIcon(selectedObra.status);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Image
                source={{ uri: selectedObra.foto }}
                style={styles.headerImage}
              />
              <View style={styles.headerInfo}>
                <Text variant='headlineSmall' style={styles.title}>
                  {selectedObra.nome}
                </Text>
                <Text variant='bodyMedium' style={styles.responsavel}>
                  {selectedObra.responsavel}
                </Text>
                <Chip
                  icon={() => (
                    <MaterialIcons name={statusIcon} size={16} color='white' />
                  )}
                  style={[styles.statusChip, { backgroundColor: statusColor }]}
                  textStyle={styles.statusText}
                >
                  {selectedObra.status}
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant='titleMedium' style={styles.sectionTitle}>
              Informações Gerais
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <MaterialIcons
                  name='calendar-today'
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={styles.infoText}>
                  <Text variant='bodySmall' style={styles.infoLabel}>
                    Data de Início
                  </Text>
                  <Text variant='bodyMedium'>
                    {formatDate(selectedObra.dataInicio)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialIcons
                  name='event'
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={styles.infoText}>
                  <Text variant='bodySmall' style={styles.infoLabel}>
                    Previsão de Término
                  </Text>
                  <Text variant='bodyMedium'>
                    {formatDate(selectedObra.dataFim)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <MaterialIcons
                  name='location-on'
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={styles.infoText}>
                  <Text variant='bodySmall' style={styles.infoLabel}>
                    Localização
                  </Text>
                  <Text variant='bodyMedium'>
                    {selectedObra.localizacao.latitude.toFixed(6)},{' '}
                    {selectedObra.localizacao.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>

              {selectedObra.orcamento && (
                <View style={styles.infoItem}>
                  <MaterialIcons
                    name='attach-money'
                    size={20}
                    color={theme.colors.primary}
                  />
                  <View style={styles.infoText}>
                    <Text variant='bodySmall' style={styles.infoLabel}>
                      Orçamento
                    </Text>
                    <Text variant='bodyMedium'>
                      {formatCurrency(selectedObra.orcamento)}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.infoItem}>
                <MaterialIcons
                  name='trending-up'
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={styles.infoText}>
                  <Text variant='bodySmall' style={styles.infoLabel}>
                    Progresso
                  </Text>
                  <Text variant='bodyMedium'>
                    {formatPercentage(selectedObra.progresso)}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              variant='titleMedium'
              style={[styles.sectionTitle, { marginTop: 16 }]}
            >
              Descrição
            </Text>
            <Text variant='bodyMedium' style={styles.description}>
              {selectedObra.descricao}
            </Text>
          </Card.Content>
        </Card>

        {/* Fiscalizações Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.fiscalizacaoHeader}>
              <Text variant='titleMedium' style={styles.sectionTitle}>
                Fiscalizações ({fiscalizacoes.length})
              </Text>
              <Button
                mode='outlined'
                onPress={handleCreateFiscalizacao}
                icon='add'
              >
                Nova
              </Button>
            </View>

            {fiscalizacoes.length === 0 ? (
              <View style={styles.emptyFiscalizacoes}>
                <MaterialIcons
                  name='assignment'
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text variant='bodyMedium' style={styles.emptyText}>
                  Nenhuma fiscalização registrada
                </Text>
              </View>
            ) : (
              fiscalizacoes.map((fiscalizacao) => (
                <FiscalizacaoCard
                  key={fiscalizacao._id}
                  fiscalizacao={fiscalizacao}
                  onPress={() => handleFiscalizacaoPress(fiscalizacao)}
                />
              ))
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode='outlined'
            onPress={handleEdit}
            icon='edit'
            style={styles.actionButton}
          >
            Editar
          </Button>
          <Button
            mode='outlined'
            onPress={handleSendEmail}
            icon='email'
            style={styles.actionButton}
          >
            Enviar por Email
          </Button>
          <Button
            mode='outlined'
            onPress={handleDelete}
            icon='delete'
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Excluir
          </Button>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon='add'
        onPress={handleCreateFiscalizacao}
        label='Nova Fiscalização'
      />

      <SimpleModal
        visible={emailModalVisible}
        onDismiss={() => setEmailModalVisible(false)}
      >
        <EmailModal
          visible={emailModalVisible}
          onDismiss={() => setEmailModalVisible(false)}
          itemType='obra'
          itemId={selectedObra._id}
          itemName={selectedObra.nome}
        />
      </SimpleModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  responsavel: {
    color: theme.colors.onSurfaceVariant,
    marginVertical: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
  },
  card: {
    margin: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  description: {
    lineHeight: 20,
    color: theme.colors.onSurface,
  },
  fiscalizacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyFiscalizacoes: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    color: theme.colors.onSurfaceVariant,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    marginVertical: 4,
    minWidth: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.secondary,
  },
});

export default ObraDetailsScreen;
