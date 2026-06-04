import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ViewNotes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    const res = await axios.get(API_URL + '/api/notes');
    setNotes(res.data.notes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await axios.delete(API_URL + '/api/notes/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });
    fetchNotes();
  };

  const filtered = notes.filter(note =>
    note.subject.toLowerCase().includes(search.toLowerCase()) ||
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#1a1a2e' }}>All Notes</h2>
      <input
        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box' }}
        placeholder="Search by title or subject..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No notes found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(note => (
          <div key={note._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>{note.title}</h3>
              <span style={{ background: '#1a1a2e', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{note.subject}</span>
            </div>
            <p style={{ color: '#555', fontSize: '14px' }}>{note.description}</p>
            <p style={{ color: '#888', fontSize: '13px' }}>By: {note.uploadedBy && note.uploadedBy.name}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {note.fileUrl ? (
                
                  <a href={note.fileUrl || ''}
                  target='_blank'
                  rel='noreferrer'
                  style={{ background: '#4CAF50', color: 'white', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}
                >
                  View File
                </a>
              ) : (
                <span style={{ color: '#aaa', fontSize: '14px' }}>No file</span>
              )}
              <button onClick={() => handleDelete(note._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewNotes;