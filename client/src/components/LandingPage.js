
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
    import { useAuth } from '../context/AuthContext';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';

    const LandingPage = () => {
      const { isLoggedIn, logout, token } = useAuth();
      const navigate = useNavigate();

      const products = [
        { id: '65f6c82a7a4b1c2d3e4f5a6b', name: 'Handcrafted Wooden Bowl', price: 40.00, imageUrl: 'https://placehold.co/300x200/E0E7FF/4338CA?text=Wooden+Bowl', rating: 4.5 },
        { id: '65f6c82a7a4b1c2d3e4f5a6c', name: 'Knitted Scarf', price: 135.00, imageUrl: 'https://placehold.co/300x200/D1FAE5/065F46?text=Knitted+Scarf', rating: 4.8 },
        { id: '65f6c82a7a4b1c2d3e4f5a6d', name: 'Ceramic Mug', price: 99.00, imageUrl: 'https://placehold.co/300x200/FEE2E2/991B1B?text=Ceramic+Mug', rating: 4.2 },
        { id: '65f6c82a7a4b1c2d3e4f5a6e', name: 'Custom Leather Wallet', price: 499.00, imageUrl: 'https://placehold.co/300x200/FFFBEB/92400E?text=Leather+Wallet', rating: 4.7 },
        { id: '65f6c82a7a4b1c2d3e4f5a6f', name: 'Artisanal Soap Set', price: 215.00, imageUrl: 'https://placehold.co/300x200/DBEAFE/1E40AF?text=Artisanal+Soap', rating: 4.6 },
        { id: '65f6c82a7a4b1c2d3e4f5a70', name: 'Hand-painted Canvas', price: 75.00, imageUrl: 'https://placehold.co/300x200/E0F2F1/0F766E?text=Painted+Canvas', rating: 4.9 },
      ];


      const categories = [
        'Jewelry', 'Home Decor', 'Art', 'Accessories',
        'Craft Supplies', 'Clothing', 'Painting', 'Candles & Soap'
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
        <div className="min-h-screen bg-gray-100 font-inter">
        
          <header className="bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between flex-wrap rounded-b-lg">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-indigo-700">HandCraftHub</Link>
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full shadow-md transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/register" className="flex items-center text-gray-700 hover:text-indigo-700 transition-colors duration-200 rounded-md p-2">
                    <User size={20} className="mr-1" /> Register
                  </Link>
                  <Link to="/login" className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full shadow-md transition-colors duration-200">
                    Login
                  </Link>
                </>
              )}
            </nav>
          </header>

    
          <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
 
            <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/category/${category.toLowerCase().replace(/\s/g, '-')}`}
                      className="block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors duration-200"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

  
            <main className="w-full lg:w-3/4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found'; }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-indigo-600 text-xl font-bold">৳{product.price.toFixed(2)}</p>
                        <div className="flex items-center text-yellow-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                          <span className="text-gray-600 text-sm">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md text-sm"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleAddToWishlist(product.name)}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-md text-sm"
                        >
                          Add to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>


          <footer className="bg-gray-800 text-white py-6 mt-10 rounded-t-lg">
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
