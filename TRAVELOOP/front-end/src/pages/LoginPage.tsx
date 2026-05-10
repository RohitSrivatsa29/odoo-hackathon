import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/');
  };

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
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to resume your global adventure.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrapper group">
                <Mail className="login-input-icon" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@traveloop.com"
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
                  required
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span className="login-checkbox-text">Remember me</span>
              </label>
              <a href="#" className="login-forgot-link">Forgot password?</a>
            </div>

            <button 
              type="submit"
              className="login-submit-btn group"
            >
              Sign In
              <ArrowRight size={20} className="login-submit-icon" />
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? {' '}
            <Link to="/signup" className="login-signup-link">Get Started</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
