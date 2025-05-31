import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const theme = useTheme();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['patient', 'doctor', 'admin'],
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: `/profile/${currentUser?.id}`,
      roles: ['patient', 'doctor', 'admin'],
    },
    {
      text: 'Upload Case',
      icon: <AddCircleIcon />,
      path: '/upload',
      roles: ['doctor'],
    },
    {
      text: 'Verification',
      icon: <VerifiedUserIcon />,
      path: '/verification',
      roles: ['doctor'],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        {menuItems
          .filter((item) => item.roles.includes(currentUser?.role || ''))
          .map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              selected={location.pathname === item.path}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
}; 