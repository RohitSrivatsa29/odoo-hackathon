import React from 'react';
import { 
  Copy, 
  Share2, 
  Download, 
  MapPin, 
  Calendar, 
  Instagram, 
  Twitter, 
  Facebook,
  Globe,
  Map,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './PublicItineraryPage.css';

export function PublicItineraryPage() {
  const { id } = useParams();
  const { trips } = useTrips();
  
  if (!trips || trips.length === 0) {
    return (
      <div className="pub-itin-page">
        <div className="pub-itin-empty">
          <h2>No trips found</h2>
          <p>Create a trip to see itineraries</p>
        </div>
      </div>
    );
  }
  
  const trip = trips.find(t => t.id === id) || trips[0];

  return (
    <div className="pub-itin-page">
      {/* Dynamic Hero */}
      <section className="pub-itin-hero">
        <img src={trip.coverImage || trip.cover_image} className="pub-itin-hero-img" alt="" />
        <div className="pub-itin-hero-overlay"></div>
        <div className="pub-itin-hero-content">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="pub-itin-hero-inner"
           >
              <div className="pub-itin-hero-badges">
                 <span className="pub-itin-badge-public">Public Itinerary</span>
                 <span className="pub-itin-creator">Created by @alexwanderer</span>
              </div>
              <h1 className="pub-itin-trip-name">{trip.name}</h1>
              <div className="pub-itin-trip-meta">
                 <div className="pub-itin-meta-item"><MapPin className="pub-itin-meta-icon" size={24} /> {trip.destinationCount || 0} Cities</div>
                 <div className="pub-itin-meta-item"><Calendar className="pub-itin-meta-icon" size={24} /> {trip.startDate || trip.start_date || 'Future'} - {trip.endDate || trip.end_date || 'Future'}</div>
              </div>
           </motion.div>
        </div>
        
        {/* Floating Controls */}
        <div className="pub-itin-floating-controls">
           <button className="pub-itin-float-btn">
              <Link to="/"><Map size={24} /></Link>
           </button>
        </div>
      </section>

      {/* Content */}
      <main className="pub-itin-main">
         <div className="pub-itin-journey">
            <div className="pub-itin-journey-section">
               <h2 className="pub-itin-journey-title">
                  The Journey Plan <div className="pub-itin-title-divider"></div>
               </h2>
               
               <div className="pub-itin-cities">
                  {trip.cities?.map((city: any, idx: number) => (
                    <div key={idx} className="pub-itin-city">
                       <div className="pub-itin-city-line"></div>
                       <div className="pub-itin-city-dot"></div>
                       
                       <div className="pub-itin-city-content">
                          <div className="pub-itin-city-header">
                             <h3 className="pub-itin-city-name">Stop 0{idx + 1}: {city.name}</h3>
                             <p className="pub-itin-city-duration">7 Days of Exploration</p>
                          </div>
                          
                          <div className="pub-itin-activities-grid">
                             {city.activities.map((act: any) => (
                               <div key={act.id} className="pub-itin-activity-card group">
                                  <div className="pub-itin-activity-img-wrapper">
                                     <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400" className="pub-itin-activity-img" alt="" />
                                     <div className="pub-itin-activity-time-badge">
                                        <Clock size={12} className="pub-itin-clock" /> {act.time}
                                     </div>
                                  </div>
                                  <div className="pub-itin-activity-info">
                                     <h4 className="pub-itin-activity-name">{act.name}</h4>
                                     <p className="pub-itin-activity-desc">"An unforgettable landmark that defines the skyline of the city."</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <aside className="pub-itin-aside">
            <div className="pub-itin-aside-sticky">
               <div className="pub-itin-remix-card">
                  <div className="pub-itin-remix-content">
                     <h3 className="pub-itin-remix-title">Like this plan? <br />Remix it to make it yours.</h3>
                     <p className="pub-itin-remix-desc">Save this entire itinerary to your Traveloop account and customize it for your specific dates.</p>
                     <button className="pub-itin-remix-btn">
                        <Copy size={20} /> Copy Itinerary
                     </button>
                  </div>
                  <Globe size={180} className="pub-itin-remix-bg-icon" />
               </div>

               <div className="pub-itin-share-card">
                  <h4 className="pub-itin-share-title">Share with Friends</h4>
                  <div className="pub-itin-share-icons">
                     <button className="pub-itin-social-btn"><Instagram size={24} /></button>
                     <button className="pub-itin-social-btn"><Twitter size={24} /></button>
                     <button className="pub-itin-social-btn"><Facebook size={24} /></button>
                  </div>
                  <button className="pub-itin-copy-link-btn">
                     <Share2 size={20} /> Copy Shareable Link
                  </button>
               </div>

               <div className="pub-itin-offline-card">
                  <div className="pub-itin-offline-icon">
                     <Download size={24} />
                  </div>
                  <div>
                     <p className="pub-itin-offline-title">Offline Access</p>
                     <button className="pub-itin-offline-link">Download as Itinerary PDF</button>
                  </div>
               </div>
            </div>
         </aside>
      </main>

      <footer className="pub-itin-footer">
         <div className="pub-itin-footer-logo">
            <div className="pub-itin-footer-icon">
               <Map size={18} />
            </div>
            <span className="pub-itin-footer-name">Traveloop</span>
         </div>
         <p className="pub-itin-footer-copy">Global Travel Planning Platform • 2024</p>
      </footer>
    </div>
  );
}
