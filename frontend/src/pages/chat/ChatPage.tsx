import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../api/socket';
import { api } from '../../api/api';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, ListItemText, Avatar, CircularProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  createdAt: string;
  sender: { name: string; };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://full-accounting-backend.onrender.com';

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    socket.emit('joinRoom', conversationId);

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string, type: 'text' | 'image' | 'audio') => {
    if (content.trim() && user && conversationId) {
      const messagePayload = {
        conversationId,
        content,
        type,
      };
      socket.emit('sendMessage', messagePayload);
      if (type === 'text') {
        setNewMessage('');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await api.post('/uploads', formData);
      const fileType = file.type.startsWith('image/') ? 'image' : 'audio';
      sendMessage(data.url, fileType);
    } catch (error) {
      console.error("Upload error:", error);
      setError('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
          const event = { target: { files: [audioFile] } } as unknown as React.ChangeEvent<HTMLInputElement>;
          await handleFileUpload(event);
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setError("Microphone access was denied.");
      }
    }
    setIsRecording(!isRecording);
  };

  const renderMessageContent = (msg: Message) => {
    const fullUrl = msg.content.startsWith('/uploads') ? `${API_BASE_URL}${msg.content}` : msg.content;
    switch (msg.type) {
      case 'image': return <img src={fullUrl} alt="uploaded content" style={{ maxWidth: '200px', borderRadius: '10px' }} />;
      case 'audio': return <audio controls src={fullUrl} />;
      default: return <ListItemText primary={msg.content} />;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
        <Typography variant="h6">Chat</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <ListItem key={msg.id} sx={{ justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: msg.senderId === user?.id ? 'row-reverse' : 'row' }}>
              <Avatar sx={{ mx: 1 }}>{msg.sender?.name?.charAt(0) || 'U'}</Avatar>
              <Paper elevation={1} sx={{ p: msg.type === 'text' ? 1.5 : 0.5, borderRadius: '20px', bgcolor: msg.senderId === user?.id ? 'primary.main' : 'grey.300', color: msg.senderId === user?.id ? 'primary.contrastText' : 'text.primary' }}>
                {renderMessageContent(msg)}
              </Paper>
            </Box>
          </ListItem>
        ))}
        {uploading && <CircularProgress sx={{ alignSelf: 'center', my: 2 }} />}
        <div ref={messagesEndRef} />
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*,audio/*" />
        <IconButton onClick={() => fileInputRef.current?.click()}><AttachFileIcon /></IconButton>
        <IconButton onClick={handleRecord}>{isRecording ? <StopIcon color="error" /> : <MicIcon />}</IconButton>
        <TextField fullWidth variant="outlined" placeholder={t('type_a_message')} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage, 'text')} />
        <IconButton color="primary" onClick={() => sendMessage(newMessage, 'text')} sx={{ ml: 1 }}><SendIcon /></IconButton>
      </Box>
    </Paper>
  );
};

export default ChatPage;
