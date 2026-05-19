import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(API_URL + '/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.logo}>🎓 CampusHub</h1>
        <h3 style={styles.sub}>Login to your account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.link}>Don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  box: { background: 'white', padding: '40px', borderRadius: '12px', width: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' },
  logo: { color: '#1a1a2e', marginBottom: '5px' },
  sub: { color: '#888', fontWeight: 'normal', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  error: { color: 'red', background: '#fdecea', padding: '10px', borderRadius: '6px' },
  link: { marginTop: '15px', color: '#555' },
};

export default Login;
