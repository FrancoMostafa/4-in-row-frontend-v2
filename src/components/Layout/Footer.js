import React from 'react';
import {
  Box,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Desarrollado con
          </Typography>
          <FavoriteIcon sx={{ color: 'error.main', fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            por Franco Mostafa
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component="a"
            href="https://github.com/FrancoMostafa"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
          
          <Divider orientation="vertical" flexItem />
          
          <Typography variant="body2" color="text.secondary">
            © {currentYear} 4 en Línea V2
          </Typography>
        </Box>

        <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Typography variant="caption" color="text.secondary">
            Versión optimizada del clásico juego
          </Typography>
          <br />
          <Link
            href="https://github.com/FrancoMostafa/4-in-row-backend"
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Ver Backend →
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;