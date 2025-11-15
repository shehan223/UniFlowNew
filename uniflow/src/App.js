import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AuthCard from './components/AuthCard';
import DashBord from './pages/DashBord';
import DoctorMedicalPage from './pages/DoctorMedicalPage';
import HostelNoticePage from './pages/HostelNoticePage';
import Qr from './pages/Qr';
import StudentHostelView from './pages/StudentHostelView';
import AdminCanteen from './pages/canteen/AdminCanteen';
import StudentCanteen from './pages/canteen/StudentCanteen';
import PrivateCanteenAdminRoute from './routes/PrivateCanteenAdminRoute';

const getStoredValue = (key) => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const isAuthenticated = () => getStoredValue('isAuthenticated') === 'true';
const getRole = () => getStoredValue('role');
const getDefaultRoute = (role) => {
  if (role === 'warden') {
    return '/warden';
  }
  if (role === 'doctor') {
    return '/doctor';
  }
  if (role === 'canteenAdmin') {
    return '/canteen-admin';
  }
  return '/dashboard';
};

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(() => isAuthenticated());
  const [role, setRole] = useState(() => getRole());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleStorage = () => {
      setAuth(isAuthenticated());
      setRole(getRole());
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    setAuth(isAuthenticated());
    setRole(getRole());
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    setAuth(true);
    setRole(getRole());
  };

  const defaultRoute = getDefaultRoute(role);

  const requireAuth = (element) => (auth ? element : <Navigate to="/login" replace />);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          auth ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <AuthCard onAuthSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/"
        element={
          auth ? (
            <Navigate to={defaultRoute} replace />
          ) : (
            <Navigate to="/canteen" replace />
          )
        }
      />
      <Route path="/dashboard" element={requireAuth(<DashBord />)} />
      <Route path="/student" element={requireAuth(<StudentHostelView />)} />
      <Route path="/canteen" element={<StudentCanteen />} />
      <Route
        path="/canteen-admin"
        element={
          <PrivateCanteenAdminRoute>
            <AdminCanteen />
          </PrivateCanteenAdminRoute>
        }
      />
      <Route path="/notices" element={requireAuth(<HostelNoticePage />)} />
      <Route
        path="/warden"
        element={
          auth ? (
            role === 'warden' ? (
              <HostelNoticePage />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/doctor"
        element={
          auth ? (
            role === 'doctor' ? (
              <DoctorMedicalPage />
            ) : (
              <Navigate to={defaultRoute} replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/qr" element={requireAuth(<Qr />)} />
      <Route path="*" element={<Navigate to="/canteen" replace />} />
    </Routes>
  );
}

export default App;
