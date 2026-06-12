import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import { fetchCart } from '../features/cart/cartSlice';

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const loadAddresses = () => api.get('/addresses').then((r) => {
    setAddresses(r.data);
    if (r.data.length && !selected) setSelected(r.data[0]._id);
    if (r.data.length === 0) setShowForm(true);
  });
  useEffect(() => { loadAddresses(); }, []);

  const saveAddress = async (e) => {
    e.preventDefault();
    const res = await api.post('/addresses', form);
    toast.success('Address added');
    setShowForm(false); setSelected(res.data._id); loadAddresses();
  };

  const pay = async () => {
    const address = addresses.find((a) => a._id === selected);
    if (!address) return toast.error('Select an address');
    try {
      const { data } = await api.post('/payment/create-order', { amount: total });
      const options = {
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: 'ShopKart', description: 'Order Payment', order_id: data.orderId,
        handler: async (response) => {
          await api.post('/payment/verify', response);
          await api.post('/orders', { shippingAddress: address, paymentData: response });
          await dispatch(fetchCart());
          toast.success('Order placed!');
          nav('/orders');
        },
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#ff9900' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-4">
        <div className="bg-white rounded shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Shipping Address</h2>
            <button onClick={() => setShowForm(!showForm)} className="text-cta text-sm hover:underline">
              {showForm ? 'Cancel' : '+ Add New'}
            </button>
          </div>
          <div className="space-y-2">
            {addresses.map((a) => (
              <label key={a._id} className={`block border rounded p-3 cursor-pointer ${selected === a._id ? 'border-cta bg-orange-50' : ''}`}>
                <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} className="mr-2" />
                <span className="font-medium">{a.name}</span> · {a.phone}
                <p className="text-sm text-gray-600 ml-5">{a.line1}, {a.line2 && a.line2 + ', '}{a.city}, {a.state} - {a.pincode}</p>
              </label>
            ))}
          </div>
          {showForm && (
            <form onSubmit={saveAddress} className="grid grid-cols-2 gap-3 mt-4 border-t pt-4">
              {['name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map((f) => (
                <input key={f} required={f !== 'line2'} placeholder={f.toUpperCase()}
                  value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className={`border rounded px-3 py-2 ${f === 'line1' || f === 'line2' ? 'col-span-2' : ''}`} />
              ))}
              <button className="btn-cta col-span-2">Save Address</button>
            </form>
          )}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-3">Order Summary ({items.length} items)</h2>
          {items.map((i) => (
            <div key={i.product?._id} className="flex justify-between text-sm py-1">
              <span>{i.product?.title} × {i.quantity}</span>
              <span>₹{(i.product?.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 h-fit">
        <h3 className="font-bold mb-3">Price Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <hr />
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
        <button onClick={pay} className="btn-cta w-full mt-4">Pay ₹{total.toLocaleString()}</button>
        <p className="text-xs text-gray-500 mt-2 text-center">Secured by Razorpay (Test Mode)</p>
      </div>
    </div>
  );
}
