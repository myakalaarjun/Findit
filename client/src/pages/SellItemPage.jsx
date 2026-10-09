import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../services/listingsService';

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

const CONDITIONS = [
  'New / Unopened',
  'Like New',
  'Good Condition',
  'Fair / Signs of Use',
  'For Parts or Repair',
];

export default function SellItemPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics & Gadgets',
    condition: 'Good Condition',
    location: '',
    imageUrl: '',
    sellerContact: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errors.price = 'Please provide a valid price (0 or higher).';
    }
    if (!formData.location.trim()) errors.location = 'Location is required.';
    if (!formData.category) errors.category = 'Category is required.';
    if (!formData.condition) errors.condition = 'Condition is required.';
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
        price: Number(formData.price),
        status: 'active',
      };
      const response = await createListing(payload);
      const created = response.data || response;
      navigate(`/marketplace/${created._id}`);
    } catch (err) {
      console.error('Failed to create listing:', err);
      setError(err?.response?.data?.message || 'Failed to create listing. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Sell an Item</h1>
        <p className="page-subtitle">List your pre-loved goods for reuse on the ReLoop marketplace</p>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Listing Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Ergonomic Office Chair, Canon EOS Camera..."
              value={formData.title}
              onChange={handleChange}
            />
            {fieldErrors.title && <div className="form-error">{fieldErrors.title}</div>}
          </div>

          {/* Price & Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price (₹ INR) <span className="required">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="1"
                min="0"
                className="form-control"
                placeholder="e.g. 1500"
                value={formData.price}
                onChange={handleChange}
              />
              {fieldErrors.price && <div className="form-error">{fieldErrors.price}</div>}
            </div>

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
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition & Location */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="condition">
                Condition <span className="required">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                className="form-control"
                value={formData.condition}
                onChange={handleChange}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Pickup Location / Area <span className="required">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-control"
                placeholder="e.g. Downtown North, Westside Ave..."
                value={formData.location}
                onChange={handleChange}
              />
              {fieldErrors.location && <div className="form-error">{fieldErrors.location}</div>}
            </div>
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
              placeholder="Describe condition, specifications, age, reasons for selling, and pickup details..."
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
            <p className="form-hint">Paste a direct image link if you have photos uploaded.</p>
          </div>

          {/* Seller Contact Info */}
          <div className="form-group">
            <label htmlFor="sellerContact">Optional Contact Info for Buyers</label>
            <input
              id="sellerContact"
              name="sellerContact"
              type="text"
              className="form-control"
              placeholder="e.g. phone: 555-0192 or email: seller@example.com"
              value={formData.sellerContact}
              onChange={handleChange}
            />
            <p className="form-hint">
              Since authentication is coming later, buyers will use this contact info to coordinate pickup.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/marketplace')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : 'List for Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
