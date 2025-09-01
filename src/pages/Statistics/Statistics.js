import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Fade
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp as TrendingIcon,
  Public as GlobalIcon,
  SportsEsports as GameIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useStatistics } from '../../hooks';
import { format } from '../../utils';
import LoadingButton from '../../components/LoadingButton';

const Statistics = () => {
  const {
    statistics,
    loading,
    error,
    filters,
    summary,
    filterOptions,
    loadAllStatistics,
    updateFilters,
    resetFilters
  } = useStatistics();

  const [selectedDate, setSelectedDate] = useState('');

  // Colores para los gráficos
  const chartColors = ['#1976d2', '#f50057', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4'];

  // Preparar datos para gráficos
  const prepareChartData = (data, key) => {
    return Object.entries(data).map(([name, value], index) => ({
      name,
      value,
      color: chartColors[index % chartColors.length]
    }));
  };

  const gamesByTypeData = prepareChartData(summary.gamesByType, 'gameType');
  const gamesByCountryData = prepareChartData(summary.gamesByCountry, 'country');
  const gamesByDateData = Object.entries(summary.gamesByDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, count]) => ({ date, games: count }));

  if (loading && statistics.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Cargando estadísticas...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            📈 Estadísticas del Juego
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Análisis y métricas de todas las partidas jugadas
          </Typography>

          {/* Controles */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <LoadingButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadAllStatistics}
              loading={loading}
              sx={{ borderRadius: 2 }}
            >
              Actualizar Datos
            </LoadingButton>
            
            <Button
              variant="text"
              startIcon={<FilterIcon />}
              onClick={resetFilters}
              disabled={Object.values(filters).every(f => f === 'all')}
              sx={{ borderRadius: 2 }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Fade in timeout={800}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon color="primary" />
            Filtros
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Periodo</InputLabel>
                <Select
                  value={filters.dateRange}
                  label="Periodo"
                  onChange={(e) => updateFilters({ dateRange: e.target.value })}
                >
                  <MenuItem value="all">Todos los tiempos</MenuItem>
                  <MenuItem value="today">Hoy</MenuItem>
                  <MenuItem value="week">Última semana</MenuItem>
                  <MenuItem value="month">Último mes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Juego</InputLabel>
                <Select
                  value={filters.gameType}
                  label="Tipo de Juego"
                  onChange={(e) => updateFilters({ gameType: e.target.value })}
                >
                  <MenuItem value="all">Todos los tipos</MenuItem>
                  {filterOptions.gameTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>País</InputLabel>
                <Select
                  value={filters.country}
                  label="País"
                  onChange={(e) => updateFilters({ country: e.target.value })}
                >
                  <MenuItem value="all">Todos los países</MenuItem>
                  {filterOptions.countries.map(country => (
                    <MenuItem key={country.value} value={country.value}>
                      {country.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Resumen de estadísticas */}
      <Fade in timeout={1000}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="statistics-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <GameIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {summary.totalGames}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Partidas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="statistics-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  {Math.round(summary.averageGamesPerDay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Promedio por Día
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="statistics-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <GlobalIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" color="warning.main" fontWeight={700}>
                  {Object.keys(summary.gamesByCountry).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Países
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="statistics-card" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  {Object.entries(summary.gamesByType).map(([type, count], index) => (
                    <Chip
                      key={type}
                      label={`${type}: ${count}`}
                      size="small"
                      color={index === 0 ? 'primary' : 'secondary'}
                      sx={{ mx: 0.5 }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Distribución por Tipo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Fade>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de barras - Juegos por tipo */}
        {gamesByTypeData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Partidas por Tipo de Juego
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gamesByTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Fade>
          </Grid>
        )}

        {/* Gráfico circular - Juegos por país */}
        {gamesByCountryData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Fade in timeout={1400}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Distribución por País
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gamesByCountryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {gamesByCountryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Fade>
          </Grid>
        )}

        {/* Gráfico de líneas - Juegos por fecha */}
        {gamesByDateData.length > 0 && (
          <Grid item xs={12}>
            <Fade in timeout={1600}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Partidas por Fecha
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={gamesByDateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="games" 
                      stroke="#1976d2" 
                      strokeWidth={3}
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Fade>
          </Grid>
        )}
      </Grid>

      {/* Mensaje cuando no hay datos */}
      {statistics.length === 0 && !loading && (
        <Fade in>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: 'grey.50'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              📊 No hay estadísticas disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Las estadísticas aparecerán aquí una vez que se jueguen partidas.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, borderRadius: 2 }}
              onClick={() => window.location.href = '/'}
            >
              Jugar una Partida
            </Button>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Statistics;