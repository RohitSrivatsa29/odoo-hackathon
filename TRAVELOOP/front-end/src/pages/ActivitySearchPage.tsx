import React, { useState } from 'react';
import { Search, Compass, Zap, Utensils, Moon, Eye, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ACTIVITIES } from '../data/mockData';
import './ActivitySearchPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'adventure', label: 'Adventure', icon: Zap },
  { id: 'food', label: 'Food & Drink', icon: Utensils },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
  { id: 'sightseeing', label: 'Culture', icon: Eye },
];

export function ActivitySearchPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filteredActivities = ACTIVITIES.filter(a => 
    (activeTab === 'all' || a.category === activeTab) && 
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="activity-container">
      <div className="activity-header">
        <div className="activity-header-text">
          <h1 className="activity-title">Unforgettable Experiences</h1>
          <p className="activity-subtitle">From hidden local gems to world-class landmarks, find the perfect activity for your vibe.</p>
        </div>
        <div className="activity-search-wrapper group">
          <Search className="activity-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Find tours, events, food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="activity-search-input"
          />
        </div>
      </div>

      <div className="activity-tabs-container">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`activity-tab ${activeTab === cat.id ? 'active' : ''}`}
          >
            <cat.icon size={18} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="activity-grid">
        <AnimatePresence mode="popLayout">
          {filteredActivities && filteredActivities.length > 0 ? filteredActivities.map((activity, idx) => (
            <motion.div 
              key={activity.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="activity-card group"
            >
              <div className="activity-card-img-wrapper">
                <img src={activity.image} className="activity-card-img" alt={activity.name} />
                <div className="activity-card-badge">
                  <span className="activity-card-badge-icon">
                    {CATEGORIES.find(c => c.id === activity.category)?.icon && React.createElement(CATEGORIES.find(c => c.id === activity.category)!.icon, { size: 16 })}
                  </span>
                </div>
              </div>
              <div className="activity-card-body">
                <div className="activity-card-info">
                  <div className="activity-card-category">
                    <Zap size={10} className="activity-category-icon" /> Best for {activity.category}
                  </div>
                  <h3 className="activity-card-name">
                    {activity.name}
                  </h3>
                  <p className="activity-card-location">
                    <Compass size={14} /> {activity.city}
                  </p>
                </div>
                
                <div className="activity-card-footer">
                  <div>
                    <span className="activity-card-price">${activity.cost}</span>
                    <span className="activity-card-price-unit">/ person</span>
                  </div>
                  <button className="activity-card-add-btn group/btn">
                    <Plus size={20} className="activity-add-icon" />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="activity-empty-state"
            >
              <div className="activity-empty-icon">
                <Search size={32} />
              </div>
              <h3 className="activity-empty-title">No activities found</h3>
              <p className="activity-empty-subtitle">Try searching for something else or change filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
