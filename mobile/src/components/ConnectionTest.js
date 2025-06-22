'use client';

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Card, Divider } from 'react-native-paper';
import api from '../services/api';
import { getAPIBaseURL, testNetworkConnectivity } from '../utils/networkUtils';
import { theme } from '../theme/theme';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Não testado');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState('');

  const testBasicConnectivity = async () => {
    setLoading(true);
    setStatus('Testando conectividade básica...');

    try {
      const result = await testNetworkConnectivity();
      if (result.success) {
        setStatus('✅ Servidor respondendo!');
        setDetails(`Uptime: ${Math.floor(result.data.uptime)}s`);
      } else {
        setStatus(`❌ Servidor não responde: ${result.error}`);
        setDetails('');
      }
    } catch (error) {
      setStatus(`❌ Erro de conectividade: ${error.message}`);
      setDetails('');
    } finally {
      setLoading(false);
    }
  };

  const testAPIConnection = async () => {
    setLoading(true);
    setStatus('Testando API de obras...');

    try {
      const response = await api.get('/obras');
      setStatus(
        `✅ API funcionando! ${response.data.count || 0} obras encontradas`
      );
      setDetails(`Total de obras: ${response.data.obras?.length || 0}`);
    } catch (error) {
      setStatus(`❌ Erro na API: ${error.message}`);
      setDetails('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant='titleMedium' style={styles.title}>
          Diagnóstico de Conexão
        </Text>

        <Text variant='bodySmall' style={styles.url}>
          URL Base: {getAPIBaseURL()}
        </Text>

        <Divider style={styles.divider} />

        <Text variant='bodyMedium' style={styles.status}>
          Status: {status}
        </Text>

        {details && (
          <Text variant='bodySmall' style={styles.details}>
            {details}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode='outlined'
            onPress={testBasicConnectivity}
            loading={loading}
            style={styles.button}
          >
            Testar Servidor
          </Button>

          <Button
            mode='contained'
            onPress={testAPIConnection}
            loading={loading}
            style={styles.button}
          >
            Testar API
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 8,
    color: theme.colors.primary,
  },
  url: {
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  divider: {
    marginVertical: 8,
  },
  status: {
    marginBottom: 8,
    color: theme.colors.onSurface,
  },
  details: {
    marginBottom: 16,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});

export default ConnectionTest;
