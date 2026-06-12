import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/common/Loader';
import Rating from '../components/common/Rating';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const load = () => {
    setLoading(true);
    api.get(`/products/${slug}`).then((r) => setP(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, [slug]);

  const onAdd = async () => {
    if (!user) return toast.error('Please sign in to add to cart');
    await dispatch(addToCart({ productId: p._id, quantity: qty }));
    toast.success('Added to cart');
  };

  const onReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${p._id}/reviews`, { rating, comment });
      toast.success('Review added'); setComment(''); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading || !p) return <Loader />;
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded shadow p-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-50 rounded mb-4">
            <img src={p.images?.[activeImg]?.url} alt={p.title} className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-2">
            {p.images?.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-16 h-16 border-2 rounded ${i === activeImg ? 'border-cta' : 'border-gray-200'}`}>
                <img src={img.url} className="w-full h-full object-cover rounded" alt="" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{p.brand} · {p.category}</p>
          <h1 className="text-2xl font-bold mb-2">{p.title}</h1>
          <Rating value={p.rating} count={p.numReviews} />
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">₹{p.price.toLocaleString()}</span>
            <span className="text-lg text-gray-500 line-through">₹{p.mrp.toLocaleString()}</span>
            {off > 0 && <span className="text-green-700 font-medium">{off}% off</span>}
          </div>
          <p className="text-sm text-green-700 mt-1">Inclusive of all taxes · Free shipping over ₹499</p>
          <p className="mt-4 text-gray-700">{p.description}</p>
          <p className="mt-2 text-sm">
            {p.stock > 0 ? <span className="text-green-700 font-medium">In stock ({p.stock} left)</span>
              : <span className="text-red-600 font-medium">Out of stock</span>}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <label className="text-sm">Qty:</label>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))}
              className="border rounded px-3 py-1.5">
              {Array.from({ length: Math.min(p.stock, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={onAdd} disabled={p.stock === 0} className="btn-accent flex-1 disabled:opacity-50">
              Add to Cart
            </button>
            <button onClick={async () => { await onAdd(); window.location.href = '/cart'; }}
              disabled={p.stock === 0} className="btn-cta flex-1 disabled:opacity-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Reviews ({p.numReviews})</h2>
        {user && (
          <form onSubmit={onReview} className="mb-6 border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-2 py-1">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..." className="w-full border rounded p-2 mb-2" rows={3} required />
            <button className="btn-cta">Submit Review</button>
          </form>
        )}
        <div className="space-y-4">
          {p.reviews?.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {p.reviews?.map((r) => (
            <div key={r._id} className="border-b pb-3">
              <div className="flex justify-between">
                <span className="font-medium">{r.name}</span>
                <Rating value={r.rating} />
              </div>
              <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
