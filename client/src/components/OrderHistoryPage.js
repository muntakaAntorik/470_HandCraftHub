// client/src/components/OrderHistoryPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        const res = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load order history. Please try again.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, token, navigate]);

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center py-8 text-gray-600">You have no past orders.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Order History</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {orders.map(order => (
          <div key={order._id} className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Order ID: {order._id}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.orderStatus}
              </span>
            </div>
            <p className="text-gray-600 mb-2">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-2">Total Price: <span className="font-bold">৳{order.totalPrice.toFixed(2)}</span></p>
            <p className="text-gray-600 mb-4">Payment Method: {order.paymentMethod}</p>

            <h3 className="text-lg font-medium text-gray-800 mb-3">Items:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.orderItems.map(item => (
                <div key={item.product._id || item.product} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-3"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/cccccc/333333?text=No+Image'; }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600 text-sm">৳{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
