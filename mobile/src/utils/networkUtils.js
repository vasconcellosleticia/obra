// Forçar modo de desenvolvimento
const isDevelopment = true;

export const getAPIBaseURL = () => {
  if (isDevelopment) {
    // Use o IP que aparece no seu log
    return 'http://192.168.15.3:3000';
  }
  return 'https://sua-api-producao.com';
};

export const testNetworkConnectivity = async () => {
  try {
    const response = await fetch(`${getAPIBaseURL()}/health`, {
      method: 'GET',
      timeout: 5000,
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
