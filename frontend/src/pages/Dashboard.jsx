import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';
import AdminDashboard from './AdminDashboard';

function Dashboard() {
  const { user } = useAuth();

  if (user.role === 'provider') return <ProviderDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <CustomerDashboard />;
}

export default Dashboard;