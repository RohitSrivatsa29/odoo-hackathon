import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Search,
  Calendar, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import './JournalPage.css';

export function JournalPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([
    { 
      id: '1', 
      title: 'Hidden Cafe in Shibuya', 
      content: 'Found a small 3rd-floor cafe near the crossing. The matcha latte was incredible and the view was unmatched. Quiet place to work.', 
      date: 'May 10, 2024',
      location: 'Tokyo, Japan',
      highlight: true
    },
    { 
      id: '2', 
      title: 'Photography Gear to Pack', 
      content: "Bring the 35mm prime and the ND filter for the waterfalls. Don't forget the lightweight tripod for night shots.", 
      date: 'May 08, 2024',
      location: 'Preparation',
      highlight: false
    },
    { 
      id: '3', 
      title: 'Local Rail Pass info', 
      content: 'Suica card is better than JR Pass for short stays in Tokyo and Osaka. Download the iPhone app for easier refills.', 
      date: 'May 05, 2024',
      location: 'Travel Advice',
      highlight: false
    }
  ]);

  return (
    <div className="journal-container">
      <div className="journal-header">
        <div className="journal-header-text">
          <div className="journal-title-row">
             <div className="journal-icon-wrapper">
                <StickyNote size={24} />
             </div>
             <h1 className="journal-title">Trip Notes &amp; Journal</h1>
          </div>
          <p className="journal-subtitle">Document your discoveries, store important info, and never forget a moment.</p>
        </div>
        <button className="journal-new-btn group">
          <Plus size={20} className="journal-new-icon" /> New Note
        </button>
      </div>

      <div className="journal-grid">
        <AnimatePresence>
          {notes.map((note, idx) => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`journal-note-card group ${note.highlight ? 'highlight' : ''}`}
            >
               <div className="journal-note-top">
                <div className="journal-note-meta">
                  <div className="journal-note-date">
                    <Calendar size={14} /> {note.date}
                  </div>
                  <button className="journal-note-menu">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <h3 className="journal-note-title">{note.title}</h3>
                <p className="journal-note-content">"{note.content}"</p>
              </div>

              <div className="journal-note-footer">
                <div className="journal-note-location">
                  <MapPin size={14} className="journal-note-pin" /> {note.location}
                </div>
                <div className="journal-note-actions">
                   <button className="journal-note-action-btn"><Edit size={16} /></button>
                   <button className="journal-note-action-btn delete"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div 
           whileHover={{ scale: 0.98 }}
           className="journal-add-card group"
        >
          <div className="journal-add-icon-wrapper">
             <Plus size={32} />
          </div>
          <span className="journal-add-label">Drop a note here</span>
          <span className="journal-add-sublabel">Capture your inspiration</span>
        </motion.div>
      </div>

          </div>
  );
}
