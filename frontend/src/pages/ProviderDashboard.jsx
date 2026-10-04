import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const borderColor = {
  pending: 'border-brass',
  accepted: 'border-workshop',
  in_progress: 'border-signal',
  completed: 'border-workshop',
  rejected: 'border-red-800',
  cancelled: 'border-steel',
};

function ProviderDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    api.get('/providers/me/').then((response) => {
      if (!response.data) {
        navigate('/provider/setup');
      } else {
        setCheckingProfile(false);
      }
    });
  }, [navigate]);

  const loadBookings = () => {
    api.get('/bookings/')
      .then((response) => setBookings(response.data))
      .catch((error) => console.error('Failed to load bookings:', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!checkingProfile) loadBookings();
  }, [checkingProfile]);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/update_status/`, { status: newStatus });
      loadBookings();
    } catch (err) {
      alert('Could not update status.');
    }
  };

  if (checkingProfile) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl">Bookings Received</h1>
          <Link to="/provider/services" className="text-signal underline text-sm">Manage My Services</Link>
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
                <p className="text-sm text-steel">Customer: {booking.customer_username}</p>
                <p className="text-sm text-steel">
                  {booking.scheduled_date} at {booking.scheduled_time}
                </p>
                {booking.address && <p className="text-sm text-steel">Address: {booking.address}</p>}
                {booking.contact_phone && <p className="text-sm text-steel">Phone: {booking.contact_phone}</p>}
                {booking.notes && <p className="text-sm text-steel">Notes: {booking.notes}</p>}
                <p className="font-display text-sm tracking-wide mt-1">
                  {booking.status.replace('_', ' ').toUpperCase()}
                </p>

                <div className="flex gap-2 mt-3">
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(booking.id, 'accepted')} className="bg-signal text-paper px-3 py-1 text-sm">Accept</button>
                      <button onClick={() => updateStatus(booking.id, 'rejected')} className="bg-red-800 text-paper px-3 py-1 text-sm">Reject</button>
                    </>
                  )}
                  {booking.status === 'accepted' && (
                    <button onClick={() => updateStatus(booking.id, 'in_progress')} className="bg-workshop text-ink px-3 py-1 text-sm">Start Job</button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button onClick={() => updateStatus(booking.id, 'completed')} className="bg-signal text-paper px-3 py-1 text-sm">Mark Completed</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderDashboard;