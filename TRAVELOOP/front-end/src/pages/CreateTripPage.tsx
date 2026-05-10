import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Calendar as CalendarIcon,
  Globe,
  Plus,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Plane,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './CreateTripPage.css';

interface CityStop {
  id: string;
  city: string;
  country: string;
  nights: number;
}

const TRIP_TYPES = [
  { id: 'single', label: 'Single City', icon: MapPin, desc: 'Stay in one destination' },
  { id: 'multi',  label: 'Multi-City',  icon: Plane,  desc: 'Hop between cities' },
];

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
];

// Curated popular destinations
const DESTINATIONS = [
  { city: 'Tokyo',         country: 'Japan',          emoji: '🇯🇵', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80' },
  { city: 'Paris',         country: 'France',         emoji: '🇫🇷', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80' },
  { city: 'New York',      country: 'United States',  emoji: '🇺🇸', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&q=80' },
  { city: 'Dubai',         country: 'UAE',            emoji: '🇦🇪', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&q=80' },
  { city: 'Bali',          country: 'Indonesia',      emoji: '🇮🇩', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80' },
  { city: 'Rome',          country: 'Italy',          emoji: '🇮🇹', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80' },
  { city: 'Santorini',     country: 'Greece',         emoji: '🇬🇷', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80' },
  { city: 'Bangkok',       country: 'Thailand',       emoji: '🇹🇭', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&q=80' },
  { city: 'Barcelona',     country: 'Spain',          emoji: '🇪🇸', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&q=80' },
  { city: 'Singapore',     country: 'Singapore',      emoji: '🇸🇬', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&q=80' },
  { city: 'Goa',           country: 'India',          emoji: '🇮🇳', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=80' },
  { city: 'Kyoto',         country: 'Japan',          emoji: '🇯🇵', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80' },
  { city: 'Maldives',      country: 'Maldives',       emoji: '🇲🇻', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&q=80' },
  { city: 'London',        country: 'United Kingdom', emoji: '🇬🇧', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&q=80' },
  { city: 'Seoul',         country: 'South Korea',    emoji: '🇰🇷', img: 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=300&q=80' },
  { city: 'Lisbon',        country: 'Portugal',       emoji: '🇵🇹', img: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=300&q=80' },
  { city: 'Cape Town',     country: 'South Africa',   emoji: '🇿🇦', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&q=80' },
  { city: 'Jaipur',        country: 'India',          emoji: '🇮🇳', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80' },
  { city: 'Prague',        country: 'Czech Republic', emoji: '🇨🇿', img: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=300&q=80' },
  { city: 'Amsterdam',     country: 'Netherlands',    emoji: '🇳🇱', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=300&q=80' },
  { city: 'Marrakech',     country: 'Morocco',        emoji: '🇲🇦', img: 'https://images.unsplash.com/photo-1539020140153-e479b8f22986?w=300&q=80' },
  { city: 'Rio de Janeiro',country: 'Brazil',         emoji: '🇧🇷', img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&q=80' },
  { city: 'Mumbai',        country: 'India',          emoji: '🇮🇳', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=300&q=80' },
  { city: 'Phuket',        country: 'Thailand',       emoji: '🇹🇭', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&q=80' },
];

// City autocomplete dropdown component
function CityAutocomplete({ stop, onUpdate }: {
  stop: CityStop;
  onUpdate: (field: keyof CityStop, value: string | number) => void;
}) {
  const [query, setQuery] = useState(stop.city);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync input when parent sets city externally (e.g. destination card click)
  useEffect(() => {
    setQuery(stop.city);
  }, [stop.city]);

  const filtered = query.length >= 1
    ? DESTINATIONS.filter(d =>
        d.city.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : DESTINATIONS.slice(0, 8);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (d: typeof DESTINATIONS[0]) => {
    setQuery(d.city);
    onUpdate('city', d.city);
    onUpdate('country', d.country);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="city-autocomplete-wrap">
      <div className="city-autocomplete-input-wrap">
        <Search size={14} className="city-autocomplete-icon" />
        <input
          type="text"
          placeholder="City (e.g. Tokyo)"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onUpdate('city', e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="city-stop-input city-autocomplete-input"
          required
        />
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.14 }}
            className="city-autocomplete-dropdown"
          >
            {filtered.map(d => (
              <li
                key={`${d.city}-${d.country}`}
                className="city-autocomplete-item"
                onMouseDown={() => select(d)}
              >
                <span className="city-autocomplete-emoji">{d.emoji}</span>
                <span className="city-autocomplete-city">{d.city}</span>
                <span className="city-autocomplete-country">{d.country}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateTripPage() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();

  const [tripType, setTripType] = useState<'single' | 'multi'>('single');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image: COVER_IMAGES[0],
    budget: '',
    travelers: '1',
  });

  // Single city destination
  const [singleCity, setSingleCity] = useState({ city: '', country: '' });

  // Multi-city stops
  const [cities, setCities] = useState<CityStop[]>([
    { id: '1', city: '', country: '', nights: 3 },
  ]);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overrideEndDate, setOverrideEndDate] = useState(false);

  // Auto-compute end date whenever start date or nights change
  const computedEndDate = useMemo(() => {
    if (!formData.start_date) return '';
    const start = new Date(formData.start_date);
    const totalNights = tripType === 'multi'
      ? cities.reduce((sum, c) => sum + (c.nights || 0), 0)
      : 7; // default 7 nights for single city
    const end = new Date(start);
    end.setDate(start.getDate() + totalNights);
    return end.toISOString().split('T')[0];
  }, [formData.start_date, cities, tripType]);

  // Sync computed end date into formData (unless user has overridden)
  useEffect(() => {
    if (!overrideEndDate && computedEndDate) {
      setFormData(prev => ({ ...prev, end_date: computedEndDate }));
    }
  }, [computedEndDate, overrideEndDate]);

  const addCity = () =>
    setCities(prev => [...prev, { id: Date.now().toString(), city: '', country: '', nights: 2 }]);

  const removeCity = (id: string) =>
    setCities(prev => prev.filter(c => c.id !== id));

  const updateCity = (id: string, field: keyof CityStop, value: string | number) =>
    setCities(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tripData: any = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        status: 'planning',
      };

      if (tripType === 'multi') {
        const validCities = cities.filter(c => c.city.trim()).map(c => ({
          city: c.city, country: c.country, nights: c.nights,
        }));
        tripData.cities = JSON.stringify(validCities);   // ← store as JSON string
        tripData.destinationCount = validCities.length;
        if (!tripData.name && validCities.length > 0) {
          tripData.name = validCities.map(c => c.city).join(' → ');
        }
      } else {
        tripData.destinationCount = 1;
        if (singleCity.city) {
          tripData.name = tripData.name || singleCity.city;
          tripData.cities = JSON.stringify([{ city: singleCity.city, country: singleCity.country, nights: 7 }]);
        }
      }

      if (!tripData.name) {
        alert('Please enter a trip name or add at least one city.');
        setIsSubmitting(false);
        return;
      }

      await addTrip(tripData);
      navigate('/trips');
    } catch (err) {
      console.error(err);
      alert('Failed to create trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview title
  const previewTitle = formData.name
    || (tripType === 'multi' && cities.some(c => c.city)
        ? cities.filter(c => c.city).map(c => c.city).join(' → ')
        : singleCity.city || 'Untitled Trip');

  return (
    <div className="create-trip-container">
      <button onClick={() => navigate(-1)} className="create-trip-back-btn group">
        <ArrowLeft size={18} className="create-trip-back-icon" />
        Back
      </button>

      <div className="create-trip-grid">
        {/* ── Left: Form ── */}
        <div className="create-trip-form-section">
          <div>
            <h1 className="create-trip-title">New Adventure</h1>
            <p className="create-trip-subtitle">Define your next journey across the world.</p>
          </div>

          {/* Trip Type Selector */}
          <div className="trip-type-selector">
            {TRIP_TYPES.map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                type="button"
                className={`trip-type-btn ${tripType === id ? 'active' : ''}`}
                onClick={() => setTripType(id as 'single' | 'multi')}
              >
                <Icon size={20} className="trip-type-icon" />
                <div>
                  <p className="trip-type-label">{label}</p>
                  <p className="trip-type-desc">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="create-trip-form">

            {/* Trip Name */}
            <div className="create-trip-input-group">
              <label className="create-trip-label">Trip Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={tripType === 'multi' ? 'Auto-generated from cities if left blank' : 'e.g., Summer in Scandinavia'}
                className="create-trip-input"
              />
            </div>

            {/* Single City Destination */}
            <AnimatePresence>
              {tripType === 'single' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="create-trip-input-group"
                >
                  <label className="create-trip-label">
                    <Globe size={13} style={{ display: 'inline', marginRight: '5px', color: '#f97316' }} />
                    Destination
                  </label>
                  <div className="single-city-row">
                    {/* City autocomplete */}
                    <div style={{ flex: 2, position: 'relative' }}>
                      <CityAutocomplete
                        stop={{ id: 'single', ...singleCity, nights: 1 }}
                        onUpdate={(field, val) => setSingleCity(prev => ({ ...prev, [field]: val as string }))}
                      />
                    </div>
                    {/* Country (auto-filled, editable) */}
                    <input
                      type="text"
                      placeholder="Country"
                      value={singleCity.country}
                      onChange={e => setSingleCity(prev => ({ ...prev, country: e.target.value }))}
                      className="city-stop-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Multi-City Stops */}
            <AnimatePresence>
              {tripType === 'multi' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="multi-city-section"
                >
                  <div className="multi-city-header">
                    <label className="create-trip-label">
                      <Plane size={16} style={{ display: 'inline', marginRight: '6px', color: '#f97316' }} />
                      City Stops
                    </label>
                    <button type="button" onClick={addCity} className="add-city-btn">
                      <Plus size={16} /> Add City
                    </button>
                  </div>

                  <div className="city-stops-list">
                    {cities.map((stop, idx) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="city-stop-card"
                      >
                        <div className="city-stop-num">{idx + 1}</div>
                        <div className="city-stop-fields">
                          {/* City with autocomplete */}
                          <CityAutocomplete
                            stop={stop}
                            onUpdate={(field, val) => updateCity(stop.id, field, val)}
                          />
                          {/* Country (auto-filled, editable) */}
                          <input
                            type="text"
                            placeholder="Country"
                            value={stop.country}
                            onChange={e => updateCity(stop.id, 'country', e.target.value)}
                            className="city-stop-input"
                          />
                          <div className="city-stop-nights-row">
                            <span className="city-stop-nights-label">Nights:</span>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={stop.nights}
                              onChange={e => updateCity(stop.id, 'nights', parseInt(e.target.value) || 1)}
                              className="city-stop-nights-input"
                            />
                          </div>
                        </div>
                        {cities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCity(stop.id)}
                            className="city-stop-remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Route preview */}
                  {cities.some(c => c.city) && (
                    <div className="city-route-preview">
                      {cities.filter(c => c.city).map((c, i, arr) => (
                        <span key={c.id}>
                          <span className="city-route-tag">{c.city}</span>
                          {i < arr.length - 1 && <span className="city-route-arrow"> → </span>}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dates */}
            <div className="create-trip-dates-grid">
              <div className="create-trip-input-group">
                <label className="create-trip-label">Start Date</label>
                <div className="create-trip-input-wrapper">
                  <CalendarIcon className="create-trip-input-icon" size={20} />
                  <input
                    type="date" required
                    value={formData.start_date}
                    onChange={e => {
                      setFormData({ ...formData, start_date: e.target.value });
                      setOverrideEndDate(false); // recompute when start changes
                    }}
                    className="create-trip-input-date"
                  />
                </div>
              </div>
              <div className="create-trip-input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="create-trip-label">End Date</label>
                  {computedEndDate && (
                    <button
                      type="button"
                      onClick={() => setOverrideEndDate(v => !v)}
                      style={{ fontSize: '0.6rem', color: overrideEndDate ? '#fb923c' : '#4b5563', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {overrideEndDate ? '↩ Use computed' : '✏️ Override'}
                    </button>
                  )}
                </div>
                <div className="create-trip-input-wrapper">
                  <CalendarIcon className="create-trip-input-icon" size={20} />
                  <input
                    type="date" required
                    value={formData.end_date}
                    readOnly={!overrideEndDate}
                    onChange={e => overrideEndDate && setFormData({ ...formData, end_date: e.target.value })}
                    className={`create-trip-input-date ${!overrideEndDate ? 'date-readonly' : ''}`}
                    title={!overrideEndDate ? 'Auto-calculated from start date + nights' : ''}
                  />
                </div>
                {!overrideEndDate && computedEndDate && (
                  <p style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '0.25rem', paddingLeft: '0.25rem' }}>
                    ⚡ Auto-set from {tripType === 'multi' ? `${cities.reduce((s,c)=>s+c.nights,0)} total nights` : '7 nights'}
                  </p>
                )}
              </div>
            </div>

            {/* Budget & Travelers */}
            <div className="create-trip-dates-grid">
              <div className="create-trip-input-group">
                <label className="create-trip-label">
                  <DollarSign size={14} style={{ display: 'inline' }} /> Budget (USD)
                </label>
                <input
                  type="number" min="0" placeholder="e.g. 3000"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  className="create-trip-input"
                />
                {/* Smart budget hint — sums ALL selected cities */}
                {(() => {
                  const RATES: Record<string, number> = {
                    Tokyo: 225, Paris: 283, Bali: 108, Dubai: 330, Rome: 245,
                    Bangkok: 92, Singapore: 262, Barcelona: 226, Santorini: 330,
                    Goa: 78, Jaipur: 69, Mumbai: 105, Seoul: 165, Kyoto: 200,
                    Maldives: 600, Marrakech: 95, 'Cape Town': 130,
                    'New York': 320, Miami: 280, London: 300, Vienna: 210,
                    Prague: 140, Amsterdam: 230, Lisbon: 160, Berlin: 180,
                    'Ho Chi Minh': 75, Hanoi: 75, Colombo: 70, Kathmandu: 65,
                    'Rio de Janeiro': 140, 'Buenos Aires': 110, Toronto: 250,
                    'Los Angeles': 290, Chicago: 260, Istanbul: 120,
                  };

                  const DEFAULT_RATE = 170;

                  let est = 0;
                  let label = '';

                  if (tripType === 'multi') {
                    const validCities = cities.filter(c => c.city);
                    if (validCities.length === 0) return null;
                    est = validCities.reduce((sum, c) => {
                      const rate = RATES[c.city] || DEFAULT_RATE;
                      return sum + rate * (c.nights || 3);
                    }, 0);
                    label = validCities.map(c => `${c.city} ${c.nights}n`).join(' + ');
                  } else {
                    if (!singleCity.city) return null;
                    const rate = RATES[singleCity.city] || DEFAULT_RATE;
                    const nights = 7;
                    est = rate * nights;
                    label = `${singleCity.city} (7d)`;
                  }

                  if (est === 0) return null;
                  const userBudget = parseFloat(formData.budget);
                  const status = !formData.budget ? 'neutral' : userBudget >= est ? 'ok' : 'low';
                  return (
                    <p className={`budget-est-hint budget-est-${status}`}>
                      💡 Est. for {label}: ~${Math.round(est).toLocaleString()}
                      {status === 'low' && ' · Budget may be tight'}
                      {status === 'ok'  && ' · Looks good!'}
                    </p>
                  );
                })()}
              </div>

              <div className="create-trip-input-group">
                <label className="create-trip-label">
                  <Users size={14} style={{ display: 'inline' }} /> Travelers
                </label>
                <input
                  type="number" min="1" max="50"
                  value={formData.travelers}
                  onChange={e => setFormData({ ...formData, travelers: e.target.value })}
                  className="create-trip-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="create-trip-submit-btn"
              disabled={isSubmitting}
            >
              <Plus size={20} />
              {isSubmitting ? 'Saving...' : 'Save & Start Planning'}
            </button>
          </form>
        </div>

        {/* ── Right: Destination image cards ── */}
        <div className="create-trip-preview-section">
          <div className="dest-panel-header">
            <p className="dest-panel-title">✈️ Popular Destinations</p>
            <p className="dest-panel-hint">Click to add to your trip</p>
          </div>

          <div className="dest-img-grid">
            {DESTINATIONS.slice(0, 12).map(d => (
              <button
                key={`${d.city}-suggest`}
                type="button"
                className="dest-img-card"
                onClick={() => {
                  if (tripType === 'single') {
                    setSingleCity({ city: d.city, country: d.country });
                  } else {
                    const lastEmpty = cities.find(c => !c.city);
                    if (lastEmpty) {
                      updateCity(lastEmpty.id, 'city', d.city);
                      updateCity(lastEmpty.id, 'country', d.country);
                    } else {
                      setCities(prev => [...prev, { id: Date.now().toString(), city: d.city, country: d.country, nights: 3 }]);
                    }
                  }
                }}
              >
                <img src={d.img} alt={d.city} className="dest-img-card-photo" />
                <div className="dest-img-card-overlay" />
                <div className="dest-img-card-info">
                  <span className="dest-img-card-name">{d.city}</span>
                  <span className="dest-img-card-country">{d.emoji} {d.country}</span>
                </div>
                <div className="dest-img-card-add"><Plus size={14} /></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
