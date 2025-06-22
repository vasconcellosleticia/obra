import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ObraDetailsScreen from './src/screens/ObraDetailsScreen';
import CreateObraScreen from './src/screens/CreateObraScreen';
import EditObraScreen from './src/screens/EditObraScreen';
import CreateFiscalizacaoScreen from './src/screens/CreateFiscalizacaoScreen';
import FiscalizacaoDetailsScreen from './src/screens/FiscalizacaoDetailsScreen';
import EditFiscalizacaoScreen from './src/screens/EditFiscalizacaoScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Context
import { ObraProvider } from './src/context/ObraContext';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name='HomeList'
        component={HomeScreen}
        options={{ title: 'Fiscalização de Obras' }}
      />
      <Stack.Screen
        name='ObraDetails'
        component={ObraDetailsScreen}
        options={{ title: 'Detalhes da Obra' }}
      />
      <Stack.Screen
        name='CreateObra'
        component={CreateObraScreen}
        options={{ title: 'Cadastrar Nova Obra' }}
      />
      <Stack.Screen
        name='EditObra'
        component={EditObraScreen}
        options={{ title: 'Editar Obra' }}
      />
      <Stack.Screen
        name='CreateFiscalizacao'
        component={CreateFiscalizacaoScreen}
        options={{ title: 'Nova Fiscalização' }}
      />
      <Stack.Screen
        name='FiscalizacaoDetails'
        component={FiscalizacaoDetailsScreen}
        options={{ title: 'Detalhes da Fiscalização' }}
      />
      <Stack.Screen
        name='EditFiscalizacao'
        component={EditFiscalizacaoScreen}
        options={{ title: 'Editar Fiscalização' }}
      />
    </Stack.Navigator>
  );
}

function StatsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name='StatsList'
        component={StatsScreen}
        options={{ title: 'Relatórios e Estatísticas' }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name='SettingsList'
        component={SettingsScreen}
        options={{ title: 'Configurações do Sistema' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ObraProvider>
          <NavigationContainer>
            <StatusBar style='light' backgroundColor={theme.colors.primary} />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = 'home';
                  } else if (route.name === 'Stats') {
                    iconName = 'bar-chart';
                  } else if (route.name === 'Settings') {
                    iconName = 'settings';
                  }

                  return (
                    <MaterialIcons name={iconName} size={size} color={color} />
                  );
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
              })}
            >
              <Tab.Screen
                name='Home'
                component={HomeStack}
                options={{ title: 'Obras' }}
              />
              <Tab.Screen
                name='Stats'
                component={StatsStack}
                options={{ title: 'Relatórios' }}
              />
              <Tab.Screen
                name='Settings'
                component={SettingsStack}
                options={{ title: 'Configurações' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
          <Toast />
        </ObraProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
