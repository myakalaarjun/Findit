import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById, updateListing, markListingAsSold } from '../services/listingsService';
import { reportListing } from '../services/moderationService';
import ReportModal from '../components/ReportModal';

const CONDITIONS = [
  'New / Unopened',
  'Like New',
  'Good Condition',
  'Fair / Signs of Use',
  'For Parts or Repair',
];

const CATEGORIES = [
  'Electronics & Gadgets',
  'Furniture & Home',
  'Books & Education',
  'Clothing & Apparel',
  'Sports & Outdoors',
  'Bicycles & Transport',
  'Hobbies & Games',
  'Other',
];

export default function MarketplaceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  const [contactRevealed, setContactRevealed] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getListingById(id);
      const data = res.data || res;
      setListing(data);
      setEditForm({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        condition: data.condition || '',
        location: data.location || '',
        imageUrl: data.imageUrl || '',
        sellerContact: data.sellerContact || '',
        status: data.status || 'active',
      });
    } catch (err) {
      console.error('Failed to fetch listing:', err);
      setError(err?.response?.data?.message || 'Listing not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleMarkSold = async () => {
    if (!window.confirm('Mark this listing as Sold?')) return;
    try {
      setUpdating(true);
      const res = await markListingAsSold(id);
      setListing(res.data || res);
      setEditForm((prev) => ({ ...prev, status: 'sold' }));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to mark as sold.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await updateListing(id, {
        ...editForm,
        price: Number(editForm.price),
      });
      setListing(res.data || res);
      setIsEditing(false);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update listing.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReport = async ({ reason }) => {
    await reportListing({ listing: id, reason });
    setReportSuccess('Listing reported to moderation. Thank you.');
    setShowReportModal(false);
    setTimeout(() => setReportSuccess(''), 4000);
  };

  if (loading) {
    return <div className="detail-container"><p>Loading listing...</p></div>;
  }

  if (error || !listing) {
    return (
      <div className="detail-container">
        <div className="alert alert-danger">{error || 'Listing not found.'}</div>
        <Link to="/marketplace" className="btn btn-secondary">&larr; Back to Marketplace</Link>
      </div>
    );
  }

  const isSold = listing.status === 'sold';

  return (
    <div className="detail-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Link to="/marketplace" className="btn btn-secondary btn-sm">
          &larr; Back to Marketplace
        </Link>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setShowReportModal(true)}
        >
          🚩 Report Inappropriate
        </button>
      </div>

      {reportSuccess && <div className="alert alert-success">{reportSuccess}</div>}

      <div className="detail-card">
        {listing.imageUrl && (
          <div className="detail-image-wrap">
            <img src={listing.imageUrl} alt={listing.title} className="detail-image" />
          </div>
        )}

        <div className="detail-body">
          <div className="card-header-row">
            <div>
              <span className={`badge ${isSold ? 'badge-sold' : 'badge-active'}`} style={{ marginRight: '0.5rem' }}>
                {listing.status?.toUpperCase()}
              </span>
              <span className="tag-highlight">{listing.category}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Listed: {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>

          {!isEditing ? (
            <>
              <h1 style={{ fontSize: '1.85rem', marginTop: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-deep-navy)' }}>
                {listing.title}
              </h1>

              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--color-muted-blue)', marginBottom: '1.25rem' }}>
                ₹{Number(listing.price).toLocaleString('en-IN')}
              </div>

              <div className="detail-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Condition</span>
                  <span className="meta-value">{listing.condition}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Pickup Location</span>
                  <span className="meta-value">📍 {listing.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Listing Status</span>
                  <span className="meta-value">{listing.status}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{listing.category}</span>
                </div>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-dark-navy)' }}>Item Description</h4>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{listing.description}</p>
              </div>

              {/* Seller Contact Action */}
              <div style={{
                backgroundColor: 'var(--color-cream-tint)',
                border: '1px solid var(--color-warm-cream)',
                borderRadius: '6px',
                padding: '1.25rem',
                margin: '1.5rem 0'
              }}>
                <h4 style={{ color: 'var(--color-deep-navy)', marginBottom: '0.5rem' }}>Seller Information</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Interested in purchasing or inspecting this item? Connect with the seller directly:
                </p>

                {contactRevealed ? (
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: '4px',
                    fontWeight: '600',
                    color: 'var(--color-deep-navy)'
                  }}>
                    📞 Contact: {listing.sellerContact || 'No direct phone/email provided. Pick up at listed location: ' + listing.location}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setContactRevealed(true)}
                  >
                    Contact Seller
                  </button>
                )}
              </div>

              {/* Dev prototype management actions */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                backgroundColor: 'var(--color-gray-light)',
                borderRadius: '6px',
                border: '1px dashed var(--color-gray-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h5 style={{ color: 'var(--color-deep-navy)', marginBottom: '0.25rem' }}>
                      Prototype Action Bar (Dev Mode)
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Manage this listing in development mode. Auth permissions will restrict editing to the verified seller.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Listing
                    </button>
                    {!isSold && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={updating}
                        onClick={handleMarkSold}
                      >
                        Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Inline Edit Form */
            <form onSubmit={handleEditSubmit} style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-deep-navy)' }}>Edit Listing (Development Mode)</h3>
              
              <div className="form-group">
                <label>Listing Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="form-control"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Condition</label>
                  <select
                    className="form-control"
                    value={editForm.condition}
                    onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Seller Contact Info</label>
                <input
                  type="text"
                  className="form-control"
                  value={editForm.sellerContact}
                  onChange={(e) => setEditForm({ ...editForm, sellerContact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          listing={listing}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
        />
      )}
    </div>
  );
}
