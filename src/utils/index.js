import { STORAGE_KEYS, DEFAULT_USER_PREFERENCES } from '../constants';

// Utilidades de almacenamiento local
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Utilidades de validación
export const validation = {
  isValidNickname(nickname) {
    return nickname && nickname.trim().length >= 2 && nickname.trim().length <= 20;
  },

  sanitizeNickname(nickname) {
    return nickname.trim().replace(/[^a-zA-Z0-9áéíóúüñ\s]/g, '').slice(0, 20);
  },

  isValidColumn(column, maxColumns = 7) {
    return Number.isInteger(column) && column >= 0 && column < maxColumns;
  }
};

// Utilidades de formato
export const format = {
  date(date) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  },

  time(date) {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  duration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  percentage(value, total) {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  }
};

// Utilidades de juego
export const gameUtils = {
  createEmptyBoard(rows = 6, cols = 7) {
    return Array(rows).fill().map(() => Array(cols).fill(null));
  },

  checkWin(board, row, col, player) {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal /
      [1, -1]   // diagonal \
    ];

    for (const [deltaRow, deltaCol] of directions) {
      let count = 1;

      // Verificar en una dirección
      for (let i = 1; i < 4; i++) {
        const newRow = row + deltaRow * i;
        const newCol = col + deltaCol * i;
        if (this.isValidPosition(board, newRow, newCol) && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // Verificar en la dirección opuesta
      for (let i = 1; i < 4; i++) {
        const newRow = row - deltaRow * i;
        const newCol = col - deltaCol * i;
        if (this.isValidPosition(board, newRow, newCol) && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 4) return true;
    }

    return false;
  },

  isValidPosition(board, row, col) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
  },

  isBoardFull(board) {
    return board[0].every(cell => cell !== null);
  },

  getAvailableRow(board, col) {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  }
};

// Utilidades de preferencias de usuario
export const userPreferences = {
  get() {
    return storage.get(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  },

  set(preferences) {
    const current = this.get();
    const updated = { ...current, ...preferences };
    return storage.set(STORAGE_KEYS.USER_PREFERENCES, updated);
  },

  reset() {
    return storage.set(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
  }
};

// Utilidades de debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utilidades de throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};