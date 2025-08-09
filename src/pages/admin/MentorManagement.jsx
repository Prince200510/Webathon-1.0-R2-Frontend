import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, MapPin, GraduationCap, Building, Mail, Phone, User, BookOpen, Filter, Search, Clock, Award, AlertCircle, ChevronDown, Download, Star, ExternalLink } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { formatDate } from '../../utils/helpers';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const [fetchTimeout, setFetchTimeout] = useState(null);

  useEffect(() => {
    if (fetchTimeout) {
      clearTimeout(fetchTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchMentors();
    }, 300); 
    
    setFetchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [filter, currentPage, sortBy]);

  useEffect(() => {
    if (searchTerm) {
      const timeout = setTimeout(() => {
        filterMentors();
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      filterMentors();
    }
  }, [mentors, searchTerm]);

  const fetchMentors = async () => {
    try {
      if (fetchingData) {
        return;
      }
      
      setFetchingData(true);
      setLoading(true);
      setError(null); 
      
      let endpoint = '/admin/users';
      const params = new URLSearchParams({
        role: 'mentor',
        page: currentPage,
        limit: 10
      });

      if (filter !== 'all') {
        params.append('approval', filter);
      }

      const response = await adminApi.get(`${endpoint}?${params.toString()}`);
      const fetchedMentors = response.data.users;
      const sortedMentors = sortMentors(fetchedMentors);
      setMentors(sortedMentors);
      setTotalPages(response.data.totalPages);
      calculateStats(fetchedMentors);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment before refreshing.');
        console.log('Rate limited. Retrying in 3 seconds...');
        setTimeout(() => {
          setFetchingData(false);
          setError(null);
          fetchMentors();
        }, 3000);
        return;
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (!error.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load mentors. Please try again.');
      }
    } finally {
      setLoading(false);
      setFetchingData(false);
    }
  };

  const sortMentors = (mentorList) => {
    return [...mentorList].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return `${a.profile?.firstName} ${a.profile?.lastName}`.localeCompare(`${b.profile?.firstName} ${b.profile?.lastName}`);
        case 'experience':
          return (b.mentorDetails?.workExperience?.yearsOfExperience || 0) - (a.mentorDetails?.workExperience?.yearsOfExperience || 0);
        default:
          return 0;
      }
    });
  };

  const calculateStats = (mentorList) => {
    const newStats = {
      pending: mentorList.filter(m => m.mentorDetails?.approvalStatus === 'pending').length,
      approved: mentorList.filter(m => m.mentorDetails?.approvalStatus === 'approved').length,
      rejected: mentorList.filter(m => m.mentorDetails?.approvalStatus === 'rejected').length,
      total: mentorList.length
    };
    setStats(newStats);
  };

  const filterMentors = () => {
    if (!searchTerm.trim()) {
      setFilteredMentors(mentors);
      return;
    }

    const filtered = mentors.filter(mentor => {
      const fullName = `${mentor.profile?.firstName} ${mentor.profile?.lastName}`.toLowerCase();
      const email = mentor.email.toLowerCase();
      const subjects = mentor.mentorDetails?.teachingSubjects?.join(' ').toLowerCase() || '';
      const university = mentor.mentorDetails?.education?.university?.toLowerCase() || '';
      const organization = mentor.mentorDetails?.workExperience?.currentOrganization?.toLowerCase() || '';
      
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || 
             email.includes(search) || 
             subjects.includes(search) ||
             university.includes(search) ||
             organization.includes(search);
    });
    
    setFilteredMentors(filtered);
  };

  const handleViewDetails = async (mentorId) => {
    try {
      const response = await adminApi.get(`/admin/mentors/${mentorId}`);
      setSelectedMentor(response.data);
      setShowModal(true);
      setActionType('');
    } catch (error) {
      console.error('Failed to fetch mentor details:', error);
    }
  };

  const handleApprove = async (mentorId) => {
    try {
      setLoading(true);
      await adminApi.put(`/admin/mentors/${mentorId}/approve`);
      await fetchMentors();
      setShowModal(false);
      setSelectedMentor(null);
      alert('Mentor approved successfully! WhatsApp notification sent.');
    } catch (error) {
      console.error('Failed to approve mentor:', error);
      alert('Failed to approve mentor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (mentorId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      await adminApi.put(`/admin/mentors/${mentorId}/reject`, {
        reason: rejectionReason
      });
      await fetchMentors();
      setShowModal(false);
      setSelectedMentor(null);
      setRejectionReason('');
      setActionType('');
      alert('Mentor rejected successfully! WhatsApp notification sent.');
    } catch (error) {
      console.error('Failed to reject mentor:', error);
      alert('Failed to reject mentor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const exportMentorData = () => {
    const mentorsToExport = searchTerm ? filteredMentors : mentors;
    
    if (mentorsToExport.length === 0) {
      alert('No mentors to export');
      return;
    }
    
    const dataToExport = mentorsToExport.map(mentor => ({
      Name: `${mentor.profile?.firstName} ${mentor.profile?.lastName}`,
      Email: mentor.email,
      Phone: mentor.mentorDetails?.phoneNumber || 'N/A',
      Status: mentor.mentorDetails?.approvalStatus || 'pending',
      University: mentor.mentorDetails?.education?.university || 'N/A',
      Organization: mentor.mentorDetails?.workExperience?.currentOrganization || 'N/A',
      Experience: mentor.mentorDetails?.workExperience?.yearsOfExperience || 'N/A',
      Subjects: mentor.mentorDetails?.teachingSubjects?.join(', ') || 'N/A',
      'Applied Date': formatDate(mentor.createdAt)
    }));
    
    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentors-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading mentors...</p>
        </div>
      </div>
    );
  }

  const displayMentors = searchTerm ? filteredMentors : mentors;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mentor Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
                Review and manage mentor applications with advanced filtering
              </p>
            </div>
          
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={exportMentorData}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-red-800">
              <div className="flex items-center">
                <span className="font-medium">Error: </span>
                <span className="ml-2">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 ml-4 text-xl"
              >
                ×
              </button>
            </div>
            {error.includes('Too many requests') && (
              <div className="mt-2 text-sm text-red-600">
                The system is temporarily limiting requests. Please wait a moment.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {[
            { key: 'pending', label: 'Pending', fullLabel: 'Pending Review', count: stats.pending, color: 'amber', icon: Clock },
            { key: 'approved', label: 'Approved', fullLabel: 'Approved', count: stats.approved, color: 'green', icon: CheckCircle },
            { key: 'rejected', label: 'Rejected', fullLabel: 'Rejected', count: stats.rejected, color: 'red', icon: XCircle },
            { key: 'total', label: 'Total', fullLabel: 'Total Applications', count: stats.total, color: 'blue', icon: User }
          ].map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.key}
                className={`bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-${stat.color}-500 cursor-pointer hover:scale-105`}
                onClick={() => stat.key !== 'total' && setFilter(stat.key)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                      <span className="sm:hidden">{stat.label}</span>
                      <span className="hidden sm:inline">{stat.fullLabel}</span>
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.count}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 sm:w-5 lg:w-6 sm:h-5 lg:h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Mentors
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, subjects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="experience">Experience (High to Low)</option>
                </select>
              </div>
              
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('newest');
                    setFilter('pending');
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <option value="pending">Pending Review ({stats.pending})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="rejected">Rejected ({stats.rejected})</option>
              <option value="all">All Mentors ({stats.total})</option>
            </select>
          </div>
          <nav className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto">
            {[
              { key: 'pending', label: 'Pending Review', shortLabel: 'Pending', count: stats.pending, color: 'amber' },
              { key: 'approved', label: 'Approved', shortLabel: 'Approved', count: stats.approved, color: 'green' },
              { key: 'rejected', label: 'Rejected', shortLabel: 'Rejected', count: stats.rejected, color: 'red' },
              { key: 'all', label: 'All Mentors', shortLabel: 'All', count: stats.total, color: 'blue' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`flex-1 min-w-max py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                  filter === tab.key
                    ? `bg-${tab.color}-500 text-white shadow-lg`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                    filter === tab.key 
                      ? 'bg-white/20' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {displayMentors.length === 0 ? (
            <div className="p-8 sm:p-12 lg:p-16 text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 sm:w-10 h-8 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No mentors found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {searchTerm ? 'Try adjusting your search terms' : 'No mentors match the current filter'}
              </p>
            </div>
          ) : (
            <>
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayMentors.map((mentor, index) => (
                    <div 
                      key={mentor._id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                {mentor.profile?.firstName?.charAt(0)}{mentor.profile?.lastName?.charAt(0)}
                              </span>
                            </div>
                            {mentor.mentorDetails?.approvalStatus === 'approved' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <Award className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {mentor.profile?.firstName} {mentor.profile?.lastName}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {mentor.email}
                            </p>
                            <div className="mt-1 flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(mentor.mentorDetails?.approvalStatus)}`}>
                                {getStatusIcon(mentor.mentorDetails?.approvalStatus)}
                                <span className="ml-1 capitalize">
                                  {mentor.mentorDetails?.approvalStatus || 'pending'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {mentor.mentorDetails?.education?.university || 'University not specified'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                              {mentor.mentorDetails?.workExperience?.currentOrganization || 'Organization not specified'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-purple-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400">
                              Applied {formatDate(mentor.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mentor.mentorDetails?.teachingSubjects?.slice(0, 3).map((subject, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-medium border border-blue-200 dark:border-blue-800"
                            >
                              {subject}
                            </span>
                          ))}
                          {mentor.mentorDetails?.teachingSubjects?.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full font-medium border border-gray-200 dark:border-gray-600">
                              +{mentor.mentorDetails.teachingSubjects.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            onClick={() => handleViewDetails(mentor._id)}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </button>
                          {mentor.mentorDetails?.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(mentor._id)}
                                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMentor(mentor);
                                  setActionType('reject');
                                  setShowModal(true);
                                }}
                                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mentor Profile
                      </th>
                      <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Education & Experience
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <span className="hidden lg:inline">Teaching Expertise</span>
                        <span className="lg:hidden">Details</span>
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {displayMentors.map((mentor, index) => (
                      <tr 
                        key={mentor._id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center">
                            <div className="relative flex-shrink-0">
                              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm lg:text-lg">
                                  {mentor.profile?.firstName?.charAt(0)}{mentor.profile?.lastName?.charAt(0)}
                                </span>
                              </div>
                              {mentor.mentorDetails?.approvalStatus === 'approved' && (
                                <div className="absolute -top-1 -right-1 w-4 lg:w-5 h-4 lg:h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Award className="w-2 lg:w-3 h-2 lg:h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {mentor.profile?.firstName} {mentor.profile?.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center truncate">
                                <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                {mentor.email}
                              </div>
                              {mentor.mentorDetails?.phoneNumber && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1 truncate">
                                  <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                  {mentor.mentorDetails.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <GraduationCap className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {mentor.mentorDetails?.education?.university || 'N/A'}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                                  {mentor.mentorDetails?.education?.degree || 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm">
                              <Building className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate">
                                  {mentor.mentorDetails?.workExperience?.currentOrganization || 'N/A'}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs">
                                  {mentor.mentorDetails?.workExperience?.yearsOfExperience ? 
                                    `${mentor.mentorDetails.workExperience.yearsOfExperience} years exp.` : 
                                    'Experience not specified'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="hidden lg:block">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {mentor.mentorDetails?.teachingSubjects?.slice(0, 3).map((subject, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-medium border border-blue-200 dark:border-blue-800"
                                >
                                  {subject}
                                </span>
                              ))}
                              {mentor.mentorDetails?.teachingSubjects?.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full font-medium border border-gray-200 dark:border-gray-600">
                                  +{mentor.mentorDetails.teachingSubjects.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="lg:hidden space-y-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              <span className="truncate">{mentor.mentorDetails?.education?.university || 'N/A'}</span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              <span className="truncate">{mentor.mentorDetails?.workExperience?.currentOrganization || 'N/A'}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mentor.mentorDetails?.teachingSubjects?.slice(0, 2).map((subject, index) => (
                                <span 
                                  key={index} 
                                  className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                                >
                                  {subject}
                                </span>
                              ))}
                              {mentor.mentorDetails?.teachingSubjects?.length > 2 && (
                                <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                                  +{mentor.mentorDetails.teachingSubjects.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 lg:px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(mentor.mentorDetails?.approvalStatus)}`}>
                              {getStatusIcon(mentor.mentorDetails?.approvalStatus)}
                              <span className="ml-1 capitalize">
                                <span className="hidden sm:inline">{mentor.mentorDetails?.approvalStatus || 'pending'}</span>
                                <span className="sm:hidden">{(mentor.mentorDetails?.approvalStatus || 'pending').substring(0, 4)}</span>
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 lg:px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(mentor.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                            <button
                              onClick={() => handleViewDetails(mentor._id)}
                              className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {mentor.mentorDetails?.approvalStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(mentor._id)}
                                  className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMentor(mentor);
                                    setActionType('reject');
                                    setShowModal(true);
                                  }}
                                  className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                    {searchTerm && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400">
                        (filtered results)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModal && selectedMentor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-5xl">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg sm:text-xl">
                          {selectedMentor.profile?.firstName?.charAt(0)}{selectedMentor.profile?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                          {selectedMentor.profile?.firstName} {selectedMentor.profile?.lastName}
                        </h3>
                        <p className="text-blue-100 text-sm sm:text-base">Mentor Application Review</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 sm:py-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-base sm:text-lg">
                        <User className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
                        Personal Information
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start space-x-3">
                          <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base break-all">
                              {selectedMentor.mentorDetails?.contactEmail || selectedMentor.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {selectedMentor.mentorDetails?.phoneNumber || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Location</p>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {selectedMentor.profile?.location || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {formatDate(selectedMentor.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-green-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-base sm:text-lg">
                        <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-green-500" />
                        Education Background
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">University</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                            {selectedMentor.mentorDetails?.education?.university || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Degree</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                            {selectedMentor.mentorDetails?.education?.degree || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Graduation Year</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {selectedMentor.mentorDetails?.education?.graduationYear || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                            {selectedMentor.mentorDetails?.education?.currentStatus || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-purple-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-base sm:text-lg">
                        <Building className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-purple-500" />
                        Professional Experience
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current Organization</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                            {selectedMentor.mentorDetails?.workExperience?.currentOrganization || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Position</p>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                            {selectedMentor.mentorDetails?.workExperience?.position || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Years of Experience</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {selectedMentor.mentorDetails?.workExperience?.yearsOfExperience || 'N/A'}
                            </p>
                            {selectedMentor.mentorDetails?.workExperience?.yearsOfExperience && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                                {selectedMentor.mentorDetails.workExperience.yearsOfExperience >= 5 ? 'Senior' : 'Junior'} Level
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-base sm:text-lg">
                        <BookOpen className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-orange-500" />
                        Teaching Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentor.mentorDetails?.teachingSubjects?.map((subject, index) => (
                          <span 
                            key={index} 
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full text-xs sm:text-sm font-medium border border-orange-200 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                          >
                            {subject}
                          </span>
                        ))}
                        {(!selectedMentor.mentorDetails?.teachingSubjects || selectedMentor.mentorDetails.teachingSubjects.length === 0) && (
                          <p className="text-gray-500 dark:text-gray-400 italic text-sm">No subjects specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedMentor.profile?.bio && (
                    <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-base sm:text-lg">Professional Bio</h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        {selectedMentor.profile.bio}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 sm:mt-6 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full ${getStatusBadge(selectedMentor.mentorDetails?.approvalStatus)}`}>
                          {getStatusIcon(selectedMentor.mentorDetails?.approvalStatus)}
                          <span className="ml-2 capitalize">
                            {selectedMentor.mentorDetails?.approvalStatus || 'pending'}
                          </span>
                        </span>
                      </div>
                      {selectedMentor.mentorDetails?.approvedAt && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {selectedMentor.mentorDetails.approvalStatus === 'approved' ? 'Approved' : 'Updated'} on {formatDate(selectedMentor.mentorDetails.approvedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-4">
                  {selectedMentor.mentorDetails?.approvalStatus === 'pending' && actionType !== 'reject' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => handleApprove(selectedMentor._id)}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base"
                      >
                        <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        {loading ? 'Approving...' : 'Approve Mentor'}
                      </button>
                      <button
                        onClick={() => setActionType('reject')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <XCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        Reject Application
                      </button>
                    </div>
                  )}
                  {actionType === 'reject' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          Rejection Reason (Required)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-600 dark:text-white resize-none text-sm"
                          rows="4"
                          placeholder="Please provide a clear and constructive reason for rejection. This will help the mentor improve their application for future submissions."
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => handleReject(selectedMentor._id)}
                          disabled={!rejectionReason.trim() || loading}
                          className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                          {loading ? 'Processing...' : 'Confirm Rejection'}
                        </button>
                        <button
                          onClick={() => {
                            setActionType('');
                            setRejectionReason('');
                          }}
                          className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedMentor.mentorDetails?.approvalStatus === 'rejected' && selectedMentor.mentorDetails?.rejectionReason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-2 flex items-center text-sm sm:text-base">
                        <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        Rejection Details
                      </h4>
                      <p className="text-red-600 dark:text-red-300 mb-2 text-sm sm:text-base break-words">
                        {selectedMentor.mentorDetails.rejectionReason}
                      </p>
                      <p className="text-xs sm:text-sm text-red-500 dark:text-red-400">
                        Rejected on {formatDate(selectedMentor.mentorDetails.approvedAt)}
                      </p>
                    </div>
                  )}
                  {selectedMentor.mentorDetails?.approvalStatus === 'approved' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Award className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 dark:text-green-400" />
                        <h4 className="font-bold text-green-800 dark:text-green-200 text-base sm:text-lg">
                          Mentor Approved Successfully
                        </h4>
                      </div>
                      <p className="text-green-600 dark:text-green-300 mt-2 text-sm sm:text-base break-words">
                        This mentor has been approved and can now start accepting students. 
                        WhatsApp notification has been sent to {selectedMentor.mentorDetails?.phoneNumber}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorManagement;
