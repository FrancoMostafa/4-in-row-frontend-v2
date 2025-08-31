// Game constants
export const GAME_TYPES = {
  SINGLE_PLAYER: 'singlePlayer',
  MULTIPLAYER: 'multiplayer'
};

export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
  ABANDONED: 'abandoned'
};

export const PLAYER_TYPES = {
  HUMAN: 'human',
  COMPUTER: 'computer'
};

export const BOARD_DIMENSIONS = {
  ROWS: 6,
  COLS: 7
};

export const WINNING_COUNT = 4;

// UI constants
export const ROUTES = {
  HOME: '/',
  GAME: '/game/:gameId/:nick/:gameType',
  STATISTICS: '/estadisticas'
};

export const MESSAGES = {
  WAITING_OPPONENT: 'Esperando oponente...',
  YOUR_TURN: 'Tu turno',
  OPPONENT_TURN: 'Turno del oponente',
  GAME_WON: '¡Ganaste!',
  GAME_LOST: 'Perdiste',
  GAME_DRAW: 'Empate',
  CONNECTION_ERROR: 'Error de conexión',
  INVALID_MOVE: 'Movimiento inválido'
};

// API constants
export const API_ENDPOINTS = {
  STATISTICS: '/statistics',
  STATISTICS_BY_DATE: '/statistics/get',
  SAVE_GAME_DATA: '/statistics'
};

// WebSocket events
export const WS_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_GAME: 'joinGame',
  MAKE_MOVE: 'makeMove',
  GAME_UPDATE: 'gameUpdate',
  OPPONENT_DISCONNECTED: 'opponentDisconnected'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  GAME_HISTORY: 'gameHistory'
};

export const DEFAULT_USER_PREFERENCES = {
  soundEnabled: true,
  animationsEnabled: true,
  theme: 'light'
};