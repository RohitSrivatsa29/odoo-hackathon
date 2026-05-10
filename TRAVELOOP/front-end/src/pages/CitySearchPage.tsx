import React, { useState, useMemo } from 'react';
import { Search, MapPin, Globe, Star, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import './CitySearchPage.css';

const ALL_CITIES = [
  // Asia
  { name: 'Tokyo',          country: 'Japan',          region: 'Asia',    rating: 4.9, tags: ['Culture','Food','Tech'],      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', desc: 'Neon lights, ancient temples & world-class sushi.' },
  { name: 'Kyoto',          country: 'Japan',          region: 'Asia',    rating: 4.8, tags: ['History','Temples','Nature'], img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', desc: 'Golden pavilions, geisha districts & bamboo forests.' },
  { name: 'Bali',           country: 'Indonesia',      region: 'Asia',    rating: 4.8, tags: ['Beach','Yoga','Culture'],     img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', desc: 'Spiritual rice terraces, surf beaches & temples.' },
  { name: 'Bangkok',        country: 'Thailand',       region: 'Asia',    rating: 4.7, tags: ['Food','Culture','Shopping'],  img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', desc: 'Street food paradise with golden wats.' },
  { name: 'Singapore',      country: 'Singapore',      region: 'Asia',    rating: 4.9, tags: ['Modern','Food','Shopping'],  img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', desc: 'Futuristic city-state, garden domes & hawker centres.' },
  { name: 'Seoul',          country: 'South Korea',    region: 'Asia',    rating: 4.8, tags: ['Culture','K-Pop','Food'],     img: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=600&q=80', desc: 'Palaces, street fashion & late-night BBQ.' },
  { name: 'Phuket',         country: 'Thailand',       region: 'Asia',    rating: 4.6, tags: ['Beach','Nightlife','Diving'],img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', desc: 'Crystal waters, cliffs & vibrant nightlife.' },
  { name: 'Maldives',       country: 'Maldives',       region: 'Asia',    rating: 5.0, tags: ['Luxury','Beach','Diving'],   img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', desc: 'Overwater bungalows on turquoise lagoons.' },
  // Europe
  { name: 'Paris',          country: 'France',         region: 'Europe',  rating: 4.9, tags: ['Romance','Art','Food'],      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', desc: 'City of love, the Louvre & world-class cuisine.' },
  { name: 'Rome',           country: 'Italy',          region: 'Europe',  rating: 4.8, tags: ['History','Food','Culture'],  img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', desc: 'The Eternal City — Colosseum, pizza & gelato.' },
  { name: 'Barcelona',      country: 'Spain',          region: 'Europe',  rating: 4.8, tags: ['Architecture','Beach','Nightlife'], img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80', desc: 'Gaudí masterpieces and beach-side tapas bars.' },
  { name: 'Santorini',      country: 'Greece',         region: 'Europe',  rating: 4.9, tags: ['Views','Romance','Beach'],   img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', desc: 'White-washed cliffs, blue domes & Aegean sunsets.' },
  { name: 'Amsterdam',      country: 'Netherlands',    region: 'Europe',  rating: 4.7, tags: ['Canals','Art','Cycling'],    img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&q=80', desc: 'Golden Age canals, Rijksmuseum & bike culture.' },
  { name: 'Prague',         country: 'Czech Republic', region: 'Europe',  rating: 4.8, tags: ['History','Beer','Architecture'], img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80', desc: 'Fairytale spires, cobblestones & Czech beer.' },
  { name: 'Lisbon',         country: 'Portugal',       region: 'Europe',  rating: 4.7, tags: ['Food','Fado','Views'],       img: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=600&q=80', desc: 'Hilltop trams, pastel de nata & Atlantic views.' },
  { name: 'Vienna',         country: 'Austria',        region: 'Europe',  rating: 4.8, tags: ['Music','History','Cafés'],   img: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80', desc: 'Imperial palaces, Mozart & legendary coffee houses.' },
  // Americas
  { name: 'New York',       country: 'United States',  region: 'Americas',rating: 4.8, tags: ['Iconic','Food','Culture'],  img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', desc: 'The city that never sleeps — pizza, Broadway & more.' },
  { name: 'Miami',          country: 'United States',  region: 'Americas',rating: 4.7, tags: ['Beach','Nightlife','Art'],  img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80', desc: 'South Beach, Art Deco, Cuban food & parties.' },
  { name: 'Rio de Janeiro', country: 'Brazil',         region: 'Americas',rating: 4.7, tags: ['Carnival','Beach','Views'], img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80', desc: 'Christ the Redeemer, Copacabana & samba nights.' },
  { name: 'Mexico City',    country: 'Mexico',         region: 'Americas',rating: 4.6, tags: ['Food','Culture','Art'],     img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&q=80', desc: 'Aztec ruins, street tacos & vibrant murals.' },
  // Middle East & Africa
  { name: 'Dubai',          country: 'UAE',            region: 'Middle East', rating: 4.8, tags: ['Luxury','Shopping','Desert'], img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', desc: 'Skyscrapers, gold souks & desert adventures.' },
  { name: 'Marrakech',      country: 'Morocco',        region: 'Africa',  rating: 4.7, tags: ['Souks','Culture','Food'],    img: 'https://images.unsplash.com/photo-1539020140153-e479b8f22986?w=600&q=80', desc: 'Bustling medinas, riads & Sahara day trips.' },
  { name: 'Cape Town',      country: 'South Africa',   region: 'Africa',  rating: 4.9, tags: ['Nature','Wine','Beach'],     img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', desc: 'Table Mountain, whale watching & Cape winelands.' },
  // India
  { name: 'Goa',            country: 'India',          region: 'India',   rating: 4.6, tags: ['Beach','Food','Nightlife'],  img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', desc: 'Golden sands, spiced seafood & Portuguese charm.' },
  { name: 'Jaipur',         country: 'India',          region: 'India',   rating: 4.7, tags: ['History','Culture','Palaces'], img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', desc: 'The Pink City — Amber Fort, bazaars & camels.' },
  { name: 'Mumbai',         country: 'India',          region: 'India',   rating: 4.5, tags: ['Bollywood','Food','History'],img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80', desc: 'Gateway of India, street food & the film industry.' },
  { name: 'Kerala',         country: 'India',          region: 'India',   rating: 4.8, tags: ['Backwaters','Nature','Ayurveda'], img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', desc: 'Houseboat cruises, spice gardens & elephant festivals.' },
];

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'India', 'Middle East', 'Africa'];

export function CitySearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return ALL_CITIES.filter(c => {
      const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase());
      const matchR = activeRegion === 'All' || c.region === activeRegion;
      return matchQ && matchR;
    });
  }, [query, activeRegion]);

  const handleAdd = (name: string) => {
    setAdded(prev => { const s = new Set(prev); s.add(name); return s; });
    // Navigate to create trip pre-filled — optional
    setTimeout(() => navigate('/create-trip'), 300);
  };

  return (
    <div className="explore-container">
      {/* Header */}
      <div className="explore-header">
        <h1 className="explore-title">Explore the Globe</h1>
        <p className="explore-subtitle">Discover your next favourite destination and add it to your travel plans instantly.</p>
      </div>

      {/* Search bar */}
      <div className="explore-search-wrap">
        <Search size={18} className="explore-search-icon" />
        <input
          type="text"
          placeholder="Search city or country…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="explore-search-input"
        />
      </div>

      {/* Region filters */}
      <div className="explore-regions">
        {REGIONS.map(r => (
          <button
            key={r}
            className={`explore-region-btn ${activeRegion === r ? 'active' : ''}`}
            onClick={() => setActiveRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="explore-count">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      <div className="explore-grid">
        <AnimatePresence>
          {filtered.map((city, idx) => (
            <motion.div
              key={city.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(idx * 0.04, 0.3) }}
              className="explore-card"
            >
              {/* Image */}
              <div className="explore-card-img-wrap">
                <img src={city.img} alt={city.name} className="explore-card-img" />
                <div className="explore-card-overlay" />
                {/* Rating */}
                <div className="explore-card-rating">
                  <Star size={11} fill="currentColor" />
                  {city.rating}
                </div>
                {/* Region badge */}
                <div className="explore-card-region">{city.region}</div>
              </div>

              {/* Body */}
              <div className="explore-card-body">
                <div className="explore-card-top">
                  <div>
                    <h3 className="explore-card-name">{city.name}</h3>
                    <p className="explore-card-country"><Globe size={12} />{city.country}</p>
                  </div>
                </div>

                <p className="explore-card-desc">{city.desc}</p>

                {/* Tags */}
                <div className="explore-card-tags">
                  {city.tags.map(t => (
                    <span key={t} className="explore-card-tag">{t}</span>
                  ))}
                </div>

                {/* Add button */}
                <button
                  className={`explore-card-btn ${added.has(city.name) ? 'added' : ''}`}
                  onClick={() => handleAdd(city.name)}
                >
                  {added.has(city.name)
                    ? <><Check size={16} /> Added to Trip</>
                    : <><Plus size={16} /> Add to Trip</>
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="explore-empty">
          <MapPin size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No destinations match your search.</p>
        </div>
      )}
    </div>
  );
}
