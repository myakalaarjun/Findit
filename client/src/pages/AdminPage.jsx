import React, { useEffect, useState } from 'react';
import { getAdminReports, updateAdminReport } from '../services/moderationService';
import { updateListing } from '../services/listingsService';

export default function AdminPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      const res = await getAdminReports(params);
      setReports(res.data || res || []);
    } catch (err) {
      console.error('Failed to load admin reports:', err);
      setError('Could not load moderation reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await updateAdminReport(reportId, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update report status.');
    }
  };

  const handleRemoveListing = async (reportId, listingId) => {
    if (!window.confirm('Remove this listing from the marketplace?')) return;
    try {
      await updateListing(listingId, { status: 'removed' });
      await updateAdminReport(reportId, { status: 'resolved' });
      fetchReports();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to remove listing.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Community Moderation (Local Admin Dev)</h1>
        <p className="page-subtitle">
          Internal review interface for flagged content during development.
        </p>
      </div>

      <div className="alert alert-warning">
        ⚠️ <strong>Security Advisory:</strong> This admin interface is active solely for local development and testing. Real administrator authentication, role-based access control (RBAC), and protected route gates must be implemented before deploying to production.
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Filter status:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={fetchReports}>
          🔄 Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <h3>No reports to review</h3>
          <p>No community reports have been filed under this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reports.map((r) => {
            const listing = r.listing;
            return (
              <div
                key={r._id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-gray-border)',
                  borderRadius: '6px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span
                      className={`badge ${r.status === 'pending' ? 'badge-lost' : r.status === 'resolved' ? 'badge-returned' : 'badge-closed'}`}
                      style={{ marginRight: '0.5rem' }}
                    >
                      {r.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Reported: {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {listing && listing.status !== 'removed' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveListing(r._id, listing._id)}
                      >
                        Remove Listing
                      </button>
                    )}
                    {r.status !== 'resolved' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateReportStatus(r._id, 'resolved')}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {r.status !== 'dismissed' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleUpdateReportStatus(r._id, 'dismissed')}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', backgroundColor: 'var(--color-gray-light)', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                  <strong style={{ color: 'var(--color-deep-navy)' }}>Report Reason:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--color-text-dark)', fontSize: '0.95rem' }}>
                    {r.reason}
                  </p>
                </div>

                {listing ? (
                  <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-deep-navy)', marginBottom: '0.25rem' }}>
                      Associated Listing Details:
                    </div>
                    <div><strong>Title:</strong> {listing.title}</div>
                    <div><strong>Price:</strong> ${Number(listing.price || 0).toFixed(2)}</div>
                    <div><strong>Category:</strong> {listing.category}</div>
                    <div><strong>Status:</strong> {listing.status}</div>
                    {listing.sellerContact && <div><strong>Seller Contact:</strong> {listing.sellerContact}</div>}
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    (The referenced listing may have been permanently deleted or is unavailable)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
