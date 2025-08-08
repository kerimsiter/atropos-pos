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
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography sx={{ ml: 1.5 }} variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="p" sx={{ textAlign: 'center' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
