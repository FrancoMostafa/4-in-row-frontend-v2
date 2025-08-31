import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el state para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2
              }}
            />
            
            <Typography variant="h4" gutterBottom color="error.main">
              ¡Oops! Algo salió mal
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ha ocurrido un error inesperado en la aplicación. 
              Puedes intentar recargar la página o volver al inicio.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReload}
                sx={{ borderRadius: 2 }}
              >
                Recargar página
              </Button>
              
              <Button
                variant="outlined"
                onClick={this.handleReset}
                sx={{ borderRadius: 2 }}
              >
                Intentar de nuevo
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 2,
                  textAlign: 'left',
                  overflow: 'auto'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Detalles del error (modo desarrollo):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;