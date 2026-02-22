import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { useContext } from 'react';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MediaLibraryPage from './pages/MediaLibraryPage';

function AppContent() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={token ? <Navigate to="/media" /> : <LoginPage />} />
      <Route path="/signup" element={token ? <Navigate to="/media" /> : <SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/media"
        element={
          <ProtectedRoute>
            <MediaLibraryPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to media or login */}
      <Route path="/" element={token ? <Navigate to="/media" /> : <Navigate to="/login" />} />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to={token ? "/media" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}