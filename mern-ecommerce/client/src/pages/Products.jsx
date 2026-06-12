import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

export default function Products() {
  const [sp, setSp] = useSearchParams();
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const q = sp.get('q') || '';
  const category = sp.get('category') || '';
  const sort = sp.get('sort') || 'newest';
  const page = Number(sp.get('page') || 1);

  useEffect(() => { api.get('/products/categories').then((r) => setCategories(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { q, category, sort, page, limit: 12 } })
      .then((r) => setData(r.data)).finally(() => setLoading(false));
  }, [q, category, sort, page]);

  const setParam = (k, v) => {
    const np = new URLSearchParams(sp);
    v ? np.set(k, v) : np.delete(k);
    np.delete('page');
    setSp(np);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="bg-white p-4 rounded shadow-sm h-fit">
          <h3 className="font-bold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setParam('category', '')}
              className={!category ? 'text-cta font-medium' : 'hover:text-cta'}>All</button></li>
            {categories.map((c) => (
              <li key={c}><button onClick={() => setParam('category', c)}
                className={category === c ? 'text-cta font-medium' : 'hover:text-cta'}>{c}</button></li>
            ))}
          </ul>
        </aside>
        <div>
          <div className="bg-white p-3 rounded shadow-sm flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">{data.total} results {q && `for "${q}"`}</span>
            <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
              className="border rounded px-3 py-1.5 text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          {loading ? <Loader /> : data.items.length === 0 ? (
            <div className="bg-white p-10 text-center rounded">No products found.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.items.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {data.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setParam('page', n)}
                      className={`px-3 py-1 rounded border ${n === page ? 'bg-primary text-white' : 'bg-white'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
