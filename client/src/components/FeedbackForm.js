// client/src/components/FeedbackForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';

const FeedbackForm = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLoggedIn) {
      alert('You must be logged in to submit feedback.');
      navigate('/login');
      return;
    }

    if (message.trim() === '') {
      setErrorMessage('Feedback message cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };
      await axios.post('http://localhost:5000/api/feedback', { message }, config);
      setSuccessMessage('Thank you for your feedback! It has been submitted successfully.');
      setMessage('');
    } catch (err) {
      console.error('Error submitting feedback:', err.response ? err.response.data : err.message);
      setErrorMessage(err.response && err.response.data && err.response.data.msg
        ? `Submission failed: ${err.response.data.msg}`
        : 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Submit Feedback</h1>
        <p className="text-gray-600 text-center mb-6">
          We value your opinion. Please share your thoughts on our platform.
        </p>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        {isLoggedIn ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedbackMessage" className="block text-gray-700 text-sm font-bold mb-2">Your Feedback:</label>
              <textarea
                id="feedbackMessage"
                name="message"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your feedback here..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 text-center">
            Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to submit feedback.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;