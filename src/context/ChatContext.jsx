import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const ChatContext = createContext();

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
        loading: false
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.chatId]: action.payload
        }
      };
    
    case 'ADD_MESSAGE':
      const chatId = action.payload.chat || action.payload.chatId;
      console.log('ADD_MESSAGE reducer called:', { payload: action.payload, chatId });
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), action.payload]
        },
        conversations: state.conversations.map(conv =>
          conv._id === chatId
            ? {
                ...conv,
                lastMessage: {
                  content: action.payload.content,
                  timestamp: action.payload.createdAt,
                  sender: action.payload.sender
                },
                updatedAt: action.payload.createdAt
              }
            : conv
        )
      };
    
    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChat: action.payload
      };
    
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.chatId]: action.payload
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations]
      };
    
    default:
      return state;
  }
};

const initialState = {
  conversations: [],
  messages: {},
  activeChat: null,
  typingUsers: {},
  loading: true
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    let pollInterval;
    
    if (user && state.activeChat) {
      console.log('Starting message polling for chat:', state.activeChat._id);
      pollInterval = setInterval(async () => {
        try {
          const response = await api.get(`/chat/${state.activeChat._id}/messages`);
          const newMessages = response.data.messages || [];
          const currentMessages = state.messages[state.activeChat._id] || [];
          if (newMessages.length > currentMessages.length) {
            console.log('Found new messages, updating...');
            dispatch({ 
              type: 'SET_MESSAGES', 
              chatId: state.activeChat._id, 
              payload: newMessages 
            });
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }, 3000); 
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user, state.activeChat]);

  const fetchConversations = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/chat/conversations');
      dispatch({ type: 'SET_CONVERSATIONS', payload: response.data || [] });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      dispatch({ type: 'SET_CONVERSATIONS', payload: [] });
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log('Fetching messages for chatId:', chatId);
      const response = await api.get(`/chat/${chatId}/messages`);
      console.log('Messages response:', response.data);
      dispatch({ 
        type: 'SET_MESSAGES', 
        chatId, 
        payload: response.data.messages || [] 
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (chatId, content, messageType = 'text') => {
    try {
      console.log('Sending message:', { chatId, content, messageType });
      const response = await api.post(`/chat/${chatId}/messages`, {
        content,
        messageType
      });
      
      console.log('Message sent response:', response.data);
      dispatch({ type: 'ADD_MESSAGE', payload: response.data });

      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const createChat = async (participantId, sessionId = null) => {
    try {
      const response = await api.post('/chat/create', {
        participantId,
        sessionId
      });

      dispatch({ type: 'ADD_CONVERSATION', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    }
  };

  const setActiveChat = (chat) => {
    console.log('Setting active chat:', chat);
  
    if (chat) {
      console.log('Switching to chat:', chat._id);
      if (!state.messages[chat._id]) {
        console.log('Messages not loaded for chat, fetching...');
        fetchMessages(chat._id);
      } else {
        console.log('Messages already loaded for chat:', state.messages[chat._id].length);
      }
    }

    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
  };

  const startTyping = (chatId) => {
    console.log('Typing indicator not implemented in simple polling mode');
  };

  const stopTyping = (chatId) => {
    console.log('Typing indicator not implemented in simple polling mode');
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    ...state,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createChat,
    setActiveChat,
    startTyping,
    stopTyping
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
