import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { USER_TYPES } from '@/constants/user';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">AyarFarm Link MSME</h1>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                {user?.user_type === USER_TYPES.ADMIN && (
                  <Link to="/admin">
                    <Button variant="outline">Admin Dashboard</Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={logout} variant="outline">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold text-gray-900">
            Connect Farmers & Buyers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AyarFarm Link MSME bridges the gap between farmers and buyers, 
            creating a sustainable agricultural marketplace.
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">For Farmers</h3>
            <p className="text-gray-600">List your products and reach buyers directly</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">For Buyers</h3>
            <p className="text-gray-600">Access fresh produce from local farmers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Stay connected with instant notifications</p>
          </div>
        </div>
      </main>
    </div>
  );
}
