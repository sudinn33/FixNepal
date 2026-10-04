import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-paper text-ink px-6 py-4 flex justify-between items-center border-b-4 border-signal">
      <Link to="/" className="font-display text-2xl tracking-wide">
        FixNepal
      </Link>
      <div className="flex gap-6 items-center font-body text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-signal">Dashboard</Link>
            <NotificationBell />
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-signal">
                {user.username} ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border-l-4 border-signal shadow-lg z-10">
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-paper"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-paper"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-signal">Log in</Link>
            <Link
              to="/register"
              className="bg-signal text-paper px-4 py-2 font-display tracking-wide hover:opacity-90"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;