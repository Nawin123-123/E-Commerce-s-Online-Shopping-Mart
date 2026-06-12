import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus } from 'lucide-react';
import api from '../../services/api';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const empty = { title: '', description: '', brand: '', category: 'Electronics', price: 0, mrp: 0, stock: 10, isFeatured: false };

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [show, setShow] = useState(false);

  const load = () => api.get('/products?limit=100').then((r) => setItems(r.data.items));
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      let images = [];
      if (files.length) {
        const fd = new FormData();
        files.forEach((f) => fd.append('images', f));
        const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        images = res.data;
      }
      await api.post('/products', { ...form, slug: slugify(form.title), images, price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock) });
      toast.success('Product created');
      setForm(empty); setFiles([]); setShow(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products ({items.length})</h1>
        <button onClick={() => setShow(!show)} className="btn-cta flex items-center gap-1">
          <Plus size={16} /> Add Product
        </button>
      </div>
      {show && (
        <form onSubmit={save} className="bg-white rounded shadow p-4 mb-4 grid grid-cols-2 gap-3">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded px-3 py-2 col-span-2" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded px-3 py-2 col-span-2" rows={3} />
          <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="border rounded px-3 py-2" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded px-3 py-2">
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded px-3 py-2" />
          <input type="number" placeholder="MRP" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded px-3 py-2" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
          </label>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} className="col-span-2" />
          <button className="btn-cta col-span-2">Save Product</button>
        </form>
      )}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-2">Image</th><th className="p-2">Title</th><th className="p-2">Category</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2"></th></tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2"><img src={p.images?.[0]?.url} className="w-12 h-12 object-cover rounded" alt="" /></td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2"><button onClick={() => remove(p._id)} className="text-red-600"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
