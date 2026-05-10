import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import './LoginPage.css';

export function SignupPage() {
  return (
    <div className="login-container">
      {/* Decorative background elements */}
      <div className="login-blob-top"></div>
      <div className="login-blob-bottom"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="login-card-wrapper"
      >
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Map size={32} />
            </div>
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Join Traveloop and start planning today.</p>
          </div>

          <form className="login-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              <div className="login-input-group">
                <label className="login-label">First Name</label>
                <div className="login-input-wrapper group">
                  <User className="login-input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Alex"
                    className="login-input"
                  />
                </div>
              </div>
              <div className="login-input-group">
                <label className="login-label">Last Name</label>
                <div className="login-input-wrapper group">
                  <User className="login-input-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Wander"
                    className="login-input"
                  />
                </div>
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Email</label>
              <div className="login-input-wrapper group">
                <Mail className="login-input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="alex@example.com"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper group">
                <Lock className="login-input-icon" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>
            </div>

            <div style={{ paddingTop: '1rem' }}>
              <button 
                type="submit"
                className="login-submit-btn group"
              >
                Create Account
                <ArrowRight size={20} className="login-submit-icon" />
              </button>
            </div>
          </form>

          <p className="login-footer">
            Already have an account? {' '}
            <Link to="/login" className="login-signup-link">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
