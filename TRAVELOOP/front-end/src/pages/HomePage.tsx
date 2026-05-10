import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import './HomePage.css';

export function HomePage() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const navigate = useNavigate();

  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const planningTrips = trips.filter(t => t.status === 'planning' || t.status === 'ongoing').length;

  return (
    <div className="homepage-container">
      {/* Welcome Banner */}
      <section className="home-banner group">
        <div className="home-banner-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200" 
          alt="Travel Hero" 
          className="home-banner-img"
        />
        <div className="home-banner-content">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="home-banner-text-box"
          >
            <div className="home-banner-tag">
              <span className="home-banner-tag-text">Welcome Back</span>
              <span className="home-banner-tag-dot"></span>
              <span className="home-banner-tag-date">
                {trips && trips.length > 0 ? `${totalTrips} trip${totalTrips !== 1 ? 's' : ''} planned` : 'Ready to explore?'}
              </span>
            </div>
            <h1 className="home-banner-title">
              {trips && trips.length > 0
                ? <>Your next adventure awaits,<br /></>
                : <>Start planning your<br /></>
              }
              <span className="home-banner-title-highlight">{user?.name || user?.username || 'Traveler'}</span>
            </h1>
            <button 
              onClick={() => navigate('/create-trip')}
              className="home-btn-primary"
            >
              <Plus size={20} />
              {trips.length > 0 ? 'New Trip' : 'Create First Trip'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Real Statistics */}
      <section className="home-stats">
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper orange">
            <Globe size={24} />
          </div>
          <div>
            <p className="home-stat-label">Total Trips</p>
            <p className="home-stat-value">{totalTrips}</p>
          </div>
        </div>
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="home-stat-label">Completed</p>
            <p className="home-stat-value">{completedTrips}</p>
          </div>
        </div>
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper blue">
            <MapPin size={24} />
          </div>
          <div>
            <p className="home-stat-label">In Planning</p>
            <p className="home-stat-value">{planningTrips}</p>
          </div>
        </div>
      </section>

      {/* Recent Trips */}
      <section className="home-recent-trips">
        <div className="home-section-header">
          <h2 className="home-section-title">Upcoming & Recent Trips</h2>
          <button 
            onClick={() => navigate('/trips')}
            className="home-section-link"
          >
            See all
          </button>
        </div>
        
        <div className="home-trips-grid">
          {trips && trips.length > 0 ? trips.slice(0, 4).map((trip) => (
            <motion.div 
              key={trip.id}
              whileHover={{ y: -5 }}
              className="home-trip-card group"
              onClick={() => navigate(`/itinerary/${trip.id}`)}
            >
              <div className="home-trip-img-wrapper">
                <img 
                  src={trip.coverImage || trip.cover_image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'} 
                  className="home-trip-img" 
                  alt={trip.name} 
                />
                <div className="home-trip-status">
                  {trip.status}
                </div>
              </div>
              <div className="home-trip-info">
                <div>
                  <h3 className="home-trip-name">{trip.name}</h3>
                  <div className="home-trip-meta">
                    <div className="home-trip-meta-item">
                      <Calendar size={12} /> {trip.startDate || trip.start_date || 'Not set'}
                    </div>
                    {trip.budget && (
                      <div className="home-trip-meta-item">
                        <MapPin size={12} /> ${trip.budget}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '3rem 2rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '1.25rem',
              border: '1px dashed rgba(255,255,255,0.1)',
              color: '#4b5563'
            }}>
              <Globe size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No trips yet</p>
              <p style={{ fontSize: '0.8rem' }}>
                <button onClick={() => navigate('/create-trip')} style={{ color: '#fb923c', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Create your first trip →
                </button>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

