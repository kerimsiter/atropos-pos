// packages/atropos-desktop/src/renderer/src/components/dashboard/StatCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontSize: 16, fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="p" sx={{ textAlign: 'left', mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
