import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Clock, Plus, Trash2, MapPin, Camera, Utensils,
  ShoppingBag, Landmark, Mountain, ChevronDown, Bed, Bus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './ItineraryViewPage.css';

// ── Currencies ───────────────────────────────────────────────
const CURRENCIES = [
  { code: 'USD', symbol: '$',  rate: 1     },
  { code: 'EUR', symbol: '€',  rate: 0.92  },
  { code: 'GBP', symbol: '£',  rate: 0.79  },
  { code: 'INR', symbol: '₹',  rate: 83.5  },
  { code: 'JPY', symbol: '¥',  rate: 155   },
  { code: 'AED', symbol: 'د.إ', rate: 3.67  },
  { code: 'SGD', symbol: 'S$', rate: 1.35  },
  { code: 'THB', symbol: '฿',  rate: 36.5  },
  { code: 'AUD', symbol: 'A$', rate: 1.53  },
];

// ── Per-city daily costs (USD) ───────────────────────────────
const CITY_DAILY: Record<string, { stay: number; food: number; transport: number }> = {
  Tokyo:      { stay: 120, food: 45, transport: 15 },
  Paris:      { stay: 150, food: 60, transport: 18 },
  Bali:       { stay: 55,  food: 20, transport: 8  },
  Dubai:      { stay: 180, food: 70, transport: 20 },
  Rome:       { stay: 130, food: 55, transport: 12 },
  Bangkok:    { stay: 50,  food: 18, transport: 6  },
  Singapore:  { stay: 170, food: 40, transport: 12 },
  Barcelona:  { stay: 120, food: 50, transport: 14 },
  Santorini:  { stay: 200, food: 65, transport: 15 },
  Goa:        { stay: 40,  food: 15, transport: 5  },
  Jaipur:     { stay: 35,  food: 12, transport: 4  },
  Mumbai:     { stay: 60,  food: 18, transport: 5  },
  Seoul:      { stay: 90,  food: 30, transport: 10 },
  Kyoto:      { stay: 110, food: 40, transport: 12 },
  Maldives:   { stay: 400, food: 80, transport: 30 },
  London:     { stay: 180, food: 55, transport: 20 },
  Amsterdam:  { stay: 140, food: 45, transport: 12 },
  Prague:     { stay: 85,  food: 30, transport: 8  },
  Lisbon:     { stay: 100, food: 35, transport: 10 },
  'New York': { stay: 220, food: 65, transport: 30 },
  Istanbul:   { stay: 75,  food: 25, transport: 6  },
};
const DEFAULT_DAILY = { stay: 90, food: 35, transport: 12 };

