import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';

const statusColor = { placed: 'bg-blue-100 text-blue-700', shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/orders/mine').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white rounded shadow p-10 text-center">
          You have no orders yet. <Link to="/products" className="text-cta">Shop now</Link>
        </div>
      ) : orders.map((o) => (
        <Link key={o._id} to={`/orders/${o._id}`} className="block bg-white rounded shadow p-4 mb-3 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500">ORDER #{o._id.slice(-8).toUpperCase()}</p>
              <p className="text-sm">{new Date(o.createdAt).toLocaleDateString()}</p>
              <p className="font-bold mt-1">₹{o.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{o.items.length} item(s)</p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${statusColor[o.status]}`}>
              {o.status.toUpperCase()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
