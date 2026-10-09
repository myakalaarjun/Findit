import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LostFoundPage from './pages/LostFoundPage';
import ReportItemPage from './pages/ReportItemPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import MarketplacePage from './pages/MarketplacePage';
import SellItemPage from './pages/SellItemPage';
import MarketplaceDetailsPage from './pages/MarketplaceDetailsPage';
import MyPostsPage from './pages/MyPostsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/report-item" element={<ReportItemPage />} />
            <Route path="/lost-found/:id" element={<ItemDetailsPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/sell" element={<SellItemPage />} />
            <Route path="/marketplace/:id" element={<MarketplaceDetailsPage />} />
            <Route path="/my-posts" element={<MyPostsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
