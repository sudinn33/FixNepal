import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function ManageServices() {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    base_price: '',
    price_type: 'fixed',
  });

  const loadServices = (pid) => {
    api.get('/services/', { params: { provider: pid } })
      .then((response) => setServices(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/providers/me/').then((response) => {
      const pid = response.data.id;
      setProviderId(pid);
      loadServices(pid);
      setForm((f) => ({ ...f, category: response.data.primary_category || '' }));
    });
    api.get('/categories/').then((response) => setCategories(response.data));
    api.get('/accounts/profile/').then((response) => setProfile(response.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/services/', form);
      setForm((f) => ({ title: '', description: '', category: f.category, base_price: '', price_type: 'fixed' }));
      loadServices(providerId);
    } catch (err) {
      setError('Could not add service. Check every field is filled in.');
    }
  };

  const toggleAvailable = async (service) => {
    await api.patch(`/services/${service.id}/`, { is_available: !service.is_available });
    loadServices(providerId);
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  const profileIncomplete = !profile.phone_number || !profile.address;

  if (profileIncomplete) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-10">
          <div className="bg-white border-l-4 border-signal p-6">
            <h1 className="font-display text-xl mb-3">Add your contact details first</h1>
            <p className="text-steel mb-5">
              Customers need a phone number to reach you and an area to know where you work. Add them to your account before listing a service.
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
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/dashboard" className="text-steel text-sm hover:text-signal">← Back to Dashboard</Link>

        {location.state?.justCreatedProfile && (
          <div className="bg-workshop text-ink p-3 border-l-4 border-signal mt-2 mb-4 text-sm">
            Business profile created. Now add the service you offer.
          </div>
        )}

        <h1 className="font-display text-2xl mt-2 mb-6">My Services</h1>

        <form onSubmit={handleSubmit} className="bg-white border-l-4 border-signal p-5 mb-8">
          <p className="font-display text-sm tracking-wide text-steel mb-3">Add a service</p>
          <p className="text-xs text-steel mb-3">
            This is one specific job you offer (e.g. "Pipe Repair"), not your business name — that's already set.
          </p>
          {error && <p className="text-red-800 text-sm mb-3">{error}</p>}

          <input name="title" placeholder="e.g. Pipe Repair" value={form.title} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-3 bg-paper" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-3 bg-paper" rows={2} />
          <label className="block text-sm text-steel mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-3 bg-paper" required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex gap-3 mb-3">
            <input type="number" name="base_price" placeholder="Price" value={form.base_price} onChange={handleChange} className="w-1/2 border border-steel px-3 py-2 bg-paper" required />
            <select name="price_type" value={form.price_type} onChange={handleChange} className="w-1/2 border border-steel px-3 py-2 bg-paper">
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <button type="submit" className="bg-signal text-paper font-display tracking-wide px-4 py-2">
            Add Service
          </button>
        </form>

        <p className="font-display text-sm tracking-wide text-steel mb-3">Your listings</p>
        {loading ? (
          <p>Loading...</p>
        ) : services.length === 0 ? (
          <p className="text-steel">No services listed yet.</p>
        ) : (
          <div className="grid gap-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white border-l-4 border-workshop p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display text-lg">{service.title}</h3>
                  <p className="text-sm text-steel">Rs. {service.base_price} ({service.price_type})</p>
                </div>
                <button
                  onClick={() => toggleAvailable(service)}
                  className={`px-3 py-1 text-sm ${service.is_available ? 'bg-steel text-paper' : 'bg-workshop text-ink'}`}
                >
                  {service.is_available ? 'Pause' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageServices;