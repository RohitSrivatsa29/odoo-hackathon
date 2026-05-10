import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  MoreVertical,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './MyTripsPage.css';

export function MyTripsPage() {
  const { trips, deleteTrip } = useTrips();
  const navigate = useNavigate();

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
        {trips.map((trip, idx) => (
          <motion.div 
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="trips-card group"
          >
            <div className="trips-card-img-wrapper">
              <img 
                src={trip.coverImage} 
                className="trips-card-img" 
                alt={trip.name} 
              />
              <div className="trips-card-overlay"></div>
              
              <div className="trips-card-actions">
                <button 
                  onClick={() => deleteTrip(trip.id)}
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
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="trips-meta-item">
                  <p className="trips-meta-label">Stops</p>
                  <div className="trips-meta-value">
                    <MapPin size={14} className="trips-meta-icon" />
                    {trip.destinationCount} Destinations
                  </div>
                </div>
              </div>

              <div className="trips-progress-wrapper">
                <div className="trips-progress-header">
                  <span className="trips-progress-label">Planning Progress</span>
                  <span className="trips-progress-value">{trip.progress}%</span>
                </div>
                <div className="trips-progress-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trip.progress}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="trips-progress-fill"
                  ></motion.div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/itinerary-view/${trip.id}`)}
                className="trips-view-btn group/btn"
              >
                View Itinerary
                <ExternalLink size={18} className="trips-view-icon" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
