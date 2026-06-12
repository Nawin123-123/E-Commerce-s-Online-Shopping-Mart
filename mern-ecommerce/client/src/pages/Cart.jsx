import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { updateCartItem, removeFromCart } from '../features/cart/cartSlice';

export default function Cart() {
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 40;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="btn-cta">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 grid md:grid-cols-[1fr_320px] gap-6">
      <div className="bg-white rounded shadow">
        <h2 className="text-xl font-bold p-4 border-b">Shopping Cart</h2>
        {items.map((i) => (
          <div key={i.product?._id} className="p-4 border-b flex gap-4">
            <img src={i.product?.images?.[0]?.url} className="w-24 h-24 object-cover rounded" alt="" />
            <div className="flex-1">
              <Link to={`/products/${i.product?.slug}`} className="font-medium hover:text-cta">{i.product?.title}</Link>
              <p className="text-sm text-gray-500 mt-1">{i.product?.brand}</p>
              <p className="font-bold mt-2">₹{i.product?.price?.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-3">
                <select value={i.quantity}
                  onChange={(e) => dispatch(updateCartItem({ productId: i.product._id, quantity: Number(e.target.value) }))}
                  className="border rounded px-2 py-1">
                  {Array.from({ length: 10 }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <button onClick={() => dispatch(removeFromCart(i.product._id))}
                  className="text-red-600 hover:underline text-sm flex items-center gap-1">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4 h-fit">
        <h3 className="font-bold mb-3">Price Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal ({items.length})</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Delivery</span>
            <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <hr />
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{(subtotal + shipping).toLocaleString()}</span></div>
        </div>
        <button onClick={() => nav('/checkout')} className="btn-cta w-full mt-4">Place Order</button>
      </div>
    </div>
  );
}
