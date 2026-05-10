import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Map, 
  Image as ImageIcon, 
  Calendar as CalendarIcon,
  Globe,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './CreateTripPage.css';

export function CreateTripPage() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrip({
      ...formData,
      status: 'Upcoming',
      destinationCount: 0,
      progress: 5
    });
    navigate('/trips');
  };

  return (
    <div className="create-trip-container">
      <button 
        onClick={() => navigate(-1)}
        className="create-trip-back-btn group"
      >
        <ArrowLeft size={18} className="create-trip-back-icon" />
        Back
      </button>

      <div className="create-trip-grid">
        <div className="create-trip-form-section">
          <div>
            <h1 className="create-trip-title">New Adventure</h1>
            <p className="create-trip-subtitle">Define your next journey across the stars (or just Earth).</p>
          </div>

          <form onSubmit={handleSubmit} className="create-trip-form">
            <div className="create-trip-input-group">
              <label className="create-trip-label">Trip Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Summer in Scandinavia"
                className="create-trip-input"
              />
            </div>

            <div className="create-trip-input-group">
              <label className="create-trip-label">Description</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What's the vibe of this trip?"
                className="create-trip-textarea"
              />
            </div>

            <div className="create-trip-dates-grid">
              <div className="create-trip-input-group">
                <label className="create-trip-label">Start Date</label>
                <div className="create-trip-input-wrapper">
                  <CalendarIcon className="create-trip-input-icon" size={20} />
                  <input 
                    type="date" 
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="create-trip-input-date"
                  />
                </div>
              </div>
              <div className="create-trip-input-group">
                <label className="create-trip-label">End Date</label>
                <div className="create-trip-input-wrapper">
                  <CalendarIcon className="create-trip-input-icon" size={20} />
                  <input 
                    type="date" 
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="create-trip-input-date"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="create-trip-submit-btn"
            >
              <Plus size={20} />
              Save & Start Planning
            </button>
          </form>
        </div>

        <div className="create-trip-preview-section">
          <div className="create-trip-preview-card group">
            <div className="create-trip-preview-img-wrapper">
              <img 
                src={formData.coverImage} 
                className="create-trip-preview-img" 
                alt="Trip Cover Preview" 
              />
              <div className="create-trip-preview-overlay">
                <h3 className="create-trip-preview-title">{formData.name || 'Untitled Trip'}</h3>
                <div className="create-trip-preview-meta">
                  <div className="create-trip-preview-meta-item"><Globe size={16} className="create-trip-preview-icon" /> Exploring</div>
                  <div className="create-trip-preview-meta-item"><CalendarIcon size={16} className="create-trip-preview-icon" /> Oct 2024</div>
                </div>
              </div>
            </div>
          </div>
          <button className="create-trip-image-btn group">
            <div className="create-trip-image-btn-icon">
              <ImageIcon size={24} />
            </div>
            <span className="create-trip-image-btn-text">Change Cover Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}
