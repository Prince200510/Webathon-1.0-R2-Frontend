import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users,  UserCheck,  Settings,  BarChart3,  Shield,  LogOut, Calendar, BookOpen, TrendingUp, Eye, DollarSign, Activity, Clock, CheckCircle, AlertCircle, Star, MessageSquare, Download, Filter, ChevronRight, Crown, Zap, Target, Award, Bell, Search, MoreVertical, ArrowUp, ArrowDown, Plus} from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { useAdminActivityTracker } from '../../hooks/useAdminActivityTracker';

const AdminDashboard = () => {
  useAdminActivityTracker();

  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMentors: 0,
    sessionsToday: 0,
    revenue: 0
  });
  const [sosStats, setSOSStats] = useState({
    pending: 0,
    resolved: 0,
    total: 0,
    recent24h: 0
  });
  const [sosRequests, setSOSRequests] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsResponse = await adminApi.get('/admin/dashboard/stats');
      setStats(statsResponse.data);
      const activityResponse = await adminApi.get('/admin/dashboard/activity');
      setRecentActivity(activityResponse.data);
      try {
        const sosResponse = await adminApi.get('/admin/sos-requests?limit=5');
        setSOSRequests(sosResponse.data.data.sosRequests || []);
        setSOSStats({
          pending: sosResponse.data.data.pendingCount || 0,
          resolved: sosResponse.data.data.resolvedCount || 0,
          total: sosResponse.data.data.total || 0,
          recent24h: sosResponse.data.data.sosRequests?.filter(req => {
            const createdAt = new Date(req.createdAt);
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return createdAt > twentyFourHoursAgo;
          }).length || 0
        });
        } catch (sosError) {
          console.error('Error fetching SOS requests:', sosError);
          setSOSStats({ pending: 0, resolved: 0, total: 0, recent24h: 0 });
          setSOSRequests([]);
        }    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const handleResolveSOSRequest = async (sosRequestId) => {
    try {
      await adminApi.put(`/admin/sos-requests/${sosRequestId}/resolve`, {
        adminNotes: 'Resolved by admin directly via phone call'
      });
      fetchDashboardData();
      
      alert('SOS request marked as resolved successfully!');
    } catch (error) {
      console.error('Error resolving SOS request:', error);
      alert('Failed to resolve SOS request. Please try again.');
    }
  };

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const StatCard = ({ title, value, icon: Icon, color, change, changeType, subtitle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            {change && (
              <div className={`flex items-center text-xs font-semibold ${
                changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {changeType === 'increase' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {change}
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {loading ? (
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
            ) : (
              value
            )}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome back, {adminUser.profile?.firstName || 'Admin'}!</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{adminUser.email === 'princemaurya@gmail.com' ? 'System Administrator' : 'Administrator'}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><LogOut className="h-4 w-4 mr-2" />Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Platform Overview</h2>
            <p className="text-gray-600 dark:text-gray-400">Monitor your EdTech platform's performance and activities</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            change="+12%"
            changeType="increase"
            subtitle="Active learners on platform"
          />
          <StatCard
            title="Active Mentors"
            value={stats.activeMentors}
            icon={UserCheck}
            color="bg-gradient-to-r from-green-500 to-green-600"
            change="+8%"
            changeType="increase"
            subtitle="Approved and teaching"
          />
          <StatCard
            title="Sessions Today"
            value={stats.sessionsToday}
            icon={Calendar}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            change="+5%"
            changeType="increase"
            subtitle="Learning sessions conducted"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            change="+15%"
            changeType="increase"
            subtitle="Total platform earnings"
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
            Emergency SOS Requests
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Pending Requests"
            value={sosStats.pending}
            icon={AlertCircle}
            color="bg-gradient-to-r from-red-500 to-red-600"
            subtitle="Awaiting admin response"
          />
          <StatCard
            title="Resolved Today"
            value={sosStats.resolved}
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
            subtitle="Successfully completed"
          />
          <StatCard
            title="Recent (24h)"
            value={sosStats.recent24h}
            icon={Clock}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            subtitle="Last 24 hours"
          />
        </div>
        {sosRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                Recent SOS Requests
              </h3>
              <Link 
                to="/admin/sos-requests" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {sosRequests.slice(0, 5).map((request) => (
                <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      request.status === 'pending' ? 'bg-red-100 dark:bg-red-900/30' :
                      request.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {request.status === 'pending' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                      {request.status === 'resolved' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {request.student.name} - {request.subject}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.urgency === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          request.urgency === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {request.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(request.createdAt).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📧 {request.student.email}</span>
                          {request.student.phone && (
                            <span className="text-blue-600 dark:text-blue-400">
                              📞 {request.student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {request.student.phone && request.status === 'pending' && (
                      <a 
                        href={`tel:${request.student.phone}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center"
                      >
                        📞 Call
                      </a>
                    )}
                    {request.status === 'pending' && (
                      <button 
                        onClick={() => handleResolveSOSRequest(request._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        ✅ Mark Resolved
                      </button>
                    )}
                    {request.status === 'resolved' && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✅ Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Completion Rate"
            value="94.5%"
            icon={Target}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            change="+2.3%"
            changeType="increase"
            subtitle="Average course completion"
          />
          <StatCard
            title="Student Satisfaction"
            value="4.8/5"
            icon={Star}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            change="+0.2"
            changeType="increase"
            subtitle="Based on reviews"
          />
          <StatCard
            title="Response Time"
            value="< 2min"
            icon={Zap}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
            change="-30s"
            changeType="increase"
            subtitle="Average mentor response"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/mentors"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              Mentor Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Approve new mentors, manage existing ones, and monitor their performance
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {stats.activeMentors} Active
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">3 Pending Approval</span>
            </div>
          </Link>

          <Link
            to="/admin/administrators"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              Administrator Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage admin users, set permissions, and control system access
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                5 Admins
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">All Active</span>
            </div>
          </Link>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              System Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View detailed platform usage statistics and performance metrics
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                Real-time
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Updated now</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group">
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Add New Course</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">Send Announcement</span>
                </div>
                <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Export Reports</span>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Manage Certificates</span>
                </div>
                <ChevronRight className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Server Status</p>
                    <p className="text-xs text-green-700 dark:text-green-300">All systems operational</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  99.9%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Database Performance</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Optimal response times</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  &lt;2ms
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Storage Usage</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">78% of quota used</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
                  78%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Latest platform activities and updates
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Activity</h4>
                  <p className="text-gray-500 dark:text-gray-400">Platform activities will appear here once users start interacting</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className={`p-3 rounded-xl ${
                      activity.type === 'mentor_approved' ? 'bg-green-100 dark:bg-green-900/30' :
                      activity.type === 'user_registered' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'session_completed' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      activity.type === 'payment_received' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {activity.type === 'mentor_approved' && <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />}
                      {activity.type === 'user_registered' && <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'session_completed' && <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                      {activity.type === 'payment_received' && <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                      {!['mentor_approved', 'user_registered', 'session_completed', 'payment_received'].includes(activity.type) && 
                        <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.timeAgo}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      {activity.metadata && (
                        <div className="flex items-center mt-2 space-x-2">
                          {activity.metadata.amount && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                              +${activity.metadata.amount}
                            </span>
                          )}
                          {activity.metadata.rating && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              {activity.metadata.rating}/5
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {recentActivity.length > 0 && (
              <div className="mt-6 text-center">
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center mx-auto">
                  View All Activities
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
