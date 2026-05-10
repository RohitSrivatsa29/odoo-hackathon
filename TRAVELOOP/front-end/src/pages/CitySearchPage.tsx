import React, { useState } from 'react';
import { Search, MapPin, Globe, Filter, Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_CITIES } from '../data/mockData';
import './CitySearchPage.css';

export function CitySearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="city-search-container">
      <div className="city-search-header">
        <h1 className="city-search-title">Explore the Globe</h1>
        <p className="city-search-subtitle">Discover your next favorite city and add it to your travel plans with a single click.</p>
      </div>

      <div className="city-search-controls">
        <div className="city-search-input-wrapper group">
          <Search className="city-search-icon" size={24} />
          <input 
            type="text" 
            placeholder="Where do you want to go?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="city-search-input"
          />
        </div>
        <button className="city-search-filter-btn">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <section className="city-search-destinations">
        <div className="city-search-destinations-header">
          <h2 className="city-search-destinations-title">Popular Destinations</h2>
          <div className="city-search-destinations-filters">
            {['Europe', 'Asia', 'Americas', 'Oceania'].map(cat => (
              <button key={cat} className="city-search-category-btn">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="city-search-results">
          {POPULAR_CITIES && POPULAR_CITIES.length > 0 ? POPULAR_CITIES
            .filter(city => city.name.toLowerCase().includes(query.toLowerCase()) || 
                           city.country.toLowerCase().includes(query.toLowerCase()))
            .map((city, idx) => (
              <motion.div 
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="city-search-card group"
              >
                <div className="city-search-card-img-wrapper">
                  <img src={city.image} className="city-search-card-img" alt={city.name} />
                  <div className="city-search-card-overlay"></div>
                  <div className="city-search-card-rating">
                    <div className="city-search-card-rating-badge">
                      <Star size={14} fill="currentColor" /> 4.9
                    </div>
                <div className="city-search-card-overlay"></div>
                <div className="city-search-card-rating">
                  </div>
                </div>
                <div className="city-search-card-info">
                  <h4 className="city-search-card-name">{city.name}</h4>
                  <div className="city-search-card-country">
                    <Globe size={14} /> {city.country}
                  </div>
                </div>
              </div>
              <div className="city-search-card-footer">
                <button className="city-search-card-add-btn group/btn">
                  <Plus size={18} />
                  Add to Trip
                </button>
              </div>
            </motion.div>
          )) : (
              <div className="city-search-empty">
                <p>No cities found. Try a different search.</p>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}
