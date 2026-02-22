import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function SignupPage() {
  const [fullName, setFullName] = useState('sachin');
  const [email, setEmail] = useState('sachin@admin.com');
  const [password, setPassword] = useState('sachin123');
  const [confirmPassword, setConfirmPassword] = useState('sachin123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter email');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = signup({
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });

      if (result) {
        setSuccess('✅ Signup successful! Redirecting...');
        setTimeout(() => {
          navigate('/media');
        }, 1000);
      } else {
        setError('❌ Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('❌ Signup failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', maxWidth: '450px', width: '90%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', margin: '0 0 0.5rem 0' }}>📝 Create Account</h1>
          <p style={{ color: '#666', margin: 0 }}>Join StockHub and start managing assets</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '2px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#dcfce7', border: '2px solid #86efac', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: '500' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="sachin"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sachin@admin.com"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <small style={{ color: '#999', display: 'block', marginTop: '0.5rem' }}>Use your company email address</small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="sachin123"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <small style={{ color: '#999', display: 'block', marginTop: '0.5rem' }}>At least 6 characters</small>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="sachin123"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.4)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
          >
            {loading ? '⏳ Creating account...' : '✅ Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>Already have an account?</p>
          <Link to="/login" style={{
            display: 'inline-block',
            background: '#f0f0f0',
            color: '#667eea',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
            onMouseEnter={(e) => (e.target.style.background = '#667eea', e.target.style.color = 'white')}
            onMouseLeave={(e) => (e.target.style.background = '#f0f0f0', e.target.style.color = '#667eea')}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}