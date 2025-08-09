import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  try {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserString = localStorage.getItem('adminUser');
    
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }

    let adminUser;
    try {
      adminUser = JSON.parse(adminUserString || '{}');
    } catch (parseError) {
      console.error('Error parsing admin user:', parseError);
      return <Navigate to="/admin/login" replace />;
    }

    if (!adminUser || !adminUser.email) {
      return <Navigate to="/admin/login" replace />;
    }

    if (adminUser.role !== 'admin' && adminUser.role !== 'superadmin') {
      return <Navigate to="/admin/login" replace />;
    }

    return children;
  } catch (error) {
    console.error('Error in AdminProtectedRoute:', error);
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminProtectedRoute;
