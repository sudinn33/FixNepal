import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t-4 border-signal bg-white mt-10">
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm text-steel">
        <div>
          <p className="font-display text-lg text-ink mb-2">FixNepal</p>
          <p>
            A directory for finding plumbers, electricians, and cleaners in Kathmandu and
            Lalitpur. Built as a university course project.
          </p>
        </div>
        <div>
          <p className="font-display text-sm tracking-wide text-ink mb-2">Quick Links</p>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-signal">Browse Services</Link></li>
            <li><Link to="/register" className="hover:text-signal">Become a Provider</Link></li>
            <li><Link to="/account" className="hover:text-signal">My Account</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-sm tracking-wide text-ink mb-2">Legal</p>
          <ul className="space-y-1">
            <li><Link to="/terms" className="hover:text-signal">Terms of Use</Link></li>
            <li><Link to="/privacy" className="hover:text-signal">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-steel/30 text-center text-xs text-steel py-4">
        FixNepal — a student project, not a live commercial service.
      </div>
    </footer>
  );
}

export default Footer;