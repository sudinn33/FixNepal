import { useState } from 'react';
import api from '../api/axios';

function ReviewForm({ bookingId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews/', { booking: bookingId, rating, comment });
      onSubmitted();
    } catch (err) {
      setError('Could not submit review — it may already be reviewed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-t border-steel pt-3">
      {error && <p className="text-red-700 text-sm mb-2">{error}</p>}
      <label className="block text-sm text-steel mb-1">Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border border-steel px-2 py-1 mb-2 bg-paper"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
        ))}
      </select>
      <textarea
        placeholder="How was the service?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-steel px-2 py-1 mb-2 text-sm bg-paper"
        rows={2}
      />
      <button type="submit" className="bg-brass text-ink px-3 py-1 text-sm">
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;