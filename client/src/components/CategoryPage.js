// client/src/components/CategoryPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js'; // Ensure correct import path
import { ShoppingCart, Heart } from 'lucide-react'; // Icons for product cards

const CategoryPage = () => {
  const { categoryName } = useParams(); // Get category name from URL
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch products from backend, filtering by category
        const res = await axios.get(`http://localhost:5000/api/products?category=${categoryName}`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching products for category ${categoryName}:`, err);
        setError('Failed to load products for this category. Please try again.');
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]); // Re-fetch when categoryName changes

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
      await axios.post('http://localhost:5000/api/cart/add', { productId, quantity }, config);
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
      await axios.post('http://localhost:5000/api/wishlist/add', { productName }, config);
      alert(`"${productName}" added to wishlist!`);
    } catch (err) {
      console.error('Error adding to wishlist:', err.response ? err.response.data : err.message);
      alert('Failed to add product to wishlist. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center capitalize">
        Products in {categoryName.replace(/-/g, ' ')}
      </h1>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/cccccc/333333?text=Image+Not+Found'; }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-indigo-600 text-xl font-bold">${product.price.toFixed(2)}</p>
                  <div className="flex items-center text-yellow-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                    <span className="text-gray-600 text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md text-sm"
                  >
                    <ShoppingCart size={16} className="inline mr-1" /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product.name)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-md text-sm"
                  >
                    <Heart size={16} className="inline mr-1" /> Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link to="/" className="text-indigo-600 hover:underline">Back to All Products</Link>
      </div>
    </div>
  );
};

export default CategoryPage;
