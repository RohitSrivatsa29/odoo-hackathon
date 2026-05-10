import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  PieChart as PieIcon, 
  TrendingDown, 
  Plus,
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './BudgetBreakdownPage.css';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

export function BudgetBreakdownPage() {
  const { trips } = useTrips();
  
  if (!trips || trips.length === 0) {
    return (
      <div className="budget-breakdown-page">
        <div className="budget-empty-state">
          <h2>No trips found</h2>
          <p>Create a trip to see budget breakdown</p>
        </div>
      </div>
    );
  }
  
  const trip = trips[0];

  // Empty data for spending history - will be populated from real data
  const historyData: any[] = [];

  return (
    <div className="budget-container">
      <div className="budget-header-wrapper">
        <div className="budget-header-text">
          <h1 className="budget-title">Trip Finance Optimizer</h1>
          <p className="budget-subtitle">Keep your adventure on track with real-time budget insights.</p>
        </div>
        <div className="budget-header-actions">
          <button className="budget-action-btn-secondary">
            <CreditCard size={18} /> Add Expense
          </button>
          <button className="budget-action-btn-primary">
            <Plus size={18} className="budget-export-icon" /> Export PDF
          </button>
        </div>
      </div>

      <div className="budget-main-grid">
        {/* Main Stats */}
        <div className="budget-stats-column">
          <div className="budget-total-card">
            <div className="budget-total-content">
              <div className="budget-total-header">
                <span className="budget-total-label">Total Trip Budget</span>
                <span className="budget-total-amount">${trip.budget.total}</span>
              </div>
              <div className="budget-progress-section">
                <div className="budget-progress-header">
                  <span className="budget-progress-label">Spent so far</span>
                  <span className="budget-progress-amount">${trip.budget.spent}</span>
                </div>
                <div className="budget-progress-bar">
                  <div className="budget-progress-fill" style={{ width: `${(trip.budget.spent / trip.budget.total) * 100}%` }}></div>
                </div>
                <div className="budget-progress-footer">
                  <span>{(trip.budget.spent / trip.budget.total * 100).toFixed(1)}% Usage</span>
                  <span>${trip.budget.total - trip.budget.spent} Remaining</span>
                </div>
              </div>
            </div>
            <Wallet size={120} className="budget-wallet-icon" />
          </div>

          <div className="budget-pie-card">
            <h3 className="budget-pie-title">
              <PieIcon size={16} className="budget-pie-icon" /> Category Split
            </h3>
            <div className="budget-pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trip.budget.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {trip.budget.categories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="budget-pie-legend">
               {trip.budget.categories.map((cat: any, idx: number) => (
                 <div key={cat.name} className="budget-pie-legend-item">
                    <div className="budget-pie-legend-color" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="budget-pie-legend-label">{cat.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Bar Charts / History */}
        <div className="budget-history-column">
          <div className="budget-history-card">
            <div className="budget-history-header">
              <div>
                <h3 className="budget-history-title">Spending History</h3>
                <p className="budget-history-subtitle">Daily allocation analytics</p>
              </div>
              <div className="budget-safe-zone">
                <TrendingDown size={14} /> Safe Zone
              </div>
            </div>
            
            <div className="budget-bar-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ borderRadius: '24px', background: '#080808', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', padding: '20px' }}
                  />
                  <Legend />
                  <Bar dataKey="transport" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hotel" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="food" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="activities" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="budget-insights-grid">
            <div className="budget-insight-card group">
              <div className="budget-insight-content">
                <div>
                  <div className="budget-insight-icon-wrapper orange">
                    <ArrowUpRight size={24} />
                  </div>
                  <h4 className="budget-insight-title">Efficiency Score</h4>
                  <p className="budget-insight-desc">You are spending within your 'Early Bird' estimates for transport.</p>
                </div>
                <span className="budget-insight-score orange">A+</span>
              </div>
            </div>
            <div className="budget-insight-card group">
              <div className="budget-insight-content">
                <div>
                  <div className="budget-insight-icon-wrapper green">
                    <DollarSign size={24} />
                  </div>
                  <h4 className="budget-insight-title">Savings Potential</h4>
                  <p className="budget-insight-desc">Booked group activities early saved you $450 this trip.</p>
                </div>
                <span className="budget-insight-score green">+$450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
