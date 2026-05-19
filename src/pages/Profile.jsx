import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Profile() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    const res = await axios.get(API_URL + '/api/users/profile', {
      headers: { Authorization: 'Bearer ' + token },
    });
    setUser(res.data.user);
  };

  const fetchMyNotes = async () => {
    const res = await axios.get(API_URL + '/api/notes');
    setNotes(res.data.notes.filter(n => n.uploadedBy?._id === user?._id));
  };

  const fetchMyEvents = async () => {
    const res = await axios.get(API_URL + '/api/events');
    setEvents(res.data.events.filter(e => e.createdBy?._id === user?._id));
  };

  const fetchMyPosts = async () => {
    const res = await axios.get(API_URL + '/api/lostfound');
    setPosts(res.data.posts.filter(p => p.postedBy?._id === user?._id));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyNotes();
      fetchMyEvents();
      fetchMyPosts();
    }
  }, [user]);

  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: '#1a1a2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '32px', color: 'white' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ color: '#1a1a2e', margin: '0' }}>{user.name}</h2>
        <p style={{ color: '#888' }}>{user.email}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
          <div style={styles.stat}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>{notes.length}</h3>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Notes</p>
          </div>
          <div style={styles.stat}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>{events.length}</h3>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Events</p>
          </div>
          <div style={styles.stat}>
            <h3 style={{ margin: 0, color: '#1a1a2e' }}>{posts.length}</h3>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Lost & Found</p>
          </div>
        </div>
      </div>
      <h3 style={{ color: '#1a1a2e' }}>My Notes</h3>
      {notes.length === 0 && <p style={{ color: '#888' }}>No notes uploaded yet.</p>}
      <div style={styles.grid}>
        {notes.map(note => (
          <div key={note._id} style={styles.card}>
            <h4 style={{ margin: '0 0 5px', color: '#1a1a2e' }}>{note.title}</h4>
            <span style={styles.badge}>{note.subject}</span>
            <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>{note.description}</p>
          </div>
        ))}
      </div>
      <h3 style={{ color: '#1a1a2e', marginTop: '30px' }}>My Events</h3>
      {events.length === 0 && <p style={{ color: '#888' }}>No events created yet.</p>}
      <div style={styles.grid}>
        {events.map(event => (
          <div key={event._id} style={styles.card}>
            <h4 style={{ margin: '0 0 5px', color: '#1a1a2e' }}>{event.title}</h4>
            <span style={styles.badge}>{new Date(event.date).toLocaleDateString()}</span>
            <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>{event.venue}</p>
          </div>
        ))}
      </div>
      <h3 style={{ color: '#1a1a2e', marginTop: '30px' }}>My Lost & Found Posts</h3>
      {posts.length === 0 && <p style={{ color: '#888' }}>No posts yet.</p>}
      <div style={styles.grid}>
        {posts.map(post => (
          <div key={post._id} style={styles.card}>
            <h4 style={{ margin: '0 0 5px', color: '#1a1a2e' }}>{post.title}</h4>
            <span style={{ ...styles.badge, background: post.type === 'lost' ? '#e74c3c' : '#4CAF50' }}>{post.type.toUpperCase()}</span>
            <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  stat: { textAlign: 'center', padding: '10px 20px', background: '#f5f5f5', borderRadius: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' },
  card: { background: 'white', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #eee' },
  badge: { background: '#1a1a2e', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' },
};

export default Profile;