import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './ChecklistPage.css';

// ── Climate profiles per city ─────────────────────────────────
const CITY_CLIMATE: Record<string, 'tropical' | 'cold' | 'desert' | 'mountain' | 'temperate'> = {
  Bali: 'tropical', Goa: 'tropical', Phuket: 'tropical', Bangkok: 'tropical',
  'Ho Chi Minh': 'tropical', Mumbai: 'tropical', Colombo: 'tropical',
  Tokyo: 'temperate', Paris: 'temperate', Rome: 'temperate', Barcelona: 'temperate',
  Amsterdam: 'temperate', Prague: 'temperate', Lisbon: 'temperate', Seoul: 'temperate',
  Kyoto: 'temperate', London: 'temperate', Berlin: 'temperate', Vienna: 'temperate',
  Dubai: 'desert', Marrakech: 'desert', Cairo: 'desert', Jaipur: 'desert',
  Kathmandu: 'mountain', Manali: 'mountain', Zurich: 'mountain',
  Maldives: 'tropical', Singapore: 'tropical',
};

// ── Smart item sets by climate/trip type ──────────────────────
const SMART_ITEMS: Record<string, { name: string; category: string }[]> = {
  tropical: [
    { name: 'Swimwear (2–3 sets)', category: 'Clothing' },
    { name: 'Waterproof Sandals', category: 'Clothing' },
    { name: 'Reef-safe Sunscreen SPF 50', category: 'Health' },
    { name: 'Insect Repellent (DEET)', category: 'Health' },
    { name: 'After-Sun Lotion', category: 'Health' },
    { name: 'Rash Guard / UV Shirt', category: 'Clothing' },
    { name: 'Lightweight Quick-dry Clothes', category: 'Clothing' },
    { name: 'Waterproof Phone Pouch', category: 'Tech' },
    { name: 'Stomach Meds (traveler\'s diarrhea)', category: 'Health' },
  ],
  cold: [
    { name: 'Heavy Winter Jacket', category: 'Clothing' },
    { name: 'Thermal Underlayers (top + bottom)', category: 'Clothing' },
    { name: 'Wool Sweaters (2–3)', category: 'Clothing' },
    { name: 'Waterproof Snow Boots', category: 'Clothing' },
    { name: 'Gloves & Scarf & Beanie', category: 'Clothing' },
    { name: 'Hand & Toe Warmers', category: 'Health' },
    { name: 'Lip Balm & Moisturiser (cold weather)', category: 'Toiletries' },
    { name: 'Vitamin C Supplements', category: 'Health' },
  ],
  desert: [
    { name: 'Loose Linen / Cotton Clothes', category: 'Clothing' },
    { name: 'Wide-brim Hat', category: 'Clothing' },
    { name: 'UV Protection Sunglasses', category: 'Clothing' },
    { name: 'High-SPF Sunscreen', category: 'Health' },
    { name: 'Large Refillable Water Bottle', category: 'Health' },
    { name: 'Electrolyte Sachets', category: 'Health' },
    { name: 'Light Scarf (sun + mosque visits)', category: 'Clothing' },
    { name: 'Portable Fan / Cooling Spray', category: 'Tech' },
  ],
  mountain: [
    { name: 'Hiking Boots (broken in)', category: 'Clothing' },
    { name: 'Trekking Poles', category: 'Tech' },
    { name: 'Layered Warm Jackets', category: 'Clothing' },
    { name: 'Rain Poncho / Waterproof Outer', category: 'Clothing' },
    { name: 'Altitude Sickness Pills', category: 'Health' },
    { name: 'High-energy Trail Snacks', category: 'Health' },
    { name: 'Headlamp + Extra Batteries', category: 'Tech' },
    { name: 'First Aid Kit (blister pads, bandages)', category: 'Health' },
    { name: 'Moisture-wicking Base Layers', category: 'Clothing' },
    { name: 'Sleeping Bag (if trekking)', category: 'Clothing' },
  ],
  temperate: [
    { name: 'Layered Outfits (light + medium)', category: 'Clothing' },
    { name: 'Compact Umbrella', category: 'Clothing' },
    { name: 'Comfortable Walking Shoes', category: 'Clothing' },
    { name: 'Light Rain Jacket', category: 'Clothing' },
    { name: 'Scarf for evening chill', category: 'Clothing' },
  ],
};

// ── Base items always needed ──────────────────────────────────
const BASE_ITEMS = [
  { id: 'b1',  name: 'Passport & Visas',              category: 'Documents' },
  { id: 'b2',  name: 'Flight Tickets (printed/app)',   category: 'Documents' },
  { id: 'b3',  name: 'Hotel Confirmations',            category: 'Documents' },
  { id: 'b4',  name: 'Travel Insurance Policy',        category: 'Documents' },
  { id: 'b5',  name: 'Emergency Contacts List',        category: 'Documents' },
  { id: 'b6',  name: 'Phone Charger & Cable',          category: 'Tech'      },
  { id: 'b7',  name: 'Universal Travel Adapter',       category: 'Tech'      },
  { id: 'b8',  name: 'Portable Power Bank',            category: 'Tech'      },
  { id: 'b9',  name: 'Noise-Cancelling Headphones',   category: 'Tech'      },
  { id: 'b10', name: 'Camera + Memory Cards',          category: 'Tech'      },
  { id: 'b11', name: 'Prescription Medications',       category: 'Health'    },
  { id: 'b12', name: 'Pain Killers / Antacids',        category: 'Health'    },
  { id: 'b13', name: 'Local Currency (cash)',           category: 'Money'     },
  { id: 'b14', name: 'Travel Credit/Debit Cards',      category: 'Money'     },
  { id: 'b15', name: 'Notify Bank of Travel Dates',    category: 'Money'     },
  { id: 'b16', name: 'Toothbrush & Toothpaste',        category: 'Toiletries'},
  { id: 'b17', name: 'Deodorant',                      category: 'Toiletries'},
  { id: 'b18', name: 'Shampoo & Conditioner',          category: 'Toiletries'},
];

