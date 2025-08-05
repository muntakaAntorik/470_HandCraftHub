    // client/src/components/CartPage.js

    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { useAuth } from '../context/AuthContext';
    import { useNavigate } from 'react-router-dom';

    const CartPage = () => {
      const { token, isLoggedIn } = useAuth();
      const navigate = useNavigate();
      const [cart, setCart] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');

      useEffect(() => {
        if (!isLoggedIn) {
          navigate('/login'); // Redirect to login if not logged in
          return;
        }

        const fetchCart = async () => {
          try {
            setLoading(true);
            const config = {
              headers: {
                'x-auth-token': token
              }
            };
            const res = await axios.get('http://localhost:5000/api/cart', config);
            setCart(res.data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError('Failed to load cart. Please try again.');
            setLoading(false);
          }
        };

        fetchCart();
      }, [isLoggedIn, token, navigate]);

      const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 0) return; // Prevent negative quantity

        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const res = await axios.put('http://localhost:5000/api/cart/update', { productId, quantity: newQuantity }, config);
          setCart(res.data);
        } catch (err) {
          console.error(err);
          setError('Failed to update quantity.');
        }
      };

      const removeItem = async (productId) => {
        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const res = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, config);
          setCart(res.data);
        } catch (err) {
          console.error(err);
          setError('Failed to remove item.');
        }
      };

      if (loading) {
        return <div className="text-center py-8">Loading cart...</div>;
      }

      if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
      }

      if (!cart || cart.items.length === 0) {
        return <div className="text-center py-8 text-gray-600">Your cart is empty.</div>;
      }

      const totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.items.map(item => (
                <div key={item.product._id || item.product} className="flex flex-col md:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4 mb-4 md:mb-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/333333?text=No+Image'; }}
                  />
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-indigo-600 text-md font-bold">৳{item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <button
                        onClick={() => updateQuantity(item.product._id || item.product, item.quantity - 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b border-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id || item.product, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product._id || item.product)}
                        className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right border-t pt-4">
              <h2 className="text-2xl font-bold text-gray-900">Total: ৳{totalAmount}</h2>
              <button className="mt-4 bg-green-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default CartPage;
    