'use client';

import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { FAB, Searchbar, Menu, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useObra } from '../context/ObraContext';
import ObraCard from '../components/ObraCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import FilterModal from '../components/FilterModal';
import { theme } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  const { obras, loading, error, fetchObras, deleteObra, clearError } =
    useObra();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadObras();
    }, [filters])
  );

  const loadObras = async () => {
    try {
      await fetchObras({ ...filters, search: searchQuery });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro de Conexão',
        text2: 'Não foi possível carregar as obras para fiscalização',
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadObras();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length === 0 || query.length >= 3) {
      await fetchObras({ ...filters, search: query });
    }
  };

  const handleCreateObra = () => {
    navigation.navigate('CreateObra');
  };

  const handleObraPress = (obra) => {
    navigation.navigate('ObraDetails', { obraId: obra._id });
  };

  const handleEditObra = (obra) => {
    navigation.navigate('EditObra', { obra });
  };

  const handleDeleteObra = (obra) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a obra "${obra.nome}" do sistema de fiscalização? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteObra(obra._id);
              Toast.show({
                type: 'success',
                text1: 'Obra Removida',
                text2: 'Obra excluída do sistema de fiscalização',
              });
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

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilterModalVisible(false);
  };

  const renderObraCard = ({ item }) => (
    <ObraCard
      obra={item}
      onPress={() => handleObraPress(item)}
      onEdit={handleEditObra}
      onDelete={handleDeleteObra}
    />
  );

  if (loading && obras.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder='Buscar obras para fiscalização...'
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode='outlined'
              onPress={() => setMenuVisible(true)}
              icon='tune'
              style={styles.filterButton}
            >
              Filtros
            </Button>
          }
        >
          <Menu.Item
            onPress={() => setFilterModalVisible(true)}
            title='Aplicar Filtros'
            leadingIcon='tune'
          />
          <Menu.Item
            onPress={handleClearFilters}
            title='Limpar Filtros'
            leadingIcon='clear'
          />
        </Menu>
      </View>

      {obras.length === 0 ? (
        <EmptyState
          icon='construction'
          title='Nenhuma obra cadastrada'
          subtitle='Comece cadastrando a primeira obra para fiscalização'
          actionText='Cadastrar Obra'
          onAction={handleCreateObra}
        />
      ) : (
        <FlatList
          data={obras}
          renderItem={renderObraCard}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB style={styles.fab} icon='plus' onPress={handleCreateObra} />

      <FilterModal
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        currentFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    minWidth: 100,
  },
  listContainer: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HomeScreen;
