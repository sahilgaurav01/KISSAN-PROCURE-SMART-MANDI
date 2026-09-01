import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});

export const joinCentreRoom = (centreId) => {
  if (centreId) {
    socket.emit('join_centre', centreId);
  }
};

export const leaveCentreRoom = (centreId) => {
  if (centreId) {
    socket.emit('leave_centre', centreId);
  }
};

export const joinUserRoom = (userId) => {
  if (userId) {
    socket.emit('join_user', userId);
  }
};
