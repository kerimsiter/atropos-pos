// packages/atropos-desktop/src/renderer/src/components/tables/TableCard.tsx
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Chip, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import NotesIcon from '@mui/icons-material/Notes';
import { Table } from '../../types/Table';

interface TableCardProps {
  table: Table;
}

export const TableCard = ({ table }: TableCardProps) => {
  const navigate = useNavigate();
  // UI amaçlı geniş alanlara ihtiyaç var; Table türündeki "orders[0]" minimal olabilir.
  // Bu nedenle gösterim için gevşek bir okuma kullanıyoruz.
  const currentOrder: any = (table as any)?.orders?.[0] ?? null;
  const orderStatus = String(currentOrder?.status || '').toUpperCase();
  const isOccupied = String(table.status || '').toUpperCase() === 'OCCUPIED';
  const isReserved = String(table.status || '').toUpperCase() === 'RESERVED' || orderStatus === 'RESERVED';
  const isReady = orderStatus === 'READY';

  const cardStyles = {
    width: 176,
    height: 124,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    p: 1.5,
    cursor: 'pointer',
    position: 'relative' as const,
    borderRadius: 2,
    color: (theme: any) => (isReady || isOccupied || isReserved ? theme.palette.common.white : theme.palette.text.primary),
    backgroundColor: (theme: any) =>
      isOccupied
        ? theme.palette.error.main
        : isReady
        ? theme.palette.success.main
        : isReserved
        ? theme.palette.warning.main
        : theme.palette.background.paper,
    border: (theme: any) => (!isReady && !isOccupied && !isReserved ? `1px solid ${(theme.palette as any).extensions?.stroke || '#EEEEEE'}` : 'none'),
    '&:hover': {
      backgroundColor: (theme: any) =>
        isOccupied
          ? theme.palette.error.dark
          : isReady
          ? theme.palette.success.dark
          : isReserved
          ? theme.palette.warning.dark
          : theme.palette.grey[100],
    },
  };

  return (
    <Paper onClick={() => navigate(`/order/${table.id}`)} elevation={1} sx={cardStyles}>
      {/* Header Row: left = status, right = quick info icons */}
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 20 }}>
          {currentOrder?.status && (
            <Chip size="small" label={currentOrder.status} color={isReady ? 'success' : isOccupied ? 'error' : isReserved ? 'warning' : 'default'} sx={{ fontSize: 10, height: 22, borderRadius: 999 }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, px: 0.5, py: 0.25, borderRadius: 1, backgroundColor: (theme: any) => (isReady || isOccupied || isReserved ? 'rgba(255,255,255,0.15)' : (theme.palette as any).secondary.light) }}>
            <PeopleIcon sx={{ fontSize: 14, opacity: 0.9 }} />
            <Typography variant="caption" sx={{ lineHeight: 1, fontWeight: 700 }}>{table.capacity ?? '-'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 0.5, py: 0.25, borderRadius: 1, backgroundColor: (theme: any) => (isReady || isOccupied || isReserved ? 'rgba(255,255,255,0.15)' : (theme.palette as any).secondary.light) }}>
            <NotesIcon sx={{ fontSize: 14, opacity: currentOrder?.note ? 1 : 0.4 }} />
          </Box>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>Masa {table.number}</Typography>
      <Box>
        <Typography variant="caption" display="block">{currentOrder?.waiter?.username || '---'}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{currentOrder ? `₺${Number(currentOrder.totalAmount || 0).toFixed(2)}` : 'Boş'}</Typography>
      </Box>
    </Paper>
  );
}

