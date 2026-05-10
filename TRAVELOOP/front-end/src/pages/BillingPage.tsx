import React from 'react';
import { ArrowLeft, CreditCard, Receipt, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SettingsPages.css';

export function BillingPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-page-container">
      <div className="settings-page-header">
        <button onClick={() => navigate('/profile')} className="settings-back-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 className="settings-page-title">Billing & Payments</h1>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><Award size={20} /> Current Subscription</h3>
        
        <div className="billing-plan-card">
          <div>
            <h4 className="plan-name">Travel Pro</h4>
            <p className="plan-desc">Unlimited AI trips, calendar sync, and expense tracking.</p>
          </div>
          <div className="plan-price">$9.99<span style={{ fontSize: '1rem', color: '#64748b' }}>/mo</span></div>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
          Your plan renews automatically on <strong>Nov 15, 2024</strong>.
        </p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="settings-btn-primary" style={{ background: '#f1f5f9', color: '#0f172a' }}>Change Plan</button>
          <button className="settings-btn-danger" style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca' }}>Cancel Subscription</button>
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><CreditCard size={20} /> Payment Methods</h3>
        
        <div className="payment-method">
          <div className="payment-method-left">
            <div style={{ background: '#1e293b', color: 'white', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>VISA</div>
            <div>
              <h4>Visa ending in 4242</h4>
              <p>Expires 12/2026</p>
            </div>
          </div>
          <span className="session-active" style={{ background: '#e0f2fe', color: '#0284c7' }}>Default</span>
        </div>

        <button className="settings-btn-primary" style={{ marginTop: '20px', background: 'white', color: '#3b82f6', border: '2px solid #3b82f6' }}>
          + Add Payment Method
        </button>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title"><Receipt size={20} /> Billing History</h3>
        
        <div className="session-item">
          <div className="session-info">
            <h4>Travel Pro - Monthly</h4>
            <p>Oct 15, 2024</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>$9.99</span>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Invoice</button>
          </div>
        </div>
        
        <div className="session-item">
          <div className="session-info">
            <h4>Travel Pro - Monthly</h4>
            <p>Sep 15, 2024</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>$9.99</span>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
