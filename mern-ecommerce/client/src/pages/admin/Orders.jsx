import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders/all').then((r) => setOrders(r.data));
  useEffect(load, []);

  const update = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success(`Marked ${status}`); load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders ({orders.length})</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-2">ID</th><th className="p-2">User</th><th className="p-2">Date</th><th className="p-2">Total</th><th className="p-2">Payment</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{o._id.slice(-8)}</td>
                <td className="p-2">{o.user?.name}<br /><span className="text-xs text-gray-500">{o.user?.email}</span></td>
                <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-2">₹{o.total.toLocaleString()}</td>
                <td className="p-2 capitalize">{o.paymentStatus}</td>
                <td className="p-2">
                  <select value={o.status} onChange={(e) => update(o._id, e.target.value)} className="border rounded px-2 py-1">
                    {['placed', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
