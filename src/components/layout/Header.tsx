import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBanner } from '../notifications/NotificationBanner';
import { Notification } from '../../types/notification';

interface HeaderProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ notifications, onMarkAsRead }) => {
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bannerNotifications, setBannerNotifications] = useState<Notification[]>([]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
    setBannerNotifications((prev) => prev.filter((n) => n.id !== id));
    handleClose();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Dottir
            </Link>
          </Typography>
          {currentUser && (
            <>
              <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={notifications.filter((n) => !n.read).length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 300,
                    width: 300,
                  },
                }}
              >
                {notifications.length === 0 ? (
                  <MenuItem disabled>No notifications</MenuItem>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      selected={!notif.read}
                    >
                      {notif.message}
                    </MenuItem>
                  ))
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <NotificationBanner notifications={bannerNotifications} onClose={handleMarkAsRead} />
    </>
  );
}; 