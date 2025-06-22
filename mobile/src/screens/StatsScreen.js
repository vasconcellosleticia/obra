import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useObra } from '../context/ObraContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { theme } from '../theme/theme';

const StatsScreen = () => {
  const { stats, loading, fetchStats } = useObra();
  const [localLoading, setLocalLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLocalLoading(true);
      await fetchStats();
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2:
          'Não foi possível carregar as estatísticas de fiscalização de obras',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchStats();
      Toast.show({
        type: 'success',
        text1: 'Atualizado',
        text2: 'Estatísticas atualizadas com sucesso',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao atualizar estatísticas',
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Função para garantir que valores numéricos são válidos
  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? defaultValue : num;
  };

  // Função para garantir que porcentagens são válidas
  const safePercentage = (value) => {
    const num = safeNumber(value, 0);
    return Math.max(0, Math.min(100, num));
  };

  if (loading || localLoading) {
    return (
      <LoadingSpinner message='Carregando estatísticas de fiscalização...' />
    );
  }

  if (!stats) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name='bar-chart'
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text variant='headlineSmall' style={styles.emptyTitle}>
            Estatísticas Indisponíveis
          </Text>
          <Text variant='bodyMedium' style={styles.emptyMessage}>
            Não foi possível carregar as estatísticas de fiscalização de obras.
            Puxe para baixo para tentar novamente.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const { obras, fiscalizacoes } = stats;

  // Valores seguros com validação
  const obrasData = {
    total: safeNumber(obras?.total, 0),
    concluidas: safeNumber(obras?.concluidas, 0),
    atrasadas: safeNumber(obras?.atrasadas, 0),
    porcentagemConclusao: safePercentage(obras?.porcentagemConclusao),
    statusDistribution: Array.isArray(obras?.statusDistribution)
      ? obras.statusDistribution
      : [],
  };

  const fiscalizacoesData = {
    total: safeNumber(fiscalizacoes?.total, 0),
    recentes: safeNumber(fiscalizacoes?.recentes, 0),
    statusDistribution: Array.isArray(fiscalizacoes?.statusDistribution)
      ? fiscalizacoes.statusDistribution
      : [],
    monthlyDistribution: Array.isArray(fiscalizacoes?.monthlyDistribution)
      ? fiscalizacoes.monthlyDistribution
      : [],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text variant='headlineSmall' style={styles.title}>
        Estatísticas de Fiscalização de Obras
      </Text>

      {/* Obras Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleLarge' style={styles.cardTitle}>
            Obras em Fiscalização
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons
                name='construction'
                size={32}
                color={theme.colors.primary}
              />
              <Text variant='headlineMedium' style={styles.statNumber}>
                {obrasData.total}
              </Text>
              <Text variant='bodyMedium' style={styles.statLabel}>
                Total de Obras
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons
                name='check-circle'
                size={32}
                color={theme.colors.secondary}
              />
              <Text variant='headlineMedium' style={styles.statNumber}>
                {obrasData.concluidas}
              </Text>
              <Text variant='bodyMedium' style={styles.statLabel}>
                Concluídas
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons
                name='warning'
                size={32}
                color={theme.colors.error}
              />
              <Text variant='headlineMedium' style={styles.statNumber}>
                {obrasData.atrasadas}
              </Text>
              <Text variant='bodyMedium' style={styles.statLabel}>
                Atrasadas
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text variant='titleMedium' style={styles.progressTitle}>
              Taxa de Conclusão: {obrasData.porcentagemConclusao.toFixed(1)}%
            </Text>
            <ProgressBar
              progress={obrasData.porcentagemConclusao / 100}
              color={theme.colors.secondary}
              style={styles.progressBar}
            />
          </View>

          {obrasData.statusDistribution.length > 0 && (
            <View style={styles.distributionSection}>
              <Text variant='titleMedium' style={styles.sectionTitle}>
                Distribuição por Status
              </Text>
              {obrasData.statusDistribution.map((item, index) => (
                <View
                  key={`obra-status-${index}`}
                  style={styles.distributionItem}
                >
                  <Text variant='bodyMedium' style={styles.distributionLabel}>
                    {item._id || 'Não definido'}
                  </Text>
                  <Text variant='bodyMedium' style={styles.distributionValue}>
                    {safeNumber(item.count, 0)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {obrasData.statusDistribution.length === 0 && (
            <View style={styles.noDataContainer}>
              <Text variant='bodyMedium' style={styles.noDataText}>
                Nenhuma obra cadastrada ainda
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Fiscalizações Stats */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleLarge' style={styles.cardTitle}>
            Relatórios de Fiscalização
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialIcons
                name='assignment'
                size={32}
                color={theme.colors.tertiary}
              />
              <Text variant='headlineMedium' style={styles.statNumber}>
                {fiscalizacoesData.total}
              </Text>
              <Text variant='bodyMedium' style={styles.statLabel}>
                Total de Fiscalizações
              </Text>
            </View>

            <View style={styles.statItem}>
              <MaterialIcons
                name='schedule'
                size={32}
                color={theme.colors.primary}
              />
              <Text variant='headlineMedium' style={styles.statNumber}>
                {fiscalizacoesData.recentes}
              </Text>
              <Text variant='bodyMedium' style={styles.statLabel}>
                Últimos 30 dias
              </Text>
            </View>
          </View>

          {fiscalizacoesData.statusDistribution.length > 0 && (
            <View style={styles.distributionSection}>
              <Text variant='titleMedium' style={styles.sectionTitle}>
                Distribuição por Status
              </Text>
              {fiscalizacoesData.statusDistribution.map((item, index) => (
                <View
                  key={`fisc-status-${index}`}
                  style={styles.distributionItem}
                >
                  <Text variant='bodyMedium' style={styles.distributionLabel}>
                    {item._id || 'Não definido'}
                  </Text>
                  <Text variant='bodyMedium' style={styles.distributionValue}>
                    {safeNumber(item.count, 0)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {fiscalizacoesData.monthlyDistribution.length > 0 && (
            <View style={styles.distributionSection}>
              <Text variant='titleMedium' style={styles.sectionTitle}>
                Fiscalizações por Mês
              </Text>
              {fiscalizacoesData.monthlyDistribution
                .slice(0, 6)
                .map((item, index) => (
                  <View key={`month-${index}`} style={styles.distributionItem}>
                    <Text variant='bodyMedium' style={styles.distributionLabel}>
                      {safeNumber(item._id?.month, 1)}/
                      {safeNumber(item._id?.year, new Date().getFullYear())}
                    </Text>
                    <Text variant='bodyMedium' style={styles.distributionValue}>
                      {safeNumber(item.count, 0)}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {fiscalizacoesData.total === 0 && (
            <View style={styles.noDataContainer}>
              <Text variant='bodyMedium' style={styles.noDataText}>
                Nenhuma fiscalização realizada ainda
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Summary Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleLarge' style={styles.cardTitle}>
            Resumo da Fiscalização
          </Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text variant='bodyMedium' style={styles.summaryLabel}>
                Média de Fiscalizações por Obra
              </Text>
              <Text variant='headlineSmall' style={styles.summaryValue}>
                {obrasData.total > 0
                  ? (fiscalizacoesData.total / obrasData.total).toFixed(1)
                  : '0.0'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text variant='bodyMedium' style={styles.summaryLabel}>
                Obras em Andamento
              </Text>
              <Text variant='headlineSmall' style={styles.summaryValue}>
                {safeNumber(
                  obrasData.statusDistribution?.find(
                    (s) => s._id === 'Em Andamento'
                  )?.count,
                  0
                )}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: theme.colors.onSurface,
  },
  emptyMessage: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  noDataContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noDataText: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    color: theme.colors.onSurface,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginTop: 8,
  },
  statLabel: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressTitle: {
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  distributionSection: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: theme.colors.onSurface,
    fontWeight: 'bold',
  },
  distributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  distributionLabel: {
    color: theme.colors.onSurface,
  },
  distributionValue: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default StatsScreen;
