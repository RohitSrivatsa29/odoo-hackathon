import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export function Navbar() {
  const { user } = useAuth();

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
        
        <div className="navbar-profile group">
          <div className="navbar-profile-info">
            <p className="navbar-profile-name">{user?.name}</p>
            <p className="navbar-profile-role">Gold Explorer</p>
          </div>
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="navbar-profile-avatar"
          />
        </div>
      </div>
    </header>
  );
}
