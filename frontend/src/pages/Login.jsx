import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full border border-steel px-3 py-2 bg-paper focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal';

const PERKS = [
  'Track your bookings from request to done',
  'Manage your services and availability',
  'Leave reviews for providers you trust',
];

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userInfo = await login(username, password);
      navigate(userInfo.role === 'customer' ? '/' : '/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Could not reach the server. Please check your connection and try again.');
      } else {
        setError(
          "That username or password is wrong, or your account isn't activated yet. Check your email for the activation link."
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <Link to="/" className="inline-block text-steel text-sm hover:text-signal mb-4">
          ← Back to home
        </Link>

        <div className="grid md:grid-cols-2 shadow-lg">
          {/* Brand panel */}
          <div className="bg-workshop text-paper p-8 md:p-10 flex flex-col justify-between border-b-4 md:border-b-0 md:border-l-4 border-signal">
            <div>
              <p className="font-display text-2xl tracking-wide mb-6">FixNepal</p>
              <h1 className="font-display text-3xl md:text-4xl leading-tight mb-3">Welcome back.</h1>
              <p className="text-paper/80 text-sm">
                Log in to pick up where you left off.
              </p>
            </div>

            <ul className="hidden md:block mt-10 space-y-3 text-sm">
              {PERKS.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <span className="text-signal">●</span>
                  <span className="text-paper/90">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form panel */}
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10">
            <h2 className="font-display text-2xl mb-1">Log in</h2>
            <p className="text-steel text-sm mb-6">Enter your details to continue.</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-800 text-red-800 text-sm px-3 py-2 mb-5" role="alert">
                {error}
              </div>
            )}

            <label htmlFor="username" className="block text-sm text-steel mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
              className={`${inputClass} mb-4`}
            />

            <label htmlFor="password" className="block text-sm text-steel mb-1">Password</label>
            <div className="relative mb-6">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-steel hover:text-signal"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal text-paper font-display tracking-wide py-2.5 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <p className="text-sm text-steel text-center mt-6">
              New here?{' '}
              <Link to="/register" className="text-signal underline">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;