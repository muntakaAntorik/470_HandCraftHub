// client/src/components/ProductDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { Star } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewFormData, setReviewFormData] = useState({ rating: 0, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setError('');
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(productRes.data);

        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(reviewsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching product or reviews:', err);
        setError('Failed to load product details or reviews. Please try again.');
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleReviewChange = (e) => {
    setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (newRating) => {
    setReviewFormData({ ...reviewFormData, rating: newRating });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmittingReview(true);

    if (!isLoggedIn) {
      setReviewError('You must be logged in to submit a review.');
      setSubmittingReview(false);
      return;
    }
    if (reviewFormData.rating === 0) {
      setReviewError('Please select a rating.');
      setSubmittingReview(false);
      return;
    }
    if (reviewFormData.comment.trim() === '') {
      setReviewError('Please enter a comment.');
      setSubmittingReview(false);
      return;
    }

    try {
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };
      const res = await axios.post(`http://localhost:5000/api/reviews/${id}`, reviewFormData, config);
      console.log('Review submitted:', res.data);
      alert('Review submitted successfully!');

      setReviews([...reviews, res.data.review]);
      const updatedProductRes = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(updatedProductRes.data);

      setReviewFormData({ rating: 0, comment: '' });
      setSubmittingReview(false);
    } catch (err) {
      console.error('Error submitting review:', err.response ? err.response.data : err.message);
      setReviewError(err.response && err.response.data && err.response.data.msg
        ? `Review submission failed: ${err.response.data.msg}`
        : 'Failed to submit review. Please try again.');
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8 text-gray-600">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found'; }}
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-indigo-600 text-2xl font-bold mb-4">৳{product.price.toFixed(2)}</p>
            <div className="flex items-center text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={i < product.rating ? 'fill-current' : 'text-gray-300'}
                />
              ))}
              <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
            </div>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-gray-600 mb-2">Category: {product.category}</p>
            <p className="text-gray-600 mb-4">In Stock: {product.countInStock}</p>
            <button
              onClick={() => { /* Add to cart logic here */ alert('Add to Cart from detail page (placeholder)'); }}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

        {/* Review Form */}
        {isLoggedIn ? (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Write a Review</h3>
            {reviewError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{reviewError}</span>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={30}
                    className={`cursor-pointer ${i < reviewFormData.rating ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => handleRatingClick(i + 1)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={reviewFormData.comment}
                onChange={handleReviewChange}
                placeholder="Share your thoughts on this product..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-8">
            Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to write a review.
          </p>
        )}

        {/* Existing Reviews */}
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet for this product.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-gray-800 mr-2">{review.name}</p>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-auto">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
