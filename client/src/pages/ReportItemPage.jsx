import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/itemsService';

const CATEGORIES = [
  'Electronics',
  'Accessories & Wallets',
  'Keys & Badges',
  'Documents & IDs',
  'Clothing & Bags',
  'Books & Stationery',
  'Jewelry',
  'Pets',
  'Other',
];

export default function ReportItemPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'Electronics',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.location.trim()) errors.location = 'Location is required.';
    if (!formData.eventDate) errors.eventDate = 'Event date is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        ...formData,
        // Status defaults to capitalize of type (e.g. Lost or Found)
        status: formData.type === 'lost' ? 'Lost' : 'Found',
      };
      const response = await createItem(payload);
      const createdItem = response.data || response;
      navigate(`/lost-found/${createdItem._id}`);
    } catch (err) {
      console.error('Failed to submit item report:', err);
      setError(err?.response?.data?.message || 'Failed to submit report. Please check input and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Report an Item</h1>
        <p className="page-subtitle">Submit details for a lost or discovered possession</p>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Report Type */}
          <div className="form-group">
            <label>
              Report Type <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                />
                <span className="badge badge-lost">Lost Item</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                />
                <span className="badge badge-found">Found Item</span>
              </label>
            </div>
            <p className="form-hint">
              Select <strong>Lost</strong> if you misplaced it, or <strong>Found</strong> if you found an unattended item.
            </p>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Item Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Black leather wallet, Silver Lenovo laptop..."
              value={formData.title}
              onChange={handleChange}
            />
            {fieldErrors.title && <div className="form-error">{fieldErrors.title}</div>}
          </div>

          {/* Category & Date */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eventDate">
                Date Lost / Found <span className="required">*</span>
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
              />
              {fieldErrors.eventDate && <div className="form-error">{fieldErrors.eventDate}</div>}
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-control"
              placeholder="e.g. Central Park Library 2nd floor, Metro line 3..."
              value={formData.location}
              onChange={handleChange}
            />
            {fieldErrors.location && <div className="form-error">{fieldErrors.location}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Detailed Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              placeholder="Provide distinctive features, brand, color, stickers, unique scratches, etc."
              value={formData.description}
              onChange={handleChange}
            />
            {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl">Optional Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <p className="form-hint">Paste an image link if available.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/lost-found')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
