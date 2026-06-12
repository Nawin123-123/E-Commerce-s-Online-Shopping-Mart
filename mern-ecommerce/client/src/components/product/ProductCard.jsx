import { Link } from 'react-router-dom';
import Rating from '../common/Rating';

export default function ProductCard({ product }) {
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link to={`/products/${product.slug}`} className="card p-3 group">
      <div className="aspect-square overflow-hidden bg-gray-50 rounded mb-3">
        <img src={product.images?.[0]?.url} alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <h3 className="text-sm font-medium line-clamp-2 mb-1">{product.title}</h3>
      <Rating value={product.rating} count={product.numReviews} />
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
        <span className="text-xs text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
        {off > 0 && <span className="text-xs text-green-700 font-medium">{off}% off</span>}
      </div>
    </Link>
  );
}
