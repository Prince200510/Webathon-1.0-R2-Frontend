import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Star, Users, BookOpen, MessageSquare, Plus, Settings, Bell, Search, Filter, Download, Upload, FileText,Video, Zap, Target, Award, TrendingUp, Activity, CheckCircle,AlertCircle, ChevronRight, MoreVertical, Eye, Edit, Trash2,Phone, Mail, MapPin, Globe, Heart, ThumbsUp, Send, Paperclip,X, ChevronDown, User, LogOut, Menu, Check} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/chat.css';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../utils/api';
import { generateAdvancedPDF } from '../../utils/pdfGenerator';

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalStudents: 0
  });
  const [availability, setAvailability] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [resources, setResources] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [resourceType, setResourceType] = useState('ai');
  const [resourceTopic, setResourceTopic] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    isAvailable: true
  });
  const [sessions, setSessions] = useState([]);
  const [sessionFilter, setSessionFilter] = useState('all');
  const [filteredSessions, setFilteredSessions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailability();
    fetchUpcomingSessions();
    fetchRecentReviews();
    fetchResources();
    fetchNotifications();
    fetchStudents();
  }, []);

  useEffect(() => {
    let pollInterval;
    
    if (selectedStudent && currentChatId) {
      console.log('Starting chat polling for student:', selectedStudent._id);
      pollInterval = setInterval(async () => {
        try {
          const since = lastMessageTime || new Date(Date.now() - 60000).toISOString(); // Last minute if no messages
          const response = await api.get(`/mentor/chat/${currentChatId}/recent?since=${since}`);
          
          if (response.data && response.data.length > 0) {
            console.log('Found new messages:', response.data.length);
            setChatMessages(prev => {
              const newMessages = response.data.filter(newMsg => 
                !prev.some(existingMsg => existingMsg._id === newMsg._id)
              );
              if (newMessages.length > 0) {
                setLastMessageTime(newMessages[newMessages.length - 1].createdAt);
                return [...prev, ...newMessages];
              }
              return prev;
            });
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }, 2000); 
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedStudent, currentChatId, lastMessageTime]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      const messagesContainer = document.querySelector('.mentor-chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [chatMessages]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/mentor/dashboard/stats');
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalSessions: 12,
        totalEarnings: 2400,
        averageRating: 4.8,
        completedSessions: 10,
        upcomingSessions: 2,
        totalStudents: 15
      });
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await api.get('/mentor/availability');
      setAvailability(Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailability([
        { _id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { _id: '2', day: 'Wednesday', startTime: '10:00', endTime: '16:00', isAvailable: true },
        { _id: '3', day: 'Friday', startTime: '09:00', endTime: '15:00', isAvailable: true }
      ]);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const response = await api.get('/mentor/sessions/upcoming');
      setUpcomingSessions(Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      setUpcomingSessions([
        {
          _id: '1',
          subject: 'Mathematics',
          student: { profile: { firstName: 'John', lastName: 'Doe' } },
          scheduledAt: new Date(Date.now() + 86400000).toISOString()
        },
        {
          _id: '2',
          subject: 'Physics',
          student: { profile: { firstName: 'Jane', lastName: 'Smith' } },
          scheduledAt: new Date(Date.now() + 172800000).toISOString()
        }
      ]);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const response = await api.get('/mentor/reviews/recent');
      setRecentReviews(Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setRecentReviews([
        {
          _id: '1',
          rating: 5,
          comment: 'Excellent teaching! Very clear explanations.',
          student: { profile: { firstName: 'Alice', lastName: 'Johnson' } }
        },
        {
          _id: '2',
          rating: 4,
          comment: 'Great session, learned a lot about calculus.',
          student: { profile: { firstName: 'Bob', lastName: 'Wilson' } }
        }
      ]);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await api.get('/mentor/resources');
      console.log('Resources response:', response.data);
      const resourcesData = response.data?.data?.resources || response.data?.resources || response.data || [];
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([
        {
          _id: '1',
          title: 'Calculus Fundamentals',
          description: 'Complete guide to calculus basics',
          type: 'notes',
          subject: 'Mathematics',
          createdAt: new Date().toISOString(),
          content: '# Calculus Fundamentals\n\nThis is a comprehensive guide to calculus...'
        },
        {
          _id: '2',
          title: 'Physics Laws',
          description: 'Newton\'s laws explained with examples',
          type: 'pdf',
          subject: 'Physics',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/mentor/notifications');
      setNotifications(Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([
        { _id: '1', title: 'New session request', message: 'John Doe requested a session' },
        { _id: '2', title: 'Payment received', message: 'You received $50 for your last session' }
      ]);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/mentor/students');
      setStudents(Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([
        {
          _id: '1',
          profile: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          college: 'MIT',
          subjects: ['Mathematics', 'Physics']
        },
        {
          _id: '2',
          profile: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
          college: 'Stanford',
          subjects: ['Mathematics']
        }
      ]);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mentor/availability', availabilityData);
      fetchAvailability();
      setShowAvailabilityModal(false);
      setAvailabilityData({ day: '', startTime: '', endTime: '', isAvailable: true });
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      let resourceResponse;
      
      if (resourceType === 'ai') {
        resourceResponse = await api.post('/mentor/resources/generate', {
          topic: resourceTopic,
          subject: user.profile?.subjects?.[0] || 'General'
        });
        
        if (resourceResponse.data.success) {
          alert('AI notes generated successfully!');
          try {
            await api.post('/mentor/notify-students', {
              resourceId: resourceResponse.data.data._id,
              resourceTitle: resourceResponse.data.data.title,
              subject: resourceResponse.data.data.subject
            });
            console.log('Students notified successfully');
          } catch (notificationError) {
            console.error('Failed to notify students:', notificationError);
          }
        }
        
      } else if (resourceType === 'upload' && uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', resourceTopic);
        formData.append('subject', user.profile?.subjects?.[0] || 'General');
        formData.append('type', uploadFile.type.includes('pdf') ? 'pdf' : 'document');
        
        resourceResponse = await api.post('/mentor/resources/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (resourceResponse.data.success) {
          alert('Resource uploaded successfully!');
          
          try {
            await api.post('/mentor/notify-students', {
              resourceId: resourceResponse.data.data._id,
              resourceTitle: resourceResponse.data.data.title,
              subject: resourceResponse.data.data.subject
            });
            console.log('Students notified successfully');
          } catch (notificationError) {
            console.error('Failed to notify students:', notificationError);
          }
        }
      }
      
      fetchResources();
      setShowResourceModal(false);
      setResourceTopic('');
      setUploadFile(null);
    } catch (error) {
      console.error('Error creating resource:', error);
      alert(`Failed to create resource: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleStartChat = async (student) => {
    setSelectedStudent(student);
    setShowChatModal(true);
    
    console.log('Starting chat with student:', student._id);
    
    try {
      const response = await api.get(`/mentor/chat/${student._id}`);
      
      if (response.data.chat && response.data.messages) {
        setCurrentChatId(response.data.chat._id);
        setChatMessages(response.data.messages);
    
        if (response.data.messages.length > 0) {
          const lastMessage = response.data.messages[response.data.messages.length - 1];
          setLastMessageTime(lastMessage.createdAt);
        }
      } else {
        setChatMessages(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setChatMessages([
        {
          _id: '1',
          content: 'Hello! How can I help you today?',
          sender: user._id,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleViewResource = async (resource) => {
    console.log('handleViewResource called with:', resource);
    console.log('Resource fileUrl:', resource.fileUrl);
    
    if (resource.fileUrl || resource.type === 'pdf' || resource.type === 'document') {
      try {
        console.log('Calling download API for resource:', resource._id);
        const response = await api.get(`/mentor/resources/${resource._id}/download`, {
          responseType: 'blob'
        });
        
        console.log('Download response received, size:', response.data.size);
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resource.title}.${resource.type === 'pdf' ? 'pdf' : 'txt'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        console.log('File download triggered successfully');
      } catch (error) {
        console.error('Error downloading resource:', error);
        alert('Failed to download resource');
      }
    } else if (resource.content) {
      const blob = new Blob([resource.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resource.title}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } else {
      alert('No downloadable content available for this resource');
    }
  };

  const handleDownloadResource = async (resource) => {
    try {
      if (resource.fileUrl) {
        const response = await api.get(`/mentor/resources/${resource._id}/download`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', resource.title);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (resource.content) {
        generateAdvancedPDF(resource.title, resource.content, resource.subject);
      } else {
        alert('No downloadable content available for this resource');
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Failed to download resource');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const optimisticMessage = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: user._id, 
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    
    setChatMessages(prev => [...prev, optimisticMessage]);
    const messageToSend = newMessage;
    setNewMessage(''); 
    
    try {
      const response = await api.post('/mentor/chat/send', {
        recipientId: selectedStudent._id,
        message: messageToSend
      });
      
      setChatMessages(prev => prev.map(msg => 
        msg.isOptimistic && msg.content === messageToSend 
          ? response.data 
          : msg
      ));
      
      setLastMessageTime(response.data.createdAt);
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => prev.filter(msg => 
        !(msg.isOptimistic && msg.content === messageToSend)
      ));
      setNewMessage(messageToSend); 
      alert('Failed to send message. Please try again.');
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await api.get('/mentor/sessions');
      const sessionsData = response.data?.data?.sessions || response.data?.sessions || response.data || [];
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    }
  };

  const handleAcceptSession = async (sessionId) => {
    try {
      await api.put(`/sessions/${sessionId}/accept`);
      fetchSessions();
      fetchUpcomingSessions();
      alert('Session accepted successfully!');
    } catch (error) {
      console.error('Error accepting session:', error);
      alert('Failed to accept session. Please try again.');
    }
  };

  const handleRejectSession = async (sessionId) => {
    try {
      await api.put(`/sessions/${sessionId}/reject`);
      fetchSessions();
      fetchUpcomingSessions();
      alert('Session rejected successfully!');
    } catch (error) {
      console.error('Error rejecting session:', error);
      alert('Failed to reject session. Please try again.');
    }
  };

  const handleStartSession = (session) => {
    const sessionUrl = `/session/${session._id}`;
    window.open(sessionUrl, '_blank');
  };

  const handleRescheduleSession = async (sessionId) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    const newTime = prompt('Enter new time (HH:MM):');
    
    if (newDate && newTime) {
      try {
        await api.put(`/sessions/${sessionId}/reschedule`, {
          scheduledAt: new Date(`${newDate}T${newTime}`).toISOString()
        });
        fetchSessions();
        fetchUpcomingSessions();
        alert('Session rescheduled successfully!');
      } catch (error) {
        console.error('Error rescheduling session:', error);
        alert('Failed to reschedule session. Please try again.');
      }
    }
  };

  const handleViewSessionDetails = (session) => {
    navigate(`/session-details/${session._id}`);
  };

  const handleContactStudent = (student) => {
    handleStartChat(student);
  };

  useEffect(() => {
    if (sessionFilter === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.status === sessionFilter));
    }
  }, [sessions, sessionFilter]);

  useEffect(() => {
    fetchDashboardData();
    fetchAvailability();
    fetchUpcomingSessions();
    fetchRecentReviews();
    fetchResources();
    fetchNotifications();
    fetchStudents();
    fetchSessions(); 
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>{value}</p>
          {subtitle && <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{subtitle}</p>}
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`
          : `${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {user.profile?.firstName}!
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Mentor Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowResourceModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Resource
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div className="relative">
                <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} relative`}>
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={logout}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats?.totalSessions || 0}
            icon={Calendar}
            color="bg-blue-500"
            change="+12%"
            subtitle="This month"
          />
          <StatCard
            title="Total Earnings"
            value={`$${(stats?.totalEarnings || 0).toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-500"
            change="+8%"
            subtitle="All time"
          />
          <StatCard
            title="Average Rating"
            value={`${(stats?.averageRating || 0).toFixed(1)}/5.0`}
            icon={Star}
            color="bg-yellow-500"
            change="+0.1"
            subtitle="Based on reviews"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="bg-purple-500"
            change="+5%"
            subtitle="Active learners"
          />
        </div>
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <TabButton id="overview" label="Overview" icon={Activity} isActive={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="availability" label="Availability" icon={Clock} isActive={activeTab === 'availability'} onClick={setActiveTab} />
          <TabButton id="sessions" label="Sessions" icon={Calendar} isActive={activeTab === 'sessions'} onClick={setActiveTab} />
          <TabButton id="resources" label="Resources" icon={BookOpen} isActive={activeTab === 'resources'} onClick={setActiveTab} />
          <TabButton id="students" label="Students" icon={Users} isActive={activeTab === 'students'} onClick={setActiveTab} />
          <TabButton id="earnings" label="Earnings" icon={DollarSign} isActive={activeTab === 'earnings'} onClick={setActiveTab} />
        </div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upcoming Sessions
                </h3>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No upcoming sessions scheduled
                  </p>
                ) : (
                  upcomingSessions.map((session) => (
                    <div key={session._id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {session.subject}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            with {session.student?.profile?.firstName} {session.student?.profile?.lastName}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-blue-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {session?.scheduledAt ? new Date(session.scheduledAt).toLocaleDateString() : 'TBD'} at {session?.scheduledAt ? new Date(session.scheduledAt).toLocaleTimeString() : 'TBD'}
                          </div>
                        </div>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600">
                          Join
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Reviews
                </h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-4">
                {recentReviews.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No reviews yet
                  </p>
                ) : (
                  (recentReviews || []).map((review) => (
                    <div key={review._id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {review.rating}/5
                            </span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            "{review.comment}"
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            - {review.student?.profile?.firstName} {review.student?.profile?.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Sessions
              </h3>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSessionFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Sessions
              </button>
              <button
                onClick={() => setSessionFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionFilter === 'pending'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setSessionFilter('confirmed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionFilter === 'confirmed'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setSessionFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sessionFilter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
            <div className="space-y-4">
              {filteredSessions.length === 0 ? (
                <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No sessions found</p>
                  <p className="text-sm">
                    {sessionFilter === 'all' 
                      ? 'You haven\'t received any session bookings yet.'
                      : `No ${sessionFilter} sessions found.`
                    }
                  </p>
                </div>
              ) : (
                filteredSessions.map((session) => (
                  <div key={session._id} className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-all`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {session.student?.profile?.firstName?.charAt(0) || session.student?.name?.charAt(0) || 'S'}
                              {session.student?.profile?.lastName?.charAt(0) || ''}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {session.student?.profile?.firstName && session.student?.profile?.lastName 
                                  ? `${session.student.profile.firstName} ${session.student.profile.lastName}`
                                  : session.student?.name || 'Student'
                                }
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {session.student?.email}
                              </p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            session.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {session.status?.toUpperCase()}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Subject: <span className="font-medium">{session.subject}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Date: <span className="font-medium">
                                {session.scheduledDate ? new Date(session.scheduledDate).toLocaleDateString() : 'TBD'}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Time: <span className="font-medium">{session.startTime} - {session.endTime}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Duration: <span className="font-medium">{session.duration} minutes</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Payment: <span className="font-medium text-green-600">₹{session.price || session.amount || 1}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-purple-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Contact: <span className="font-medium">{session.student?.profile?.phoneNumber || 'Not provided'}</span>
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-600' : 'bg-blue-50'}`}>
                          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Student Contact Information:
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-blue-500" />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {session.student?.email || 'Email not provided'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-green-500" />
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {session.student?.profile?.phoneNumber || 'Phone not provided'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {session.meetingLink && (
                          <div className={`p-3 rounded-lg mb-4 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border ${isDarkMode ? 'border-green-700' : 'border-green-200'}`}>
                            <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                              Video Session Link:
                            </h5>
                            <div className="flex items-center space-x-2">
                              <Video className="w-4 h-4 text-green-500" />
                              <a 
                                href={session.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium underline"
                              >
                                {session.meetingLink}
                              </a>
                              <button
                                onClick={() => navigator.clipboard.writeText(session.meetingLink)}
                                className="text-gray-500 hover:text-gray-600 text-xs"
                                title="Copy link"
                              >
                                📋 Copy
                              </button>
                            </div>
                          </div>
                        )}
                        {(session.description || session.sessionNotes) && (
                          <div className="mb-4">
                            <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Session Notes:
                            </h5>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} italic bg-gray-50 dark:bg-gray-700 p-3 rounded-lg`}>
                              "{session.description || session.sessionNotes}"
                            </p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {session.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptSession(session._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectSession(session._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                          {session.status === 'confirmed' && (
                            <>
                              <button
                                onClick={() => handleStartSession(session)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Start Session
                              </button>
                              <button
                                onClick={() => handleRescheduleSession(session._id)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center"
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Reschedule
                              </button>
                            </>
                          )}
                          {session.meetingLink && (
                            <button
                              onClick={() => window.open(session.meetingLink, '_blank')}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center"
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Join Meeting
                            </button>
                          )}
                          <button
                            onClick={() => handleViewSessionDetails(session)}
                            className={`px-4 py-2 rounded-lg text-sm border transition-colors flex items-center ${
                              isDarkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                          
                          <button
                            onClick={() => handleContactStudent(session.student)}
                            className={`px-4 py-2 rounded-lg text-sm border transition-colors flex items-center ${
                              isDarkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </button>
                          {session.student?.email && (
                            <button
                              onClick={() => window.open(`mailto:${session.student.email}`, '_blank')}
                              className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}

                          {session.student?.profile?.phoneNumber && (
                            <button
                              onClick={() => window.open(`tel:${session.student.profile.phoneNumber}`, '_blank')}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
                              title="Call Student"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Manage Availability
              </h3>
              <button
                onClick={() => setShowAvailabilityModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(availability || []).map((slot) => (
                <div key={slot._id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {slot.day}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      slot.isAvailable 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {slot.startTime} - {slot.endTime}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <button className="text-blue-500 hover:text-blue-600 text-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600 text-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Resources
              </h3>
              <button
                onClick={() => setShowResourceModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Resource
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(resources || []).map((resource) => (
                <div key={resource._id} className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl">
                      {resource.type === 'notes' ? '📝' : resource.type === 'pdf' ? '📄' : '📋'}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      resource.type === 'notes' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      resource.type === 'pdf' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {resource.type}
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {resource.title}
                  </h4>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {resource.subject}
                    </span>
                    <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {resource?.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleDownloadResource(resource)}
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewResource(resource)}
                        className="text-blue-500 hover:text-blue-600"
                        title="Download Resource"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Students
              </h3>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(students || []).map((student) => (
                <div key={student._id} className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name ? student.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) : (student.email?.charAt(0) || 'S')}
                    </div>
                    <div className="ml-3">
                      <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {student.name || student.email || 'Student'}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sessions: {student.totalSessions || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.subjects?.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartChat(student)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </button>
                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Availability Slot
              </h3>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Day
                </label>
                <select
                  value={availabilityData.day}
                  onChange={(e) => setAvailabilityData({...availabilityData, day: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Start Time
                </label>
                <input
                  type="time"
                  value={availabilityData.startTime}
                  onChange={(e) => setAvailabilityData({...availabilityData, startTime: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  End Time
                </label>
                <input
                  type="time"
                  value={availabilityData.endTime}
                  onChange={(e) => setAvailabilityData({...availabilityData, endTime: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={availabilityData.isAvailable}
                  onChange={(e) => setAvailabilityData({...availabilityData, isAvailable: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 mr-2"
                />
                <label htmlFor="isAvailable" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Available for booking
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create Resource
              </h3>
              <button
                onClick={() => setShowResourceModal(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Resource Type
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setResourceType('ai')}
                    className={`flex-1 p-3 border rounded-lg text-center ${
                      resourceType === 'ai'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Zap className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">AI Generate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResourceType('upload')}
                    className={`flex-1 p-3 border rounded-lg text-center ${
                      resourceType === 'upload'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Upload className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Upload</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {resourceType === 'ai' ? 'Topic' : 'Title'}
                </label>
                <input
                  type="text"
                  value={resourceTopic}
                  onChange={(e) => setResourceTopic(e.target.value)}
                  placeholder={resourceType === 'ai' ? 'Enter topic for AI generation' : 'Enter resource title'}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              
              {resourceType === 'upload' && (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Upload File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.txt"
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {resourceType === 'ai' ? 'Generate' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showChatModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full h-[500px] flex flex-col shadow-2xl`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {selectedStudent.profile?.profilePicture ? (
                    <img
                      src={selectedStudent.profile.profilePicture}
                      alt={selectedStudent.profile?.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium ${
                      (() => {
                        const name = selectedStudent.profile?.firstName || 'Student';
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
                          'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
                        ];
                        const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
                        return colors[hash % colors.length];
                      })()
                    }`}>
                      {(selectedStudent.profile?.firstName || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedStudent.profile?.firstName} {selectedStudent.profile?.lastName}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Student
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={`mentor-chat-messages chat-scrollbar chat-container flex-1 p-4 overflow-y-auto overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="space-y-3">
                {(chatMessages || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  (chatMessages || []).map((message) => {
                    let senderId = null;
                    if (typeof message.sender === 'string') {
                      senderId = message.sender;
                    } else if (message.sender && message.sender._id) {
                      senderId = message.sender._id;
                    }
                    
                    const isOwn = senderId === user._id;
                    
                    const messageTime = message?.createdAt ? new Date(message.createdAt) : new Date();
                    const senderInfo = typeof message.sender === 'object' ? message.sender : null;
                    const senderName = isOwn 
                      ? 'You' 
                      : (senderInfo?.name || 
                         `${selectedStudent.profile?.firstName || ''} ${selectedStudent.profile?.lastName || ''}`.trim() ||
                         selectedStudent.name ||
                         'Student');
                    
                    const getProfileInitial = (name) => {
                      if (!name) return 'S';
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
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div className={`flex max-w-xs ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end ${isOwn ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                          {!isOwn && (
                            <div className="flex-shrink-0">
                              {selectedStudent.profile?.profilePicture ? (
                                <img
                                  src={selectedStudent.profile.profilePicture}
                                  alt={senderName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${getProfileColor(senderName)}`}>
                                  {getProfileInitial(senderName)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div
                            className={`relative px-3 py-2 rounded-2xl shadow-sm ${
                              isOwn
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : isDarkMode ? 'bg-gray-700 text-white rounded-bl-md' : 'bg-white text-gray-900 rounded-bl-md border'
                            }`}
                          >
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
                                {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  })
                )}
              </div>
            </div>
            
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className={`w-full px-4 py-2 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
                    } border`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-lg transition-colors ${
                    !newMessage.trim()
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
