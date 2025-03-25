// API configuration settings

export const API_CONFIG = {
  BASE_URL: 'https://tailorbe.cyberdetox.in',
  ENDPOINTS: {
    MEASUREMENTS: '/api/measurements'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};