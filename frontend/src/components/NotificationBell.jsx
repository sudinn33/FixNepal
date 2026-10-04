import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const load = () => {
    api.get('/accounts/notifications/').then((response) => setNotifications(response.data));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    await api.patch(`/accounts/notifications/${id}/mark_read/`);
    load();
  };

  const markAllRead = async () => {
    await api.patch('/accounts/notifications/mark_all_read/');
    load();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen(!open)} className="relative hover:text-signal">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-1 bg-signal text-paper text-xs px-1.5">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border-l-4 border-signal shadow-lg p-2 z-10 text-ink">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-signal underline p-2">
              Mark all as read
            </button>
          )}
          {notifications.length === 0 ? (
            <p className="text-sm text-steel p-2">No notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-2 cursor-pointer text-sm ${n.is_read ? 'text-steel' : 'bg-paper font-medium'}`}
              >
                <p>{n.title}</p>
                <p className="text-xs text-steel">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;