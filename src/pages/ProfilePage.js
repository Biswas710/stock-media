import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ProfileMenu from '../components/ProfileMenu';
import { colors, gradients } from '../theme/colors';
import axios from 'axios';

export default function ProfilePage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

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
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowChangePassword(false), 1500);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
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
            👤 My Profile
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ProfileMenu />
            <button
              onClick={() => navigate('/media')}
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
              ← Back to Library
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <div
          style={{
            background: colors.white,
            borderRadius: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Profile Header with Avatar */}
          <div
            style={{
              background: gradients.primaryGradient,
              padding: '2rem',
              textAlign: 'center',
              color: colors.white,
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              👤
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700' }}>
              {user?.fullName}
            </h2>
            <p style={{ margin: 0, opacity: 0.95 }}>{user?.email}</p>
            {user?.role && (
              <div style={{ marginTop: '1rem' }}>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role}
                </span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '1.1rem', fontWeight: '700', color: colors.darkGray }}>
              Account Information
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: colors.mediumGray, marginBottom: '0.25rem' }}>
                Full Name
              </label>
              <div
                style={{
                  padding: '0.75rem',
                  background: colors.lightBackground,
                  borderRadius: '0.5rem',
                  color: colors.darkGray,
                  fontWeight: '500',
                }}
              >
                {user?.fullName}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: colors.mediumGray, marginBottom: '0.25rem' }}>
                Email Address
              </label>
              <div
                style={{
                  padding: '0.75rem',
                  background: colors.lightBackground,
                  borderRadius: '0.5rem',
                  color: colors.darkGray,
                  fontWeight: '500',
                }}
              >
                {user?.email}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: colors.mediumGray, marginBottom: '0.25rem' }}>
                Role
              </label>
              <div
                style={{
                  padding: '0.75rem',
                  background: colors.lightBackground,
                  borderRadius: '0.5rem',
                  color: colors.darkGray,
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {user?.role || 'User'}
              </div>
            </div>

            {/* Change Password Button */}
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: colors.primaryBlue,
                color: colors.white,
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 4px 12px rgba(0, 102, 255, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔐 Change Password
            </button>

            {/* Change Password Form */}
            {showChangePassword && (
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: `1px solid ${colors.lightGray}` }}>
                <h3 style={{ marginTop: 0, fontSize: '1.1rem', fontWeight: '700', color: colors.darkGray }}>
                  Update Password
                </h3>

                {passwordError && (
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
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
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
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handleChangePassword}>
                  <div style={{ marginBottom: '1rem' }}>
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

                  <div style={{ marginBottom: '1rem' }}>
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

                  <div style={{ marginBottom: '1rem' }}>
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
                      onClick={() => setShowChangePassword(false)}
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
                      disabled={passwordLoading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: colors.primaryBlue,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        opacity: passwordLoading ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => !passwordLoading && (e.target.style.boxShadow = `0 4px 12px rgba(0, 102, 255, 0.3)`)}
                      onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
