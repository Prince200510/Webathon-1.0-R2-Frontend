import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell,  X,  Check,  BookOpen,  MessageCircle,  Calendar,  CreditCard, Star, AlertCircle, Download, User, Trash2} from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students/notifications?limit=15', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/students/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/students/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notif => notif._id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_resource':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'session_booked':
      case 'session_cancelled':
      case 'session_reminder':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'payment_received':
        return <CreditCard className="w-5 h-5 text-yellow-500" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'chat_message':
        return <MessageCircle className="w-5 h-5 text-indigo-500" />;
      case 'mentor_available':
        return <User className="w-5 h-5 text-teal-500" />;
      case 'system_announcement':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-blue-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const NotificationItem = ({ notification }) => (
    <div
      className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} transition-all duration-200 hover:shadow-md ${
        isDarkMode 
          ? notification.isRead 
            ? 'bg-gray-800 hover:bg-gray-750' 
            : 'bg-gray-700 hover:bg-gray-650'
          : notification.isRead 
            ? 'bg-gray-50 hover:bg-gray-100' 
            : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } ${!notification.isRead ? 'font-bold' : ''}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {notification.message}
              </p>
              
              {notification.type === 'new_resource' && notification.data?.resourceTitle && (
                <div className={`mt-2 p-2 rounded ${
                  isDarkMode ? 'bg-gray-600' : 'bg-blue-50'
                }`}>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-blue-700'
                  }`}>
                    Resource: {notification.data.resourceTitle}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-blue-600'
                  }`}>
                    Subject: {notification.data.subject}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                
                <div className="flex items-center space-x-2">
                  {notification.sentViaWhatsApp && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                      WhatsApp
                    </span>
                  )}
                  
                  {notification.priority === 'urgent' && (
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification._id);
                  }}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  title="Mark as read"
                >
                  <Check className="w-4 h-4 text-green-500" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this notification?')) {
                    deleteNotification(notification._id);
                  }
                }}
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-200 text-red-500'
                }`}
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              
              {notification.isRead && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className={`absolute right-0 top-0 h-full w-full max-w-md shadow-xl transform transition-transform duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Notifications
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`flex border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {['all', 'unread', 'read'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                filter === filterType
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                    : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && (
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-32 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Bell className="w-8 h-8 mb-2" />
              <p className="text-sm">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification._id} notification={notification} />
              ))}
            </div>
          )}
        </div>

        <div className={`p-4 border-t space-y-2 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => {
              const unreadNotifications = notifications.filter(n => !n.isRead);
              unreadNotifications.forEach(notification => 
                markAsRead(notification._id)
              );
            }}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Mark All as Read
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all read notifications?')) {
                const readNotifications = notifications.filter(n => n.isRead);
                readNotifications.forEach(notification => 
                  deleteNotification(notification._id)
                );
              }
            }}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Delete All Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
