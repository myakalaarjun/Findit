import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems } from '../services/itemsService';
import { getListings } from '../services/listingsService';
import ItemCard from '../components/ItemCard';
import ListingCard from '../components/ListingCard';

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, listingsRes] = await Promise.all([
          getItems({ limit: 4 }),
          getListings({ limit: 4 }),
        ]);
        setRecentItems(itemsRes.data || itemsRes || []);
        setRecentListings(listingsRes.data || listingsRes || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setError('Unable to reach the server. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-dark-navy)',
        color: 'var(--color-white)',
        padding: '3.5rem 1.5rem',
        borderRadius: '8px',
        marginBottom: '2.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-warm-cream)', marginBottom: '0.75rem' }}>
            ReLoop
          </h1>
          <p style={{ fontSize: '1.25rem', fontWeight: '500', color: '#cfd7eb', marginBottom: '1rem' }}>
            Find it. Sell it. Reuse it.
          </p>
          <p style={{ fontSize: '1rem', color: '#aab8d8', lineHeight: '1.6', marginBottom: '2rem' }}>
            A unified local platform to reunite lost possessions with their rightful owners and buy or sell quality pre-owned goods. Keep belongings in circulation and build a more connected community.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/report-item" className="btn btn-primary" style={{ backgroundColor: 'var(--color-warm-cream)', color: 'var(--color-deep-navy)', borderColor: 'var(--color-warm-cream)' }}>
              Report an Item
            </Link>
            <Link to="/marketplace" className="btn btn-outline" style={{ color: 'var(--color-white)', borderColor: 'var(--color-warm-cream)' }}>
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h2 className="page-title">How ReLoop Works</h2>
          <p className="page-subtitle">Simple, straightforward community exchange</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          <div style={{
            backgroundColor: 'var(--color-gray-light)',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid var(--color-gray-border)'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🔍 1. Report or Search</div>
            <h4 style={{ color: 'var(--color-deep-navy)', marginBottom: '0.5rem' }}>Lost &amp; Found</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Post items you have misplaced or discovered. Search by location, category, or keyword to match lost items with finders.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--color-gray-light)',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid var(--color-gray-border)'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏷️ 2. Buy &amp; Sell</div>
            <h4 style={{ color: 'var(--color-deep-navy)', marginBottom: '0.5rem' }}>Secondhand Market</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              List pre-loved goods at fair prices. Buyers contact sellers directly to inspect, purchase, and pick up items locally.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--color-gray-light)',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid var(--color-gray-border)'
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>♻️ 3. Close the Loop</div>
            <h4 style={{ color: 'var(--color-deep-navy)', marginBottom: '0.5rem' }}>Sustainable Reuse</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Mark items as returned or sold once complete. Prevent unnecessary waste and build community trust.
            </p>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-warning">{error}</div>}

      {/* Recent Lost & Found */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="page-header-row" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Recent Lost &amp; Found Reports</h2>
            <p className="page-subtitle">Latest items reported across the community</p>
          </div>
          <Link to="/lost-found" className="btn btn-outline btn-sm">
            View All Reports &rarr;
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading recent reports...</p>
        ) : recentItems.length === 0 ? (
          <div className="empty-state">
            <h3>No reports found</h3>
            <p>Be the first to report a lost or found item.</p>
            <Link to="/report-item" className="btn btn-primary btn-sm">
              Report an Item
            </Link>
          </div>
        ) : (
          <div className="grid">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Marketplace Listings */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="page-header-row" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Recent Marketplace Listings</h2>
            <p className="page-subtitle">Quality pre-owned goods ready for reuse</p>
          </div>
          <Link to="/marketplace" className="btn btn-outline btn-sm">
            View All Listings &rarr;
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading marketplace listings...</p>
        ) : recentListings.length === 0 ? (
          <div className="empty-state">
            <h3>No active listings</h3>
            <p>Ready to sell? Post your pre-loved goods now.</p>
            <Link to="/sell" className="btn btn-primary btn-sm">
              Sell an Item
            </Link>
          </div>
        ) : (
          <div className="grid">
            {recentListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
