import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  List, 
  Grid, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Layout,
  Plus,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './ItineraryViewPage.css';

export function ItineraryViewPage() {
  const { id } = useParams();
  const { trips, getTripById } = useTrips();
  const trip = id ? getTripById(id) : trips[0];
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  if (!trip) {
    return (
      <div className="itin-view-container">
        <div className="itin-view-header">
          <h1 className="itin-view-title">No Trip Selected</h1>
          <p className="itin-view-subtitle">Please select a trip from your dashboard to view its itinerary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="itin-view-container">
      <div className="itin-view-header">
        <div className="itin-view-header-left">
          <h1 className="itin-view-title">Trip Visualization</h1>
          <p className="itin-view-subtitle">A bird's eye view of your entire adventure.</p>
        </div>
        
        <div className="itin-view-mode-toggle">
           <button 
             onClick={() => setViewMode('timeline')}
             className={`itin-view-mode-btn ${viewMode === 'timeline' ? 'active' : ''}`}
           >
             <List size={16} /> Timeline
           </button>
           <button 
             onClick={() => setViewMode('grid')}
             className={`itin-view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
           >
             <Grid size={16} /> Day Grid
           </button>
        </div>
      </div>

      <div className="itin-view-body">
        <div className="itin-view-sidebar">
           <div className="itin-view-nav-card">
              <div className="itin-view-nav-header">
                 <h3 className="itin-view-nav-title">Navigation</h3>
                 <div className="itin-view-nav-arrows">
                    <button className="itin-view-nav-btn"><ChevronLeft size={20} /></button>
                    <button className="itin-view-nav-btn"><ChevronRight size={20} /></button>
                 </div>
              </div>
              
              <div className="itin-view-days-list">
                 {[1, 2, 3, 4, 5, 6, 7].map(day => (
                   <div key={day} className={`itin-view-day-item ${day === 1 ? 'active' : ''}`}>
                      <div className="itin-view-day-left">
                         <div className={`itin-view-day-num ${day === 1 ? 'active' : ''}`}>
                            {day}
                         </div>
                         <div>
                            <p className="itin-view-day-date">Oct 1{day}, 2024</p>
                            <p className="itin-view-day-stage">Tokyo Stage</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="itin-view-sync-card group">
              <CalendarIcon size={120} className="itin-view-sync-bg-icon" />
              <h3 className="itin-view-sync-title">Calendar Sync</h3>
              <p className="itin-view-sync-desc">Easily sync your Traveloop itinerary to your calendar.</p>
              <button className="itin-view-sync-btn">
                 Sync Now
              </button>
           </div>
        </div>

        <div className="itin-view-content">
           <AnimatePresence mode="wait">
             {viewMode === 'timeline' ? (
               <motion.div 
                 key="timeline"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="itin-view-timeline-list"
               >
<<<<<<< HEAD
                 {trip.cities?.[0]?.activities?.map((act: any, idx: number) => (
                    <div key={act.id} className="itin-view-timeline-item group">
                       <div className="itin-view-timeline-left">
                          <div className="itin-view-day-circle">
                             <span className="itin-view-day-circle-label">Day</span>
                             <span className="itin-view-day-circle-num">01</span>
                          </div>
                          {idx < trip.cities[0].activities.length - 1 && <div className="itin-view-timeline-connector"></div>}
=======
                 {trip?.cities?.[0]?.activities?.map((act: any, idx: number) => (
                   <div key={act.id} className="itin-view-timeline-item group">
                      <div className="itin-view-timeline-left">
                         <div className="itin-view-day-circle">
                            <span className="itin-view-day-circle-label">Day</span>
                            <span className="itin-view-day-circle-num">01</span>
                         </div>
                         {idx < (trip?.cities?.[0]?.activities?.length || 0) - 1 && <div className="itin-view-timeline-connector"></div>}
>>>>>>> 401c1272bdf70ae65e205b50bc48b2f284cf8a9c
                      </div>
                      
                      <div className="itin-view-timeline-card-wrapper">
                         <div className="itin-view-timeline-card">
                            <div className="itin-view-timeline-card-arrow"></div>
                            <div className="itin-view-timeline-card-content">
                               <div className="itin-view-timeline-card-left">
                                  <div className="itin-view-timeline-img-wrapper">
                                     <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=200" className="itin-view-timeline-img" alt="" />
                                  </div>
                                  <div className="itin-view-timeline-info">
                                     <div className="itin-view-timeline-time">
                                        <Clock size={12} /> {act.time}
                                     </div>
                                     <h3 className="itin-view-timeline-act-name">{act.name}</h3>
                                     <p className="itin-view-timeline-act-loc">Shibuya, Tokyo • Outdoor Activity</p>
                                  </div>
                               </div>
                               <div className="itin-view-timeline-card-right">
                                  <span className="itin-view-timeline-cost">${act.cost}</span>
                                  <button className="itin-view-timeline-map-btn">
                                     View Map
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 <button className="itin-view-add-day-btn group">
                    <Plus size={24} className="itin-view-add-day-icon" /> Add Activity to Day 01
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                  key="grid"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="itin-view-grid"
               >
                 {[1, 2, 3, 4, 5, 6, 7].map(day => (
                   <div key={day} className="itin-view-grid-card">
                     <div>
                       <div className="itin-view-grid-card-header">
                         <div className="itin-view-grid-day-badge">Day 0{day}</div>
                         <button className="itin-view-grid-more"><MoreVertical size={16} /></button>
                       </div>
                       <h3 className="itin-view-grid-title">Tokyo City Exploration</h3>
                       <p className="itin-view-grid-desc">Shibuya Crossing, Harajuku, Omotesando and Meiji Shrine.</p>
                     </div>
                     
                     <div className="itin-view-grid-footer">
                        <div className="itin-view-grid-avatars">
                           {[1,2,3].map(i => (
                             <div key={i} className="itin-view-avatar">
                                <img src={`https://i.pravatar.cc/150?u=${i + day}`} alt="" />
                             </div>
                           ))}
                           <div className="itin-view-avatar-extra">+4</div>
                        </div>
                        <button className="itin-view-grid-view-btn">
                           View Day Itinerary <ChevronRight size={14} />
                        </button>
                     </div>
                   </div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
