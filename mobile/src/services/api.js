import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Forçar modo de desenvolvimento
const isDevelopment = true; // Mudança aqui - forçar desenvolvimento

// Base URL - ajuste conforme necessário
const getBaseURL = () => {
  if (isDevelopment) {
    // Use o IP que aparece no log: 192.168.3.1
    return 'http://192.168.3.1:3000/api/v1';
  }
  return 'https://sua-api-producao.com/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log da configuração
console.log('🔗 API Base URL configurada:', getBaseURL());
console.log('📱 Platform:', Platform.OS);
console.log('🔧 Development mode:', isDevelopment);

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    console.log(
      `🚀 Fazendo requisição: ${config.method?.toUpperCase()} ${
        config.baseURL
      }${config.url}`
    );
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Sucesso: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  (error) => {
    console.error(`❌ Erro na requisição:`);
    console.error(`   URL: ${error.config?.baseURL}${error.config?.url}`);
    console.error(`   Method: ${error.config?.method?.toUpperCase()}`);
    console.error(`   Status: ${error.response?.status || 'Network Error'}`);

    // Log more details about the error
    if (error.response) {
      console.error('   Response data:', error.response.data);
      console.error('   Response status:', error.response.status);
    } else if (error.request) {
      console.error('   Request feita mas sem resposta');
      console.error('   Request details:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        timeout: error.config?.timeout,
      });
    } else {
      console.error('   Error setting up request:', error.message);
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('authToken');
    }

    // Transform error message
    let message = 'Erro de conexão';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.message) {
      if (
        error.message.includes('Network Error') ||
        error.code === 'NETWORK_ERROR'
      ) {
        message = `Erro de rede. Verifique se o servidor está rodando em ${getBaseURL()}`;
      } else if (error.message.includes('timeout')) {
        message = 'Timeout na conexão. Tente novamente.';
      } else {
        message = error.message;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
