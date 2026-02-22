import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ProfileMenu from '../components/ProfileMenu';
import { colors, gradients } from '../theme/colors';
import axios from 'axios';

export default function ChangePasswordPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Password changed successfully! Redirecting...');
      setTimeout(() => navigate('/media'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.lightBackground }}>
      {/* Header */}
      <header
        style={{
          background: gradients.primaryGradient,
          color: colors.white,
          padding: '1.5rem 2rem',
          boxShadow: `0 2px 8px rgba(0, 102, 255, 0.2)`,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            🔐 Change Password
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ProfileMenu />
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'rgba(255,255,255,0.2)',
                color: colors.white,
                border: `1px solid rgba(255,255,255,0.5)`,
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.background = 'rgba(255,255,255,0.3)')}
              onMouseLeave={(e) => (e.target.style.background = 'rgba(255,255,255,0.2)')}
            >
              ← Back to Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '500px', margin: '3rem auto', padding: '0 1rem' }}>
        <div
          style={{
            background: colors.white,
            borderRadius: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '2rem',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: '700', color: colors.darkGray }}>
            Update Your Password
          </h2>
          <p style={{ color: colors.mediumGray, marginBottom: '1.5rem' }}>
            Please enter your current password and your new password below.
          </p>

          {error && (
            <div
              style={{
                background: '#FFE0E0',
                border: `1px solid #FF6B6B`,
                color: '#991B1B',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: '#E0FFE0',
                border: `1px solid #6BFF6B`,
                color: '#166534',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="currentPassword"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: colors.darkGray,
                  fontSize: '0.9rem',
                }}
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="newPassword"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: colors.darkGray,
                  fontSize: '0.9rem',
                }}
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (minimum 6 characters)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: colors.darkGray,
                  fontSize: '0.9rem',
                }}
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: colors.lightBackground,
                  color: colors.darkGray,
                  border: `1px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#E0E0E0')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.lightBackground)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: colors.primaryBlue,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => !loading && (e.target.style.boxShadow = `0 4px 12px rgba(0, 102, 255, 0.3)`)}
                onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
