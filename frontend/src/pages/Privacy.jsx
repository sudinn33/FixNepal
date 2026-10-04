import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Privacy() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10 flex-1">
        <h1 className="font-display text-2xl mb-4">Privacy Policy</h1>
        <p className="text-steel mb-4">
          FixNepal stores the account details you provide — username, email, phone number,
          address, and role — to operate the booking and provider-matching features of this
          prototype.
        </p>
        <p className="text-steel mb-4">
          This data is kept in a local database for the purposes of this academic project and
          is not shared with any third party, sold, or used for advertising.
        </p>
        <p className="text-steel">
          Because this is a prototype, data may be reset or deleted at any time during
          development without notice.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;