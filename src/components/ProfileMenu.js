import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { colors, gradients } from '../theme/colors';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setIsOpen(false);
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: colors.primaryBlue,
          color: colors.white,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          outline: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: `0 2px 8px rgba(0, 102, 255, 0.3)`,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.08)';
          e.target.style.boxShadow = `0 4px 12px rgba(0, 102, 255, 0.4)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = `0 2px 8px rgba(0, 102, 255, 0.3)`;
        }}
        title={user?.fullName}
      >
        {getInitials(user?.fullName)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            background: colors.white,
            border: `1px solid ${colors.lightGray}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
            minWidth: '240px',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Profile Avatar Section */}
          <div
            style={{
              padding: '1.5rem',
              background: gradients.primaryGradient,
              color: colors.white,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '26px',
                fontWeight: 'bold',
                border: `3px solid rgba(255, 255, 255, 0.4)`,
              }}
            >
              {getInitials(user?.fullName)}
            </div>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '16px', fontWeight: '700' }}>
              {user?.fullName || 'User'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div>
            {/* Change Password Option */}
            <button
              onClick={handleChangePassword}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: colors.white,
                color: colors.darkGray,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.15s',
                borderBottom: `1px solid ${colors.lightGray}`,
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#E3F2FD')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = colors.white)}
            >
              <span style={{ marginRight: '0.6rem' }}>🔐</span>
              Change Password
            </button>

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: colors.white,
                color: colors.primaryBlue,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#E3F2FD')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = colors.white)}
            >
              <span style={{ marginRight: '0.6rem' }}>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
