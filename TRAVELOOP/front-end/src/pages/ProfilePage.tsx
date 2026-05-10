import React, { useRef, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import './ProfilePage.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150');
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState({
    booking: true,
    price: false,
    recommendations: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const nextState = { ...prev, [key]: !prev[key] };
      setTimeout(() => alert('Notification preferences successfully saved!'), 300);
      return nextState;
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // Using mock user ID 1
    try {
      const response = await fetch('http://localhost:8000/api/users/1/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(`http://localhost:8000/${data.filename}`);
      } else {
        alert('Failed to upload profile picture.');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading profile picture.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Profile Info Sidebar */}
        <div className="profile-sidebar">
           <div className="profile-card">
              <div className="profile-avatar-wrapper group" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                 <div className="profile-avatar-frame">
                    <img src={avatarUrl} className="profile-avatar-img" alt="" style={{ opacity: uploading ? 0.5 : 1 }} />
                 </div>
                 <div className="profile-avatar-edit">
                    <Camera size={20} />
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept="image/*" 
                   style={{ display: 'none' }} 
                 />
              </div>
              <h2 className="profile-name">{user?.name}</h2>
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
                 {user?.savedDestinations.map((dest, i) => (
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
