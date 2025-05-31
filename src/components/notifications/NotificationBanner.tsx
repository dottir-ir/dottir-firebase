import type { Notification } from '../../services/NotificationService';

interface NotificationBannerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notifications, onClose }) => {
  if (!notifications.length) return null;
  return (
    <Stack spacing={2} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1400 }}>
      {notifications.map((notif) => (
        <Alert
          key={notif.id}
          severity={notif.type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => onClose(notif.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ minWidth: 300 }}
        >
          {notif.message}
        </Alert>
      ))}
    </Stack>
  );
}; 