import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

const baseURL = process.env.REACT_APP_4_IN_ROW_BASE_URL;

// Configurar instancia de axios
const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class ApiService {
  // Obtener todas las estadísticas
  async getAllStatistics() {
    try {
      const { data } = await apiClient.get(API_ENDPOINTS.STATISTICS);
      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return [];
    }
  }

  // Obtener estadísticas por fecha
  async getStatisticsByDate(day, month, year) {
    try {
      const { data } = await apiClient.get(
        `${API_ENDPOINTS.STATISTICS_BY_DATE}/${day}/${month}/${year}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching statistics by date:', error);
      return null;
    }
  }

  // Guardar datos del juego
  async saveGameData(gameId, gameType, gameState, userCountry = null) {
    try {
      const country = userCountry || this.getUserCountry();
      const { data } = await apiClient.post(
        `${API_ENDPOINTS.SAVE_GAME_DATA}/${gameId}/${gameType}/${gameState}/${country}`
      );
      return data;
    } catch (error) {
      console.error('Error saving game data:', error);
      return null;
    }
  }

  // Obtener país del usuario basado en timezone
  getUserCountry() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = timezone.replace(' ', '_').split('/')[1];
      return country || 'UNKNOWN';
    } catch (error) {
      console.error('Error getting user country:', error);
      return 'UNKNOWN';
    }
  }

  // Verificar estado del servidor
  async checkServerHealth() {
    try {
      const { status } = await apiClient.get('/health');
      return status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new ApiService();