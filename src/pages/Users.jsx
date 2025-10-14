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

const Users = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    const allUsers = [
      { id: 1, nombreApellido: 'Juan Pérez', dni: '12345678', email: 'juan@example.com', telefono: '123456789', esAdmin: true, estado: 'Activo' },
      { id: 2, nombreApellido: 'María García', dni: '87654321', email: 'maria@example.com', telefono: '987654321', esAdmin: false, estado: 'Activo' },
      { id: 3, nombreApellido: 'Carlos López', dni: '11223344', email: 'carlos@example.com', telefono: '555666777', esAdmin: false, estado: 'Inactivo' },
    ];
    const filteredUsers = isAdmin ? allUsers : allUsers.filter(u => u.id === user.id);
    setUsers(filteredUsers);
  }, [isAdmin, user]);


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
          {isAdmin ? 'Usuarios' : 'Mi Perfil'}
        </Typography>
        {isAdmin && (
          <Button variant="contained" color="primary">
            Nuevo Usuario
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre y Apellido</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  {isAdmin && <TableCell>Rol</TableCell>}
                  {isAdmin && <TableCell>Estado</TableCell>}
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.nombreApellido}</TableCell>
                    <TableCell>{u.dni}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.telefono}</TableCell>
                    {isAdmin && <TableCell>{u.esAdmin ? 'Admin' : 'Usuario'}</TableCell>}
                    {isAdmin && (
                      <TableCell>
                        <Chip
                          label={u.estado}
                          color={u.estado === 'Activo' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(u)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        {isAdmin ? (
                          <Button
                            variant="outlined"
                            size="small"
                            color={u.estado === 'Activo' ? 'warning' : 'success'}
                            onClick={() => handleToggleStatus(u.id, u.estado)}
                          >
                            {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                          >
                            Eliminar Cuenta
                          </Button>
                        )}
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
        <DialogTitle>{isAdmin ? 'Editar Usuario' : 'Editar Mi Perfil'}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="nombreApellido"
                  name="nombreApellido"
                  label="Nombre y Apellido"
                  value={selectedUser.nombreApellido}
                  onChange={(e) => setSelectedUser({ ...selectedUser, nombreApellido: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="dni"
                  name="dni"
                  label="DNI"
                  value={selectedUser.dni}
                  onChange={(e) => setSelectedUser({ ...selectedUser, dni: e.target.value })}
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
                  id="telefono"
                  name="telefono"
                  label="Teléfono"
                  value={selectedUser.telefono}
                  onChange={(e) => setSelectedUser({ ...selectedUser, telefono: e.target.value })}
                />
              </Grid>
              {isAdmin && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="rol"
                    name="rol"
                    label="Rol"
                    value={selectedUser.esAdmin ? 'Admin' : 'Usuario'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, esAdmin: e.target.value === 'Admin' })}
                  />
                </Grid>
              )}
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