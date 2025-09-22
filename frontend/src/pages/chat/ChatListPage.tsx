import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Paper, Badge, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

const ChatListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      const mockConversations: Conversation[] = [
        { id: 'conv1', otherUser: { id: 'user2', name: 'Ali Ahmed' }, lastMessage: { content: 'Hello there!', timestamp: new Date().toISOString() }, unreadCount: 2 },
        { id: 'conv2', otherUser: { id: 'user3', name: 'Fatima Saleh' }, lastMessage: { content: 'See you tomorrow.', timestamp: new Date(Date.now() - 86400000).toISOString() }, unreadCount: 0 },
      ];
      setConversations(mockConversations);
    };
    fetchConversations();
  }, [user]);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>{t('conversations')}</Typography>
      <List>
        {conversations.map((conv, index) => (
          <React.Fragment key={conv.id}>
            <ListItem button onClick={() => handleConversationClick(conv.id)}>
              <ListItemAvatar>
                <Avatar>{conv.otherUser.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={conv.otherUser.name}
                secondary={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {conv.lastMessage.content}
                  </Typography>
                }
              />
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {conv.unreadCount > 0 && (
                  <Badge badgeContent={conv.unreadCount} color="primary" sx={{ ml: 2 }} />
                )}
              </Box>
            </ListItem>
            {index < conversations.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ChatListPage;
