    // client/src/components/WishlistPage.js

    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { useAuth } from '../context/AuthContext';
    import { useNavigate } from 'react-router-dom';

    const WishlistPage = () => {
      const { isLoggedIn, token, user } = useAuth();
      const navigate = useNavigate();
      const [wishlistItems, setWishlistItems] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [newProductName, setNewProductName] = useState(''); // For adding new item

      useEffect(() => {
        const fetchWishlist = async () => {
          try {
            setLoading(true);
            setError('');
            // Fetch all wishlist items (public view)
            const res = await axios.get('http://localhost:5000/api/wishlist/all');
            setWishlistItems(res.data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError('Failed to load wishlist items. Please try again.');
            setLoading(false);
          }
        };

        fetchWishlist();
      }, []); // Empty dependency array to fetch once on mount

      const handleAddWishlistItem = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
          alert('Please log in to add items to your wishlist.');
          navigate('/login');
          return;
        }
        if (newProductName.trim() === '') {
          alert('Please enter a product name.');
          return;
        }

        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          const res = await axios.post('http://localhost:5000/api/wishlist/add', { productName: newProductName }, config);
          console.log(res.data);
          setWishlistItems([...wishlistItems, res.data.item]); // Add new item to state
          setNewProductName(''); // Clear input
          alert('Product added to wishlist!');
        } catch (err) {
          console.error(err.response ? err.response.data : err.message);
          setError(err.response ? err.response.data.msg : 'Failed to add item to wishlist.');
        }
      };

      const handleRemoveWishlistItem = async (id) => {
        if (!isLoggedIn) {
          alert('Please log in to remove items from your wishlist.');
          navigate('/login');
          return;
        }

        // Optional: Confirm before deleting
        if (!window.confirm('Are you sure you want to remove this item from the wishlist?')) {
          return;
        }

        try {
          const config = {
            headers: {
              'x-auth-token': token
            }
          };
          await axios.delete(`http://localhost:5000/api/wishlist/remove/${id}`, config);
          setWishlistItems(wishlistItems.filter(item => item._id !== id)); // Remove from state
          alert('Item removed from wishlist.');
        } catch (err) {
          console.error(err.response ? err.response.data : err.message);
          setError(err.response ? err.response.data.msg : 'Failed to remove item from wishlist.');
        }
      };


      if (loading) {
        return <div className="text-center py-8">Loading wishlist...</div>;
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Wishlist</h1>

          {/* Add to Wishlist Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Item to Wishlist</h2>
            <form onSubmit={handleAddWishlistItem} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md"
              >
                Add to Wishlist
              </button>
            </form>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">{error}</div>}
          </div>

          {/* All Wishlist Items Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Wishlist Items</h2>
            {wishlistItems.length === 0 ? (
              <p className="text-gray-600">No items in the wishlist yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Product Name</th>
                      <th className="py-3 px-6 text-left">Added By</th>
                      <th className="py-3 px-6 text-left">Date Added</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {wishlistItems.map(item => (
                      <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{item.productName}</td>
                        <td className="py-3 px-6 text-left">{item.user ? item.user.name : 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-6 text-center">
                          {isLoggedIn && user && item.user && item.user._id === user.id && (
                            <button
                              onClick={() => handleRemoveWishlistItem(item._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    };

    export default WishlistPage;
    
    