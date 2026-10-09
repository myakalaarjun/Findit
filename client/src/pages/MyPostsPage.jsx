import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, updateItem } from '../services/itemsService';
import { getListings, markListingAsSold, updateListing } from '../services/listingsService';

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'listings'
  const [items, setItems] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [itemsRes, listingsRes] = await Promise.all([
        getItems(),
        getListings(),
      ]);
      setItems(itemsRes.data || itemsRes || []);
      setListings(listingsRes.data || listingsRes || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Could not load posts from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleItemStatus = async (id, status) => {
    try {
      await updateItem(id, { status });
      loadData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleListingSold = async (id) => {
    try {
      await markListingAsSold(id);
      loadData();
    } catch (err) {
      alert('Failed to mark listing as sold.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Posts (Prototype Mode)</h1>
        <p className="page-subtitle">
          Manage local posts and reports. In this unauthenticated phase, all local MongoDB records are accessible for development testing. User-specific ownership filters will be linked when authentication is added.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
        ℹ️ <strong>Development Notice:</strong> Authentication is postponed per MVP specs. No dummy accounts or hardcoded IDs are used. All records persist in MongoDB.
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('items')}
        >
          Lost &amp; Found Reports ({items.length})
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('listings')}
        >
          Marketplace Listings ({listings.length})
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading records from MongoDB...</p>
      ) : activeTab === 'items' ? (
        items.length === 0 ? (
          <div className="empty-state">
            <h3>No reports found</h3>
            <p>You haven't created any lost or found reports yet.</p>
            <Link to="/report-item" className="btn btn-primary btn-sm">Report an Item</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-gray-border)',
                  borderRadius: '6px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge badge-${item.status?.toLowerCase() || 'lost'}`}>
                      {item.status || item.type}
                    </span>
                    <span className="tag-highlight">{item.category}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      📍 {item.location}
                    </span>
                  </div>
                  <h4 style={{ color: 'var(--color-deep-navy)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Reported on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/lost-found/${item._id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                  {item.status !== 'Returned' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleItemStatus(item._id, 'Returned')}
                    >
                      Mark Returned
                    </button>
                  )}
                  {item.status !== 'Closed' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleItemStatus(item._id, 'Closed')}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        listings.length === 0 ? (
          <div className="empty-state">
            <h3>No marketplace listings found</h3>
            <p>You haven't listed any items for sale yet.</p>
            <Link to="/sell" className="btn btn-primary btn-sm">Sell an Item</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {listings.map((l) => (
              <div
                key={l._id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-gray-border)',
                  borderRadius: '6px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${l.status === 'sold' ? 'badge-sold' : l.status === 'removed' ? 'badge-removed' : 'badge-active'}`}>
                      {l.status?.toUpperCase()}
                    </span>
                    <span className="tag-highlight">{l.category}</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-muted-blue)' }}>
                      ${Number(l.price).toFixed(2)}
                    </span>
                  </div>
                  <h4 style={{ color: 'var(--color-deep-navy)' }}>{l.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    📍 {l.location} &bull; Condition: {l.condition}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/marketplace/${l._id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                  {l.status !== 'sold' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleListingSold(l._id)}
                    >
                      Mark Sold
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
