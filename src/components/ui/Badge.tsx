import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface BadgeProps extends Omit<ChipProps, 'color' | 'variant'> {
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
  chipVariant?: 'filled' | 'outlined';
}

const getColor = (status: BadgeProps['status']): ChipProps['color'] => {
  switch (status) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'info':
      return 'info';
    default:
      return 'default';
  }
};

export function Badge({ status = 'default', chipVariant = 'filled', ...props }: BadgeProps) {
  return <Chip color={getColor(status)} variant={chipVariant} {...props} />;
} 