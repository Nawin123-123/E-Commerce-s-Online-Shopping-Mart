import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';

export default function OrderDetail() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setO(r.data)); }, [id]);
  if (!o) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Order #{o._id.slice(-8).toUpperCase()}</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-bold text-lg capitalize">{o.status}</p>
      </div>
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="font-bold mb-2">Items</h3>
        {o.items.map((i, idx) => (
          <div key={idx} className="flex gap-3 py-2 border-b last:border-0">
            <img src={i.image} className="w-16 h-16 object-cover rounded" alt="" />
            <div className="flex-1">
              <p className="font-medium">{i.title}</p>
              <p className="text-sm text-gray-600">Qty: {i.quantity}</p>
            </div>
            <p className="font-bold">₹{(i.price * i.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4 mb-4">
        <h3 className="font-bold mb-2">Shipping Address</h3>
        <p>{o.shippingAddress.name} — {o.shippingAddress.phone}</p>
        <p className="text-sm text-gray-600">{o.shippingAddress.line1}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}</p>
      </div>
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{o.subtotal.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{o.shipping === 0 ? 'FREE' : `₹${o.shipping}`}</span></div>
        <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{o.total.toLocaleString()}</span></div>
        <p className="text-xs text-gray-500 mt-2">Payment: {o.paymentStatus.toUpperCase()} via Razorpay</p>
      </div>
    </div>
  );
}
