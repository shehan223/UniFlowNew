import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthCard from './components/AuthCard';
import DashBord from './pages/DashBord';
import HostelNoticePage from './pages/HostelNoticePage';
import StudentHostelView from './pages/StudentHostelView';
import DoctorMedicalPage from './pages/DoctorMedicalPage';
import Qr from './pages/Qr';

const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';
const getRole = () => localStorage.getItem('role');

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(getRole())) {
    const role = getRole();
    let target = '/login';
    if (role === 'warden') {
      target = '/warden';
    } else if (role === 'doctor') {
      target = '/doctor';
    } else if (role === 'student') {
      target = '/dashboard';
    }
    return <Navigate to={target} replace />;
  }

  return children;
};

const AuthPage = ({ onLoginSuccess }) => (
  <div className='auth-page'>
    <AuthCard onAuthSuccess={onLoginSuccess} />
  </div>
);

function App() {
  const [auth, setAuth] = useState(isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    const handleStorage = () => setAuth(isAuthenticated());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, [location.pathname]);

  const role = getRole();

  const handleLoginSuccess = () => {
    setAuth(true);
  };

  return (
    <div className='app'>
      <Routes>
        <Route
          path='/'
          element={
            auth
              ? <Navigate to={role === 'warden' ? '/warden' : role === 'doctor' ? '/doctor' : '/dashboard'} replace />
              : <AuthPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path='/login'
          element={
            auth
              ? <Navigate to={role === 'warden' ? '/warden' : role === 'doctor' ? '/doctor' : '/dashboard'} replace />
              : <AuthPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path='/warden'
          element={
            <ProtectedRoute allowedRoles={['warden']}>
              <HostelNoticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/doctor'
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorMedicalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/student'
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHostelView />
            </ProtectedRoute>
          }
        />
        <Route
          path='/medical'
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHostelView />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashBord />
            </ProtectedRoute>
          }
        />
        <Route
          path='/qr'
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Qr />
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={
            auth
              ? <Navigate to={role === 'warden' ? '/warden' : role === 'doctor' ? '/doctor' : '/dashboard'} replace />
              : <Navigate to='/login' replace />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
