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

const Rooms = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Habitaciones
        </Typography>
        <Button variant="contained" color="primary">
          Agregar Habitación
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Precio ($)</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.numero}</TableCell>
                    <TableCell>{room.tipo}</TableCell>
                    <TableCell>
                      <Chip
                        label={room.estado}
                        color={room.estado === 'Disponible' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{room.precio}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(room)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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
    </Container>
  );
};

export default Rooms;