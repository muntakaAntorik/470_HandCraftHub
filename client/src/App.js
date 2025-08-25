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
import AdminPanel from './components/AdminPanel.js';
import SellerDashboard from './components/SellerDashboard.js';
import ProductForm from './components/ProductForm.js';
import AboutUsPage from './components/AboutUsPage.js';
import TermsAndConditionsPage from './components/TermsAndConditionsPage.js'; // Import new component
import FeedbackForm from './components/FeedbackForm.js'; // Import new component
import AdminInsights from './components/AdminInsights.js'; // Import new component
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
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<ProductForm />} />
        <Route path="/seller/edit-product/:id" element={<ProductForm />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/feedback" element={<FeedbackForm />} /> {/* New route for feedback form */}
        <Route path="/admin/insights" element={<AdminInsights />} /> {/* New route for admin feedback panel */}
      </Routes>
    </div>
  );
}

export default App;
