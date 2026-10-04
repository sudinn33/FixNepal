import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function ProviderSetup() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({
    business_name: '',
    bio: '',
    primary_category: '',
    experience_years: 0,
    service_area: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/providers/me/').then((response) => {
      if (response.data) {
        navigate('/dashboard');
      } else {
        setChecking(false);
      }
    });
    api.get('/categories/').then((response) => setCategories(response.data));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/providers/', form);
      navigate('/provider/services', { state: { justCreatedProfile: true } });
    } catch (err) {
      setError('Could not create profile. Check every field is filled in.');
    }
  };

  if (checking) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <Link to="/" className="text-steel text-sm hover:text-signal">← Back to Home</Link>

        <div className="bg-white border-l-4 border-signal p-6 mt-2">
          <p className="font-display text-sm tracking-wide text-steel mb-1">New provider</p>
          <h1 className="font-display text-2xl mb-1">Set up your business</h1>
          <p className="text-steel text-sm mb-6">
            Customers see this before they book you.
          </p>

          {error && <p className="text-red-800 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm text-steel mb-1">Business name</label>
            <input name="business_name" value={form.business_name} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

            <label className="block text-sm text-steel mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" rows={2} />

            <label className="block text-sm text-steel mb-1">Primary category</label>
            <select name="primary_category" value={form.primary_category} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label className="block text-sm text-steel mb-1">Years of experience</label>
            <input type="number" name="experience_years" value={form.experience_years} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" min="0" />

            <label className="block text-sm text-steel mb-1">Service area</label>
            <input name="service_area" value={form.service_area} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-6 bg-paper" placeholder="e.g. Kathmandu" />

            <button type="submit" className="w-full bg-signal text-paper font-display tracking-wide py-2">
              Create profile and add a service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProviderSetup;