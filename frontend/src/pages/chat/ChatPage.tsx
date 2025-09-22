import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../api/socket';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages for the conversation
    // In a real app, this would come from localApi or a direct API call
    const initialMessages: Message[] = [
      { id: '1', senderId: 'user2', content: 'Hello there!', timestamp: new Date().toISOString(), status: 'read' },
      { id: '2', senderId: user!.id, content: 'Hi! How are you?', timestamp: new Date().toISOString(), status: 'read' },
    ];
    setMessages(initialMessages);

    socket.on('receiveMessage', (message: Message) => {
      if (message.senderId !== user?.id) { // Basic check to avoid echoing own messages
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      const message: Message = {
        id: new Date().toISOString(), // Temporary ID
        senderId: user.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      socket.emit('sendMessage', { conversationId, message });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <Paper sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">Chat with [Other User]</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <ListItem key={msg.id} sx={{ justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: msg.senderId === user?.id ? 'row-reverse' : 'row' }}>
              <Avatar sx={{ mx: 1 }}>{msg.senderId === user?.id ? 'Y' : 'O'}</Avatar>
              <Paper elevation={1} sx={{ p: 1.5, borderRadius: '20px', bgcolor: msg.senderId === user?.id ? 'primary.main' : 'grey.300', color: msg.senderId === user?.id ? 'primary.contrastText' : 'text.primary' }}>
                <ListItemText primary={msg.content} />
              </Paper>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('type_a_message')}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatPage;
