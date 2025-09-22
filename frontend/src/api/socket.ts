import { io } from 'socket.io-client';

// Use the backend URL from environment variables, with a fallback for local development
const SOCKET_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We will connect manually after login
  withCredentials: true,
});

socket.on('connect_error', (err) => {
  console.error(`Socket connection error: ${err.message}`);
});
