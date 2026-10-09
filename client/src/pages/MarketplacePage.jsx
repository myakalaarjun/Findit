import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getListings } from '../services/listingsService';
import { reportListing } from '../services/moderationService';
import ListingCard from '../components/ListingCard';
import ReportModal from '../components/ReportModal';

const CATEGORIES = [
  'All Categories',
  'Electronics & Gadgets',
  'Furniture & Home',
  'Books & Education',
  'Clothing & Apparel',
  'Sports & Outdoors',
  'Bicycles & Transport',
  'Hobbies & Games',
  'Other',
];

export default function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [reportingListing, setReportingListing] = useState(null);
  const [reportSuccess, setReportSuccess] = useState('');

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        sort: sortBy,
      };
      if (keyword.trim()) params.search = keyword.trim();
      if (categoryFilter !== 'All Categories') params.category = categoryFilter;

      const res = await getListings(params);
      setListings(res.data || res || []);
    } catch (err) {
      console.error('Failed to fetch marketplace listings:', err);
      setError('Unable to load listings from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [categoryFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleReset = () => {
    setKeyword('');
    setCategoryFilter('All Categories');
    setSortBy('newest');
  };

  const handleReportSubmit = async ({ listingId, reason }) => {
    await reportListing({ listing: listingId, reason });
    setReportSuccess('Report submitted to moderation. Thank you for keeping the community safe.');
    setTimeout(() => setReportSuccess(''), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Marketplace</h1>
            <p className="page-subtitle">Buy, sell, and reuse pre-loved goods locally</p>
          </div>
          <Link to="/sell" className="btn btn-primary">
            + Sell an Item
          </Link>
        </div>
      </div>

      {reportSuccess && <div className="alert alert-success">{reportSuccess}</div>}

      {/* Search & Filter Toolbar */}
      <form onSubmit={handleSearchSubmit} className="toolbar">
        <div className="toolbar-group" style={{ flex: '1 1 240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search listings by title, description, location..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </div>

        <div className="toolbar-group">
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {(keyword || categoryFilter !== 'All Categories' || sortBy !== 'newest') && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading marketplace items...</p>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <h3>No listings found</h3>
          <p>No products match your search or filter criteria.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              Clear Filters
            </button>
            <Link to="/sell" className="btn btn-primary btn-sm">
              List an Item for Sale
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onReport={(l) => setReportingListing(l)}
            />
          ))}
        </div>
      )}

      {/* Moderation Report Modal */}
      {reportingListing && (
        <ReportModal
          listing={reportingListing}
          onClose={() => setReportingListing(null)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}
