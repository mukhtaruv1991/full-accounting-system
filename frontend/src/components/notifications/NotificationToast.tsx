import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, Typography } from '@mui/material';

const socket = io('http://localhost:5000'); // تأكد من أن هذا هو عنوان الخادم الصحيح

export const NotificationToast: React.FC = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    socket.on('newJournalEntry', (data: string) => {
      setMessage(data);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); // إخفاء الإشعار بعد 5 ثواني
    });

    return () => {
      socket.off('newJournalEntry');
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        zIndex: 9999,
        transition: 'opacity 0.5s ease-in-out',
        opacity: visible ? 1 : 0,
      }}
    >
      <Typography>{message}</Typography>
    </Box>
  );
};
