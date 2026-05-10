import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Bed, UtensilsCrossed, Bus, Ticket, ShoppingBag, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './BudgetBreakdownPage.css';

// ── Currency exchange rates (vs USD) ─────────────────────────
const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',        rate: 1     },
  { code: 'EUR', symbol: '€',  name: 'Euro',             rate: 0.92  },
  { code: 'GBP', symbol: '£',  name: 'British Pound',    rate: 0.79  },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',     rate: 83.5  },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',     rate: 155   },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham',      rate: 3.67  },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35  },
  { code: 'THB', symbol: '฿',  name: 'Thai Baht',        rate: 36.5  },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah',rate: 16000 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',rate: 1.53  },
];

// ── Recommended daily costs per city (USD) ───────────────────
const CITY_COSTS: Record<string, { stay: number; food: number; transport: number; tickets: number; misc: number }> = {
  Tokyo:      { stay: 120, food: 45, transport: 15, tickets: 25, misc: 20 },
  Paris:      { stay: 150, food: 60, transport: 18, tickets: 30, misc: 25 },
  Bali:       { stay: 55,  food: 20, transport: 8,  tickets: 10, misc: 15 },
  Dubai:      { stay: 180, food: 70, transport: 20, tickets: 40, misc: 30 },
  Rome:       { stay: 130, food: 55, transport: 12, tickets: 28, misc: 20 },
  Bangkok:    { stay: 50,  food: 18, transport: 6,  tickets: 12, misc: 10 },
  Singapore:  { stay: 170, food: 40, transport: 12, tickets: 20, misc: 25 },
  Barcelona:  { stay: 120, food: 50, transport: 14, tickets: 22, misc: 20 },
  Santorini:  { stay: 200, food: 65, transport: 15, tickets: 20, misc: 30 },
  Goa:        { stay: 40,  food: 15, transport: 5,  tickets: 8,  misc: 10 },
  Jaipur:     { stay: 35,  food: 12, transport: 4,  tickets: 10, misc: 8  },
  Mumbai:     { stay: 60,  food: 18, transport: 5,  tickets: 10, misc: 12 },
  Seoul:      { stay: 90,  food: 30, transport: 10, tickets: 20, misc: 15 },
  Kyoto:      { stay: 110, food: 40, transport: 12, tickets: 20, misc: 18 },
  Maldives:   { stay: 400, food: 80, transport: 30, tickets: 50, misc: 40 },
  DEFAULT:    { stay: 90,  food: 35, transport: 12, tickets: 18, misc: 15 },
};

// ── Budget-based planning suggestions ────────────────────────
function getPlanningTips(budget: number, estimatedTotal: number, cityName: string, days: number, currency: typeof CURRENCIES[0]) {
  const ratio = budget / Math.max(estimatedTotal, 1);
  const fmt = (v: number) => `${currency.symbol}${Math.round(v * currency.rate).toLocaleString()}`;

  if (ratio >= 1.5) return [
    { emoji: '🏨', text: `Luxury hotels — budget allows ~${fmt(budget * currency.rate / days / currency.rate * 0.45)} per night` },
    { emoji: '🍽️', text: 'Fine dining at top restaurants — no need to compromise' },
    { emoji: '🚖', text: 'Private transfers & business-class upgrades possible' },
    { emoji: '🎭', text: 'Premium experiences: exclusive tours, rooftop dinners, spa days' },
    { emoji: '💳', text: `You have ~${fmt((budget - estimatedTotal))} buffer for shopping & extras` },
  ];
  if (ratio >= 1.0) return [
    { emoji: '🏩', text: 'Comfortable 3–4 star hotels or boutique stays' },
    { emoji: '🍜', text: 'Mix of local restaurants & occasional fine dining' },
    { emoji: '🚌', text: 'Public transport + occasional taxi — optimal balance' },
    { emoji: '🎟️', text: 'All major attractions included in the estimate' },
    { emoji: '✅', text: `Budget aligns well with ${cityName} costs — good headroom for surprises` },
  ];
  if (ratio >= 0.7) return [
    { emoji: '🏠', text: 'Budget hotels, guesthouses or Airbnb — still comfortable' },
    { emoji: '🍛', text: 'Local street food & markets — authentic & affordable' },
    { emoji: '🚇', text: 'Stick to public transport to save ~30% on travel costs' },
    { emoji: '🆓', text: 'Prioritise free attractions: parks, temples, beaches, markets' },
    { emoji: '⚠️', text: `Shortfall ~${fmt(estimatedTotal - budget)} — consider adding ${Math.ceil((estimatedTotal - budget) / days / currency.rate)} USD/day` },
  ];
  return [
    { emoji: '🏕️', text: 'Hostels or shared rooms only — book well in advance' },
    { emoji: '🥡', text: 'Cook your own meals or eat only street food' },
    { emoji: '🚶', text: 'Walk everywhere possible — skip paid transport' },
    { emoji: '🔄', text: `Consider shortening trip to ${Math.floor(budget / (estimatedTotal / days))} days to match budget` },
    { emoji: '⛔', text: `Budget is ${Math.round((1 - ratio) * 100)}% below estimate — significant shortfall` },
  ];
}

