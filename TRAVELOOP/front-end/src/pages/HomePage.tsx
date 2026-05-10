import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { POPULAR_CITIES } from '../data/mockData';
import './HomePage.css';

export function HomePage() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const navigate = useNavigate();

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
              <span className="home-banner-tag-text">Upcoming Journey</span>
              <span className="home-banner-tag-dot"></span>
              <span className="home-banner-tag-date">Summer 2026</span>
            </div>
            <h1 className="home-banner-title">
              Where to, <br />
              <span className="home-banner-title-highlight">{user?.name || 'Traveler'}?</span>
            </h1>
            <button 
              onClick={() => navigate('/create-trip')}
              className="home-btn-primary"
            >
              <Plus size={20} />
              Open Planner
            </button>
          </motion.div>
        </div>
      </section>

      {/* Statistics & Budget Highlights */}
      <section className="home-stats">
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper orange">
            <Globe size={24} />
          </div>
          <div>
            <p className="home-stat-label">Trips Taken</p>
            <p className="home-stat-value">12</p>
          </div>
        </div>
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper green">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="home-stat-label">Budget Saved</p>
            <p className="home-stat-value">15%</p>
          </div>
        </div>
        <div className="home-stat-card group">
          <div className="home-stat-icon-wrapper blue">
            <MapPin size={24} />
          </div>
          <div>
            <p className="home-stat-label">Cities Visited</p>
            <p className="home-stat-value">24</p>
          </div>
        </div>
      </section>

      <div className="home-main-grid">
        {/* Recent Trips */}
        <section className="home-recent-trips">
          <div className="home-section-header">
            <h2 className="home-section-title">Your Recent Trips</h2>
            <button 
              onClick={() => navigate('/trips')}
              className="home-section-link"
            >
              See all
            </button>
          </div>
          
          <div className="home-trips-grid">
            {trips && trips.length > 0 ? trips.slice(0, 2).map((trip) => (
              <motion.div 
                key={trip.id}
                whileHover={{ y: -5 }}
                className="home-trip-card group"
                onClick={() => navigate(`/itinerary/${trip.id}`)}
              >
                <div className="home-trip-img-wrapper">
                  <img src={trip.coverImage || trip.cover_image} className="home-trip-img" alt={trip.name} />
                  <div className="home-trip-status">
                    {trip.status}
                  </div>
                </div>
                <div className="home-trip-info">
                  <div>
                    <h3 className="home-trip-name">{trip.name}</h3>
                    <div className="home-trip-meta">
                      <div className="home-trip-meta-item"><Calendar size={12} /> {trip.startDate || trip.start_date || 'Future'}</div>
                      <div className="home-trip-meta-item"><MapPin size={12} /> {trip.destinationCount || 0} Stops</div>
                    </div>
                  </div>
                  <div className="home-trip-progress-bar">
                    <div className="home-trip-progress-fill" style={{ width: `${trip.progress || 0}%` }}></div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="home-trips-empty">
                <p>No trips yet. Create your first trip to get started!</p>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Destinations */}
        <section className="home-recommended">
          <h2 className="home-section-title">Recommended</h2>
          <div className="home-recommended-list">
            {POPULAR_CITIES && POPULAR_CITIES.length > 0 ? POPULAR_CITIES.map((city, idx) => (
              <motion.div 
                key={city.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="home-city-card group"
              >
                <img src={city.image} className="home-city-img" alt={city.name} />
                <div className="home-city-info">
                  <h4 className="home-city-name">{city.name}</h4>
                  <p className="home-city-country">{city.country}</p>
                </div>
                <button className="home-city-btn group-hover:active">
                  <Plus size={18} />
                </button>
              </motion.div>
            )) : (
              <div className="home-recommended-empty">
                <p>Start exploring to see recommendations</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
