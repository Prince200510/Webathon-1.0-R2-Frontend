import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';
import ChatInterface from '../../components/ChatInterface';

const ChatPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { 
    conversations, 
    activeChat, 
    setActiveChat, 
    loading
  } = useChat();

  const [selectedChatId, setSelectedChatId] = useState(null);

  const getParticipantName = (participant) => {
    if (participant?.profile?.firstName) {
      return `${participant.profile.firstName} ${participant.profile.lastName || ''}`.trim();
    }
    return participant?.name || 'Unknown User';
  };

  const getOtherParticipant = (chat) => {
    const otherParticipant = chat.participants?.find(p => p._id !== user._id);
    if (otherParticipant) {
      return {
        ...otherParticipant,
        name: getParticipantName(otherParticipant),
        profilePicture: otherParticipant.profile?.profilePicture || otherParticipant.profilePicture
      };
    }
    return { name: 'Unknown User', _id: null };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleChatSelect = (chat) => {
    setSelectedChatId(chat._id);
    setActiveChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    setActiveChat(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Chat List Sidebar */}
      <div className={`${selectedChatId ? 'hidden lg:block' : ''} w-full lg:w-1/3 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
        
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Messages
            </h1>
            <div className="flex items-center space-x-2">
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className={`mt-2 text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No messages yet
              </h3>
              <p className={`mt-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Start a conversation with a mentor or student.
              </p>
            </div>
          ) : (
            conversations.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const isActive = selectedChatId === chat._id;
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
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } cursor-pointer hover:${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors ${
                    isActive ? (isDarkMode ? 'bg-blue-900' : 'bg-blue-50') : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {otherUser?.profile?.profilePicture ? (
                        <img
                          src={otherUser.profile.profilePicture}
                          alt={otherUser?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getProfileColor(otherUser?.name)}`}>
                          <span className="text-lg">
                            {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        } truncate`}>
                          {otherUser?.name}
                        </p>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                        </p>
                      </div>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      } truncate`}>
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className={`${selectedChatId ? '' : 'hidden lg:flex'} flex-1 flex flex-col`}>
        {selectedChatId ? (
          <ChatInterface
            chatId={selectedChatId}
            onBack={handleBackToList}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className={`mt-2 text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Select a conversation
              </h3>
              <p className={`mt-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Choose a chat from the sidebar to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
