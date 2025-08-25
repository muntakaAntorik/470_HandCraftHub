// client/src/components/TermsAndConditionsPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const TermsAndConditionsPage = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      {/* Header section with logo and navigation links */}
      <header className="bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between flex-wrap rounded-b-lg text-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-900 transition-colors duration-200">HandCraftHub</Link>
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              disabled // Search is disabled on this page
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>
        <nav className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link to="/" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
            Home
          </Link>
          <Link to="/cart" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
            <ShoppingCart size={20} className="mr-1" /> Cart
          </Link>
          <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
            <Heart size={20} className="mr-1" /> Wishlist
          </Link>
          {isLoggedIn ? (
            <>
              {user && user.role === 'seller' && (
                <Link to="/seller/dashboard" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
                  <LayoutDashboard size={20} className="mr-1" /> Seller Dashboard
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link to="/admin/panel" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
                  <Settings size={20} className="mr-1" /> Update Website
                </Link>
              )}
              <Link to="/myorders" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
                Purchase History
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
                <User size={20} className="mr-1" /> Register
              </Link>
              <Link to="/login" className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-200">
                Login
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Section 1: Terms & Conditions */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-left border-l-4 border-indigo-500">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Terms & Conditions</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            <li>By using HandCraftHub, you agree to these terms.</li>
            <li>All products listed are handmade and unique.</li>
            <li>Sellers are responsible for product descriptions and quality.</li>
            <li>Buyers must provide accurate shipping and payment information.</li>
            <li>Unauthorized use of content from this site is prohibited.</li>
            <li>We reserve the right to modify or terminate services at any time.</li>
            <li>Disputes will be resolved through arbitration in Dhaka, Bangladesh.</li>
            <li>Your account may be suspended for violations of these terms.</li>
            <li>Prices are subject to change without prior notice.</li>
          </ul>
        </section>

        {/* Section 2: Refund Policy */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-left border-r-4 border-purple-500">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Refund Policy</h2>
          <p className="text-lg text-gray-700">
            Customers may request a refund within 7 days of receiving a product if it is damaged or not as described. To initiate a refund, please contact the seller directly through the platform. Handmade items are unique, and minor variations are expected. Refunds will be processed after the returned item is inspected by the seller. Shipping costs for returns are generally the responsibility of the buyer unless the item is faulty.
          </p>
        </section>

        {/* Section 3: Privacy Policy */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-left border-l-4 border-green-500">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Privacy Policy</h2>
          <p className="text-lg text-gray-700">
            At HandCraftHub, we are committed to protecting your privacy. We collect personal information (name, email, address, phone number) only for order processing and communication. Your data will not be shared with third parties for marketing purposes. We use secure servers to protect your information. By using our services, you consent to our data collection and usage practices as outlined in this policy.
          </p>
        </section>
        
        {/* Section 4: Other Policies */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-left border-r-4 border-red-500">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Other Policies</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            <li>**Shipping Policy**: All orders are processed within 2-3 business days. Delivery times may vary based on location.</li>
            <li>**Cookie Policy**: We use cookies to enhance your browsing experience. By continuing to use our site, you agree to our cookie policy.</li>
            <li>**Content Policy**: Users are prohibited from uploading offensive or illegal content. Violations will result in account termination.</li>
          </ul>
        </section>

      </main>

      <footer className="bg-gray-800 text-white py-6 mt-10 rounded-t-lg shadow-inner">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} HandCraftHub. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditionsPage;