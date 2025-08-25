// client/src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, LayoutDashboard, Database } from 'lucide-react'; // Import new icon

const AdminPanel = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== 'admin') {
      alert('You must be logged in as an admin to access this page.');
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user && user.role === 'admin') {
        try {
          setLoading(true);
          setError('');
          const config = {
            headers: {
              'x-auth-token': token
            }
          };

          const [productsRes, usersRes] = await Promise.all([
            axios.get('http://localhost:5000/api/products', config),
            axios.get('http://localhost:5000/api/users', config)
          ]);

          setProducts(productsRes.data);
          setUsers(usersRes.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching admin data:', err);
          setError('Failed to load admin data. Please try again.');
          setLoading(false);
        }
      }
    };
    fetchAdminData();
  }, [user, token]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
      alert('Product deleted successfully!');
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.msg : 'Failed to delete product.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      alert('User deleted successfully!');
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.msg : 'Failed to delete user.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin panel...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-8 text-gray-600">Access Denied: Not an administrator.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Panel</h1>

      {/* Admin actions buttons */}
      <div className="flex justify-center mb-8 space-x-4">
        <Link
          to="/admin/insights"
          className="bg-purple-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
        >
          <Database size={20} className="mr-2" /> View Feedback Insights
        </Link>
      </div>

      {/* Product Management Section */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Manage Products</h2>
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

      {/* User Management Section */}
      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-3">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        disabled={user.role === 'admin'}
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
    </div>
  );
};

export default AdminPanel;