const CATEGORIES = [
  { key: 'stay',      label: 'Stay',      icon: Bed,             color: '#f97316' },
  { key: 'food',      label: 'Food',      icon: UtensilsCrossed, color: '#3b82f6' },
  { key: 'transport', label: 'Transport', icon: Bus,             color: '#22c55e' },
  { key: 'tickets',   label: 'Tickets',   icon: Ticket,          color: '#a855f7' },
  { key: 'misc',      label: 'Misc',      icon: ShoppingBag,     color: '#ec4899' },
];

function getDays(start: string, end: string) {
  if (!start || !end) return 0;
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

export function BudgetBreakdownPage() {
  const { trips } = useTrips();
  const trip = trips[0];

  const [customBudget, setCustomBudget] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  const days = trip ? getDays(trip.start_date, trip.end_date) : 0;

  const cityName = useMemo(() => {
    if (!trip) return 'DEFAULT';
    const c = (trip as any).cities?.[0]?.city || trip.name?.split(' ')[0] || 'DEFAULT';
    return CITY_COSTS[c] ? c : 'DEFAULT';
  }, [trip]);

  const rates = CITY_COSTS[cityName] || CITY_COSTS.DEFAULT;
  const perDayTotal = Object.values(rates).reduce((s, v) => s + v, 0);
  const estimatedTotalUSD = perDayTotal * Math.max(days, 1);

  const budgetUSD = customBudget
    ? parseFloat(customBudget) / currency.rate   // user entered in selected currency → convert to USD
    : (typeof trip?.budget === 'number' && trip.budget > 0 ? trip.budget : estimatedTotalUSD);

  // Convert to selected currency
  const fmt = (usd: number) => `${currency.symbol}${Math.round(usd * currency.rate).toLocaleString()}`;

  const pieData = CATEGORIES.map(cat => {
    const rate = rates[cat.key as keyof typeof rates];
    const totalUSD = rate * Math.max(days, 1);
    const proportion = estimatedTotalUSD > 0 ? totalUSD / estimatedTotalUSD : 0.2;
    return {
      name: cat.label,
      value: Math.round(budgetUSD * proportion * currency.rate),
      valueUSD: budgetUSD * proportion,
      color: cat.color,
      perDay: rate,
    };
  });

  const spent = 0;
  const remaining = budgetUSD - spent;
  const pct = budgetUSD > 0 ? Math.round((spent / budgetUSD) * 100) : 0;

  const planningTips = getPlanningTips(budgetUSD, estimatedTotalUSD, cityName, Math.max(days, 1), currency);

  if (!trip) {
    return (
      <div className="budget-page">
        <div className="budget-empty">
          <Wallet size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h2>No trips yet</h2>
          <p>Create a trip to see your budget breakdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-page">
      {/* Header */}
      <div className="budget-page-header">
        <div>
          <h1 className="budget-page-title">Trip Finance</h1>
          <p className="budget-page-subtitle">
            {trip.name} · {days} day{days !== 1 ? 's' : ''} · {cityName !== 'DEFAULT' ? cityName : 'Custom destination'}
          </p>
        </div>

        <div className="budget-controls">
          {/* Currency selector */}
          <div className="budget-currency-wrap" style={{ position: 'relative' }}>
            <button className="budget-currency-btn" onClick={() => setShowCurrencyMenu(v => !v)}>
              <span>{currency.symbol}</span>
              <span>{currency.code}</span>
              <ChevronDown size={14} />
            </button>
            {showCurrencyMenu && (
              <div className="budget-currency-menu">
                {CURRENCIES.map(c => (
                  <button
                    key={c.code}
                    className={`budget-currency-item ${c.code === currencyCode ? 'active' : ''}`}
                    onClick={() => { setCurrencyCode(c.code); setShowCurrencyMenu(false); }}
                  >
                    <span>{c.symbol}</span>
                    <span>{c.code}</span>
                    <span className="budget-currency-name">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Budget input */}
          <div className="budget-input-wrap">
            <span className="budget-input-dollar">{currency.symbol}</span>
            <input
              type="number"
              placeholder={String(Math.round(estimatedTotalUSD * currency.rate))}
              value={customBudget}
              onChange={e => setCustomBudget(e.target.value)}
              className="budget-input-field"
            />
            <span className="budget-input-label">Total Budget ({currency.code})</span>
          </div>
        </div>
      </div>

      {/* Estimated cost hint */}
      <div className="budget-est-banner">
        💡 Estimated cost for <strong>{cityName !== 'DEFAULT' ? cityName : 'this trip'}</strong> ({days} days):&nbsp;
        <strong style={{ color: '#fb923c' }}>{fmt(estimatedTotalUSD)}</strong>
        <span style={{ color: '#4b5563', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
          (~{fmt(perDayTotal)}/day per person)
        </span>
      </div>

      <div className="budget-main-layout">
        {/* LEFT — Pie chart + spent */}
        <div className="budget-chart-section">
          <div className="budget-chart-card">
            <h3 className="budget-card-title">Budget Split</h3>
            <div className="budget-pie-wrap">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '0.82rem' }}
                    formatter={(val: any) => [`${currency.symbol}${Number(val).toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="budget-pie-center">
                <p className="budget-pie-center-label">Total</p>
                <p className="budget-pie-center-amount">{fmt(budgetUSD)}</p>
              </div>
            </div>
            <div className="budget-pie-legend">
              {pieData.map((d, i) => (
                <div key={i} className="budget-legend-item">
                  <div className="budget-legend-dot" style={{ background: d.color }} />
                  <span className="budget-legend-name">{d.name}</span>
                  <span className="budget-legend-val">{currency.symbol}{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="budget-spent-card">
            <div className="budget-spent-row">
              <div>
                <p className="budget-spent-label">Spent</p>
                <p className="budget-spent-val">{fmt(spent)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="budget-spent-label">Remaining</p>
                <p className="budget-spent-val" style={{ color: '#4ade80' }}>{fmt(remaining)}</p>
              </div>
            </div>
            <div className="budget-bar-track">
              <div className="budget-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="budget-bar-pct">{pct}% used</p>
          </div>
        </div>

        {/* RIGHT — Table + planning tips */}
        <div className="budget-table-section">
          <div className="budget-table-card">
            <div className="budget-table-header">
              <h3 className="budget-card-title">Per-Day Expense Breakdown</h3>
              <span className="budget-city-tag">{cityName !== 'DEFAULT' ? cityName : 'Average'}</span>
            </div>
            <p className="budget-table-subtitle">Recommended daily costs per person · in {currency.name}</p>

            <div className="budget-table">
              <div className="budget-table-row budget-table-heading">
                <span>Category</span>
                <span>Per Day</span>
                <span>Total ({days}d)</span>
                <span>Budget %</span>
              </div>

              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                const rate = rates[cat.key as keyof typeof rates];
                const totalUSD = rate * Math.max(days, 1);
                const pctOfBudget = budgetUSD > 0 ? Math.round((totalUSD / budgetUSD) * 100) : 0;
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="budget-table-row"
                  >
                    <div className="budget-table-cat">
                      <div className="budget-table-icon" style={{ background: cat.color + '20', color: cat.color }}>
                        <Icon size={15} />
                      </div>
                      <span>{cat.label}</span>
                    </div>
                    <span className="budget-table-cell">{fmt(rate)}</span>
                    <span className="budget-table-cell bold">{fmt(totalUSD)}</span>
                    <div className="budget-table-bar-cell">
                      <div className="budget-mini-track">
                        <div className="budget-mini-fill" style={{ width: `${Math.min(pctOfBudget, 100)}%`, background: cat.color }} />
                      </div>
                      <span className="budget-mini-pct">{pctOfBudget}%</span>
                    </div>
                  </motion.div>
                );
              })}

              <div className="budget-table-row budget-table-total">
                <span style={{ fontWeight: 700 }}>Total Estimate</span>
                <span>{fmt(perDayTotal)}/day</span>
                <span style={{ color: '#fb923c', fontWeight: 700 }}>{fmt(estimatedTotalUSD)}</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Planning optimization card */}
          <div className="budget-plan-card">
            <p className="budget-plan-title">🗺️ Optimized Planning</p>
            <p className="budget-plan-sub">
              Based on your {currency.code} {fmt(budgetUSD)} budget vs {fmt(estimatedTotalUSD)} estimate
            </p>
            <div className="budget-plan-tips">
              {planningTips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="budget-plan-tip"
                >
                  <span className="budget-plan-emoji">{tip.emoji}</span>
                  <span>{tip.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
