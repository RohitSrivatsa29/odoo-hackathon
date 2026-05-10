import React from 'react';
import { ArrowLeft, Shield, Key, Smartphone, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SettingsPages.css';

export function SecurityPrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page-container">
      <div className="settings-page-header">
        <button onClick={() => navigate('/profile')} className="settings-back-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 className="settings-page-title">Security & Privacy</h1>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><Key size={20} /> Change Password</h3>
        <form>
          <div className="settings-form-group">
            <label className="settings-label">Current Password</label>
            <input type="password" className="settings-input" placeholder="••••••••" />
          </div>
          <div className="settings-form-group">
            <label className="settings-label">New Password</label>
            <input type="password" className="settings-input" placeholder="Enter new password" />
          </div>
          <div className="settings-form-group">
            <label className="settings-label">Confirm New Password</label>
            <input type="password" className="settings-input" placeholder="Confirm new password" />
          </div>
          <button type="button" className="settings-btn-primary">Update Password</button>
        </form>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><Smartphone size={20} /> Two-Factor Authentication (2FA)</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        <button type="button" className="settings-btn-primary">Enable 2FA App</button>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><Monitor size={20} /> Active Sessions</h3>
        
        <div className="session-item">
          <div className="session-info">
            <h4>MacBook Pro - Chrome</h4>
            <p>San Francisco, CA • IP: 192.168.1.1</p>
          </div>
          <span className="session-active">Current Session</span>
        </div>
        
        <div className="session-item">
          <div className="session-info">
            <h4>iPhone 13 - Safari</h4>
            <p>San Francisco, CA • Last active: 2 hours ago</p>
          </div>
          <button className="settings-btn-danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Revoke</button>
        </div>
      </div>
    </div>
  );
}
