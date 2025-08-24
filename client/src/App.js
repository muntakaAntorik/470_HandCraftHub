// client/src/App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register.js';
import Login from './components/Login.js';
import LandingPage from './components/LandingPage.js';
import CartPage from './components/CartPage.js';
import WishlistPage from './components/WishlistPage.js';
import OrderHistoryPage from './components/OrderHistoryPage.js';
import ShippingAndPaymentForm from './components/ShippingAndPaymentForm.js';
import CategoryPage from './components/CategoryPage.js';
import ProductDetailPage from './components/ProductDetailPage.js';
import SellerDashboard from './components/SellerDashboard.js'; // Ensure SellerDashboard is imported
import ProductForm from './components/ProductForm.js';     // Ensure ProductForm is imported
import AdminPanel from './components/AdminPanel.js';       // Ensure AdminPanel is imported
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
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/myorders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<ShippingAndPaymentForm />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<ProductForm />} />
        <Route path="/seller/edit-product/:id" element={<ProductForm />} />
        {/* Admin Routes */}
        <Route path="/admin/panel" element={<AdminPanel />} /> {/* Corrected route for AdminPanel */}
        {/* Add other routes here as you create more components */}
      </Routes>
    </div>
  );
}

export default App;
