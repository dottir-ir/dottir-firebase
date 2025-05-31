import React from 'react';
import { Stack, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Notification } from '../../types/notification';

interface NotificationBannerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <Stack spacing={2} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1400 }}>
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => onClose(notification.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      ))}
    </Stack>
  );
}; 