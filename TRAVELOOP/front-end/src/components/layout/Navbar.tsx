import React from 'react';
import { Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

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
        <button className="navbar-btn">
          <Bell size={20} />
          <span className="navbar-btn-badge"></span>
        </button>
        
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
    </header>
  );
}

