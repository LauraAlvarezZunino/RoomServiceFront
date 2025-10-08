import React, { useState } from 'react';
import { Button, Grid, TextField, Alert, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import moment from 'moment';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormularioReserva({ habitacionId, alConfirmarReserva }) {
  const [fechaEntrada, establecerFechaEntrada] = useState(null);
  const [fechaSalida, establecerFechaSalida] = useState(null);
  const [errorFechas, establecerErrorFechas] = useState('');

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    establecerErrorFechas('');
    
    // Validación de fechas
    if (!fechaEntrada || !fechaSalida) {
      establecerErrorFechas('Por favor, selecciona las fechas de entrada y salida.');
      return;
    }
    if (fechaEntrada.isSameOrAfter(fechaSalida, 'day')) { // Corregida la lógica
      establecerErrorFechas('La fecha de salida debe ser posterior a la de entrada.');
      return;
    }

    // Llama a la función de la página y le pasa los datos con el formato que espera la DB
    alConfirmarReserva({
        habitacionId: habitacionId,
        fecha_inicio: fechaEntrada.format('YYYY-MM-DD'),
        fecha_salida: fechaSalida.format('YYYY-MM-DD')
    });
  };

  return (
    <Box component="form" onSubmit={manejarEnvio}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Fecha de Entrada"
              value={fechaEntrada}
              onChange={(newValue) => establecerFechaEntrada(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth color="primary" />}
              minDate={moment()} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Fecha de Salida"
              value={fechaSalida}
              onChange={(newValue) => establecerFechaSalida(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth color="primary" />}
              // Debe ser al menos un día después de la entrada
              minDate={fechaEntrada ? moment(fechaEntrada).add(1, 'day') : moment().add(1, 'day')} 
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      
      {errorFechas && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorFechas}
        </Alert>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        startIcon={<EventIcon />}
      >
        Confirmar Reserva
      </Button>
    </Box>
  );
}