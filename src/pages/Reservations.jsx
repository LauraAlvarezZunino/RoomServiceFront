import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../servicios/api';

const Reservations = () => {
  const { user, isAdmin } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // API call to fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/api.php/reservas');
        const data = response.data;

        console.log('API Response:', data); // Debug: ver qué devuelve la API

        // Ensure data is an array
        const reservationsArray = Array.isArray(data) ? data : (data.reservas || data.data || []);

        // Transform API data to match the component's expected format
        const transformedData = reservationsArray.map(reservation => ({
          id: reservation.id,
          habitacion: reservation.habitacion.numero,
          cliente: `Usuario ${reservation.usuarioId}`, // You might need to fetch user data separately
          usuarioId: reservation.usuarioId,
          fechaInicio: reservation.fechaInicio,
          fechaFin: reservation.fechaFin,
          costo: reservation.costo,
          estado: 'Confirmada', // API doesn't seem to have status, adjust based on your logic
        }));

        // Filter reservations for non-admin users
        const filteredData = isAdmin ? transformedData : transformedData.filter(res => res.usuarioId === user.id);
        setReservations(filteredData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);


  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const handleSave = async () => {
    if (!selectedReservation) return;

    try {
      const response = await api.put(`/api.php/reservas/${selectedReservation.id}`, {
        fechaInicio: selectedReservation.fechaInicio,
        fechaFin: selectedReservation.fechaFin,
        habitacionId: selectedReservation.habitacionId, // You might need to map this
      });

      console.log('Reservation updated:', response.data);

      // Refresh the reservations list
      // You could call fetchReservations again or update the state directly

      handleClose();
    } catch (err) {
      console.error('Error updating reservation:', err);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await api.delete(`/api.php/reservas/${id}`);
      console.log('Reservation cancelled:', response.data);

      // Remove from local state or refresh
      setReservations(reservations.filter(res => res.id !== id));

    } catch (err) {
      console.error('Error cancelling reservation:', err);
      // Handle error
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Reservas
        </Typography>
        <Typography>Cargando reservas...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Reservas
        </Typography>
        <Typography color="error">Error al cargar reservas: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reservas
        </Typography>
        {isAdmin && (
          <Button variant="contained" color="primary">
            Nueva Reserva
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Habitación</TableCell>
                  {isAdmin && <TableCell>Cliente</TableCell>}
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Fin</TableCell>
                  <TableCell>Costo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.habitacion}</TableCell>
                    {isAdmin && <TableCell>{reservation.cliente}</TableCell>}
                    <TableCell>{reservation.fechaInicio}</TableCell>
                    <TableCell>{reservation.fechaFin}</TableCell>
                    <TableCell>${reservation.costo}</TableCell>
                    <TableCell>
                      <Chip
                        label={reservation.estado}
                        color={
                          reservation.estado === 'Confirmada' ? 'success' :
                          reservation.estado === 'Pendiente' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(reservation)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleCancel(reservation.id)}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle>Editar Reserva</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="habitacion"
                  name="habitacion"
                  label="Habitación"
                  value={selectedReservation.habitacion}
                  onChange={(e) => setSelectedReservation({ ...selectedReservation, habitacion: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="cliente"
                  name="cliente"
                  label="Cliente"
                  value={selectedReservation.cliente}
                  onChange={(e) => setSelectedReservation({ ...selectedReservation, cliente: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="fechaInicio"
                  name="fechaInicio"
                  label="Fecha Inicio"
                  type="date"
                  value={selectedReservation.fechaInicio}
                  onChange={(e) => setSelectedReservation({ ...selectedReservation, fechaInicio: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="fechaFin"
                  name="fechaFin"
                  label="Fecha Fin"
                  type="date"
                  value={selectedReservation.fechaFin}
                  onChange={(e) => setSelectedReservation({ ...selectedReservation, fechaFin: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reservations;