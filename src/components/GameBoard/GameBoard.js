import React, { memo, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { BOARD_DIMENSIONS } from '../../constants';

const GameBoard = memo(({ 
  board, 
  onColumnClick, 
  disabled = false,
  winningCells = [],
  currentPlayer = 1 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleColumnClick = useCallback((columnIndex) => {
    if (!disabled && onColumnClick) {
      onColumnClick(columnIndex);
    }
  }, [disabled, onColumnClick]);

  const getCellColor = useCallback((row, col) => {
    const cellValue = board[row][col];
    if (cellValue === null) return 'transparent';
    
    const isWinning = winningCells.some(([r, c]) => r === row && c === col);
    
    if (cellValue === 1) {
      return isWinning ? '#ff1744' : '#f44336'; // Rojo
    } else {
      return isWinning ? '#ffd600' : '#ffeb3b'; // Amarillo
    }
  }, [board, winningCells]);

  const getColumnPreview = useCallback((colIndex) => {
    if (disabled) return null;
    
    // Encontrar la primera fila disponible
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][colIndex] === null) {
        return row;
      }
    }
    return null;
  }, [board, disabled]);

  return (
    <Paper 
      elevation={3}
      sx={{
        p: { xs: 1, sm: 2 },
        backgroundColor: '#1565c0',
        borderRadius: 3,
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Grid container spacing={0.5}>
        {Array.from({ length: BOARD_DIMENSIONS.COLS }, (_, colIndex) => (
          <Grid item xs key={`col-${colIndex}`}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
              }}
            >
              {/* Botón de columna para el preview */}
              <IconButton
                onClick={() => handleColumnClick(colIndex)}
                disabled={disabled || getColumnPreview(colIndex) === null}
                sx={{
                  width: { xs: 35, sm: 50, md: 60 },
                  height: { xs: 35, sm: 50, md: 60 },
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <CircleIcon
                  sx={{
                    fontSize: { xs: 20, sm: 30, md: 35 },
                    color: disabled || getColumnPreview(colIndex) === null 
                      ? 'rgba(255, 255, 255, 0.3)'
                      : currentPlayer === 1 
                        ? '#f44336' 
                        : '#ffeb3b',
                    opacity: 0.7
                  }}
                />
              </IconButton>
              
              {/* Celdas del tablero */}
              {Array.from({ length: BOARD_DIMENSIONS.ROWS }, (_, rowIndex) => (
                <Box
                  key={`cell-${rowIndex}-${colIndex}`}
                  sx={{
                    width: { xs: 35, sm: 50, md: 60 },
                    height: { xs: 35, sm: 50, md: 60 },
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '3px solid #1565c0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {board[rowIndex][colIndex] && (
                    <Box
                      className={winningCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'winning-piece' : ''}
                      sx={{
                        width: '85%',
                        height: '85%',
                        borderRadius: '50%',
                        backgroundColor: getCellColor(rowIndex, colIndex),
                        border: '2px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
});

GameBoard.displayName = 'GameBoard';

export default GameBoard;