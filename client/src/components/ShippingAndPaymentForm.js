// client/src/components/ShippingAndPaymentForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js'; // Ensure correct import path

const ShippingAndPaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To get cart data passed from CartPage
  const { token, isLoggedIn } = useAuth(); // Get token and login status from AuthContext

  // State to hold form data
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '', // Only address and phone number
    paymentMethod: 'Cash on Delivery' // Default payment method
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Effect to load cart items from location state
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect if not logged in
      return;
    }

    if (location.state && location.state.cart) {
      setCartItems(location.state.cart.items);
      const calculatedTotal = location.state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(calculatedTotal);
    } else {
      // If no cart data, redirect back to cart page or home
      alert('No cart data found. Please go back to your cart.');
      navigate('/cart');
    }
  }, [location.state, navigate, isLoggedIn]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Cannot place an order.');
      return;
    }

    // Prepare order details for backend
    const orderDetails = {
      orderItems: cartItems.map(item => ({
        product: item.product._id || item.product,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress: {
        address: formData.address,
        phoneNumber: formData.phoneNumber // Only address and phone number
      },
      paymentMethod: formData.paymentMethod,
      taxPrice: 0, // Placeholder, calculate if needed
      shippingPrice: 5, // Placeholder, calculate if needed
      totalPrice: (totalPrice + 5).toFixed(2) // Total + shipping
    };

    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };
      const res = await axios.post('http://localhost:5000/api/orders', orderDetails, config);
      console.log('Order placed successfully:', res.data);
      alert('Order placed successfully! You will be redirected to your order history.');
      navigate('/myorders'); // Redirect to order history
    } catch (err) {
      console.error('Error placing order:', err.response ? err.response.data : err.message);
      setErrorMessage(err.response && err.response.data && err.response.data.msg
        ? `Order failed: ${err.response.data.msg}`
        : 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Shipping Address */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Shipping Information</h2>
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="123 Main St"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Removed City, Postal Code, Country fields */}
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={onChange}
              placeholder="123-456-7890"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Payment Method */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Payment Method</h2>
          <div>
            <label htmlFor="paymentMethod" className="block text-gray-700 text-sm font-bold mb-2">Select Method:</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment (Coming Soon)</option>
            </select>
          </div>

          {/* Order Summary (Optional, but good for user confirmation) */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Order Summary</h2>
          <div className="flex justify-between text-lg font-medium text-gray-800">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium text-gray-800">
            <span>Shipping:</span>
            <span>$5.00</span> {/* Hardcoded for now */}
          </div>
          <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${(totalPrice + 5).toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 mt-6"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingAndPaymentForm;
