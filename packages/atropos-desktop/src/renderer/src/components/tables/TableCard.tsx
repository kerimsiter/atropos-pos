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
  // UI amaçlı geniş alanlara ihtiyaç var; Table türündeki "orders[0]" minimal olabilir.
  // Bu nedenle gösterim için gevşek bir okuma kullanıyoruz.
  const currentOrder: any = (table as any)?.orders?.[0] ?? null;

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
          width: 140,
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: 1.5,
          cursor: 'pointer', // 'move' yerine 'pointer' daha uygun
          position: 'absolute',
          borderRadius: 2,
          color: (() => {
            const os = currentOrder?.status?.toUpperCase();
            if (os === 'READY') return 'white';
            if (table.status === 'OCCUPIED') return 'white';
            return 'inherit';
          })(),
          backgroundColor: (() => {
            const os = currentOrder?.status?.toUpperCase();
            if (os === 'READY') return 'success.main';
            if (table.status === 'OCCUPIED') return 'primary.main';
            return 'background.paper';
          })(),
          '&:hover': {
            backgroundColor: (() => {
              const os = currentOrder?.status?.toUpperCase();
              if (os === 'READY') return 'success.dark';
              return table.status === 'OCCUPIED' ? 'primary.dark' : 'grey.100';
            })(),
          },
        }}
      >
        <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
          {currentOrder?.status && (
            <Chip
              size="small"
              label={currentOrder.status}
              color={currentOrder.status.toUpperCase() === 'READY' ? 'success' : table.status === 'OCCUPIED' ? 'warning' : 'default'}
              sx={{ fontSize: 10 }}
            />
          )}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{table.number}</Typography>
        <Box>
          <Typography variant="caption" display="block">{currentOrder?.waiter?.username || '---'}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {currentOrder ? `${Number(currentOrder.totalAmount || 0).toFixed(2)} TL` : 'Boş'}
          </Typography>
        </Box>
      </Paper>
    </Draggable>
  );
}

