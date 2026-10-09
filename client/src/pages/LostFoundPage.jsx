import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getItems } from '../services/itemsService';
import ItemCard from '../components/ItemCard';

const CATEGORIES = [
  'All Categories',
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

export default function LostFoundPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All Categories');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (keyword.trim()) params.search = keyword.trim();
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'All Categories') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await getItems(params);
      setItems(res.data || res || []);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError('Unable to load items from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReset = () => {
    setKeyword('');
    setTypeFilter('all');
    setCategoryFilter('All Categories');
    setStatusFilter('all');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Lost &amp; Found</h1>
            <p className="page-subtitle">Search or report misplaced and discovered possessions</p>
          </div>
          <Link to="/report-item" className="btn btn-primary">
            + Report an Item
          </Link>
        </div>
      </div>

      {/* Toolbar / Search & Filter */}
      <form onSubmit={handleSearchSubmit} className="toolbar">
        <div className="toolbar-group" style={{ flex: '1 1 240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search title, description, location..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Only</option>
            <option value="found">Found Only</option>
          </select>

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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
            <option value="Returned">Returned</option>
            <option value="Closed">Closed</option>
          </select>

          {(keyword || typeFilter !== 'all' || categoryFilter !== 'All Categories' || statusFilter !== 'all') && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading items...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>We couldn't find any reports matching your search or filters.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
              Clear Filters
            </button>
            <Link to="/report-item" className="btn btn-primary btn-sm">
              Create New Report
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
