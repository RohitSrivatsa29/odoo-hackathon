import React from 'react';
import { 
  User, 
  Settings, 
  MapPin, 
  Shield, 
  Bell, 
  LogOut, 
  CreditCard,
  History,
  Languages,
  CheckCircle2,
  Camera,
  Edit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Profile Info Sidebar */}
        <div className="profile-sidebar">
           <div className="profile-card">
              <div className="profile-avatar-wrapper group">
                 <div className="profile-avatar-frame">
                    <img src={user?.avatar} className="profile-avatar-img" alt="" />
                 </div>
                 <div className="profile-avatar-edit">
                    <Camera size={20} />
                 </div>
              </div>
              <h2 className="profile-name">{user?.name || user?.username}</h2>
              <p className="profile-email">{user?.email}</p>
              
              <div className="profile-stats">
                <div className="profile-stat">
                   <span className="profile-stat-label">Badge</span>
                   <span className="profile-stat-value">Gold Explorer</span>
                </div>
                <div className="profile-stat">
                   <span className="profile-stat-label">Points</span>
                   <span className="profile-stat-value">4,250</span>
                </div>
              </div>
           </div>

           <div className="profile-destinations">
              <h3 className="profile-destinations-title">Saved Destinations</h3>
              <div className="profile-destinations-list">
                 {user?.savedDestinations?.map((dest, i) => (
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
        </div>

        {/* Settings Area */}
        <div className="profile-settings">
           <section className="profile-settings-section">
              <h3 className="profile-section-title">
                 <Settings className="profile-section-icon" /> General Settings
              </h3>
              
              <div className="profile-settings-list">
                 <div className="profile-settings-item group">
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper orange"><User size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Personal Information</h4>
                          <p className="profile-settings-item-desc">Edit your name, bio, and contact details.</p>
                       </div>
                    </div>
                    <Edit size={20} className="profile-settings-edit-icon" />
                 </div>
                 
                 <div className="profile-settings-item group">
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper gray"><Shield size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Security &amp; Privacy</h4>
                          <p className="profile-settings-item-desc">Update your password and 2FA settings.</p>
                       </div>
                    </div>
                    <Edit size={20} className="profile-settings-edit-icon" />
                 </div>

                 <div className="profile-settings-item group">
                    <div className="profile-settings-item-content">
                       <div className="profile-settings-icon-wrapper green"><CreditCard size={28} /></div>
                       <div>
                          <h4 className="profile-settings-item-title">Billing &amp; Payments</h4>
                          <p className="profile-settings-item-desc">Manage your subscription and payment methods.</p>
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
                   { label: 'Booking Reminders', desc: 'Get notified 24h before your flight or hotel check-in.', default: true },
                   { label: 'Price Alerts', desc: 'Alerts when your watched destinations drop in price.', default: false },
                   { label: 'Trip Recommendations', desc: 'Weekly inspo based on your bucket list.', default: true },
                 ].map(opt => (
                   <div key={opt.label} className="profile-notification-item">
                      <div>
                         <h5 className="profile-notification-label">{opt.label}</h5>
                         <p className="profile-notification-desc">{opt.desc}</p>
                      </div>
                      <label className="profile-toggle">
                        <input type="checkbox" defaultChecked={opt.default} className="profile-toggle-input peer" />
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
