import React, { useState } from 'react';
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
  Plane
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
];

export function CreateTripPage() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();

  // Trip type toggle
  const [tripType, setTripType] = useState<'single' | 'multi'>('single');

  // Core form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image: COVER_IMAGES[0],
    budget: '',
    travelers: '1',
  });

  // Multi-city stops
  const [cities, setCities] = useState<CityStop[]>([
    { id: '1', city: '', country: '', nights: 3 },
  ]);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── City helpers ── */
  const addCity = () =>
    setCities(prev => [...prev, { id: Date.now().toString(), city: '', country: '', nights: 2 }]);

  const removeCity = (id: string) =>
    setCities(prev => prev.filter(c => c.id !== id));

  const updateCity = (id: string, field: keyof CityStop, value: string | number) =>
    setCities(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tripData: any = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        status: 'planning',
      };

      if (tripType === 'multi') {
        tripData.cities = cities;
        tripData.destinationCount = cities.length;
        // Auto-generate name if empty
        if (!tripData.name && cities.some(c => c.city)) {
          tripData.name = cities.filter(c => c.city).map(c => c.city).join(' → ');
        }
      } else {
        tripData.destinationCount = 1;
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
                required={tripType === 'single'}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={tripType === 'multi' ? 'Auto-generated from cities if left blank' : 'e.g., Summer in Scandinavia'}
                className="create-trip-input"
              />
            </div>

            {/* Description */}
            <div className="create-trip-input-group">
              <label className="create-trip-label">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's the vibe of this trip?"
                className="create-trip-textarea"
              />
            </div>

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
                          <input
                            type="text"
                            placeholder="City name (e.g. Tokyo)"
                            value={stop.city}
                            onChange={e => updateCity(stop.id, 'city', e.target.value)}
                            className="city-stop-input"
                            required
                          />
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
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    className="create-trip-input-date"
                  />
                </div>
              </div>
              <div className="create-trip-input-group">
                <label className="create-trip-label">End Date</label>
                <div className="create-trip-input-wrapper">
                  <CalendarIcon className="create-trip-input-icon" size={20} />
                  <input
                    type="date" required
                    value={formData.end_date}
                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    className="create-trip-input-date"
                  />
                </div>
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
              </div>
              <div className="create-trip-input-group">
                <label className="create-trip-label">
                  <Users size={14} style={{ display: 'inline' }} /> Travelers
                </label>
                <input
                  type="number" min="1" max="50" placeholder="1"
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

        {/* ── Right: Preview ── */}
        <div className="create-trip-preview-section">
          <div className="create-trip-preview-card group">
            <div className="create-trip-preview-img-wrapper">
              <img
                src={formData.cover_image}
                className="create-trip-preview-img"
                alt="Trip Cover"
              />
              <div className="create-trip-preview-overlay">
                <h3 className="create-trip-preview-title">
                  {formData.name || (tripType === 'multi' && cities.some(c => c.city)
                    ? cities.filter(c => c.city).map(c => c.city).join(' → ')
                    : 'Untitled Trip')}
                </h3>
                <div className="create-trip-preview-meta">
                  <div className="create-trip-preview-meta-item">
                    <Globe size={16} className="create-trip-preview-icon" />
                    {tripType === 'multi' ? `${cities.length} Cities` : 'Single City'}
                  </div>
                  <div className="create-trip-preview-meta-item">
                    <CalendarIcon size={16} className="create-trip-preview-icon" />
                    {formData.start_date || 'Future'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image picker */}
          <button
            type="button"
            className="create-trip-image-btn group"
            onClick={() => setShowImagePicker(prev => !prev)}
          >
            <div className="create-trip-image-btn-icon">
              <ImageIcon size={24} />
            </div>
            <span className="create-trip-image-btn-text">Change Cover Image</span>
          </button>

          {showImagePicker && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="cover-image-picker"
            >
              {COVER_IMAGES.map(img => (
                <img
                  key={img}
                  src={img}
                  alt="Cover option"
                  className={`cover-image-option ${formData.cover_image === img ? 'selected' : ''}`}
                  onClick={() => { setFormData({ ...formData, cover_image: img }); setShowImagePicker(false); }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
