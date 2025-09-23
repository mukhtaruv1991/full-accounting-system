import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { localApi } from '../../api/localApi'; // Using localApi for friends
import { api } from '../../api/api'; // Using real api for conversations
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Paper, Badge, Box, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface Conversation {
  id: string;
  members: { id: string; name: string; }[];
  messages: { content: string; createdAt: string; }[];
}

const ChatListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get('/chat/conversations');
      setConversations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>{t('conversations')}</Typography>
      <List>
        {conversations.length === 0 ? (
          <Typography sx={{ textAlign: 'center', p: 2 }}>{t('no_conversations')}</Typography>
        ) : (
          conversations.map((conv, index) => {
            const otherUser = conv.members[0]; // The backend ensures this is the other user
            const lastMessage = conv.messages[0];
            const dateLocale = i18n.language === 'ar' ? ar : enUS;

            return (
              <React.Fragment key={conv.id}>
                <ListItem button onClick={() => handleConversationClick(conv.id)}>
                  <ListItemAvatar>
                    <Avatar>{otherUser?.name?.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={otherUser?.name || 'Unknown User'}
                    secondary={
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {lastMessage?.content || 'No messages yet'}
                      </Typography>
                    }
                  />
                  {lastMessage && (
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true, locale: dateLocale })}
                    </Typography>
                  )}
                </ListItem>
                {index < conversations.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })
        )}
      </List>
    </Paper>
  );
};

export default ChatListPage;
