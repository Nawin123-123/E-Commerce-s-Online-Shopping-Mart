import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl mt-2">Page not found</p>
      <Link to="/" className="btn-cta inline-block mt-6">Go Home</Link>
    </div>
  );
}
