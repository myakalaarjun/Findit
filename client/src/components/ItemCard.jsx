import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'lost':
        return 'badge-lost';
      case 'found':
        return 'badge-found';
      case 'returned':
        return 'badge-returned';
      case 'closed':
        return 'badge-closed';
      default:
        return 'badge-closed';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="card-image-wrap">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="card-image" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="card-image-placeholder">
            <span>📷</span>
            <span>No image provided</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <span className={`badge ${getBadgeClass(item.status || item.type)}`}>
            {item.status || item.type}
          </span>
          <span className="tag-highlight">{item.category}</span>
        </div>

        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">{item.description}</p>

        <div className="card-meta">
          <span>📍 {item.location}</span>
          <span>📅 {formatDate(item.eventDate)}</span>
        </div>

        <div className="card-actions">
          <Link to={`/lost-found/${item._id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
