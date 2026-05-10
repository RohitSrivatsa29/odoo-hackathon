import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Tag, 
  Grid, 
  List, 
  Search,
  CheckCircle,
  Package,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrips } from '../context/TripContext';
import './ChecklistPage.css';

export function ChecklistPage() {
  const { trips } = useTrips();
  const [items, setItems] = useState([
    { id: '1', name: 'Passport & Visas', category: 'Essentials', isPacked: true },
    { id: '2', name: 'Universal Travel Adapter', category: 'Tech', isPacked: false },
    { id: '3', name: 'Noise-Cancelling Headphones', category: 'Tech', isPacked: true },
    { id: '4', name: 'Weather-Proof Rain Jacket', category: 'Clothing', isPacked: false },
    { id: '5', name: 'Portable Power Bank', category: 'Tech', isPacked: true },
    { id: '6', name: 'Travel Insurance Documents', category: 'Essentials', isPacked: false },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const togglePacked = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isPacked: !item.isPacked } : item));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const cat = activeCategory === 'All' ? 'Essentials' : activeCategory;
    setItems([{ id: Date.now().toString(), name: newItemName, category: cat, isPacked: false }, ...items]);
    setNewItemName('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.isPacked));
  };

  const progress = items.length === 0 ? 0 : (items.filter(i => i.isPacked).length / items.length) * 100;
  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <div className="checklist-header-text">
          <h1 className="checklist-title">Packing Checklist</h1>
          <p className="checklist-subtitle">Inventory your essentials and ensure nothing gets left behind.</p>
        </div>
        <div className="checklist-progress-card">
          <div className="checklist-progress-pct">
            <span className="checklist-progress-label">Packed</span>
            <span className="checklist-progress-value">{Math.round(progress)}%</span>
          </div>
          <div className="checklist-progress-divider"></div>
          <div className="checklist-progress-count">
             <div className="checklist-progress-circle">
                {items.filter(i => i.isPacked).length}/{items.length}
             </div>
          </div>
        </div>
      </div>

      <div className="checklist-main">
        <div className="checklist-input-wrapper group">
          <input 
            type="text" 
            placeholder="Add new item (e.g., Hiking Boots)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="checklist-input"
          />
          <button 
            onClick={addItem}
            className="checklist-add-btn"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="checklist-list-container">
          <div className="checklist-categories" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
               {['All', 'Essentials', 'Tech', 'Clothing', 'Toiletries'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`checklist-category-btn ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
               ))}
             </div>
             <button onClick={clearCompleted} className="checklist-clear-btn" style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
               Clear Completed
             </button>
          </div>
          
          <div className="checklist-items">
            <AnimatePresence initial={false}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No items in this category.</div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="checklist-item group"
                >
                  <button 
                    onClick={() => togglePacked(item.id)}
                    className={`checklist-item-checkbox ${item.isPacked ? 'packed' : ''}`}
                  >
                    {item.isPacked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="checklist-item-info">
                    <h4 className={`checklist-item-name ${item.isPacked ? 'packed' : ''}`}>
                      {item.name}
                    </h4>
                    <span className="checklist-item-category">{item.category}</span>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="checklist-item-delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="checklist-tips-grid">
        <div className="checklist-tip-card group">
           <Package size={80} className="checklist-tip-icon" />
           <h3 className="checklist-tip-title">Standard Packing Tips</h3>
           <p className="checklist-tip-desc">Don't forget to pack a versatile layer for changing weather. Try 'Rolling' instead of 'Folding' to save up to 20% space.</p>
           <button className="checklist-tip-link">Read Guide <ArrowUpRight size={14} /></button>
        </div>
        <div className="checklist-success-card group">
           <CheckCircle size={80} className="checklist-success-icon" />
           <h3 className="checklist-success-title">Everything looks great!</h3>
           <p className="checklist-success-desc">You have reached {Math.round(progress)}% of your list. You're almost ready for the big day.</p>
           <div className="checklist-success-bar">
               <div className="checklist-success-fill" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
}
