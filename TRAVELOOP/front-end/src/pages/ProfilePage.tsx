import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  MapPin, 
  Shield, 
  Bell, 
  LogOut, 
  CreditCard,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import './ProfilePage.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    booking: true,
    price: false,
    recommendations: true
  });

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const nextState = { ...prev, [key]: !prev[key] };
      setTimeout(() => alert('Notification preferences successfully saved!'), 300);
      return nextState;
    });
  };

  // Generate initials avatar from user name
  const initials = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join('') || user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Profile Info Sidebar */}
        <div className="profile-sidebar">
           <div className="profile-card">
              {/* Initials Avatar — no upload */}
              <div className="profile-avatar-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f97316, #ea580c)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                  {initials}
                </span>
              </div>

              <h2 className="profile-name">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username}
              </h2>
              <p className="profile-email">{user?.email}</p>
              
              <div className="profile-stats">
                <div className="profile-stat">
                   <span className="profile-stat-label">Username</span>
                   <span className="profile-stat-value">@{user?.username}</span>
                </div>
                <div className="profile-stat">
                   <span className="profile-stat-label">Member</span>
                   <span className="profile-stat-value">Explorer</span>
                </div>
              </div>
           </div>

           {user?.savedDestinations && user.savedDestinations.length > 0 && (
             <div className="profile-destinations">
               <h3 className="profile-destinations-title">Saved Destinations</h3>
               <div className="profile-destinations-list">
                 {user.savedDestinations.map((dest, i) => (
                   <motion.div 
                     key={dest} 
                     initial={{ opacity: 0, x: -10 }} 
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="profile-destination-item group"
                   >
                      <MapPin size={18} className="profile-destination-pin" />
                      <span className="profile-destination-name">{dest}</span>
                   </motion.div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Settings Area */}
        <div className="profile-settings">
           <section className="profile-settings-section">
              <h3 className="profile-section-title">
                 <Settings className="profile-section-icon" /> General Settings
              </h3>
              
              <div className="profile-settings-list">
                 <div className="profile-settings-item group" onClick={() => navigate('/settings/personal-info')} style={{ cursor: 'pointer' }}>
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper orange"><User size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Personal Information</h4>
                          <p className="profile-settings-item-desc">Edit your name, bio, and contact details.</p>
                       </div>
                    </div>
                    <Edit size={20} className="profile-settings-edit-icon" />
                 </div>
                 
                 <div className="profile-settings-item group" onClick={() => navigate('/settings/security')} style={{ cursor: 'pointer' }}>
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper gray"><Shield size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Security &amp; Privacy</h4>
                          <p className="profile-settings-item-desc">Update your password and 2FA settings.</p>
                       </div>
                    </div>
                    <Edit size={20} className="profile-settings-edit-icon" />
                 </div>

                 <div className="profile-settings-item group" onClick={() => navigate('/settings/billing')} style={{ cursor: 'pointer' }}>
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper green"><CreditCard size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Billing &amp; Payments</h4>
                          <p className="profile-settings-item-desc">Manage your payment methods.</p>
                       </div>
                    </div>
                    <Edit size={20} className="profile-settings-edit-icon" />
                 </div>
              </div>
           </section>

           <section className="profile-settings-section">
              <h3 className="profile-section-title">
                 <Bell className="profile-section-icon" /> Notifications
              </h3>
              <div className="profile-notifications-card">
                 {[
                   { id: 'booking', label: 'Booking Reminders', desc: 'Get notified 24h before your flight or hotel check-in.' },
                   { id: 'price', label: 'Price Alerts', desc: 'Alerts when your watched destinations drop in price.' },
                   { id: 'recommendations', label: 'Trip Recommendations', desc: 'Weekly inspo based on your bucket list.' },
                 ].map(opt => (
                   <div key={opt.id} className="profile-notification-item">
                      <div>
                         <h5 className="profile-notification-label">{opt.label}</h5>
                         <p className="profile-notification-desc">{opt.desc}</p>
                      </div>
                      <label className="profile-toggle">
                        <input 
                           type="checkbox" 
                           checked={notifications[opt.id as keyof typeof notifications]}
                           onChange={() => handleNotificationToggle(opt.id as keyof typeof notifications)}
                           className="profile-toggle-input peer" 
                        />
                        <div className="profile-toggle-track peer-checked:bg-orange-500"></div>
                      </label>
                   </div>
                 ))}
              </div>
           </section>

           <div className="profile-actions">
              <button onClick={logout} className="profile-signout-btn">
                 <LogOut size={20} /> Sign Out
              </button>
              <button className="profile-support-btn">
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
