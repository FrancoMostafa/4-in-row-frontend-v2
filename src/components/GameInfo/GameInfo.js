import React, { memo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Computer as ComputerIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { GAME_STATES, MESSAGES } from '../../constants';
import { format } from '../../utils';

const GameInfo = memo(({ 
  gameState,
  playerName,
  gameType,
  gameStartTime,
  moveCount = 0
}) => {
  const {
    currentPlayer,
    gameStatus,
    winner,
    isMyTurn,
    opponentName
  } = gameState;

  const getStatusMessage = () => {
    switch (gameStatus) {
      case GAME_STATES.WAITING:
        return MESSAGES.WAITING_OPPONENT;
      case GAME_STATES.PLAYING:
        return isMyTurn ? MESSAGES.YOUR_TURN : MESSAGES.OPPONENT_TURN;
      case GAME_STATES.FINISHED:
        if (winner === null) return MESSAGES.GAME_DRAW;
        return winner === 1 ? MESSAGES.GAME_WON : MESSAGES.GAME_LOST;
      case GAME_STATES.ABANDONED:
        return 'Juego abandonado';
      default:
        return 'Estado desconocido';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case GAME_STATES.WAITING:
        return 'warning';
      case GAME_STATES.PLAYING:
        return isMyTurn ? 'success' : 'info';
      case GAME_STATES.FINISHED:
        if (winner === null) return 'default';
        return winner === 1 ? 'success' : 'error';
      case GAME_STATES.ABANDONED:
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateGameDuration = () => {
    if (!gameStartTime) return null;
    const duration = Math.floor((Date.now() - gameStartTime.getTime()) / 1000);
    return format.duration(duration);
  };

  return (
    <Paper 
      elevation={2}
      className="game-info-slide-in"
      sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
      }}
    >
      {/* Estado del juego */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Chip
          label={getStatusMessage()}
          color={getStatusColor()}
          variant="filled"
          sx={{ 
            fontWeight: 600,
            fontSize: '0.9rem',
            px: 2,
            py: 1
          }}
        />
      </Box>

      {/* Indicador de turno */}
      {gameStatus === GAME_STATES.PLAYING && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="indeterminate" 
            color={isMyTurn ? 'success' : 'info'}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Información de jugadores */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="error" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Jugador 1
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {playerName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {gameType === 'singlePlayer' ? <ComputerIcon color="warning" /> : <PersonIcon color="primary" />}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Jugador 2
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              {gameType === 'singlePlayer' ? 'Computadora' : (opponentName || 'Esperando...')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Estadísticas del juego */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <Box>
          <Typography variant="h6" color="primary.main" fontWeight={600}>
            {moveCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Movimientos
          </Typography>
        </Box>

        {gameStartTime && (
          <Box>
            <Typography variant="h6" color="primary.main" fontWeight={600}>
              {calculateGameDuration()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Duración
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="h6" color="primary.main" fontWeight={600}>
            {currentPlayer === 1 ? '🔴' : '🟡'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Turno
          </Typography>
        </Box>
      </Box>

      {/* Mensaje de victoria */}
      {gameStatus === GAME_STATES.FINISHED && winner !== null && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <TrophyIcon 
            sx={{ 
              fontSize: 40, 
              color: winner === 1 ? 'success.main' : 'warning.main',
              mb: 1 
            }} 
          />
          <Typography 
            variant="h6" 
            color={winner === 1 ? 'success.main' : 'error.main'}
            fontWeight={600}
          >
            {winner === 1 ? '¡Has ganado!' : 'Has perdido'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
});

GameInfo.displayName = 'GameInfo';

export default GameInfo;