import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

function ViewNotes() {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(API_URL + '/api/notes').then(res => setNotes(res.data.notes));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete?')) return;
    axios.delete(API_URL + '/api/notes/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    }).then(() => {
      setNotes(notes.filter(n => n._id !== id));
    });
  };

  return (
    <div style={{padding: '30px'}}>
      <h2>All Notes</h2>
      {notes.map(note => (
        <div key={note._id} style={{background: 'white', padding: '15px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd'}}>
          <h3>{note.title}</h3>
          <p>Subject: {note.subject}</p>
          <p>Description: {note.description}</p>
          <p>By: {note.uploadedBy && note.uploadedBy.name}</p>
          {note.fileUrl && (
            <a href={note.fileUrl} download="note.pdf" target="_blank" rel="noreferrer">Download File</a>
          )}
          <button onClick={() => handleDelete(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ViewNotes;