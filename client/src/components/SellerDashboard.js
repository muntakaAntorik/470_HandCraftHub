// client/src/components/SellerDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const SellerDashboard = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== 'seller') {
      alert('You must be logged in as a seller to access this page.');
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch seller's products
  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (user && user.role === 'seller') {
        try {
          setLoading(true);
          setError('');
          const config = {
            headers: {
              'x-auth-token': token // This line is crucial for authentication
            }
          };
          // Fetch products specifically for the logged-in seller
          const res = await axios.get(`http://localhost:5000/api/products/seller/${user.id}`, config);
          setProducts(res.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching seller products:', err);
          setError(err.response ? err.response.data.msg : 'Failed to load your products. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchSellerProducts();
  }, [user, token]); // Re-fetch when user or token changes

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token // This line is crucial for authentication
        }
      };
      await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
      alert('Product deleted successfully!');
      setProducts(products.filter(p => p._id !== productId)); // Remove from UI
    } catch (err) {
      console.error('Error deleting product:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.msg : 'Failed to delete product.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading seller dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!user || user.role !== 'seller') {
    return <div className="text-center py-8 text-gray-600">Access Denied: Not a seller.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Seller Dashboard</h1>

      <div className="flex justify-end mb-6">
        <Link
          to="/seller/add-product"
          className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
        >
          <PlusCircle size={20} className="mr-2" /> Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-600">You have not listed any products yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Your Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Stock</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {products.map(product => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                    <td className="py-3 px-6 text-left">{product.category}</td>
                    <td className="py-3 px-6 text-left">৳{product.price.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">{product.countInStock}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-3">
                        <Link to={`/seller/edit-product/${product._id}`} className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200">
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;