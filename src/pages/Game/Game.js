import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  Backdrop
} from '@mui/material';
import {
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ExitToApp as ExitIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks';
import { GAME_STATES } from '../../constants';
import GameBoard from '../../components/GameBoard';
import GameInfo from '../../components/GameInfo';
import LoadingButton from '../../components/LoadingButton';
import Swal from 'sweetalert2';

const Game = () => {
  const { gameId, nick: playerName, gameType } = useParams();
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [moveCount, setMoveCount] = useState(0);

  const {
    gameState,
    loading,
    error,
    connected,
    makeMove,
    resetGame,
    connectToGame
  } = useGame(gameId, playerName, gameType);

  // Manejar clics en columnas del tablero
  const handleColumnClick = useCallback((columnIndex) => {
    const success = makeMove(columnIndex);
    if (success) {
      setMoveCount(prev => prev + 1);
    } else {
      // Mostrar feedback de movimiento inválido
      Swal.fire({
        icon: 'warning',
        title: 'Movimiento inválido',
        text: 'No puedes colocar una ficha en esta columna',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  }, [makeMove]);

  // Manejar fin del juego
  useEffect(() => {
    if (gameState.gameStatus === GAME_STATES.FINISHED) {
      const isWinner = gameState.winner === 1;
      const isDraw = gameState.winner === null;
      
      setTimeout(() => {
        Swal.fire({
          icon: isDraw ? 'info' : (isWinner ? 'success' : 'error'),
          title: isDraw ? '¡Empate!' : (isWinner ? '¡Ganaste!' : 'Perdiste'),
          text: isDraw 
            ? 'El tablero se llenó sin ganador' 
            : isWinner 
              ? '¡Felicidades! Has conectado 4 fichas' 
              : 'Tu oponente ha conectado 4 fichas',
          confirmButtonText: 'Jugar de nuevo',
          showCancelButton: true,
          cancelButtonText: 'Volver al inicio',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            handleResetGame();
          } else {
            handleGoHome();
          }
        });
      }, 1000);
    }
  }, [gameState.gameStatus, gameState.winner]);

  // Manejar reconexión automática
  useEffect(() => {
    if (error && !connected) {
      const timeoutId = setTimeout(() => {
        connectToGame();
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [error, connected, connectToGame]);

  // Funciones de navegación
  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleResetGame = useCallback(() => {
    setMoveCount(0);
    setWinningCells([]);
    resetGame();
  }, [resetGame]);

  const handleExitGame = useCallback(() => {
    setShowExitDialog(false);
    handleGoHome();
  }, [handleGoHome]);

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">
            Conectando al juego...
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mt: 1, opacity: 0.8 }}>
            Preparando la partida
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {/* Alert de error de conexión */}
      {error && (
        <Fade in>
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={connectToGame}
              >
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Alert de estado de conexión */}
      {!connected && !loading && (
        <Fade in>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Conexión perdida. Reintentando...
          </Alert>
        </Fade>
      )}

      <Grid container spacing={3}>
        {/* Información del juego */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <GameInfo
              gameState={gameState}
              playerName={playerName}
              gameType={gameType}
              gameStartTime={gameState.gameStartTime}
              moveCount={moveCount}
            />
            
            {/* Controles del juego */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetGame}
                disabled={gameState.gameStatus === GAME_STATES.WAITING || loading}
                sx={{ borderRadius: 2 }}
              >
                Nueva Partida
              </Button>
              
              <Button
                variant="text"
                startIcon={<HomeIcon />}
                onClick={() => setShowExitDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Tablero de juego */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Fade in timeout={800}>
              <Box>
                <GameBoard
                  board={gameState.board}
                  onColumnClick={handleColumnClick}
                  disabled={!gameState.isMyTurn || gameState.gameStatus !== GAME_STATES.PLAYING || !connected}
                  winningCells={winningCells}
                  currentPlayer={gameState.currentPlayer}
                />
              </Box>
            </Fade>
          </Box>
        </Grid>
      </Grid>

      {/* Diálogo de confirmación para salir */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ExitIcon color="warning" />
            Salir del juego
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres salir del juego? 
            {gameState.gameStatus === GAME_STATES.PLAYING && 
              'Se perderá el progreso de la partida actual.'}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setShowExitDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleExitGame}
            color="warning"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Game;