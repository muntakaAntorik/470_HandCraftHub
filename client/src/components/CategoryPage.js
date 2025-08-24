// client/src/components/CategoryPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Define a set of appealing background colors for product cards
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

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
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
  }, [categoryName]);

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
          {products.map((product, index) => (
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
                    <ShoppingCart size={16} className="inline mr-1" /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(product.name)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm"
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
