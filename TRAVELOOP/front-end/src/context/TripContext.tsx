import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5001/api';

interface Trip {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  cover_image: string;
  status: string;
  budget?: any; // Reverting to any to support complex budget objects
  startDate?: string; // For compatibility
  endDate?: string; // For compatibility
  coverImage?: string; // For compatibility
  destinationCount?: number;
  progress?: number;
  cities?: any[];
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: any) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTripById: (id: string) => Trip | undefined;
  loading: boolean;
  refreshTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchTrips = async () => {
    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedTrips = data.trips.map((trip: any) => {
          // Ensure budget is always a plain number — never an object
          const rawBudget = trip.budget;
          const budgetNum = typeof rawBudget === 'number'
            ? rawBudget
            : typeof rawBudget === 'string'
              ? parseFloat(rawBudget) || 0
              : typeof rawBudget === 'object' && rawBudget !== null
                ? (rawBudget.total ?? 0)
                : 0;

          // Parse cities from JSON string to array
          let citiesArr: any[] = [];
          try {
            const raw = trip.cities;
            if (typeof raw === 'string' && raw.startsWith('[')) {
              citiesArr = JSON.parse(raw);
            } else if (Array.isArray(raw)) {
              citiesArr = raw;
            }
          } catch {}

          return {
            ...trip,
            name: trip.name || trip.title || trip.destination || 'Untitled Trip',
            budget: budgetNum,
            budgetBreakdown: {
              total: budgetNum, spent: 0,
              categories: [
                { name: 'Transport', value: 0 },
                { name: 'Food',      value: 0 },
                { name: 'Stay',      value: 0 },
                { name: 'Fun',       value: 0 },
              ],
            },
            startDate:        trip.start_date,
            endDate:          trip.end_date,
            coverImage:       trip.cover_image,
            destinationCount: trip.destinationCount || citiesArr.length || 0,
            progress:         trip.progress || 0,
            cities:           citiesArr,            // always an array
          };
        });

        setTrips(mappedTrips);
      }
    } catch (err) {
      console.error('Fetch trips error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [isAuthenticated]);

  const addTrip = async (newTrip: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTrip)
      });
      
      if (response.ok) {
        await fetchTrips();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add trip');
      }
    } catch (err) {
      console.error('Add trip error:', err);
      throw err;
    }
  };

  const deleteTrip = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTrips(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Delete trip error:', err);
    }
  };

  const getTripById = (id: string) => trips.find(t => t.id === id);

  return (
    <TripContext.Provider value={{ 
      trips, 
      addTrip, 
      deleteTrip, 
      getTripById, 
      loading, 
      refreshTrips: fetchTrips 
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) throw new Error('useTrips must be used within a TripProvider');
  return context;
}