// ── Curated suggestions per city ────────────────────────────
const CITY_SUGGESTIONS: Record<string, { name: string; time: string; type: string; cost: number; icon: any; img: string }[]> = {
  Tokyo: [
    { name: 'Senso-ji Temple', time: '08:00 AM', type: 'Culture', cost: 0, icon: Landmark, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
    { name: 'Shibuya Crossing', time: '10:30 AM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&q=80' },
    { name: 'Tsukiji Market Breakfast', time: '07:30 AM', type: 'Food', cost: 20, icon: Utensils, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80' },
    { name: 'Harajuku Fashion Walk', time: '02:00 PM', type: 'Shopping', cost: 50, icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&q=80' },
    { name: 'Mt. Fuji Day Trip', time: '06:00 AM', type: 'Adventure', cost: 80, icon: Mountain, img: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&q=80' },
    { name: 'Shinjuku Gyoen Garden', time: '11:00 AM', type: 'Nature', cost: 5, icon: Camera, img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80' },
    { name: 'Ramen Dinner in Shibuya', time: '07:00 PM', type: 'Food', cost: 15, icon: Utensils, img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80' },
  ],
  Paris: [
    { name: 'Eiffel Tower Visit', time: '09:00 AM', type: 'Sightseeing', cost: 25, icon: Landmark, img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&q=80' },
    { name: 'Louvre Museum', time: '11:00 AM', type: 'Culture', cost: 17, icon: Landmark, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
    { name: 'Montmartre & Sacré-Cœur', time: '02:00 PM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
    { name: 'Seine River Cruise', time: '06:00 PM', type: 'Adventure', cost: 35, icon: Camera, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
    { name: 'French Café Breakfast', time: '08:30 AM', type: 'Food', cost: 12, icon: Utensils, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
    { name: 'Champs-Élysées Shopping', time: '03:00 PM', type: 'Shopping', cost: 100, icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=400&q=80' },
  ],
  Bali: [
    { name: 'Ubud Monkey Forest', time: '09:00 AM', type: 'Nature', cost: 5, icon: Mountain, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
    { name: 'Tegallalang Rice Terraces', time: '07:30 AM', type: 'Sightseeing', cost: 2, icon: Camera, img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80' },
    { name: 'Tanah Lot Temple Sunset', time: '05:30 PM', type: 'Culture', cost: 4, icon: Landmark, img: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&q=80' },
    { name: 'Seminyak Beach', time: '02:00 PM', type: 'Adventure', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
    { name: 'Balinese Cooking Class', time: '10:00 AM', type: 'Food', cost: 35, icon: Utensils, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  ],
  Dubai: [
    { name: 'Burj Khalifa Observation', time: '10:00 AM', type: 'Sightseeing', cost: 40, icon: Landmark, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
    { name: 'Dubai Mall & Fountain', time: '01:00 PM', type: 'Shopping', cost: 0, icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80' },
    { name: 'Desert Safari Sunset', time: '03:00 PM', type: 'Adventure', cost: 70, icon: Mountain, img: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&q=80' },
    { name: 'Gold Souk Visit', time: '11:00 AM', type: 'Shopping', cost: 0, icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
    { name: 'Dhow Dinner Cruise', time: '07:30 PM', type: 'Food', cost: 60, icon: Utensils, img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&q=80' },
  ],
  Rome: [
    { name: 'Colosseum Tour', time: '09:00 AM', type: 'Culture', cost: 18, icon: Landmark, img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
    { name: 'Vatican Museums', time: '02:00 PM', type: 'Culture', cost: 22, icon: Landmark, img: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&q=80' },
    { name: 'Trevi Fountain', time: '11:00 AM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400&q=80' },
    { name: 'Pizza & Pasta Lunch', time: '01:00 PM', type: 'Food', cost: 20, icon: Utensils, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
    { name: 'Spanish Steps Stroll', time: '04:00 PM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400&q=80' },
  ],
  Goa: [
    { name: 'Calangute Beach Morning', time: '07:30 AM', type: 'Adventure', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
    { name: 'Old Goa Churches', time: '10:00 AM', type: 'Culture', cost: 5, icon: Landmark, img: 'https://images.unsplash.com/photo-1582560475093-ba66accbc095?w=400&q=80' },
    { name: 'Dudhsagar Waterfall Trek', time: '06:00 AM', type: 'Adventure', cost: 20, icon: Mountain, img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80' },
    { name: 'Spice Plantation Tour', time: '11:00 AM', type: 'Nature', cost: 15, icon: Mountain, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
    { name: 'Beach Shack Seafood Dinner', time: '07:00 PM', type: 'Food', cost: 25, icon: Utensils, img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' },
  ],
};

// Default suggestions for unknown cities
const DEFAULT_SUGGESTIONS = [
  { name: 'City Center Walk', time: '09:00 AM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' },
  { name: 'Local Market Visit', time: '11:00 AM', type: 'Shopping', cost: 20, icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80' },
  { name: 'Traditional Lunch', time: '01:00 PM', type: 'Food', cost: 15, icon: Utensils, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { name: 'Historical Site Tour', time: '03:00 PM', type: 'Culture', cost: 10, icon: Landmark, img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80' },
  { name: 'Sunset Viewpoint', time: '06:00 PM', type: 'Sightseeing', cost: 0, icon: Camera, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80' },
];

const TYPE_COLORS: Record<string, string> = {
  Culture: '#a855f7', Sightseeing: '#3b82f6', Food: '#f97316',
  Shopping: '#ec4899', Adventure: '#22c55e', Nature: '#14b8a6',
};

function getDays(start: string, end: string) {
  const days: { date: Date; label: string }[] = [];
  const s = new Date(start), e = new Date(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    days.push({
      date: new Date(d),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  }
  return days;
}

// ── Types ────────────────────────────────────────────────────
interface DaySlot {
  city: string;
  isTravel: boolean;         // travel day between cities
  fromCity?: string;
  toCity?: string;
}

// Parse cities array from trip (handles JSON string from DB)
function parseCities(trip: any): { city: string; nights: number }[] {
  let cs = trip?.cities;
  if (!cs) return [];
  if (typeof cs === 'string') {
    try { cs = JSON.parse(cs); } catch { cs = []; }
  }
  if (!Array.isArray(cs) || cs.length === 0) return [];
  return cs.filter((c: any) => c.city || c.name).map((c: any) => ({
    city: c.city || c.name || '',
    nights: Number(c.nights) || 3,
  }));
}

// Infer cities from trip name like "Tokyo → Paris → Dubai → New York" and total days
function inferCitiesFromName(tripName: string, totalDays: number): { city: string; nights: number }[] {
  const parts = tripName.split(/\s*[→\->\|\/,]+\s*/).map(s => s.trim()).filter(Boolean);
  if (parts.length <= 1) return [{ city: parts[0] || tripName, nights: totalDays }];
  // Distribute days: last city gets fewer if needed (travel day adjustment)
  const nightsEach = Math.floor(totalDays / parts.length);
  return parts.map((city, i) => ({
    city,
    nights: i === parts.length - 1 ? totalDays - nightsEach * (parts.length - 1) : nightsEach,
  }));
}

// Build full day schedule including travel days
function buildDaySchedule(cities: { city: string; nights: number }[], totalDays: number): DaySlot[] {
  const slots: DaySlot[] = [];

  if (cities.length === 0) return Array(totalDays).fill({ city: 'Unknown', isTravel: false });
  if (cities.length === 1) return Array(totalDays).fill({ city: cities[0].city, isTravel: false });

  for (let i = 0; i < cities.length; i++) {
    const { city, nights } = cities[i];
    // Sightseeing nights in this city (reserve 1 day for travel EXCEPT last city)
    const sightNights = i < cities.length - 1 ? Math.max(1, nights - 1) : nights;

    for (let n = 0; n < sightNights; n++) {
      slots.push({ city, isTravel: false });
    }

    // Travel day: move to next city (except after last city)
    if (i < cities.length - 1) {
      slots.push({ city, isTravel: true, fromCity: city, toCity: cities[i + 1].city });
    }
  }

  // Pad or trim to match totalDays
  while (slots.length < totalDays) slots.push({ city: cities[cities.length - 1].city, isTravel: false });
  return slots.slice(0, totalDays);
}

// Travel day: only logistics — flights are pre-booked by the user
const TRAVEL_ACTIVITIES = (from: string, to: string) => [
  {
    id: 'travel-1', name: `Check out of hotel in ${from}`, time: '09:00 AM',
    type: 'Logistics', cost: 0, icon: null,
    img: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f25?w=400&q=80',
  },
  {
    id: 'travel-2', name: `Head to airport (your flight is pre-booked)`, time: '11:00 AM',
    type: 'Logistics', cost: 0, icon: null,
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
  },
  {
    id: 'travel-3', name: `Arrive in ${to} & Hotel Check-in`, time: '06:00 PM',
    type: 'Logistics', cost: 0, icon: null,
    img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80',
  },
];


export function ItineraryViewPage() {
  const { id } = useParams();
  const { trips, getTripById } = useTrips();
  const trip = id ? getTripById(id) : trips[0];

  const [activeDay, setActiveDay] = useState(0);
  const [activities, setActivities] = useState<Record<number, any[]>>({});
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const fmt = (usd: number) => `${currency.symbol}${Math.round(usd * currency.rate).toLocaleString()}`;

  // Total budget (stored in USD)
  const totalBudgetUSD = useMemo(() => {
    const b = typeof trip?.budget === 'number' ? trip.budget : parseFloat(trip?.budget || '0') || 0;
    return b;
  }, [trip]);

  // Get days array
  const days = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return [];
    return getDays(trip.start_date, trip.end_date);
  }, [trip]);

  // Resolve cities
  const resolvedCities = useMemo(() => {
    if (!trip) return [];
    const dbCities = parseCities(trip);
    if (dbCities.length > 0) return dbCities;
    if (trip.name?.includes('→') || trip.name?.includes('->')) {
      return inferCitiesFromName(trip.name, days.length || 7);
    }
    return [{ city: trip.name?.split(' ')[0] || 'Destination', nights: days.length || 7 }];
  }, [trip, days.length]);

  // Build schedule with travel days
  const schedule = useMemo(() => buildDaySchedule(resolvedCities, days.length), [resolvedCities, days.length]);

  const getSlot = (dayIdx: number): DaySlot =>
    schedule[dayIdx] || { city: resolvedCities[0]?.city || '', isTravel: false };

  const currentSlot = getSlot(activeDay);
  const currentCity = currentSlot.city;
  const suggestions = CITY_SUGGESTIONS[currentCity] || DEFAULT_SUGGESTIONS;

  // Daily budget: spread total evenly across non-travel days
  const nonTravelDays = useMemo(() => schedule.filter(s => !s.isTravel).length || 1, [schedule]);
  const dailyBudgetUSD = totalBudgetUSD > 0 ? totalBudgetUSD / nonTravelDays : 0;

  // Per-day city costs
  const cityCosts = useMemo(() => {
    const c = currentSlot.isTravel ? DEFAULT_DAILY : (CITY_DAILY[currentCity] || DEFAULT_DAILY);
    return c;
  }, [currentCity, currentSlot.isTravel]);

  // Auto-populate activities per day
  const dayActivities = useMemo(() => {
    if (activities[activeDay] !== undefined) return activities[activeDay];
    const slot = getSlot(activeDay);
    if (slot.isTravel) return TRAVEL_ACTIVITIES(slot.fromCity!, slot.toCity!);
    const pool = CITY_SUGGESTIONS[slot.city] || DEFAULT_SUGGESTIONS;
    const base = (activeDay * 3) % pool.length;
    return [
      pool[base % pool.length],
      pool[(base + 1) % pool.length],
      pool[(base + 2) % pool.length],
    ].map((s, i) => ({ ...s, id: `auto-${activeDay}-${i}` }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay, activities, schedule]);

  // Costs — computed AFTER dayActivities
  const activitiesCostUSD = dayActivities.reduce((s: number, a: any) => s + (a.cost || 0), 0);
  const totalDayUSD = cityCosts.stay + cityCosts.food + cityCosts.transport + activitiesCostUSD;

  const addActivity = (suggestion: any) => {
    const current = activities[activeDay] ?? dayActivities;
    setActivities(prev => ({ ...prev, [activeDay]: [...current, { ...suggestion, id: Date.now().toString() }] }));
  };

  const removeActivity = (actId: string) => {
    const current = activities[activeDay] ?? dayActivities;
    setActivities(prev => ({ ...prev, [activeDay]: current.filter((a: any) => a.id !== actId) }));
  };


  if (!trip) {
    return (
      <div className="itin-empty">
        <MapPin size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
        <h2>No Trip Selected</h2>
        <p>Open a trip from My Trips to view its itinerary.</p>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="itin-empty">
        <h2>Dates not set</h2>
        <p>Edit this trip to add start and end dates.</p>
      </div>
    );
  }

  return (
    <div className="itin-page">
      {/* Header */}
      <div className="itin-header">
        <div>
          <h1 className="itin-title">{trip.name}</h1>
          <p className="itin-subtitle">
            <MapPin size={13} style={{ display: 'inline', color: '#f97316' }} />
            {resolvedCities.map(c => c.city).join(' → ')} &nbsp;·&nbsp; {days.length} days
            {totalBudgetUSD > 0 && <span style={{ marginLeft: '0.5rem', color: '#f97316' }}>· {fmt(totalBudgetUSD)} total</span>}
          </p>
        </div>
        <div className="itin-header-meta">
          <span className="itin-status-badge">{trip.status}</span>
          {/* Currency selector */}
          <div style={{ position: 'relative' }}>
            <button className="itin-currency-btn" onClick={() => setShowCurrencyMenu(v => !v)}>
              {currency.symbol} {currency.code} <ChevronDown size={13} />
            </button>
            {showCurrencyMenu && (
              <div className="itin-currency-menu">
                {CURRENCIES.map(c => (
                  <button key={c.code}
                    className={`itin-currency-item ${c.code === currencyCode ? 'active' : ''}`}
                    onClick={() => { setCurrencyCode(c.code); setShowCurrencyMenu(false); }}
                  >
                    <span>{c.symbol}</span><span>{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="itin-body">
        {/* Day sidebar */}
        <aside className="itin-sidebar">
          <p className="itin-sidebar-label">Days</p>
          <div className="itin-days-list">
            {days.map((d, idx) => {
              const sl = getSlot(idx);
              return (
                <button
                  key={idx}
                  className={`itin-day-btn ${activeDay === idx ? 'active' : ''} ${sl.isTravel ? 'travel-day' : ''}`}
                  onClick={() => setActiveDay(idx)}
                >
                  <div className={`itin-day-num ${activeDay === idx ? 'active' : ''} ${sl.isTravel ? 'travel' : ''}`}>
                    {sl.isTravel ? '✈' : idx + 1}
                  </div>
                  <div className="itin-day-info">
                    <p className="itin-day-date">{d.label}</p>
                    <p className="itin-day-city">
                      {sl.isTravel ? `${sl.fromCity} → ${sl.toCity}` : sl.city}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="itin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="itin-day-header">
                <div>
                  <h2 className="itin-day-title">Day {activeDay + 1} — {days[activeDay].label}</h2>
                  {currentSlot.isTravel
                    ? <span className="itin-day-city-tag travel">✈️ Travel: {currentSlot.fromCity} → {currentSlot.toCity}</span>
                    : <span className="itin-day-city-tag">📍 {currentCity}</span>
                  }
                </div>
                <span className="itin-day-count">{dayActivities.length} activities</span>
              </div>

              {/* Day expense strip */}
              {!currentSlot.isTravel && (
                <div className="itin-expense-strip">
                  <div className="itin-expense-item">
                    <Bed size={14} className="itin-expense-icon" style={{ color: '#f97316' }} />
                    <div>
                      <p className="itin-expense-label">Stay</p>
                      <p className="itin-expense-val">{fmt(cityCosts.stay)}</p>
                    </div>
                  </div>
                  <div className="itin-expense-item">
                    <Utensils size={14} className="itin-expense-icon" style={{ color: '#3b82f6' }} />
                    <div>
                      <p className="itin-expense-label">Food</p>
                      <p className="itin-expense-val">{fmt(cityCosts.food)}</p>
                    </div>
                  </div>
                  <div className="itin-expense-item">
                    <Bus size={14} className="itin-expense-icon" style={{ color: '#22c55e' }} />
                    <div>
                      <p className="itin-expense-label">Transport</p>
                      <p className="itin-expense-val">{fmt(cityCosts.transport)}</p>
                    </div>
                  </div>
                  <div className="itin-expense-item">
                    <Camera size={14} className="itin-expense-icon" style={{ color: '#a855f7' }} />
                    <div>
                      <p className="itin-expense-label">Activities</p>
                      <p className="itin-expense-val">{fmt(activitiesCostUSD)}</p>
                    </div>
                  </div>
                  <div className="itin-expense-divider" />
                  <div className="itin-expense-item total">
                    <div>
                      <p className="itin-expense-label">Day Total</p>
                      <p className="itin-expense-val total">{fmt(totalDayUSD)}</p>
                    </div>
                  </div>
                  {dailyBudgetUSD > 0 && (
                    <div className="itin-expense-item budget">
                      <div>
                        <p className="itin-expense-label">Day Budget</p>
                        <p className={`itin-expense-val ${totalDayUSD <= dailyBudgetUSD ? 'ok' : 'over'}`}>
                          {fmt(dailyBudgetUSD)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Activities grouped by time */}
              <div className="itin-activities-list">
                {dayActivities.map((act: any, idx: number) => {
                  const color = TYPE_COLORS[act.type] || '#f97316';
                  const slot = idx === 0 ? '🌅 Morning' : idx === 1 ? '☀️ Afternoon' : '🌙 Evening';
                  const costConverted = act.cost > 0 ? fmt(act.cost) : 'Free';
                  return (
                    <motion.div key={act.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.07 }} className="itin-activity-card">
                      <div className="itin-activity-img-wrap">
                        <img src={act.img} alt={act.name} className="itin-activity-img" />
                        <span className="itin-activity-slot-badge">{slot}</span>
                      </div>
                      <div className="itin-activity-info">
                        <div className="itin-activity-top">
                          <span className="itin-activity-time"><Clock size={11} />{act.time}</span>
                          <span className="itin-activity-type" style={{ color, borderColor: color + '40', background: color + '15' }}>{act.type}</span>
                        </div>
                        <h3 className="itin-activity-name">{act.name}</h3>
                        <p className="itin-activity-loc"><MapPin size={11} />{currentCity} · {act.type}</p>
                      </div>
                      <div className="itin-activity-right">
                        <span className="itin-activity-cost">{costConverted}</span>
                        <button className="itin-activity-remove" onClick={() => removeActivity(act.id)} title="Remove"><Trash2 size={14} /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {!currentSlot.isTravel && (
              <div className="itin-suggestions-section">
                <p className="itin-suggestions-title">✨ Add to Day {activeDay + 1} in {currentCity}</p>
                <div className="itin-suggestions-grid">
                  {suggestions.map((s, i) => {
                    const Icon = s.icon;
                    const color = TYPE_COLORS[s.type] || '#f97316';
                    return (
                      <button key={i} className="itin-suggestion-card" onClick={() => addActivity({ ...s, id: Date.now().toString() + i })}>
                        <img src={s.img} alt={s.name} className="itin-suggestion-card-img" />
                        <div className="itin-suggestion-card-overlay" />
                        <div className="itin-suggestion-card-body">
                          <span className="itin-suggestion-card-time"><Clock size={10} /> {s.time}</span>
                          <p className="itin-suggestion-card-name">{s.name}</p>
                          <div className="itin-suggestion-card-footer">
                            <span className="itin-suggestion-card-type" style={{ color }}><Icon size={11} /> {s.type}</span>
                            <span className="itin-suggestion-card-cost">{s.cost > 0 ? fmt(s.cost) : 'Free'}</span>
                          </div>
                        </div>
                        <div className="itin-suggestion-card-add"><Plus size={14} /></div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
