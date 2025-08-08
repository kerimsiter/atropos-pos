// packages/atropos-desktop/src/renderer/src/components/tables/TableCard.tsx
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Paper, Typography, Chip, Box } from '@mui/material';
import { Table } from '../../types/Table';
import React from 'react';

interface TableCardProps {
  table: Table;
  onStop: (id: string, x: number, y: number) => void;
}

export const TableCard = ({ table, onStop }: TableCardProps) => {
  const navigate = useNavigate();
  const nodeRef = React.useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: table.positionX || 0, y: table.positionY || 0 }}
      onStop={(_e, data) => onStop(table.id, data.x, data.y)}
      bounds="parent"
    >
      <Paper
        ref={nodeRef}
        onClick={() => navigate(`/order/${table.id}`)}
        elevation={3}
        sx={{
          width: 100,
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer', // 'move' yerine 'pointer' daha uygun
          position: 'absolute',
          color: (() => {
            const os = table.orders?.[0]?.status?.toUpperCase();
            if (os === 'READY') return 'white';
            if (os === 'PREPARING') return 'white';
            return table.status === 'OCCUPIED' ? 'white' : 'inherit';
          })(),
          backgroundColor: (() => {
            const os = table.orders?.[0]?.status?.toUpperCase();
            if (os === 'READY') return 'success.main';
            if (os === 'PREPARING') return 'info.main';
            return table.status === 'OCCUPIED' ? 'primary.main' : 'background.paper';
          })(),
          '&:hover': {
            backgroundColor: (() => {
              const os = table.orders?.[0]?.status?.toUpperCase();
              if (os === 'READY') return 'success.dark';
              if (os === 'PREPARING') return 'info.dark';
              return table.status === 'OCCUPIED' ? 'primary.dark' : 'grey.200';
            })(),
          },
        }}
      >
        <Box sx={{ position: 'absolute', top: 6 }}>
          {table.orders?.[0]?.status && (
            <Chip
              size="small"
              label={table.orders[0].status}
              color={table.orders[0].status.toUpperCase() === 'READY' ? 'success' : table.orders[0].status.toUpperCase() === 'PREPARING' ? 'info' : 'default'}
              sx={{ fontSize: 10 }}
            />
          )}
        </Box>
        <Typography variant="h6">{table.number}</Typography>
        <Typography variant="caption">{table.capacity} Kişilik</Typography>
      </Paper>
    </Draggable>
  );
}

