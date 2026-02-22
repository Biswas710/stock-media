import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '2rem' }}>🔑 Forgot Password</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>For now, please try logging in with your password or contact admin.</p>
        <Link to="/login" style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.25rem', textDecoration: 'none', fontWeight: 'bold' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}