import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BarChart as StatsIcon } from '@mui/icons-material';
import { ROUTES } from '../../constants';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isActive = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path.split('/:')[0]);
  };

  const navigationItems = [
    {
      path: ROUTES.HOME,
      label: 'Inicio',
      icon: <HomeIcon />
    },
    {
      path: ROUTES.STATISTICS,
      label: 'Estadísticas',
      icon: <StatsIcon />
    }
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff, #e3f2fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🎯 4 en Línea
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              startIcon={!isMobile ? item.icon : null}
              sx={{
                borderRadius: 2,
                px: isMobile ? 1 : 2,
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {isMobile ? item.icon : item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;