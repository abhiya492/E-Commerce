import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Code, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-100 border-t border-dark-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="self-center text-2xl font-bold whitespace-nowrap text-primary-400">
                ModernShop
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Premium shopping experience with quality products and exceptional service.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Code size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/category/jeans" className="text-gray-400 hover:text-primary-400">Jeans</Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="text-gray-400 hover:text-primary-400">T-Shirts</Link>
              </li>
              <li>
                <Link to="/category/shoes" className="text-gray-400 hover:text-primary-400">Shoes</Link>
              </li>
              <li>
                <Link to="/category/jackets" className="text-gray-400 hover:text-primary-400">Jackets</Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-400">Press</a>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mt-0.5 mr-2 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">123 Fashion St, Style City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary-400 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-primary-400">+1 (123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@modernshop.com" className="text-gray-400 hover:text-primary-400">info@modernshop.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} ModernShop. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-primary-400">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary-400">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary-400">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 