import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ReviewForm from '../components/ReviewForm';

const borderColor = {
  pending: 'border-brass',
  accepted: 'border-workshop',
  in_progress: 'border-signal',
  completed: 'border-workshop',
  rejected: 'border-red-700',
  cancelled: 'border-steel',
};

const ACTIVE_STATUSES = ['pending', 'accepted', 'in_progress'];

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  const loadBookings = () => {
    api.get('/bookings/')
      .then((response) => setBookings(response.data))
      .catch((error) => console.error('Failed to load bookings:', error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/update_status/`, { status: 'cancelled' });
      loadBookings();
    } catch (err) {
      alert('Could not cancel booking.');
    }
  };

  const active = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status));
  const history = bookings.filter((b) => !ACTIVE_STATUSES.includes(b.status));

  const renderBooking = (booking) => (
    <div key={booking.id} className={`bg-white p-4 border-l-4 ${borderColor[booking.status]}`}>
      <h3 className="font-display text-lg">{booking.service_title}</h3>
      <p className="text-sm text-steel">Provider: {booking.provider_name}</p>
      <p className="text-sm text-steel">
        {booking.scheduled_date} at {booking.scheduled_time}
      </p>
            {booking.address && <p className="text-sm text-steel">Address: {booking.address}</p>}
      <p className="font-display text-sm tracking-wide mt-1">
        {booking.status.replace('_', ' ').toUpperCase()}
      </p>

      <div className="flex gap-2 items-center mt-3">
        {booking.status === 'pending' && (
          <button onClick={() => cancelBooking(booking.id)} className="bg-steel text-paper px-3 py-1 text-sm">
            Cancel
          </button>
        )}
        {booking.status === 'completed' && !booking.has_review && reviewingId !== booking.id && (
          <button onClick={() => setReviewingId(booking.id)} className="bg-brass text-ink px-3 py-1 text-sm">
            Leave a Review
          </button>
        )}
        {booking.status === 'completed' && booking.has_review && (
          <span className="text-sm text-steel">Reviewed</span>
        )}
      </div>

      {reviewingId === booking.id && (
        <ReviewForm
          bookingId={booking.id}
          onSubmitted={() => {
            setReviewingId(null);
            loadBookings();
          }}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl mb-6">My Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-steel">No bookings yet.</p>
        ) : (
          <>
            <h2 className="font-display text-sm tracking-wide text-steel mb-3">Active</h2>
            {active.length === 0 ? (
              <p className="text-steel mb-8">No active bookings.</p>
            ) : (
              <div className="grid gap-3 mb-8">{active.map(renderBooking)}</div>
            )}

            <h2 className="font-display text-sm tracking-wide text-steel mb-3">History</h2>
            {history.length === 0 ? (
              <p className="text-steel">No past bookings.</p>
            ) : (
              <div className="grid gap-3">{history.map(renderBooking)}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;