const CATEGORIES = ['All', 'Documents', 'Tech', 'Clothing', 'Health', 'Money', 'Toiletries'];

const CAT_COLORS: Record<string, string> = {
  Documents: '#f97316', Tech: '#3b82f6', Clothing: '#a855f7',
  Health: '#22c55e', Money: '#fbbf24', Toiletries: '#ec4899',
};

function ProgressRing({ pct }: { pct: number }) {
  const r = 38, circ = 2 * Math.PI * r;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#f97316" strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="45" y="49" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Outfit,sans-serif">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export function ChecklistPage() {
  const { trips } = useTrips();
  const trip = trips[0];

  // Detect climate from trip city
  const climate = useMemo(() => {
    if (!trip) return 'temperate';
    const city = (trip as any).cities?.[0]?.city || trip.name?.split(' ')[0] || '';
    return CITY_CLIMATE[city] || 'temperate';
  }, [trip]);

  const cityName = useMemo(() => {
    if (!trip) return '';
    return (trip as any).cities?.[0]?.city || trip.name?.split(' ')[0] || '';
  }, [trip]);

  // Build initial items: base + climate-specific
  const initialItems = useMemo(() => {
    const smart = (SMART_ITEMS[climate] || []).map((s, i) => ({
      id: `s${i}`, ...s, isPacked: false,
    }));
    return [...BASE_ITEMS.map(i => ({ ...i, isPacked: false })), ...smart];
  }, [climate]);

  const [items, setItems] = useState(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Documents');
  const [activeCategory, setActiveCategory] = useState('All');

  const togglePacked = (id: string) =>
    setItems(items.map(i => i.id === id ? { ...i, isPacked: !i.isPacked } : i));
  const addItem = () => {
    if (!newItemName.trim()) return;
    setItems([{ id: Date.now().toString(), name: newItemName.trim(), category: newItemCat, isPacked: false }, ...items]);
    setNewItemName('');
  };
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const clearCompleted = () => setItems(items.filter(i => !i.isPacked));

  const packed = items.filter(i => i.isPacked).length;
  const progress = items.length === 0 ? 0 : (packed / items.length) * 100;
  const filtered = useMemo(
    () => activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory),
    [items, activeCategory]
  );

  const climateLabel: Record<string, string> = {
    tropical: '🌴 Tropical', cold: '❄️ Cold', desert: '☀️ Desert',
    mountain: '⛰️ Mountain', temperate: '🌤️ Temperate',
  };

  return (
    <div className="cl-page">
      {/* Header */}
      <div className="cl-header">
        <div>
          <h1 className="cl-title">Packing Checklist</h1>
          <p className="cl-subtitle">Smart recommendations for your trip — nothing left behind.</p>
          {cityName && (
            <div className="cl-trip-badge">
              <Sparkles size={12} />
              Auto-tailored for <strong>{cityName}</strong> · {climateLabel[climate]} climate
            </div>
          )}
        </div>
        <div className="cl-progress-card">
          <ProgressRing pct={progress} />
          <div className="cl-progress-info">
            <p className="cl-progress-count">{packed}<span>/{items.length}</span></p>
            <p className="cl-progress-label">items packed</p>
          </div>
        </div>
      </div>

      {/* Add item bar */}
      <div className="cl-add-bar">
        <input
          type="text"
          placeholder="Add item (e.g. Hiking Boots)…"
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addItem()}
          className="cl-add-input"
        />
        <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)} className="cl-cat-select">
          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={addItem} className="cl-add-btn"><Plus size={18} /></button>
      </div>

      {/* Category filter */}
      <div className="cl-cats-bar">
        <div className="cl-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cl-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              style={activeCategory === cat && cat !== 'All'
                ? { borderColor: CAT_COLORS[cat], color: CAT_COLORS[cat], background: CAT_COLORS[cat] + '15' }
                : {}}
            >
              {cat}
              <span className="cl-cat-count">
                {cat === 'All' ? items.length : items.filter(i => i.category === cat).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={clearCompleted} className="cl-clear-btn">Clear done</button>
      </div>

      {/* Items */}
      <div className="cl-items">
        <AnimatePresence initial={false}>
          {filtered.length === 0
            ? <div className="cl-empty">No items in this category.</div>
            : filtered.map(item => {
                const color = CAT_COLORS[item.category] || '#f97316';
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.15 }}
                    className={`cl-item ${item.isPacked ? 'packed' : ''}`}
                  >
                    <button onClick={() => togglePacked(item.id)}
                      className={`cl-check ${item.isPacked ? 'packed' : ''}`}
                      style={item.isPacked ? { color, borderColor: color } : {}}
                    >
                      {item.isPacked ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <div className="cl-item-info">
                      <p className={`cl-item-name ${item.isPacked ? 'packed' : ''}`}>{item.name}</p>
                      <span className="cl-item-cat" style={{ color, background: color + '15', borderColor: color + '30' }}>
                        {item.category}
                      </span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="cl-del"><Trash2 size={16} /></button>
                  </motion.div>
                );
              })
          }
        </AnimatePresence>
      </div>

      {progress === 100 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="cl-done-banner">
          🎉 All packed! You're ready to go. Have an amazing trip!
        </motion.div>
      )}
    </div>
  );
}
