import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, ArrowRight, User, Mail, Lock, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export function SignupPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signup(formData);
      navigate('/');
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="login-container">
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
            {localError && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>{localError}</p>}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              <div className="login-input-group">
                <label className="login-label">First Name</label>
                <div className="login-input-wrapper group">
                  <User className="login-input-icon" size={18} />
                  <input 
                    type="text" 
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
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
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Wander"
                    className="login-input"
                  />
                </div>
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Username</label>
              <div className="login-input-wrapper group">
                <UserCircle className="login-input-icon" size={18} />
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="traveler123"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Email</label>
              <div className="login-input-wrapper group">
                <Mail className="login-input-icon" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
