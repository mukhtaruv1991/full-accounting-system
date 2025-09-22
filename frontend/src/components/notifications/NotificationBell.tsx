import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localApi } from '../../api/localApi';
import { io, Socket } from 'socket.io-client';
import { IconButton, Badge, Menu, MenuItem, Typography, ListItemIcon, ListItemText, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user?.id) {
      // Connect to WebSocket server with userId
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        query: { userId: user.id },
      });
      setSocket(newSocket);

      // Fetch initial notifications
      localApi.get(`/notifications`).then(setNotifications).catch(console.error);

      // Listen for new notifications
      newSocket.on('new_notification', (newNotification: Notification) => {
        setNotifications(prev => [newNotification, ...prev]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await localApi.patch(`/notifications/${notificationId}/read`, {});
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const dateLocale = i18n.language === 'ar' ? ar : enUS;

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenMenu}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{ sx: { width: 360, maxWidth: '100%' } }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>Notifications</Typography>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem onClick={handleCloseMenu}>No new notifications</MenuItem>
        ) : (
          notifications.map(notification => (
            <MenuItem
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              sx={{ backgroundColor: notification.isRead ? 'transparent' : 'action.hover', whiteSpace: 'normal' }}
            >
              <ListItemText
                primary={notification.message}
                secondary={formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: dateLocale })}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
