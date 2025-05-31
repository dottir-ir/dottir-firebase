import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService, Notification } from '../../services/NotificationService';
import { NotificationBanner } from '../notifications/NotificationBanner';
export const Header = () => {
    const { currentUser } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [bannerNotifications, setBannerNotifications] = useState([]);
    useEffect(() => {
        if (currentUser) {
            notificationService.getUserNotifications(currentUser.id).then((notifs) => {
                setNotifications(notifs);
                setBannerNotifications(notifs.filter((n) => !n.read));
            });
        }
    }, [currentUser]);
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMarkAsRead = async (id) => {
        await notificationService.markNotificationAsRead(id);
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        setBannerNotifications((prev) => prev.filter((n) => n.id !== id));
    };
    return (_jsxs(_Fragment, { children: [_jsx(AppBar, { position: "static", children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", sx: { flexGrow: 1 }, children: "Dottir" }), currentUser && (_jsxs(_Fragment, { children: [_jsx(IconButton, { color: "inherit", onClick: handleOpen, children: _jsx(Badge, { badgeContent: notifications.filter((n) => !n.read).length, color: "error", children: _jsx(NotificationsIcon, {}) }) }), _jsxs(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleClose, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, children: [notifications.length === 0 && (_jsx(MenuItem, { disabled: true, children: "No notifications" })), notifications.map((notif) => (_jsx(MenuItem, { onClick: () => handleMarkAsRead(notif.id), selected: !notif.read, children: notif.message }, notif.id)))] })] }))] }) }), _jsx(NotificationBanner, { notifications: bannerNotifications, onClose: handleMarkAsRead })] }));
};
