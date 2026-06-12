import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Search, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../features/auth/authSlice';
import { resetCart } from '../../features/cart/cartSlice';

export default function Header() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q)}`);
  };

  const onLogout = () => {
    dispatch(logout()); dispatch(resetCart()); nav('/');
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="bg-primary text-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-accent">ShopKart</Link>
        <form onSubmit={onSearch} className="flex-1 flex max-w-2xl">
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
            className="flex-1 px-4 py-2 rounded-l text-gray-900 focus:outline-none"
          />
          <button className="bg-accent hover:bg-accent-hover px-4 rounded-r text-primary">
            <Search size={20} />
          </button>
        </form>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-1 hover:text-accent">
                <User size={18} /> <span className="text-sm">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg py-1">
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <Package size={16} /> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <LayoutDashboard size={16} /> Admin
                    </Link>
                  )}
                  <button onClick={onLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm hover:text-accent">Sign In</Link>
          )}
          <Link to="/cart" className="flex items-center gap-1 hover:text-accent relative">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-cta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{count}</span>
            )}
            <span className="text-sm hidden lg:inline">Cart</span>
          </Link>
        </div>
      </div>
      <nav className="bg-primary-light px-4 py-2 text-sm">
        <div className="container mx-auto flex gap-6 overflow-x-auto">
          <Link to="/products" className="hover:text-accent">All</Link>
          <Link to="/products?category=Electronics" className="hover:text-accent">Electronics</Link>
          <Link to="/products?category=Fashion" className="hover:text-accent">Fashion</Link>
          <Link to="/products?category=Home & Kitchen" className="hover:text-accent">Home & Kitchen</Link>
          <Link to="/products?category=Books" className="hover:text-accent">Books</Link>
          <Link to="/products?category=Sports" className="hover:text-accent">Sports</Link>
        </div>
      </nav>
    </header>
  );
}
