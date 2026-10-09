import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../services/itemsService';

const STATUS_OPTIONS = ['Lost', 'Found', 'Returned', 'Closed'];

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getItemById(id);
      const data = res.data || res;
      setItem(data);
      setEditForm({
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        category: data.category || '',
        status: data.status || 'Lost',
        imageUrl: data.imageUrl || '',
      });
    } catch (err) {
      console.error('Failed to fetch item details:', err);
      setError(err?.response?.data?.message || 'Could not find this item.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await updateItem(id, { status: newStatus });
      setItem(res.data || res);
      setEditForm((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await updateItem(id, editForm);
      setItem(res.data || res);
      setIsEditing(false);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update item details.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="detail-container"><p>Loading item details...</p></div>;
  }

  if (error || !item) {
    return (
      <div className="detail-container">
        <div className="alert alert-danger">{error || 'Item not found.'}</div>
        <Link to="/lost-found" className="btn btn-secondary">&larr; Back to Lost &amp; Found</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/lost-found" className="btn btn-secondary btn-sm">
          &larr; Back to Lost &amp; Found
        </Link>
      </div>

      <div className="detail-card">
        {item.imageUrl && (
          <div className="detail-image-wrap">
            <img src={item.imageUrl} alt={item.title} className="detail-image" />
          </div>
        )}

        <div className="detail-body">
          <div className="card-header-row">
            <div>
              <span className={`badge badge-${item.status?.toLowerCase() || 'lost'}`} style={{ marginRight: '0.5rem' }}>
                {item.status || item.type}
              </span>
              <span className="tag-highlight">{item.category}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Report Type: <strong>{item.type?.toUpperCase()}</strong>
            </span>
          </div>

          {!isEditing ? (
            <>
              <h1 style={{ fontSize: '1.75rem', marginTop: '0.75rem', marginBottom: '1rem', color: 'var(--color-deep-navy)' }}>
                {item.title}
              </h1>

              <div className="detail-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">📍 {item.location}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date of Event</span>
                  <span className="meta-value">
                    📅 {new Date(item.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value">{item.status}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Reported On</span>
                  <span className="meta-value">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ margin: '1.5rem 0' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-dark-navy)' }}>Description</h4>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{item.description}</p>
              </div>

              {/* Dev prototype management actions */}
              <div style={{
                marginTop: '2rem',
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
                      Unrestricted status updates for testing. User-specific ownership will be enforced upon auth integration.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Report Details
                    </button>
                    {item.status !== 'Returned' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={updating}
                        onClick={() => handleStatusChange('Returned')}
                      >
                        Mark as Returned
                      </button>
                    )}
                    {item.status !== 'Closed' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={updating}
                        onClick={() => handleStatusChange('Closed')}
                      >
                        Close Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Inline Edit Form */
            <form onSubmit={handleEditSubmit} style={{ marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-deep-navy)' }}>Edit Item (Development Mode)</h3>
              
              <div className="form-group">
                <label>Title</label>
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
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
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
    </div>
  );
}
