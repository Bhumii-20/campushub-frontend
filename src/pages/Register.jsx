import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(API_URL + '/api/auth/register', {
        name,
        email,
        password,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.btn} onClick={handleRegister}>Register</button>
        <p>Already have an account? <Link to='/'>Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' },
  box: { background: '#f5f5f5', padding: '30px', borderRadius: '10px', width: '300px', textAlign: 'center' },
  input: { width: '100%', padding: '10px', margin: '8px 0', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' },
  error: { color: 'red' },
};

export default Register;