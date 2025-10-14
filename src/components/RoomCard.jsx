import React from 'react';
import {
  Card, CardContent, CardActions, Typography, Button, Chip, Divider,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HotelIcon from '@mui/icons-material/Hotel'; // Para la capacidad
import EditIcon from '@mui/icons-material/Edit'; // Para el botón de editar
import { useAuth } from '../contexts/AuthContext';

// Función auxiliar para renderizar el botón de acción
const renderActions = (room, isAdmin, onEdit) => {
  if (isAdmin) {
    return (
      <Button
        size="small"
        color="primary"
        onClick={() => onEdit(room)}
        startIcon={<EditIcon />}
      >
        Editar
      </Button>
    );
  }

  // Lógica para usuarios regulares
  return room.estado === 'Disponible' ? (
    <Button
      size="small"
      color="primary"
      variant="contained"
    >
      Reservar
    </Button>
  ) : (
    // No hay botón de reservar si no está disponible
    <Typography variant="caption" color="error">
      No disponible
    </Typography>
  );
};

export default function RoomCard({ room, onEdit }) {
  const { isAdmin } = useAuth();
  
  // Asumiendo que 'room.capacidad' existe y es el número de huéspedes
  const capacidad = room.capacidad || 2; 
  const isAvailable = room.estado === 'Disponible';

  return (
    <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        // Efecto visual si no está disponible
        opacity: isAvailable ? 1 : 0.7, 
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" color="primary">
          Habitación {room.numero}
        </Typography>
        
        {/* Tipo de Habitación como Chip para resaltarlo */}
        <Chip 
          label={room.tipo} 
          size="small" 
          color="secondary" 
          sx={{ mb: 2 }} 
        />
        
        {/* Sección de detalles con iconos */}
        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} /> 
          <span style={{ fontWeight: 'bold' }}>${room.precio}</span> / noche
        </Typography>

        <Typography variant="body1" color="text.primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HotelIcon sx={{ mr: 1, color: 'info.main' }} /> 
          Capacidad: {capacidad} {capacidad > 1 ? 'huéspedes' : 'huésped'}
        </Typography>
        
        <Divider sx={{ mb: 1 }} />

        {/* Estado visible para todos (MEJORA CLAVE) */}
        <Chip
          label={room.estado}
          color={isAvailable ? 'success' : 'error'}
          variant={isAdmin ? 'filled' : 'outlined'} // El admin lo ve más destacado
          size="small"
          sx={{ mt: 1 }}
        />

        {/* Info extra de administración (opcional) */}
        {isAdmin && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Última limpieza: {room.ultimaLimpieza || 'N/A'} 
            </Typography>
        )}

      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        {renderActions(room, isAdmin, onEdit)}
      </CardActions>
    </Card>
  );
}