import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Alert, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Notification } from '../../services/NotificationService';
export const NotificationBanner = ({ notifications, onClose }) => {
    if (!notifications.length)
        return null;
    return (_jsx(Stack, { spacing: 2, sx: { position: 'fixed', top: 16, right: 16, zIndex: 1400 }, children: notifications.map((notif) => (_jsx(Alert, { severity: notif.type, action: _jsx(IconButton, { "aria-label": "close", color: "inherit", size: "small", onClick: () => onClose(notif.id), children: _jsx(CloseIcon, { fontSize: "inherit" }) }), sx: { minWidth: 300 }, children: notif.message }, notif.id))) }));
};
