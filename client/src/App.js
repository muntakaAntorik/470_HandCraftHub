    // client/src/App.js

    import React from 'react';
    import { Route, Routes } from 'react-router-dom';
    import Register from './components/Register';
    import Login from './components/Login';
    import LandingPage from './components/LandingPage';
    import CartPage from './components/CartPage';
    import WishlistPage from './components/WishlistPage'; // Import WishlistPage
    import './App.css';
    import './index.css';

    function App() {
      return (
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} /> {/* Add the route for WishlistPage */}
            {/* Add other routes here as you create more components */}
          </Routes>
        </div>
      );
    }

    export default App;
    