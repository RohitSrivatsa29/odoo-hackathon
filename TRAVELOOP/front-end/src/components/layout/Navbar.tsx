import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Price Alert', desc: 'Flights to Tokyo dropped by $150!', time: '2h ago', unread: true },
    { id: 2, title: 'Checklist Reminder', desc: 'Don\'t forget to pack your passport.', time: '5h ago', unread: true },
    { id: 3, title: 'New Feature', desc: 'You can now sync trips to Google Calendar.', time: '1d ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="navbar">
      <div className="navbar-search-container">
        <Search size={18} className="navbar-search-icon" />
        <input 
          type="text" 
          placeholder="Search destinations, activities..." 
          className="navbar-search-input"
        />
      </div>

      <div className="navbar-actions">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="navbar-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="navbar-btn-badge"></span>}
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: '0',
              width: '320px',
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.8)',
              border: '1px solid #334155',
              zIndex: 50,
              padding: '20px',
              color: 'white',
              cursor: 'default'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold' }}>Notifications</h3>
                {unreadCount > 0 && <span style={{ backgroundColor: '#f97316', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>{unreadCount} New</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: '12px', opacity: n.unread ? 1 : 0.6, cursor: 'pointer' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.unread ? '#f97316' : 'transparent', marginTop: '6px', flexShrink: 0 }}></div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem' }}>{n.title}</h4>
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>{n.desc}</p>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={markAllAsRead}
                style={{ width: '100%', padding: '12px', marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', opacity: unreadCount > 0 ? 1 : 0.5 }}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
        <div className="navbar-divider"></div>
        
        {/* Clickable profile with dropdown */}
        <div className="navbar-profile-wrapper">
          <button
            className="navbar-profile group"
            onClick={() => setDropdownOpen(prev => !prev)}
            aria-label="Profile menu"
          >
            <div className="navbar-profile-info">
              <p className="navbar-profile-name">{user?.name || user?.username}</p>
              <p className="navbar-profile-role">Gold Explorer</p>
            </div>
            <img 
              src={user?.avatar} 
              alt={user?.name || user?.username} 
              className="navbar-profile-avatar"
            />
            <ChevronDown size={16} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown" onClick={() => setDropdownOpen(false)}>
              <button
                className="navbar-dropdown-item"
                onClick={() => navigate('/profile')}
              >
                <span>👤</span> My Profile
              </button>
              <button
                className="navbar-dropdown-item"
                onClick={() => navigate('/trips')}
              >
                <span>🗺️</span> My Trips
              </button>
              <div className="navbar-dropdown-divider" />
              <button
                className="navbar-dropdown-item danger"
                onClick={() => { logout(); navigate('/login'); }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}

