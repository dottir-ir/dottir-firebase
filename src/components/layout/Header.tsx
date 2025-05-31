import { NotificationBanner } from '../notifications/NotificationBanner';

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bannerNotifications, setBannerNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (currentUser) {
      notificationService.getUserNotifications(currentUser.id).then((notifs) => {
        setNotifications(notifs);
        setBannerNotifications(notifs.filter((n) => !n.read));
      });
    }
  }, [currentUser]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMarkAsRead = async (id: string) => {
    await notificationService.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setBannerNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dottir
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {notifications.length === 0 && (
                  <MenuItem disabled>No notifications</MenuItem>
                )}
                {notifications.map((notif) => (
                  <MenuItem
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    selected={!notif.read}
                  >
                    {notif.message}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <NotificationBanner notifications={bannerNotifications} onClose={handleMarkAsRead} />
    </>
  );
}; 