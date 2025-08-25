// client/src/components/AdminInsights.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const AdminInsights = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== 'admin') {
      alert('You must be logged in as an admin to access this page.');
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch all feedback for the admin
  useEffect(() => {
    const fetchFeedback = async () => {
      if (user && user.role === 'admin') {
        try {
          setLoading(true);
          setError('');
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const res = await axios.get('http://localhost:5000/api/feedback', config);
          setFeedbackList(res.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching feedback:', err);
          setError(err.response && err.response.data && err.response.data.msg
            ? `Failed to load feedback: ${err.response.data.msg}`
            : 'Failed to load feedback. Please check server logs.');
          setLoading(false);
        }
      }
    };
    fetchFeedback();
  }, [user, token]);

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-8 text-gray-600">Access Denied: Not an administrator.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Insights</h1>

      {feedbackList.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No feedback has been submitted yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Feedback</h2>
          <div className="space-y-6">
            {feedbackList.map(feedback => (
              <div key={feedback._id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-gray-800">{feedback.name}</span>
                  <span className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 italic">"{feedback.message}"</p>
                <p className="text-sm text-gray-500 mt-2">from {feedback.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInsights;

