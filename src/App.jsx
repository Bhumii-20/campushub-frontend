import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import ViewNotes from './pages/ViewNotes';
import Events from './pages/Events';
import LostFound from './pages/LostFound';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/view-notes' element={<ViewNotes />} />
        <Route path='/events' element={<Events />} />
        <Route path='/lost-found' element={<LostFound />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;