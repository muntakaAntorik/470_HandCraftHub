// client/src/components/AboutUsPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // Ensure correct import path
import { useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart, LayoutDashboard, Settings } from 'lucide-react'; // Import necessary icons

const AboutUsPage = () => {
  const { isLoggedIn, logout, user } = useAuth(); // Destructure user to get role
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
            <Home size={20} className="mr-1" /> Home
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
        {/* Section 1: Welcome to HandCraftHub */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-center border-l-4 border-indigo-500">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to HandCraftHub</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            HandCraftHub is your premier online marketplace dedicated to the world of handmade products. We are a community of passionate artisans and creative minds, bringing you unique, high-quality items that tell a story. Our platform connects skilled makers with customers who appreciate the beauty, authenticity, and love poured into every handcrafted piece.
          </p>
        </section>

        {/* Section 2: Our History */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-center border-r-4 border-purple-500">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Our History</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Founded in 2025 by a group of university students, HandCraftHub was born from a simple idea: to create a digital home for local artisans. We noticed a gap in the market where talented creators struggled to find a wide audience, and discerning customers had difficulty finding authentic, unique handmade goods. From a small project, we have grown into a thriving community, supporting local economies and celebrating craftsmanship.
          </p>
        </section>

        {/* Section 3: Our Mission */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-center border-l-4 border-green-500">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our mission is to empower artisans and provide a platform that values creativity, quality, and fair trade. We strive to be the bridge that connects the heart of the maker with the home of the customer. We are committed to fostering a sustainable and ethical marketplace where every purchase makes a positive impact.
          </p>
        </section>
        
        {/* Section 4: Meet the Team */}
        <section className="bg-white p-8 rounded-lg shadow-xl text-center border-r-4 border-red-500">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Meet the Team</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            HandCraftHub is built and maintained by a dedicated team of passionate individuals who believe in the power of handmade products. We are engineers, designers, and artists working together to create an exceptional platform for our community.
          </p>
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

export default AboutUsPage;