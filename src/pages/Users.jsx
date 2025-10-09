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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    setUsers([
      { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin', estado: 'Activo' },
      { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Usuario', estado: 'Activo' },
      { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Usuario', estado: 'Inactivo' },
    ]);
  }, []);


  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    // Implement save logic
    handleClose();
  };

  const handleToggleStatus = (id, currentStatus) => {
    // Implement toggle status logic
    console.log('Toggle status for user:', id, 'from', currentStatus);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Usuarios
        </Typography>
        <Button variant="contained" color="primary">
          Nuevo Usuario
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.estado}
                        color={user.estado === 'Activo' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(user)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color={user.estado === 'Activo' ? 'warning' : 'success'}
                          onClick={() => handleToggleStatus(user.id, user.estado)}
                        >
                          {user.estado === 'Activo' ? 'Desactivar' : 'Activar'}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="nombre"
                  name="nombre"
                  label="Nombre"
                  value={selectedUser.nombre}
                  onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="rol"
                  name="rol"
                  label="Rol"
                  value={selectedUser.rol}
                  onChange={(e) => setSelectedUser({ ...selectedUser, rol: e.target.value })}
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

export default Users;