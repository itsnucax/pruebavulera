
    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext.jsx';

    const ProtectedRoute = ({ children, allowedRoles }) => {
      const { currentUser } = useAuth();
      const location = useLocation();

      if (!currentUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
      }

      if (allowedRoles && !allowedRoles.includes(currentUser.type)) {
        return <Navigate to="/" state={{ from: location }} replace />;
      }

      return children;
    };

    export default ProtectedRoute;
  