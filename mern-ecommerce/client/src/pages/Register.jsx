import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register } from '../features/auth/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { user, loading, error } = useSelector((s) => s.auth);
  useEffect(() => { if (user) nav('/'); }, [user]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(register(form)); }} className="space-y-3">
          {['name', 'email', 'phone', 'password'].map((f) => (
            <input key={f} type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'} required
              placeholder={f[0].toUpperCase() + f.slice(1)} value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          ))}
          <button disabled={loading} className="btn-cta w-full">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-cta hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
