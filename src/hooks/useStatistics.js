import { useState, useCallback, useEffect } from 'react';
import apiService from '../services/api';
import { format } from '../utils';

const useStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    gameType: 'all',
    country: 'all'
  });

  // Cargar todas las estadísticas
  const loadAllStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getAllStatistics();
      setStatistics(data);
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas por fecha
  const loadStatisticsByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const data = await apiService.getStatisticsByDate(day, month, year);
      setStatistics(data ? [data] : []);
    } catch (err) {
      setError('Error al cargar las estadísticas por fecha');
      console.error('Error loading statistics by date:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar estadísticas
  const filteredStatistics = useCallback(() => {
    return statistics.filter(stat => {
      // Filtro por tipo de juego
      if (filters.gameType !== 'all' && stat.gameType !== filters.gameType) {
        return false;
      }

      // Filtro por país
      if (filters.country !== 'all' && stat.country !== filters.country) {
        return false;
      }

      // Filtro por rango de fechas
      if (filters.dateRange !== 'all') {
        const statDate = new Date(stat.date);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            return statDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return statDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return statDate >= monthAgo;
          default:
            return true;
        }
      }

      return true;
    });
  }, [statistics, filters]);

  // Obtener resumen de estadísticas
  const getStatisticsSummary = useCallback(() => {
    const filtered = filteredStatistics();
    
    const totalGames = filtered.length;
    const gamesByType = filtered.reduce((acc, stat) => {
      acc[stat.gameType] = (acc[stat.gameType] || 0) + 1;
      return acc;
    }, {});
    
    const gamesByCountry = filtered.reduce((acc, stat) => {
      acc[stat.country] = (acc[stat.country] || 0) + 1;
      return acc;
    }, {});
    
    const gamesByDate = filtered.reduce((acc, stat) => {
      const date = format.date(new Date(stat.date));
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalGames,
      gamesByType,
      gamesByCountry,
      gamesByDate,
      averageGamesPerDay: totalGames / Math.max(Object.keys(gamesByDate).length, 1)
    };
  }, [filteredStatistics]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: 'all',
      gameType: 'all',
      country: 'all'
    });
  }, []);

  // Obtener opciones únicas para los filtros
  const getFilterOptions = useCallback(() => {
    const gameTypes = [...new Set(statistics.map(stat => stat.gameType))];
    const countries = [...new Set(statistics.map(stat => stat.country))];
    
    return {
      gameTypes: gameTypes.map(type => ({ value: type, label: type })),
      countries: countries.map(country => ({ value: country, label: country }))
    };
  }, [statistics]);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadAllStatistics();
  }, [loadAllStatistics]);

  return {
    statistics: filteredStatistics(),
    allStatistics: statistics,
    loading,
    error,
    filters,
    summary: getStatisticsSummary(),
    filterOptions: getFilterOptions(),
    loadAllStatistics,
    loadStatisticsByDate,
    updateFilters,
    resetFilters
  };
};

export default useStatistics;