import React from 'react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing, onReport }) {
  const isSold = listing.status === 'sold';
  const isRemoved = listing.status === 'removed';

  const formatPrice = (val) => {
    return Number(val).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={`card ${isSold ? 'listing-sold' : ''}`}>
      <div className="card-image-wrap">
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.title} className="card-image" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="card-image-placeholder">
            <span>🏷️</span>
            <span>No image provided</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <span className={`badge ${isSold ? 'badge-sold' : isRemoved ? 'badge-removed' : 'badge-active'}`}>
            {listing.status ? listing.status.toUpperCase() : 'ACTIVE'}
          </span>
          <span className="tag-highlight">{listing.category}</span>
        </div>

        <h3 className="card-title">{listing.title}</h3>
        <div className="card-price">{formatPrice(listing.price)}</div>
        <p className="card-description">{listing.description}</p>

        <div className="card-meta">
          <span>📍 {listing.location}</span>
          <span>Condition: {listing.condition}</span>
        </div>

        <div className="card-actions" style={{ marginTop: '0.8rem' }}>
          <Link to={`/marketplace/${listing._id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            View Listing
          </Link>
          {onReport && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onReport(listing)}
              title="Report this listing to moderation"
            >
              🚩
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
