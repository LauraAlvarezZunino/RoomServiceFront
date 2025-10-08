import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Importar las páginas desde la carpeta 'paginas'
import ListadoHabitaciones from './paginas/ListadoHabitaciones';
import DetalleHabitacion from './paginas/DetalleHabitacion';
import Autenticacion from './paginas/Autenticacion';

// --- Definición del Tema Oscuro ---
const temaOscuro = createTheme({
  palette: {
    mode: 'dark', // Modo oscuro activado
    primary: {
      main: '#90caf9', // Azul claro
    },
    secondary: {
      main: '#f48fb1', // Rosa
    },
    background: {
      default: '#121212', // Fondo general
      paper: '#1d1d1d',   // Fondo de cards y contenedores
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={temaOscuro}>
      <CssBaseline />
      
      <Router>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<ListadoHabitaciones />} />
          <Route path="/habitacion/:id" element={<DetalleHabitacion />} />
          <Route path="/auth" element={<Autenticacion />} />
          
          {/* Se recomienda agregar una ruta de 404 aquí */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;