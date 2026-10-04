import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [activationLink, setActivationLink] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/accounts/register/', formData);
      setActivationLink(response.data.activation_link);
    } catch (err) {
      setError('That username is already taken.');
    }
  };

  if (activationLink) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="bg-white border-l-4 border-signal p-8 w-full max-w-sm">
          <h1 className="font-display text-2xl mb-4">Almost there</h1>
          <p className="text-steel text-sm mb-4">
            This prototype has no real mail server, so here's your activation link directly
            (a real account would get this by email).
          </p>
          <a
            href={activationLink}
            className="block text-center bg-signal text-paper font-display tracking-wide py-2"
          >
            Activate my account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-white border-l-4 border-signal p-8 w-full max-w-sm">
        <p className="font-display text-sm tracking-wide text-steel mb-1">FixNepal</p>
        <h1 className="font-display text-2xl mb-6">Create an account</h1>

        {error && <p className="text-red-800 text-sm mb-4">{error}</p>}

        <label className="block text-sm text-steel mb-1">Username</label>
        <input name="username" value={formData.username} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

        <label className="block text-sm text-steel mb-1">Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

        <label className="block text-sm text-steel mb-1">Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper" required />

        <label className="block text-sm text-steel mb-1">I am a</label>
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border border-steel px-3 py-2 mb-4 bg-paper">
          <option value="customer">Customer, looking for a service</option>
          <option value="provider">Service provider, offering a service</option>
        </select>

        <label className="flex items-start gap-2 text-sm text-steel mb-6">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
          <span>
            I agree to the <Link to="/terms" className="text-signal underline" target="_blank">Terms</Link> and{' '}
            <Link to="/privacy" className="text-signal underline" target="_blank">Privacy Policy</Link>.
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed}
          className={`w-full font-display tracking-wide py-2 ${agreed ? 'bg-signal text-paper' : 'bg-steel text-paper opacity-60 cursor-not-allowed'}`}
        >
          Create account
        </button>

        <p className="text-sm text-steel text-center mt-5">
          Already registered? <Link to="/login" className="text-signal underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;