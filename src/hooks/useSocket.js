import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (user) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user?._id) {
      socket.current = io(import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com', {
        transports: ['websocket', 'polling']
      });

      socket.current.on('connect', () => {
        console.log('Connected to server:', socket.current.id);
        setIsConnected(true);
        socket.current.emit('user_connected', user._id);
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      socket.current.on('user_online', (userId) => {
        setOnlineUsers(prev => new Set([...prev, userId]));
      });

      socket.current.on('user_offline', (userId) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [user?._id]);

  const joinChat = (chatId) => {
    if (socket.current && isConnected) {
      socket.current.emit('join_chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socket.current && isConnected) {
      socket.current.emit('leave_chat', chatId);
    }
  };

  const sendMessage = (data) => {
    if (socket.current && isConnected) {
      socket.current.emit('send_message', data);
    }
  };

  const onReceiveMessage = (callback) => {
    if (socket.current) {
      socket.current.on('receive_message', callback);
      socket.current.on('new-message', callback); 
      return () => {
        socket.current.off('receive_message', callback);
        socket.current.off('new-message', callback);
      };
    }
  };

  const onNewMessageNotification = (callback) => {
    if (socket.current) {
      socket.current.on('new_message_notification', callback);
      return () => socket.current.off('new_message_notification', callback);
    }
  };

  const on = (event, callback) => {
    if (socket.current) {
      socket.current.on(event, callback);
      return () => socket.current.off(event, callback);
    }
  };

  const startTyping = (chatId) => {
    if (socket.current && isConnected) {
      socket.current.emit('typing_start', { chatId });
    }
  };

  const stopTyping = (chatId) => {
    if (socket.current && isConnected) {
      socket.current.emit('typing_stop', { chatId });
    }
  };

  const onUserTyping = (callback) => {
    if (socket.current) {
      socket.current.on('user_typing', callback);
      return () => socket.current.off('user_typing', callback);
    }
  };

  return {
    socket: socket.current,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendMessage,
    onReceiveMessage,
    onNewMessageNotification,
    startTyping,
    stopTyping,
    onUserTyping,
    on
  };
};
