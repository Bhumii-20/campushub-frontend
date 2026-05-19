import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function LostFound() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('lost');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    const res = await axios.get(API_URL + '/api/lostfound');
    setPosts(res.data.posts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async () => {
    if (!title || !description || !location || !contact) {
      setError('All fields are required!');
      return;
    }
    try {
      setError('');
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('type', type);
      form.append('location', location);
      form.append('contact', contact);
      if (image) form.append('image', image);
      await axios.post(API_URL + '/api/lostfound', form, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setMessage('Post created successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setContact('');
      setImage(null);
      setType('lost');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await axios.delete(API_URL + '/api/lostfound/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });
    fetchPosts();
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1a1a2e' }}>Lost & Found</h2>
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ color: '#1a1a2e' }}>Post an Item</h3>
        {message && <p style={{ color: 'green', background: '#e8f5e9', padding: '10px', borderRadius: '6px' }}>{message}</p>}
        {error && <p style={{ color: 'red', background: '#fdecea', padding: '10px', borderRadius: '6px' }}>{error}</p>}
        <select style={styles.input} value={type} onChange={e => setType(e.target.value)}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input style={styles.input} placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Location *" value={location} onChange={e => setLocation(e.target.value)} />
        <input style={styles.input} placeholder="Contact (phone/email) *" value={contact} onChange={e => setContact(e.target.value)} />
        <textarea style={styles.textarea} placeholder="Description *" value={description} onChange={e => setDescription(e.target.value)} />
        <label style={styles.fileLabel}>
          {image ? image.name : 'Upload Image (optional)'}
          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </label>
        <button style={styles.btn} onClick={handleCreate}>Post Item</button>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={{ ...styles.filterBtn, background: filter === 'all' ? '#1a1a2e' : '#eee', color: filter === 'all' ? 'white' : '#333' }} onClick={() => setFilter('all')}>All</button>
        <button style={{ ...styles.filterBtn, background: filter === 'lost' ? '#e74c3c' : '#eee', color: filter === 'lost' ? 'white' : '#333' }} onClick={() => setFilter('lost')}>Lost</button>
        <button style={{ ...styles.filterBtn, background: filter === 'found' ? '#4CAF50' : '#eee', color: filter === 'found' ? 'white' : '#333' }} onClick={() => setFilter('found')}>Found</button>
      </div>
      {filtered.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>No posts found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(post => (
          <div key={post._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>{post.title}</h3>
              <span style={{ background: post.type === 'lost' ? '#e74c3c' : '#4CAF50', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{post.type.toUpperCase()}</span>
            </div>
            {post.imageUrl && <img src={API_URL + '/' + post.imageUrl} alt={post.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', height: '150px', objectFit: 'cover' }} />}
            <p style={{ color: '#555', fontSize: '14px' }}>{post.description}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>📍 {post.location}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>📞 {post.contact}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>👤 {post.postedBy && post.postedBy.name}</p>
            <button onClick={() => handleDelete(post._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  input: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', height: '100px' },
  btn: { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' },
  fileLabel: { display: 'block', padding: '12px', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', color: '#555', margin: '8px 0' },
  filterBtn: { padding: '8px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
};

export default LostFound;
            