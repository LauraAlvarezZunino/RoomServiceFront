import React, { useState } from 'react';
import {
  Container, Box, TextField, Card, CardContent,
  Alert, Link, Typography, Button, Grid, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
// Removida: import NavegacionSecundaria from '../components/NavegacionSecundaria';

// Estado inicial del formulario
const initialFormState = {
  email: '',
  password: '',
  nombreApellido: '',
  dni: '',
  telefono: '',
};

export default function Autenticacion() {
  const [esRegistro, establecerEsRegistro] = useState(false);
  const [formData, establecerFormData] = useState(initialFormState);
  const [errorAuth, establecerErrorAuth] = useState('');
  const [cargando, establecerCargando] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // 1. Unificar el manejo de inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    establecerFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 2. Validación de campos básica
  const validarCampos = () => {
    const { email, password, nombreApellido, dni, telefono } = formData;
    
    if (!email || !password) return false;
    
    if (esRegistro) {
      // Agrega más validaciones aquí, como longitud mínima de contraseña
      return nombreApellido && dni && telefono && password.length >= 6;
    }
    
    return true;
  };

  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    if (!validarCampos()) {
      establecerErrorAuth('Por favor, completa todos los campos requeridos.');
      return;
    }

    establecerErrorAuth('');
    establecerCargando(true);

    try {
      let result;
      if (esRegistro) {
        result = await register(formData);
        if (result.success) {
          establecerErrorAuth('¡Registro exitoso! Por favor, inicia sesión.');
          establecerEsRegistro(false);
          // Opcional: limpiar la contraseña y el resto del formulario
          establecerFormData(prev => ({ ...initialFormState, email: prev.email }));
        } else {
          establecerErrorAuth(result.error || 'Error al registrar.');
        }
      } else {
        result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          establecerErrorAuth(result.error || 'Credenciales incorrectas.');
        }
      }
    } catch (error) {
      console.error("Error de Auth:", error);
      establecerErrorAuth('Error de conexión o del servidor.');
    } finally {
      establecerCargando(false);
    }
  };

  return (
    // 3. Estilos de Pantalla Completa (Full Screen)
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: (theme) => theme.palette.grey[50],
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 },
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 400 },
        }}
      >
        <Card
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: { xs: 2, sm: 4 }, // Padding responsive
            }}
          >
            <LockOutlinedIcon
              color="primary"
              sx={{
                fontSize: { xs: 32, sm: 40 }, // Icon size responsive
                mb: 2
              }}
            />
            <Typography
              component="h1"
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '1.875rem' }, // Title size responsive
                textAlign: 'center'
              }}
            >
              {esRegistro ? 'Crea tu Cuenta' : 'Iniciar Sesión'}
            </Typography>
            
            <Box component="form" onSubmit={manejarEnvioFormulario} noValidate sx={{ width: '100%', mt: 1 }}>
              
              {/* Campos principales */}
              <TextField
                margin="normal" required fullWidth id="email" label="Correo Electrónico" 
                autoComplete="email" autoFocus type="email" name="email"
                value={formData.email} onChange={manejarCambioInput}
                error={!!errorAuth && !formData.email} // Muestra error si falta
              />
              <TextField
                margin="normal" required fullWidth name="password" label="Contraseña"
                type="password" id="password" autoComplete={esRegistro ? 'new-password' : 'current-password'}
                value={formData.password} onChange={manejarCambioInput}
                helperText={esRegistro && 'Mínimo 6 caracteres.'}
                error={!!errorAuth && !formData.password}
              />

              {/* Campos de Registro */}
              {esRegistro && (
                <>
                  <TextField
                    margin="normal" required fullWidth id="nombreApellido" label="Nombre y Apellido"
                    autoComplete="name" name="nombreApellido"
                    value={formData.nombreApellido} onChange={manejarCambioInput}
                  />
                  <TextField
                    margin="normal" required fullWidth id="dni" label="DNI"
                    autoComplete="off" name="dni" type="number"
                    value={formData.dni} onChange={manejarCambioInput}
                  />
                  <TextField
                    margin="normal" required fullWidth id="telefono" label="Teléfono"
                    autoComplete="tel" name="telefono" type="tel"
                    value={formData.telefono} onChange={manejarCambioInput}
                  />
                </>
              )}

              {/* Manejo de Errores */}
              {errorAuth && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorAuth}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: { xs: 1.5, sm: 1.75 }, // Button padding responsive
                  fontSize: { xs: '0.9rem', sm: '1rem' } // Button text size responsive
                }}
                disabled={cargando || !validarCampos()}
              >
                {cargando ? <CircularProgress size={24} color="inherit" /> : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
              </Button>
              
              <Grid container justifyContent="flex-end">
                <Grid >
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={() => {
                        establecerEsRegistro(!esRegistro);
                        establecerErrorAuth(''); // Limpiar errores al cambiar de modo
                        establecerFormData(initialFormState); // Limpiar el formulario
                    }}
                  >
                    {esRegistro ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}