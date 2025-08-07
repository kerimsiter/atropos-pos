// packages/atropos-desktop/src/renderer/src/components/tables/TableCard.tsx
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Paper, Typography } from '@mui/material';
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
          color: table.status === 'OCCUPIED' ? 'white' : 'inherit',
          backgroundColor: table.status === 'OCCUPIED' ? 'primary.main' : 'background.paper',
          '&:hover': {
            backgroundColor: table.status === 'OCCUPIED' ? 'primary.dark' : 'grey.200',
          },
        }}
      >
        <Typography variant="h6">{table.number}</Typography>
        <Typography variant="caption">{table.capacity} Kişilik</Typography>
      </Paper>
    </Draggable>
  );
};

