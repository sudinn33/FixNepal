import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function BookService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [profile, setProfile] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/services/${serviceId}/`)
      .then((response) => setService(response.data))
      .catch(() => setError('Could not load this service.'));
    api.get('/accounts/profile/').then((response) => {
      setProfile(response.data);
      setAddress(response.data.address || '');
      setContactPhone(response.data.phone_number || '');
    });
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings/', {
        provider: service.provider,
        service: service.id,
        scheduled_date: date,
        scheduled_time: time,
        address,
        contact_phone: contactPhone,
        notes,
        total_cost: service.base_price,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Booking failed. Check the date and time.');
    }
  };

  if (error && !service) return <p className="p-6 text-red-800">{error}</p>;
  if (!service || !profile) return <p className="p-6">Loading...</p>;

  const profileIncomplete = !profile.phone_number || !profile.address;

  if (profileIncomplete) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-10">
          <div className="bg-white border-l-4 border-signal p-6">
            <h1 className="font-display text-xl mb-3">Add your contact details first</h1>
            <p className="text-steel mb-5">
              The provider needs your phone number and address to do the job. Add them to your account before booking.
            </p>
            <Link to="/account" className="inline-block bg-signal text-paper font-display tracking-wide px-4 py-2">
              Go to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white border-l-4 border-signal p-6">
          <p className="font-display text-sm tracking-wide text-steel mb-1">Service request</p>
          <h1 className="font-display text-2xl mb-1">{service.title}</h1>
          <p className="text-steel text-sm mb-1">By {service.provider_name}</p>
          {service.provider_phone && (
            <p className="text-steel text-sm mb-4">Provider contact: {service.provider_phone}</p>
          )}
          <p className="font-display text-signal mb-6">Rs. {service.base_price}</p>

          {error && <p className="text-red-800 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm text-steel mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

            <label className="block text-sm text-steel mb-1">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

            <label className="block text-sm text-steel mb-1">Where should the provider come?</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

            <label className="block text-sm text-steel mb-1">Contact number for this booking</label>
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

            <label className="block text-sm text-steel mb-1">Notes for the provider (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" />

            <p className="text-xs text-steel mb-6">
              Payment: cash to the provider once the job is done. Online payment isn't available in this prototype.
            </p>

            <button type="submit" className="w-full bg-signal text-paper font-display tracking-wide py-2">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookService;