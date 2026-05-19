import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>CampusHub</h2>
      <div>
        <Link to='/notes' style={styles.link}>Upload Notes</Link>
        <Link to='/view-notes' style={styles.link}>View Notes</Link>
        <Link to='/events' style={styles.link}>Events</Link>
        <Link to='/lost-found' style={styles.link}>Lost & Found</Link>
        <Link to='/profile' style={styles.link}>Profile</Link>
        <button onClick={logout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#1a1a2e', color: 'white' },
  logo: { margin: 0, color: 'white' },
  link: { color: 'white', marginRight: '15px', textDecoration: 'none' },
  btn: { background: 'red', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' },
};

export default Navbar;