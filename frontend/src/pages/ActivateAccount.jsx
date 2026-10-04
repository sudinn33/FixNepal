import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

function ActivateAccount() {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/accounts/activate/${uidb64}/${token}/`)
      .then((response) => {
        setStatus('success');
        setMessage(response.data.detail);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Something went wrong.');
      });
  }, [uidb64, token]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white border-l-4 border-signal p-6 text-center">
          {status === 'loading' && <p>Activating your account...</p>}
          {status !== 'loading' && (
            <>
              <h1 className="font-display text-xl mb-3">{message}</h1>
              {status === 'success' && (
                <Link to="/login" className="inline-block bg-signal text-paper font-display tracking-wide px-4 py-2">
                  Go to Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivateAccount;