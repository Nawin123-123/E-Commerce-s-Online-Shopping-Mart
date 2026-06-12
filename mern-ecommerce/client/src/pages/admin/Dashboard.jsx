import { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)); }, []);
  if (!data) return <Loader />;

  const stats = [
    { label: 'Total Revenue', value: `₹${data.revenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-green-500' },
    { label: 'Orders', value: data.orderCount, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Users', value: data.userCount, icon: Users, color: 'bg-purple-500' },
    { label: 'Products', value: data.productCount, icon: Package, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded shadow p-4">
            <div className={`${s.color} w-10 h-10 rounded flex items-center justify-center text-white mb-2`}>
              <s.icon size={20} />
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-bold mb-3">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead className="text-left bg-gray-50">
            <tr><th className="p-2">ID</th><th className="p-2">User</th><th className="p-2">Total</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{o._id.slice(-8)}</td>
                <td className="p-2">{o.user?.name}</td>
                <td className="p-2">₹{o.total.toLocaleString()}</td>
                <td className="p-2 capitalize">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
