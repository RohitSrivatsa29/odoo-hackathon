import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MapPin, 
  Clock, 
  ChevronRight, 
  MoreHorizontal,
  ArrowLeft,
  Share2,
  Settings,
  Image as ImageIcon,
  Map
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './ItineraryBuilderPage.css';

export function ItineraryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTripById } = useTrips();
  const trip = getTripById(id || '');

  const [cities, setCities] = useState(trip?.cities || [
    { id: '1', name: 'Starting Point', activities: [] }
  ]);

  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="itin-builder-container">
      {/* Header */}
      <div className="itin-builder-header">
        <div className="itin-builder-header-left">
          <button onClick={() => navigate('/trips')} className="itin-builder-back-btn">
            <ArrowLeft size={18} /> Back to Trips
          </button>
          <div className="itin-builder-trip-info">
            <div className="itin-builder-cover-thumb">
              <img src={trip.coverImage} className="itin-builder-cover-img" alt="" />
            </div>
            <div>
              <h1 className="itin-builder-trip-name">{trip.name}</h1>
              <div className="itin-builder-trip-meta">
                <span className="itin-builder-meta-item"><MapPin size={16} /> {trip.destinationCount} Cities</span>
                <span className="itin-builder-status-badge">{trip.status}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="itin-builder-header-actions">
          <button className="itin-builder-share-btn">
            <Share2 size={18} /> Share
          </button>
          <button className="itin-builder-add-btn">
            <Plus size={18} /> Add City
          </button>
        </div>
      </div>

      <div className="itin-builder-body">
        {/* Navigation / List */}
        <div className="itin-builder-nav">
          <div className="itin-builder-overview-card">
            <h3 className="itin-builder-overview-title">Itinerary Overview</h3>
            <div className="itin-builder-city-list">
              {cities.map((city, idx) => (
                <div key={city.id} className="itin-builder-city-item group">
                  <div className="itin-builder-city-num">
                    {idx + 1}
                  </div>
                  <span className="itin-builder-city-name">{city.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="itin-builder-promo-card">
            <div className="itin-builder-promo-content">
              <h3 className="itin-builder-promo-title">Next Stop: Tokyo</h3>
              <p className="itin-builder-promo-desc">You've planned 8 activities here. Don't forget to book the Ramen workshop!</p>
              <button className="itin-builder-promo-btn">
                Explore Tokyo Activities <ChevronRight size={14} />
              </button>
            </div>
            <Map size={100} className="itin-builder-promo-icon" />
          </div>
        </div>

        {/* Builder Timeline */}
        <div className="itin-builder-timeline">
           <Reorder.Group axis="y" values={cities} onReorder={setCities} className="itin-builder-reorder-group">
            {cities.map((city, cityIdx) => (
              <Reorder.Item key={city.id} value={city} className="itin-builder-reorder-item">
                {/* Timeline Line */}
                {cityIdx < cities.length - 1 && (
                  <div className="itin-builder-timeline-line"></div>
                )}
                
                <div className="itin-builder-city-card group">
                  <div className="itin-builder-city-card-header">
                    <div className="itin-builder-city-card-title-row">
                      <div className="itin-builder-day-badge group-hover:bg-orange-500">
                        <span className="itin-builder-day-label">Day</span>
                        <span className="itin-builder-day-num">0{cityIdx + 1}</span>
                      </div>
                      <div>
                        <h2 className="itin-builder-city-card-name">
                          {city.name}
                          <Settings size={20} className="itin-builder-city-settings" />
                        </h2>
                        <span className="itin-builder-city-activity-count">Planned for {city.activities?.length || 0} activities</span>
                      </div>
                    </div>
                    <button className="itin-builder-more-btn">
                      <MoreHorizontal size={24} />
                    </button>
                  </div>

                  <div className="itin-builder-activities-list">
                    {city.activities?.map((activity: any) => (
                      <motion.div 
                        key={activity.id}
                        whileHover={{ x: 5 }}
                        className="itin-builder-activity-item"
                      >
                        <div className="itin-builder-activity-time">
                          <Clock size={14} className="itin-builder-clock-icon" /> {activity.time}
                        </div>
                        <div className="itin-builder-activity-info">
                          <h4 className="itin-builder-activity-name">{activity.name}</h4>
                          <div className="itin-builder-activity-tags">
                            <span className="itin-builder-tag-paid">Paid</span>
                            <span className="itin-builder-tag-cost">Est. Cost: ${activity.cost}</span>
                          </div>
                        </div>
                        <button className="itin-builder-remove-btn group-hover:opacity-100">
                          <Plus size={18} className="itin-builder-remove-icon" />
                        </button>
                      </motion.div>
                    ))}
                    
                    <button className="itin-builder-add-activity-btn">
                      <Plus size={18} /> Add Activity
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
}

