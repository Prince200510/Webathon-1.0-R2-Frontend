import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import '../styles/chat.css';
import { Send,  Paperclip,  Smile,  MoreVertical, Phone, Video, Search, ArrowLeft} from 'lucide-react';

const ChatInterface = ({ chatId, onBack }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { messages,  activeChat,  sendMessage,  startTyping,  stopTyping,  typingUsers} = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatMessages = messages[chatId] || [];
  const otherParticipant = activeChat?.participants?.find(p => p._id !== user?._id);
  const isTyping = typingUsers[chatId]?.length > 0;

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleScroll = (e) => {
    const container = e.target;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    setShowScrollToBottom(!isAtBottom && chatMessages.length > 5);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !chatId) return;

    try {
      setSending(true);
      await sendMessage(chatId, newMessage.trim());
      setNewMessage('');
      stopTyping(chatId);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!typingTimer) {
      startTyping(chatId);
    }

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    const timer = setTimeout(() => {
      stopTyping(chatId);
      setTypingTimer(null);
    }, 1000);

    setTypingTimer(timer);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getParticipantName = (participant) => {
    if (!participant) return 'Unknown User';
    if (typeof participant === 'string') {
      return 'User'; 
    }
    
    if (participant?.profile?.firstName) {
      return `${participant.profile.firstName} ${participant.profile.lastName || ''}`.trim();
    }
    return participant?.name || 'Unknown User';
  };

  const MessageBubble = ({ message }) => {
    let senderId = null;
    if (typeof message.sender === 'string') {
      senderId = message.sender;
    } else if (message.sender && message.sender._id) {
      senderId = message.sender._id;
    }
    
    const isOwn = senderId === user?._id;
    const senderName = getParticipantName(message.sender);
    const getProfileInitial = (name) => {
      if (!name) return '?';
      return name.charAt(0).toUpperCase();
    };
  
    const getProfileColor = (name) => {
      if (!name) return 'bg-gray-500';
      const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
        'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
      ];
      const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
      return colors[hash % colors.length];
    };
    
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end ${isOwn ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          {!isOwn && (
            <div className="flex-shrink-0">
              {message.sender.profile?.profilePicture ? (
                <img
                  src={message.sender.profile.profilePicture}
                  alt={senderName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getProfileColor(senderName)}`}>
                  {getProfileInitial(senderName)}
                </div>
              )}
            </div>
          )}
          
          <div className={`relative px-3 py-2 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-md'
              : isDarkMode
                ? 'bg-gray-700 text-white rounded-bl-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}>
            {!isOwn && (
              <p className={`text-xs mb-1 font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {senderName}
              </p>
            )}
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
            <div className={`flex items-center justify-end space-x-1 mt-1`}>
              <p className={`text-xs ${
                isOwn
                  ? 'text-blue-100'
                  : isDarkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`}>
                {formatTime(message.createdAt)}
              </p>
              {isOwn && (
                <div className="flex space-x-1">
                  <svg className={`w-3 h-3 ${message.read ? 'text-blue-200' : 'text-blue-100'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  <svg className={`w-3 h-3 -ml-1 ${message.read ? 'text-blue-200' : 'text-blue-100'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!activeChat) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className={`p-1 rounded-lg transition-colors lg:hidden ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="relative">
            {otherParticipant?.profile?.profilePicture ? (
              <img
                src={otherParticipant.profile.profilePicture}
                alt={getParticipantName(otherParticipant)}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium ${
                (() => {
                  const name = getParticipantName(otherParticipant);
                  const colors = [
                    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
                    'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
                  ];
                  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
                  return colors[hash % colors.length];
                })()
              }`}>
                {getParticipantName(otherParticipant).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <h3 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {getParticipantName(otherParticipant)}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {isTyping ? 'typing...' : 'Tap to view info'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-white' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Phone className="w-5 h-5" />
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-white' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <Video className="w-5 h-5" />
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-white' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}>
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={`chat-scrollbar chat-container h-full overflow-y-auto overflow-x-hidden p-4 space-y-4 ${
            isDarkMode 
              ? 'bg-gray-900' 
              : 'bg-gray-50'
          }`} 
          style={{
            backgroundImage: isDarkMode 
              ? 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23374151" fill-opacity="0.03"%3E%3Cpath d="M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"/%3E%3C/g%3E%3C/svg%3E")'
              : 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23e5e7eb" fill-opacity="0.3"%3E%3Cpath d="M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"/%3E%3C/g%3E%3C/svg%3E")'
          }}
        >
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`text-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {(() => {
              const groupedMessages = chatMessages.reduce((groups, message) => {
                const date = formatDate(message.createdAt);
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(message);
                return groups;
              }, {});

              return Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-4">
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {date}
                    </div>
                  </div>
                  {dateMessages.map((message, index) => (
                    <div key={message._id} className="message-enter">
                      <MessageBubble message={message} />
                    </div>
                  ))}
                </div>
              ));
            })()}
            <div ref={messagesEndRef} />
          </>
        )}
        </div>
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className={`scroll-to-bottom absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
            }`}
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      <div className={`p-4 border-t ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 flex items-end space-x-2">
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                rows={1}
                className={`w-full px-4 py-2 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            
            <button
              type="button"
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-2 rounded-lg transition-colors ${
              !newMessage.trim() || sending
                ? isDarkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
