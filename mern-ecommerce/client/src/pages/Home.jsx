import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const categories = [
  { name: 'Electronics', img: 'https://source.unsplash.com/400x400/?electronics' },
  { name: 'Fashion', img: 'https://source.unsplash.com/400x400/?fashion' },
  { name: 'Home & Kitchen', img: 'https://source.unsplash.com/400x400/?kitchen' },
  { name: 'Books', img: 'https://source.unsplash.com/400x400/?books' },
  { name: 'Sports', img: 'https://source.unsplash.com/400x400/?sports' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/products/featured').then((r) => setFeatured(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Mega Sale Live Now</h1>
          <p className="text-xl text-gray-300 mb-6">Up to 70% off on top brands</p>
          <Link to="/products" className="btn-cta inline-block text-lg px-8 py-3">Shop Now</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded shadow p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`}
              className="text-center group">
              <div className="aspect-square overflow-hidden rounded-full mx-auto w-24 h-24 bg-gray-100 mb-2">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
              </div>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <section className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Today's Best Deals</h2>
          <Link to="/products" className="text-cta hover:underline text-sm">View all →</Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
