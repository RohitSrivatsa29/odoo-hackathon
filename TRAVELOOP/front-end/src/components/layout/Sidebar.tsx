import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Search, 
  Settings, 
  User, 
  Briefcase, 
  LogOut,
  Calendar,
  DollarSign,
  CheckSquare,
  StickyNote
} from 'lucide-react';
import { motion } from 'motion/react';

import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'My Trips', path: '/trips' },
  { icon: Search, label: 'Explore Cities', path: '/explore-cities' },
  { icon: Calendar, label: 'Itinerary View', path: '/itinerary-view' },
  { icon: DollarSign, label: 'Budget', path: '/budget' },
  { icon: CheckSquare, label: 'Checklist', path: '/checklist' },
  { icon: StickyNote, label: 'Journal', path: '/journal' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-icon">
            <Map size={20} />
          </div>
          <span className="sidebar-title">
            Traveloop
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link group${isActive ? ' sidebar-link-active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={`sidebar-link-icon${isActive ? ' sidebar-link-icon-active' : ''}`} />
                <span className="sidebar-link-text">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-promo">
          <p className="sidebar-promo-title">Travel Pro</p>
          <p className="sidebar-promo-desc">Unlock AI itinerary generation for your next trip.</p>
          <button className="sidebar-promo-btn">Upgrade Now</button>
        </div>

        <button
          onClick={logout}
          className="sidebar-logout group"
        >
          <LogOut size={18} className="sidebar-logout-icon" />
          <span className="sidebar-logout-text">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
