import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: 'linear-gradient(135deg, #2563eb 0%, #a855f7 100%)', color: 'white', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>StockHub</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Welcome, <strong>{user?.fullName}</strong> ({user?.role})</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid white',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Welcome to your Dashboard!</h2>
          <p>Email: {user?.email}</p>
          <p>Role: <strong>{user?.role}</strong></p>

          {user?.role === 'admin' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.25rem' }}>
              <p>✨ You have Admin access - Full access to all features!</p>
            </div>
          )}

          {user?.role === 'contributor' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#dbeafe', borderRadius: '0.25rem' }}>
              <p>✨ You can upload and manage your own assets</p>
            </div>
          )}

          {user?.role === 'viewer' && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0e7ff', borderRadius: '0.25rem' }}>
              <p>✨ You can browse and download assets</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}