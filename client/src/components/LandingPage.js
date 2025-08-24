    // client/src/components/LandingPage.js

    import React, { useState, useEffect } from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { Home, Search, ShoppingCart, User, Heart, Star, LayoutDashboard, Settings } from 'lucide-react'; // Import new icons
    import { useAuth } from '../context/AuthContext.js';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const LandingPage = () => {
      const { isLoggedIn, logout, token, user } = useAuth(); // Destructure user to get role
      const navigate = useNavigate();
      const location = useLocation();

      const [searchTerm, setSearchTerm] = useState('');
      const [displayedProducts, setDisplayedProducts] = useState(null);
      const [loadingProducts, setLoadingProducts] = useState(true);
      const [productError, setProductError] = useState('');

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            setLoadingProducts(true);
            setProductError('');

            const apiUrl = `http://localhost:5000/api/products?keyword=${searchTerm}`;
            
            console.log(`Fetching products from: ${apiUrl}`);
            const res = await axios.get(apiUrl);
            
            console.log('Products fetched successfully:', res.data);
            setDisplayedProducts(res.data);
            setLoadingProducts(false);
          } catch (err) {
            console.error('Error fetching products from frontend:', err);
            setProductError(err.response && err.response.data && err.response.data.msg 
                             ? `Server Error: ${err.response.data.msg}`
                             : 'Failed to load products. Please check network or server logs.');
            setLoadingProducts(false);
          }
        };

        const debounceFetch = setTimeout(() => {
          fetchProducts();
        }, 300);

        return () => clearTimeout(debounceFetch);
      }, [searchTerm]);

      const categories = [
        'Home decor', 'Arts', 'Clothing', 'Painting', 'Accessories', 'Jewelry', 'Candles & Soap'
      ];

      const productCardColors = [
        'bg-gradient-to-br from-blue-50 to-blue-100',
        'bg-gradient-to-br from-green-50 to-green-100',
        'bg-gradient-to-br from-red-50 to-red-100',
        'bg-gradient-to-br from-yellow-50 to-yellow-100',
        'bg-gradient-to-br from-purple-50 to-purple-100',
        'bg-gradient-to-br from-pink-50 to-pink-100',
        'bg-gradient-to-br from-indigo-50 to-indigo-100',
        'bg-gradient-to-br from-teal-50 to-teal-100'
      ];

      const handleAddToCart = async (productId) => {
        if (!isLoggedIn) {
          alert('Please log in to add items to your cart.');
          navigate('/login');
          return;
        }

        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const quantity = 1;

          const res = await axios.post('http://localhost:5000/api/cart/add', { productId, quantity }, config);
          console.log('Add to cart response:', res.data);
          alert('Product added to cart!');
        } catch (err) {
          console.error('Error adding to cart:', err.response ? err.response.data : err.message);
          alert('Failed to add product to cart. Please try again.');
        }
      };

      const handleAddToWishlist = async (productName) => {
        if (!isLoggedIn) {
          alert('Please log in to add items to your wishlist.');
          navigate('/login');
          return;
        }

        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const res = await axios.post('http://localhost:5000/api/wishlist/add', { productName }, config);
          console.log('Add to wishlist response:', res.data);
          alert(`"${productName}" added to wishlist!`);
        } catch (err) {
          console.error('Error adding to wishlist:', err.response ? err.response.data : err.message);
          alert('Failed to add product to wishlist. Please try again.');
        }
      };

      const handleLogout = () => {
        logout();
        navigate('/');
      };

      return (
        <div className="min-h-screen bg-gray-50 font-inter">
          {/* Header section with logo, search bar, and navigation links */}
          <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg py-4 px-6 md:px-10 flex items-center justify-between flex-wrap rounded-b-lg text-white">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-200">HandCraftHub</Link>
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>
            </div>
            <nav className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                <Home size={20} className="mr-1" /> Home
              </Link>
              <Link to="/cart" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                <ShoppingCart size={20} className="mr-1" /> Cart
              </Link>
              <Link to="/wishlist" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                <Heart size={20} className="mr-1" /> Wishlist
              </Link>
              {isLoggedIn ? (
                <>
                  {user && user.role === 'seller' && (
                    <Link to="/seller/dashboard" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                      <LayoutDashboard size={20} className="mr-1" /> Seller Dashboard
                    </Link>
                  )}
                  {user && user.role === 'admin' && (
                    <Link to="/admin/panel" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                      <Settings size={20} className="mr-1" /> Update Website
                    </Link>
                  )}
                  <Link to="/myorders" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
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
                  <Link to="/register" className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200 rounded-md p-2">
                    <User size={20} className="mr-1" /> Register
                  </Link>
                  <Link to="/login" className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                    Login
                  </Link>
                </>
              )}
            </nav>
          </header>

          {/* Main content area with categories sidebar and product grid */}
          <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
            {/* Sidebar for Categories */}
            <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category, index) => {
                  const categorySlug = category.replace(/\s/g, '-');
                  const isActive = location.pathname === `/category/${categorySlug}`;
                  return (
                    <li key={index}>
                      <Link
                        to={`/category/${categorySlug}`}
                        className={`block text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-all duration-200 ${
                          isActive ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
                        }`}
                      >
                        {category}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Product Grid - displays dynamically fetched products */}
            <main className="w-full lg:w-3/4">
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
                {loadingProducts ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : productError ? (
                  <div className="text-center py-8 text-red-600">{productError}</div>
                ) : displayedProducts === null || displayedProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No products found.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {displayedProducts.map((product, index) => (
                      <div
                        key={product._id}
                        className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 ${productCardColors[index % productCardColors.length]}`}
                      >
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found'; }}
                          />
                        </Link>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            <Link to={`/product/${product._id}`} className="hover:text-indigo-600">
                              {product.name}
                            </Link>
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-indigo-600 text-xl font-bold">৳{product.price.toFixed(2)}</p>
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < product.rating ? 'fill-current' : 'text-gray-300'}
                                />
                              ))}
                              <span className="ml-1 text-gray-600 text-sm">({product.numReviews})</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => handleAddToCart(product._id)}
                              className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 text-sm"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleAddToWishlist(product.name)}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm"
                            >
                              Add to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            </main>
          </div>

          {/* Footer section */}
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

    export default LandingPage;
    