import React, { useState } from 'react';
import {
  Container, Box, TextField, Card, CardContent,
  Alert, Link, Typography, Button, Grid, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

import api from '../servicios/api';
import NavegacionSecundaria from '../componentes/NavegacionSecundaria'; 

export default function Autenticacion() {
  const [esRegistro, establecerEsRegistro] = useState(false);
  const [email, establecerEmail] = useState('');
  const [password, establecerPassword] = useState('');
  const [errorAuth, establecerErrorAuth] = useState('');
  const [cargando, establecerCargando] = useState(false);
  const navigate = useNavigate();

  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    establecerErrorAuth('');
    establecerCargando(true);

    const endpoint = esRegistro ? '/registro' : '/login';
    
    try {
        const response = await api.post(endpoint, {
            email: email,
            password: password
            // Si es registro, quizá necesites enviar más datos (nombre_apellido, dni, etc.)
        });

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            // Si el backend devuelve el ID del usuario, guárdalo también
            // localStorage.setItem('userId', response.data.userId); 
            navigate('/'); 
        } else if (esRegistro) {
            alert('Registro exitoso! Por favor, inicia sesión con tu nueva cuenta.');
            establecerEsRegistro(false); 
        } else {
            establecerErrorAuth('Respuesta inesperada del servidor.');
        }

    } catch (error) {
        console.error("Error de Auth:", error.response);
        const mensajeError = error.response?.data?.message || 'Error de conexión. Verifica las credenciales.';
        establecerErrorAuth(mensajeError);
    } finally {
        establecerCargando(false);
    }
  };

  return (
    <>
      <NavegacionSecundaria 
          titulo={esRegistro ? 'Registrarse' : 'Iniciar Sesión'} 
          mostrarBotonVolver={true} 
      />

      <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              {esRegistro ? 'Crea tu Cuenta' : 'Accede a tu Cuenta'}
            </Typography>
            
            <Box component="form" onSubmit={manejarEnvioFormulario} noValidate sx={{ width: '100%', mt: 1 }}>
              <TextField
                margin="normal" required fullWidth id="email" label="Correo Electrónico" 
                autoComplete="email" autoFocus value={email} color="primary" type="email"
                onChange={(e) => establecerEmail(e.target.value)}
              />
              <TextField
                margin="normal" required fullWidth name="password" label="Contraseña"
                type="password" id="password" autoComplete="current-password"
                value={password} color="primary"
                onChange={(e) => establecerPassword(e.target.value)}
              />
              
              {errorAuth && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorAuth}
                </Alert>
              )}
              <Button
                type="submit" fullWidth variant="contained" color="primary"
                sx={{ mt: 3, mb: 2 }} disabled={cargando}
              >
                {cargando ? <CircularProgress size={24} color="inherit" /> : (esRegistro ? 'Registrarse' : 'Iniciar Sesión')}
              </Button>
              
              <Grid container justifyContent="flex-end">
                <Grid >
                  <Link href="#" variant="body2" onClick={() => establecerEsRegistro(!esRegistro)}>
                    {esRegistro ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}