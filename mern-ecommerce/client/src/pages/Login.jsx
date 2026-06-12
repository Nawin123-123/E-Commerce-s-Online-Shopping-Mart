import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../features/auth/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const { user, loading, error } = useSelector((s) => s.auth);
  const from = loc.state?.from?.pathname || '/';

  useEffect(() => { if (user) nav(from, { replace: true }); }, [user]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const onSubmit = (e) => { e.preventDefault(); dispatch(login({ email, password })); };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input type="email" required placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="password" required placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="btn-cta w-full">
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          New here? <Link to="/register" className="text-cta hover:underline">Create account</Link>
        </p>
        <div className="mt-4 text-xs text-gray-500 border-t pt-3">
          <p className="font-medium">Demo accounts:</p>
          <p>Admin: admin@shopkart.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
}
