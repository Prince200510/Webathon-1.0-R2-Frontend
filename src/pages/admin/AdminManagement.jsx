import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit,  Trash2,  Shield,  UserPlus,  Settings,  Eye,  EyeOff,  Search, Filter, MoreVertical, Crown, Calendar, Mail, User, Users, ChevronDown, Activity, Clock, CheckCircle, XCircle, AlertCircle, LogOut, Bell, ArrowLeft} from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { formatDate } from '../../utils/helpers';
import { getTimeAgo, getActivityStatus } from '../../utils/timeUtils';
import { useAdminActivityTracker } from '../../hooks/useAdminActivityTracker';

const AdminManagement = () => {
  useAdminActivityTracker();

  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    superAdmins: 0
  });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profile: {
      firstName: '',
      lastName: ''
    },
    permissions: {
      canCreateAdmin: false,
      canDeleteAdmin: false,
      canManageUsers: true,
      canApproveMentors: true,
      canViewAnalytics: true,
      canManageContent: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAdmins();
    const interval = setInterval(() => {
      fetchAdmins();
    }, 30000); 
    
    return () => clearInterval(interval);
  }, [currentPage, searchTerm, filterStatus, filterRole]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get(`/admin/admins?page=${currentPage}&limit=10&search=${searchTerm}&status=${filterStatus}&role=${filterRole}`);
      setAdmins(response.data.admins);
      setTotalPages(response.data.totalPages);
      
      const total = response.data.admins.length;
      const active = response.data.admins.filter(admin => admin.adminDetails?.isActive).length;
      const inactive = total - active;
      const superAdmins = response.data.admins.filter(admin => admin.role === 'superadmin').length;
      
      setStats({ total, active, inactive, superAdmins });
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post('/admin/admins', formData);
      fetchAdmins();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create admin:', error);
      alert(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleUpdatePermissions = async (adminId, permissions) => {
    try {
      await adminApi.put(`/admin/admins/${adminId}/permissions`, { permissions });
      fetchAdmins();
      setShowEditModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert(error.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleDeactivateAdmin = async (adminId, adminEmail) => {
    if (adminEmail === 'princemaurya@gmail.com') {
      alert('Cannot deactivate the main system administrator account.');
      return;
    }

    if (window.confirm('Are you sure you want to deactivate this admin account?')) {
      try {
        await adminApi.put(`/admin/admins/${adminId}/deactivate`);
        fetchAdmins();
      } catch (error) {
        console.error('Failed to deactivate admin:', error);
        alert(error.response?.data?.message || 'Failed to deactivate admin');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      profile: {
        firstName: '',
        lastName: ''
      },
      permissions: {
        canCreateAdmin: false,
        canDeleteAdmin: false,
        canManageUsers: true,
        canApproveMentors: true,
        canViewAnalytics: true,
        canManageContent: false
      }
    });
  };

  const handlePermissionChange = (permission, value, isEdit = false) => {
    if (isEdit && selectedAdmin) {
      setSelectedAdmin(prev => ({
        ...prev,
        adminDetails: {
          ...prev.adminDetails,
          permissions: {
            ...prev.adminDetails.permissions,
            [permission]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: value
        }
      }));
    }
  };

  const getPermissionColor = (hasPermission) => {
    return hasPermission 
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'admin':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const permissionLabels = {
    canCreateAdmin: 'Create Admins',
    canDeleteAdmin: 'Delete Admins',
    canManageUsers: 'Manage Users',
    canApproveMentors: 'Approve Mentors',
    canViewAnalytics: 'View Analytics',
    canManageContent: 'Manage Content'
  };

  const getPermissionCount = (permissions) => {
    if (!permissions) return 0;
    return Object.values(permissions).filter(Boolean).length;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading administrators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mr-3"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Administrator Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage system administrators and permissions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {adminUser.profile?.firstName || 'Admin'} {adminUser.profile?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {adminUser.email === 'princemaurya@gmail.com' ? 'System Administrator' : 'Administrator'}
                  </p>
                </div>
              </div>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Platform Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor and manage all administrator accounts
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add New Admin
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Super Admins</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.superAdmins}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {admins.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Administrators Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first administrator account</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center mx-auto"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create First Admin
                </button>
              </div>
            </div>
          ) : (
            admins.map((admin) => (
              <div key={admin._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative p-6 pb-4">
                  <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                        admin.role === 'superadmin' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}>
                        {admin.profile?.firstName?.charAt(0)}{admin.profile?.lastName?.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                        getActivityStatus(admin.adminDetails?.lastActivity).status === 'online' ? 'bg-green-500' :
                        getActivityStatus(admin.adminDetails?.lastActivity).status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`} title={`${getActivityStatus(admin.adminDetails?.lastActivity).status.charAt(0).toUpperCase() + getActivityStatus(admin.adminDetails?.lastActivity).status.slice(1)}`}>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {admin.profile?.firstName} {admin.profile?.lastName}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          getActivityStatus(admin.adminDetails?.lastActivity).status === 'online' ? 'bg-green-500 animate-pulse' :
                          getActivityStatus(admin.adminDetails?.lastActivity).status === 'away' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className={`text-xs font-medium ${
                          getActivityStatus(admin.adminDetails?.lastActivity).status === 'online' ? 'text-green-600 dark:text-green-400' :
                          getActivityStatus(admin.adminDetails?.lastActivity).status === 'away' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          {getActivityStatus(admin.adminDetails?.lastActivity).status === 'online' ? 'Online' :
                           getActivityStatus(admin.adminDetails?.lastActivity).status === 'away' ? 'Away' :
                           'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(admin.role)}`}>
                        {admin.role === 'superadmin' && <Crown className="w-3 h-3 mr-1" />}
                        {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                      </span>
                      <div className="flex items-center">
                        {getStatusIcon(admin.adminDetails?.isActive)}
                        <span className={`ml-1 text-xs font-medium ${
                          admin.adminDetails?.isActive 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {admin.adminDetails?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Settings className="w-4 h-4 mr-1" />
                      Permissions
                    </h4>
                    {admin.role === 'superadmin' ? (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-3 rounded-xl">
                        <div className="flex items-center">
                          <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Full System Access
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Permissions:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {admin.email === 'princemaurya@gmail.com' ? '6/6' : `${getPermissionCount(admin.adminDetails?.permissions)}/6`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: admin.email === 'princemaurya@gmail.com' 
                                ? '100%' 
                                : `${(getPermissionCount(admin.adminDetails?.permissions) / 6) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {admin.email === 'princemaurya@gmail.com' ? (
                            <span className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300 rounded-lg">
                              All System Permissions
                            </span>
                          ) : (
                            <>
                              {Object.entries(admin.adminDetails?.permissions || {})
                                .filter(([_, hasPermission]) => hasPermission)
                                .slice(0, 2)
                                .map(([permission, _]) => (
                                  <span key={permission} className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg">
                                    {permissionLabels[permission]}
                                  </span>
                                ))}
                              {getPermissionCount(admin.adminDetails?.permissions) > 2 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg">
                                  +{getPermissionCount(admin.adminDetails?.permissions) - 2} more
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {formatDate(admin.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        getActivityStatus(admin.adminDetails?.lastActivity).status === 'online' ? 'bg-green-500' :
                        getActivityStatus(admin.adminDetails?.lastActivity).status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(admin.adminDetails?.lastActivity)}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {admin.email === 'princemaurya@gmail.com' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <Crown className="w-3 h-3 mr-1" />
                        Main Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {admin.role !== 'superadmin' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit Permissions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {admin.adminDetails?.isActive && admin.email !== 'princemaurya@gmail.com' && (
                          <button
                            onClick={() => handleDeactivateAdmin(admin._id, admin.email)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Deactivate Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {currentPage} of {totalPages}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)}></div>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleCreateAdmin}>
                  <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Create New Administrator
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Set up a new admin account with appropriate permissions.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.profile.firstName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              profile: { ...prev.profile, firstName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.profile.lastName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              profile: { ...prev.profile, lastName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            minLength="6"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Permissions
                        </label>
                        <div className="space-y-2">
                          {Object.entries(permissionLabels).map(([permission, label]) => (
                            <label key={permission} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.permissions[permission]}
                                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Create Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showEditModal && selectedAdmin && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Edit Admin Permissions
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Modify permissions for {selectedAdmin.profile?.firstName} {selectedAdmin.profile?.lastName}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(permissionLabels).map(([permission, label]) => (
                      <label key={permission} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        <input
                          type="checkbox"
                          checked={selectedAdmin.adminDetails?.permissions?.[permission] || false}
                          onChange={(e) => handlePermissionChange(permission, e.target.checked, true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={() => handleUpdatePermissions(selectedAdmin._id, selectedAdmin.adminDetails.permissions)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update Permissions
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAdmin(null);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
