import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    setRooms([
      { id: 1, numero: '101', tipo: 'Suite', estado: 'Disponible', precio: 150 },
      { id: 2, numero: '102', tipo: 'Doble', estado: 'Ocupada', precio: 100 },
      { id: 3, numero: '103', tipo: 'Simple', estado: 'Disponible', precio: 80 },
    ]);
  }, []);


  const handleEdit = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
  };

  const handleSave = () => {
    // Implement save logic
    handleClose();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3, gap:4, }}>
        <Typography variant="h4" component="h1">
          Habitaciones
        </Typography>
        {isAdmin && (
          <Button variant="contained" color="primary">
            Agregar Habitación
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <RoomCard room={room} onEdit={handleEdit} />
          </Grid>
        ))}
      </Grid>

      {isAdmin && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Habitación</DialogTitle>
          <DialogContent>
            {selectedRoom && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="numero"
                    name="numero"
                    label="Número"
                    value={selectedRoom.numero}
                    onChange={(e) => setSelectedRoom({ ...selectedRoom, numero: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="tipo"
                    name="tipo"
                    label="Tipo"
                    value={selectedRoom.tipo}
                    onChange={(e) => setSelectedRoom({ ...selectedRoom, tipo: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="precio"
                    name="precio"
                    label="Precio"
                    type="number"
                    value={selectedRoom.precio}
                    onChange={(e) => setSelectedRoom({ ...selectedRoom, precio: e.target.value })}
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
      )}
    </Container>
  );
};

export default Rooms;