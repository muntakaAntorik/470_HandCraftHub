// client/src/components/ProductForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const ProductForm = () => {
  const { id } = useParams(); // Product ID for editing, if available
  const navigate = useNavigate();
  const { token, isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
    countInStock: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== 'seller') {
      alert('You must be logged in as a seller to access this page.');
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`http://localhost:5000/api/products/${id}`);
          const productData = res.data;

          // Pre-fill form with existing product data
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            imageUrl: productData.imageUrl,
            category: productData.category,
            countInStock: productData.countInStock
          });
          setLoading(false);
        } catch (err) {
          console.error('Error fetching product for edit:', err);
          setErrorMessage('Failed to load product for editing.');
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const categories = [
    'Home decor', 'Arts', 'Clothing', 'Painting', 'Accessories', 'Jewelry', 'Candles & Soap'
  ];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, formData, config);
        alert('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', formData, config);
        alert('Product added successfully!');
      }
      navigate('/seller/dashboard'); // Redirect to seller dashboard
    } catch (err) {
      console.error('Error submitting product form:', err.response ? err.response.data : err.message);
      setErrorMessage(err.response && err.response.data && err.response.data.msg
        ? `Submission failed: ${err.response.data.msg}`
        : 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center py-8">Loading product data...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g., Handcrafted Wooden Bowl"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={onChange}
              placeholder="Detailed description of the product..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price (৳):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={onChange}
              placeholder="e.g., 1500.00"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={onChange}
              placeholder="e.g., https://example.com/image.jpg"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="countInStock" className="block text-gray-700 text-sm font-bold mb-2">Count In Stock:</label>
            <input
              type="number"
              id="countInStock"
              name="countInStock"
              value={formData.countInStock}
              onChange={onChange}
              placeholder="e.g., 50"
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
