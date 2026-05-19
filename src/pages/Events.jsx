import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    const res = await axios.get(API_URL + '/api/events');
    setEvents(res.data.events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async () => {
    if (!title || !description || !date || !venue) {
      setError('All fields are required!');
      return;
    }
    try {
      setError('');
      await axios.post(API_URL + '/api/events',
        { title, description, date, venue },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      setVenue('');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(API_URL + '/api/events/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });
    fetchEvents();
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1a1a2e' }}>📅 Events</h2>
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ color: '#1a1a2e' }}>Create Event</h3>
        {message && <p style={{ color: 'green', background: '#e8f5e9', padding: '10px', borderRadius: '6px' }}>{message}</p>}
        {error && <p style={{ color: 'red', background: '#fdecea', padding: '10px', borderRadius: '6px' }}>{error}</p>}
        <input style={styles.input} placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Venue *" value={venue} onChange={e => setVenue(e.target.value)} />
        <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
        <textarea style={styles.textarea} placeholder="Description *" value={description} onChange={e => setDescription(e.target.value)} />
        <button style={styles.btn} onClick={handleCreate}>Create Event</button>
      </div>
      <h3 style={{ color: '#1a1a2e' }}>Upcoming Events</h3>
      {events.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>No events found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {events.map(event => (
          <div key={event._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#1a1a2e' }}>{event.title}</h3>
              <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: '#555', fontSize: '14px' }}>{event.description}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>📍 {event.venue}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>👤 {event.createdBy && event.createdBy.name}</p>
            <button onClick={() => handleDelete(event._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
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
};

export default Events;
  