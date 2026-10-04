import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = { customer: 'Customer', provider: 'Service Provider', admin: 'Administrator' };
const inputClass = 'w-full border border-steel px-3 py-2 bg-paper';

function Account() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    api.get('/accounts/profile/').then((response) => setForm(response.data));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const response = await api.patch('/accounts/profile/', form);
      setForm(response.data);
      setToast('Account details saved.');
    } catch (err) {
      setError('Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pw.next !== pw.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwSaving(true);
    try {
      await api.post('/accounts/change-password/', {
        current_password: pw.current,
        new_password: pw.next,
      });
      setPw({ current: '', next: '', confirm: '' });
      setToast('Password changed.');
    } catch (err) {
      setPwError(err.response?.data?.detail || 'Could not change password.');
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!form) return <p className="p-6">Loading...</p>;

  const displayName = [form.first_name, form.last_name].filter(Boolean).join(' ') || form.username;
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = form.date_joined
    ? new Date(form.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '';

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {toast && (
        <div className="fixed top-20 right-6 bg-workshop text-paper px-4 py-3 border-l-4 border-signal shadow-lg z-20">
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <Link
          to="/dashboard"
          className="inline-block border border-steel px-4 py-2 text-sm hover:border-signal hover:text-signal"
        >
          ← Back to Dashboard
        </Link>

        {/* Profile header */}
        <div className="bg-white border-l-4 border-signal p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-workshop text-paper font-display text-3xl flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl truncate">{displayName}</h1>
            <p className="text-steel text-sm">@{form.username}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="bg-workshop text-paper px-2 py-1 font-display tracking-wide">
                {ROLE_LABELS[form.role] || form.role}
              </span>
              {memberSince && <span className="text-steel">Member since {memberSince}</span>}
              <span className={form.is_active ? 'text-workshop' : 'text-red-800'}>
                {form.is_active ? '● Account active' : '● Not activated'}
              </span>
            </div>
          </div>
        </div>

        {/* Personal details */}
        <form onSubmit={handleSubmit} className="bg-white border-l-4 border-workshop p-6">
          <h2 className="font-display text-xl mb-4">Personal details</h2>
          {error && <p className="text-red-800 text-sm mb-4">{error}</p>}

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-steel mb-1">First name</label>
              <input name="first_name" value={form.first_name ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-steel mb-1">Last name</label>
              <input name="last_name" value={form.last_name ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-steel mb-1">Email</label>
              <input name="email" type="email" value={form.email ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-steel mb-1">Phone number</label>
              <input name="phone_number" value={form.phone_number ?? ''} onChange={handleChange} className={inputClass} placeholder="e.g. 98XXXXXXXX" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-steel mb-1">Address</label>
              <input name="address" value={form.address ?? ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-steel mb-1">City</label>
              <input name="city" value={form.city ?? ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-signal text-paper font-display tracking-wide py-2 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePassword} className="bg-white border-l-4 border-brass p-6">
          <h2 className="font-display text-xl mb-4">Change password</h2>
          {pwError && <p className="text-red-800 text-sm mb-4">{pwError}</p>}

          <label className="block text-sm text-steel mb-1">Current password</label>
          <input
            type="password"
            value={pw.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
            className={`${inputClass} mb-4`}
            required
          />

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-steel mb-1">New password</label>
              <input
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-steel mb-1">Confirm new password</label>
              <input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                className={inputClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="w-full bg-workshop text-paper font-display tracking-wide py-2 disabled:opacity-60"
          >
            {pwSaving ? 'Updating...' : 'Update password'}
          </button>
        </form>

        {/* Session */}
        <div className="bg-white border-l-4 border-steel p-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl">Sign out</h2>
            <p className="text-steel text-sm">Log out of FixNepal on this device.</p>
          </div>
          <button onClick={handleLogout} className="border border-red-800 text-red-800 px-4 py-2 font-display tracking-wide hover:bg-red-800 hover:text-paper">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;