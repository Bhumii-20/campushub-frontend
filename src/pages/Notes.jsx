import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Notes() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleUpload = async () => {
    if (!title || !subject) {
      setError('Title and Subject are required!');
      return;
    }
    const form = new FormData();
    form.append('title', title);
    form.append('subject', subject);
    form.append('description', description);
    if (file) form.append('file', file);

    try {
      setLoading(true);
      setError('');
      await axios.post(API_URL + '/api/notes', form, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setMessage('✅ Note uploaded successfully!');
      setTitle('');
      setSubject('');
      setDescription('');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>📤 Upload Note</h2>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder='Title *' value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder='Subject *' value={subject} onChange={e => setSubject(e.target.value)} />
        <input style={styles.input} placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
        <div style={styles.fileBox}>
          <label style={styles.fileLabel}>
            📁 {file ? file.name : 'Choose File (optional)'}
            <input type='file' style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button style={styles.btn} onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Note'}
        </button>
        <button style={styles.viewBtn} onClick={() => navigate('/view-notes')}>
          📚 View All Notes
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', background: '#f0f2f5' },
  box: { background: 'white', padding: '40px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  heading: { textAlign: 'center', color: '#1a1a2e', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  fileBox: { margin: '10px 0' },
  fileLabel: { display: 'block', padding: '12px', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', color: '#555' },
  btn: { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  viewBtn: { width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  success: { color: 'green', textAlign: 'center', background: '#e8f5e9', padding: '10px', borderRadius: '6px' },
  error: { color: 'red', textAlign: 'center', background: '#fdecea', padding: '10px', borderRadius: '6px' },
};

export default Notes;
  