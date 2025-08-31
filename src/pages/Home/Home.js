import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Fade,
  Chip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  Group as GroupIcon,
  SportsTennis as GameIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { validation } from '../../utils';
import { GAME_TYPES } from '../../constants';
import LoadingButton from '../components/LoadingButton';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    gameType: GAME_TYPES.SINGLE_PLAYER
  });
  const [errors, setErrors] = useState({});
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  // Manejar cambios en el formulario
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'nickname' ? validation.sanitizeNickname(value) : value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Validar formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!validation.isValidNickname(formData.nickname)) {
      newErrors.nickname = 'El nombre debe tener entre 2 y 20 caracteres';
    }
    
    return newErrors;
  }, [formData.nickname]);

  // Crear nuevo juego
  const handleCreateGame = useCallback(async () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsCreatingGame(true);
    
    try {
      // Generar ID único para el juego
      const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Navegar a la página del juego
      navigate(`/game/${gameId}/${formData.nickname}/${formData.gameType}`);
    } catch (error) {
      console.error('Error creating game:', error);
      setErrors({ general: 'Error al crear el juego. Inténtalo de nuevo.' });
    } finally {
      setIsCreatingGame(false);
    }
  }, [formData, validateForm, navigate]);

  const gameOptions = [
    {
      value: GAME_TYPES.SINGLE_PLAYER,
      label: 'Un Jugador',
      description: 'Juega contra la computadora',
      icon: <ComputerIcon />,
      color: 'primary'
    },
    {
      value: GAME_TYPES.MULTIPLAYER,
      label: 'Multijugador',
      description: 'Juega con un amigo online',
      icon: <GroupIcon />,
      color: 'secondary'
    }
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* Hero Section */}
      <Fade in timeout={600}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 2
            }}
          >
            🎯 Cuatro en Línea
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          >
            El clásico juego de estrategia ahora online. 
            Conecta cuatro fichas antes que tu oponente.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<GameIcon />} label="Juego clásico" variant="outlined" />
            <Chip icon={<PersonIcon />} label="1-2 Jugadores" variant="outlined" />
            <Chip label="Gratis" color="success" variant="outlined" />
          </Box>
        </Box>
      </Fade>

      <Grid container spacing={4} justifyContent="center">
        {/* Formulario de juego */}
        <Grid item xs={12} md={6} lg={5}>
          <Fade in timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                🎨 Configurar Partida
              </Typography>

              {errors.general && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errors.general}
                </Alert>
              )}

              {/* Campo de nombre */}
              <TextField
                fullWidth
                label="Tu nombre"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                error={!!errors.nickname}
                helperText={errors.nickname || 'Entre 2 y 20 caracteres'}
                placeholder="Ingresa tu nombre..."
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Tipo de juego */}
              <FormControl fullWidth>
                <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                  Modo de Juego
                </FormLabel>
                
                <RadioGroup
                  value={formData.gameType}
                  onChange={(e) => handleInputChange('gameType', e.target.value)}
                >
                  {gameOptions.map((option) => (
                    <Paper
                      key={option.value}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 1,
                        border: formData.gameType === option.value ? 2 : 1,
                        borderColor: formData.gameType === option.value 
                          ? `${option.color}.main` 
                          : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: `${option.color}.main`,
                          transform: 'translateY(-1px)',
                          boxShadow: 1
                        }
                      }}
                      onClick={() => handleInputChange('gameType', option.value)}
                    >
                      <FormControlLabel
                        value={option.value}
                        control={<Radio color={option.color} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Box sx={{ color: `${option.color}.main` }}>
                              {option.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {option.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ margin: 0, width: '100%' }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>

              <LoadingButton
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCreateGame}
                loading={isCreatingGame}
                startIcon={<PlayIcon />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)'
                  }
                }}
              >
                {isCreatingGame ? 'Creando partida...' : 'Comenzar Juego'}
              </LoadingButton>
            </Paper>
          </Fade>
        </Grid>

        {/* Información del juego */}
        <Grid item xs={12} md={6} lg={5}>
          <Fade in timeout={1000}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                height: 'fit-content'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                🏆 Cómo Jugar
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Objetivo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Ser el primero en conectar cuatro fichas de tu color en línea: 
                  horizontal, vertical o diagonal.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  Reglas
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Los jugadores alternan turnos
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Las fichas caen por gravedad
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Gana quien haga 4 en línea primero
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    Si se llena el tablero, es empate
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  ¡Disfruta de este clásico juego de estrategia!
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;