import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const borderColor = {
  pending: 'border-brass',
  accepted: 'border-workshop',
  in_progress: 'border-signal',
  completed: 'border-workshop',
  rejected: 'border-red-700',
  cancelled: 'border-steel',
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/')
      .then((response) => setBookings(response.data))
      .catch((error) => console.error('Failed to load bookings:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl">All Bookings</h1>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="text-workshop underline text-sm"
          >
            Open Django Admin
          </a>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-steel">No bookings yet.</p>
        ) : (
          <div className="grid gap-3">
            {bookings.map((booking) => (
              <div key={booking.id} className={`bg-white p-4 border-l-4 ${borderColor[booking.status]}`}>
                <h2 className="font-display text-lg">{booking.service_title}</h2>
                <p className="text-sm text-steel">
                  Customer: {booking.customer_username} · Provider: {booking.provider_name}
                </p>
                <p className="text-sm text-steel">
                  {booking.scheduled_date} at {booking.scheduled_time}
                </p>
                <p className="font-display text-sm tracking-wide mt-1">
                  {booking.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;