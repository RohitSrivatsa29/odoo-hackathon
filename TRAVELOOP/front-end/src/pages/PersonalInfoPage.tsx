import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SettingsPages.css';

export function PersonalInfoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Personal information updated successfully!');
    }, 800);
  };

  return (
    <div className="settings-page-container">
      <div className="settings-page-header">
        <button onClick={() => navigate('/profile')} className="settings-back-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 className="settings-page-title">Personal Information</h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="settings-card">
          <h3 className="settings-card-title"><User size={20} /> Basic Details</h3>
          
          <div className="settings-flex-row">
            <div className="settings-form-group">
              <label className="settings-label">First Name</label>
              <input type="text" className="settings-input" defaultValue={user?.name?.split(' ')[0]} />
            </div>
            <div className="settings-form-group">
              <label className="settings-label">Last Name</label>
              <input type="text" className="settings-input" defaultValue={user?.name?.split(' ')[1] || ''} />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Bio</label>
            <textarea className="settings-input" rows={4} defaultValue="Avid traveler and explorer. Currently planning my next big adventure in Asia!"></textarea>
          </div>
        </div>

        <div className="settings-card">
          <h3 className="settings-card-title"><Mail size={20} /> Contact Information</h3>
          
          <div className="settings-form-group">
            <label className="settings-label">Email Address</label>
            <input type="email" className="settings-input" defaultValue={user?.email} />
          </div>

          <div className="settings-flex-row">
            <div className="settings-form-group">
              <label className="settings-label">Phone Number</label>
              <input type="tel" className="settings-input" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="settings-form-group">
              <label className="settings-label">Location</label>
              <input type="text" className="settings-input" defaultValue="San Francisco, CA" />
            </div>
          </div>
        </div>

        <button type="submit" className="settings-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
