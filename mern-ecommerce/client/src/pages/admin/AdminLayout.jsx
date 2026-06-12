import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="bg-white rounded shadow p-3 h-fit">
        <h2 className="font-bold mb-3 px-2">Admin Panel</h2>
        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label, end }) => {
            const active = end ? pathname === to : pathname.startsWith(to);
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${active ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div><Outlet /></div>
    </div>
  );
}
