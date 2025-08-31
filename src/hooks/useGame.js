import { useState, useCallback, useEffect } from 'react';
import { GAME_STATES, BOARD_DIMENSIONS } from '../constants';
import { gameUtils } from '../utils';
import websocketService from '../services/websocket';
import apiService from '../services/api';

const useGame = (gameId, playerName, gameType) => {
  const [gameState, setGameState] = useState({
    board: gameUtils.createEmptyBoard(),
    currentPlayer: 1,
    gameStatus: GAME_STATES.WAITING,
    winner: null,
    isMyTurn: false,
    opponentName: null,
    moveHistory: [],
    gameStartTime: null
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  // Conectar al WebSocket
  const connectToGame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await websocketService.connect(gameId);
      websocketService.joinGame(gameId, playerName);
      
      setConnected(true);
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [gameId, playerName]);

  // Realizar movimiento
  const makeMove = useCallback((column) => {
    if (!gameState.isMyTurn || gameState.gameStatus !== GAME_STATES.PLAYING) {
      return false;
    }

    const availableRow = gameUtils.getAvailableRow(gameState.board, column);
    if (availableRow === -1) {
      return false; // Columna llena
    }

    // Enviar movimiento al servidor
    websocketService.makeMove(column);
    return true;
  }, [gameState.board, gameState.isMyTurn, gameState.gameStatus]);

  // Manejar actualización del juego desde WebSocket
  const handleGameUpdate = useCallback((data) => {
    const { board, currentPlayer, gameStatus, winner, players, moveHistory } = data;
    
    setGameState(prev => ({
      ...prev,
      board: board || prev.board,
      currentPlayer: currentPlayer !== undefined ? currentPlayer : prev.currentPlayer,
      gameStatus: gameStatus || prev.gameStatus,
      winner: winner !== undefined ? winner : prev.winner,
      isMyTurn: currentPlayer === getPlayerNumber(playerName, players),
      opponentName: getOpponentName(playerName, players),
      moveHistory: moveHistory || prev.moveHistory,
      gameStartTime: gameStatus === GAME_STATES.PLAYING && !prev.gameStartTime ? new Date() : prev.gameStartTime
    }));

    // Si el juego terminó, guardar estadísticas
    if (gameStatus === GAME_STATES.FINISHED) {
      saveGameStatistics(gameId, gameType, winner);
    }
  }, [gameId, gameType, playerName]);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    setGameState({
      board: gameUtils.createEmptyBoard(),
      currentPlayer: 1,
      gameStatus: GAME_STATES.WAITING,
      winner: null,
      isMyTurn: false,
      opponentName: null,
      moveHistory: [],
      gameStartTime: null
    });
    connectToGame();
  }, [connectToGame]);

  // Funciones auxiliares
  const getPlayerNumber = (name, players) => {
    if (!players) return 1;
    return players.findIndex(p => p.name === name) + 1;
  };

  const getOpponentName = (name, players) => {
    if (!players || players.length < 2) return null;
    return players.find(p => p.name !== name)?.name || null;
  };

  const saveGameStatistics = async (gameId, gameType, winner) => {
    try {
      await apiService.saveGameData(gameId, gameType, GAME_STATES.FINISHED);
    } catch (error) {
      console.error('Error saving game statistics:', error);
    }
  };

  // Manejar eventos de WebSocket
  useEffect(() => {
    const handleGameUpdate = (data) => {
      setGameState(prev => ({ ...prev, ...data }));
    };

    const handleOpponentDisconnected = () => {
      setGameState(prev => ({
        ...prev,
        gameStatus: GAME_STATES.ABANDONED
      }));
    };

    websocketService.on('gameUpdate', handleGameUpdate);
    websocketService.on('opponentDisconnected', handleOpponentDisconnected);

    return () => {
      websocketService.off('gameUpdate', handleGameUpdate);
      websocketService.off('opponentDisconnected', handleOpponentDisconnected);
    };
  }, []);

  // Conectar al juego
  useEffect(() => {
    connectToGame();
    return () => websocketService.disconnect();
  }, [connectToGame]);

  return {
    gameState,
    loading,
    error,
    connected,
    makeMove,
    resetGame,
    connectToGame
  };
};

export default useGame;