import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './MyTripsPage.css';

export function MyTripsPage() {
  const { trips, deleteTrip, loading } = useTrips();
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading trips...</div>;
  }

  return (
    <div className="trips-container">
      <div className="trips-header-wrapper">
        <div>
          <h1 className="trips-title">My Trips</h1>
          <p className="trips-subtitle">Manage and explore your planned journeys.</p>
        </div>
        <button 
          onClick={() => navigate('/create-trip')}
          className="trips-create-btn"
        >
          <Plus size={20} />
          Create Trip
        </button>
      </div>

      <div className="trips-grid">
        {trips.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <p>No trips found. Start by creating your first adventure!</p>
          </div>
        ) : (
          trips.map((trip, idx) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="trips-card group"
            >
              <div className="trips-card-img-wrapper">
                <img 
                  src={trip.coverImage || trip.cover_image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'} 
                  className="trips-card-img" 
                  alt={trip.name} 
                />
                <div className="trips-card-overlay"></div>
                
                <div className="trips-card-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTrip(trip.id);
                    }}
                    className="trips-action-btn trips-action-delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                    className="trips-action-btn trips-action-edit"
                    title="Edit Trip Itinerary"
                  >
                    <Edit size={18} />
                  </button>
                </div>

                <div className="trips-card-status">
                  {trip.status}
                </div>
              </div>

              <div className="trips-card-body">
                <div>
                  <h3 className="trips-card-name">{trip.name}</h3>
                  <p className="trips-card-desc">
                    {trip.description}
                  </p>
                </div>

                <div className="trips-card-meta">
                  <div className="trips-meta-item">
                    <p className="trips-meta-label">Date</p>
                    <div className="trips-meta-value">
                      <Calendar size={14} className="trips-meta-icon" />
                      {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Future'}
                    </div>
                  </div>
                  <div className="trips-meta-item">
                    <p className="trips-meta-label">Budget</p>
                    <div className="trips-meta-value">
                      <span style={{ fontSize: '0.875rem' }}>$</span>
                      {typeof trip.budget === 'number'
                        ? trip.budget.toLocaleString()
                        : '—'}

                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                  className="trips-view-btn group/btn"
                >
                  View Itinerary
                  <ExternalLink size={18} className="trips-view-icon" />
                </button>
              </div>
          </motion.div>
        ))
      )}

      </div>
    </div>
  );
}
