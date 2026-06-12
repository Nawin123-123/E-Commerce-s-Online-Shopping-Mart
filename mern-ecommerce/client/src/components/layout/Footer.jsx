import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="font-bold mb-3 text-accent">Get to Know Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li>About ShopKart</li><li>Careers</li><li>Press Releases</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-accent">Make Money</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Sell on ShopKart</li><li>Affiliate Program</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-accent">Let Us Help</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/orders">Your Orders</Link></li><li>Shipping</li><li>Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-accent">Connect</h4>
          <ul className="space-y-2 text-gray-300">
            <li>Facebook</li><li>Twitter</li><li>Instagram</li>
          </ul>
        </div>
      </div>
      <div className="bg-primary-light text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} ShopKart — Built with MERN stack
      </div>
    </footer>
  );
}
