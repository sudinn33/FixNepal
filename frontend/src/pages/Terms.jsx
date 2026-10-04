import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Terms() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10 flex-1">
        <h1 className="font-display text-2xl mb-4">Terms of Use</h1>
        <p className="text-steel mb-4">
          FixNepal is an academic prototype built for a university course project. It is not
          a live commercial service, and no real payments are processed through it.
        </p>
        <p className="text-steel mb-4">
          By creating an account, you agree to use this prototype for demonstration and
          testing purposes only. Bookings, providers, and reviews shown here are test data
          created for evaluation, not real transactions.
        </p>
        <p className="text-steel">
          FixNepal and its developer make no guarantees about the accuracy, availability, or
          reliability of this prototype, and accept no liability for its use.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;