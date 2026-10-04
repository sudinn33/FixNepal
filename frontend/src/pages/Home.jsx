import CategorySuggest from "../components/CategorySuggest";
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

// Groups are matched by category name. Edit names here if yours differ.
const GROUPS = [
  { label: 'Plumbing', names: ['Plumbing'] },
  { label: 'Electrical', names: ['Electrical'] },
  {
    label: 'Cleaning',
    names: ['Cleaning', 'Basic Cleaning', 'Deep Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning', 'Sofa/Carpet Cleaning'],
  },
  { label: 'Carpentry & Assembly', names: ['Carpentry', 'Furniture Assembly', 'Wall Mounting'] },
  { label: 'Painting & Renovation', names: ['Painting', 'Waterproofing', 'Renovation', 'Tile Repair'] },
  { label: 'Appliance Repair', names: ['Appliance Repair'] },
  { label: 'Gardening & Outdoor', names: ['Gardening', 'Lawn Maintenance', 'Tree Trimming', 'Landscaping'] },
  { label: 'Moving', names: ['House Moving', 'Packing', 'Loading/Unloading', 'Furniture Moving'] },
  { label: 'Tech Setup', names: ['Wi-Fi Setup', 'CCTV Installation', 'Computer/Laptop Setup', 'TV Installation'] },
];

function Home() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(''); // '' | 'group:Label' | 'cat:ID'
  const [suggestKey, setSuggestKey] = useState(0); // changing this resets the AI box
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories/').then((response) => setCategories(response.data));
    api.get('/reviews/').then((response) => {
      const sorted = [...response.data].sort((a, b) => b.rating - a.rating);
      setReviews(sorted.slice(0, 3));
    });
    api.get('/services/')
      .then((response) => setServices(response.data))
      .catch(() => setError('Could not load services. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => {
    const used = new Set();
    const result = GROUPS.map((g) => {
      const cats = categories.filter((c) => g.names.includes(c.name));
      cats.forEach((c) => used.add(c.id));
      return { label: g.label, cats };
    }).filter((g) => g.cats.length > 0);
    const leftovers = categories.filter((c) => !used.has(c.id));
    if (leftovers.length > 0) result.push({ label: 'Other', cats: leftovers });
    return result;
  }, [categories]);

  const handleSuggest = (cat) => {
    const name = typeof cat === 'string' ? cat : (cat?.category ?? cat?.name);
    const all = groups.flatMap((g) => g.cats);
    const match = all.find((c) => c.name.toLowerCase() === String(name).toLowerCase());
    if (match) setFilter(`cat:${match.id}`);
  };

  const clearFilters = () => {
    setSearch('');
    setFilter('');
    setSuggestKey((k) => k + 1); // rebuilds the AI box with empty text
  };

  const visibleServices = useMemo(() => {
    let allowedNames = null;
    if (filter.startsWith('group:')) {
      const g = groups.find((grp) => grp.label === filter.slice(6));
      allowedNames = g ? g.cats.map((c) => c.name) : [];
    } else if (filter.startsWith('cat:')) {
      const c = categories.find((cat) => String(cat.id) === filter.slice(4));
      allowedNames = c ? [c.name] : [];
    }

    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      if (allowedNames && !allowedNames.includes(s.category_name)) return false;
      if (!q) return true;
      return [s.title, s.description, s.provider_name, s.category_name]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(q));
    });
  }, [services, search, filter, groups, categories]);

  const scrollToListings = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasFilters = search || filter;
  const canBook = !user || user.role === 'customer';

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />

            {/* Hero: headline on the left, search panel on the right */}
      <section className="bg-workshop text-paper">
        <div className="max-w-5xl mx-auto w-full px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              Fix it right.
              <br />
              Book it fast.
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Trusted plumbers, electricians and cleaners across Nepal, one click away.
            </p>
          </div>

          <div className="bg-white text-ink border-l-4 border-signal p-5 space-y-4">
            <div>
              <label className="block font-display text-lg mb-2">
                Not sure which service you need? Describe the problem
              </label>
              <CategorySuggest key={suggestKey} onSelect={handleSuggest} />
            </div>

            <div>
              <label className="block text-sm text-steel mb-1">Search by keyword</label>
              <input
                type="text"
                placeholder="e.g. pipe repair, wiring..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && scrollToListings()}
                className="w-full border border-steel px-3 py-2 bg-paper"
              />
            </div>

            <div>
              <label className="block text-sm text-steel mb-1">Category</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-steel px-3 py-2 bg-paper"
              >
                <option value="">Any category</option>
                {groups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.cats.length > 1 && (
                      <option value={`group:${g.label}`}>All {g.label}</option>
                    )}
                    {g.cats.map((cat) => (
                      <option key={cat.id} value={`cat:${cat.id}`}>{cat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      <div id="listings" className="max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl">
            Available services {!loading && <span className="text-steel text-base">({visibleServices.length})</span>}
          </h2>
          {hasFilters && (
            <button onClick={clearFilters} className="text-steel text-sm underline">
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-800">{error}</p>
        ) : visibleServices.length === 0 ? (
          <p className="text-steel">No services match your search.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleServices.map((service) => (
              <div key={service.id} className="bg-white border-l-4 border-workshop p-4 flex flex-col">
                <h3 className="font-display text-lg">{service.title}</h3>
                <p className="text-steel text-sm flex-1">{service.description}</p>
                <p className="text-sm text-ink mt-1">
                  {service.provider_name} · {service.category_name}
                </p>
                <p className="font-display text-signal mt-2 mb-3">
                  Rs. {service.base_price} ({service.price_type})
                </p>
                {canBook && (
                  <Link
                    to={`/book/${service.id}`}
                    className="bg-signal text-paper font-display tracking-wide px-4 py-2 text-center"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="font-display text-xl mb-4">What customers are saying</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 border-t-4 border-brass">
                <p className="text-brass font-display mb-1">{'★'.repeat(review.rating)}</p>
                <p className="text-sm text-ink mb-2">"{review.comment}"</p>
                <p className="text-xs text-steel">{review.customer_username} · {review.provider_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;