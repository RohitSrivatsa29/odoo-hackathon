import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_TRIPS } from '../data/mockData';

interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  status: string;
  destinationCount: number;
  progress: number;
  budget?: any;
  cities?: any[];
  notes?: any[];
  items?: any[];
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: any) => void;
  deleteTrip: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);

  const addTrip = (newTrip: any) => {
    setTrips(prev => [...prev, { ...newTrip, id: `trip_${Date.now()}` }]);
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const getTripById = (id: string) => trips.find(t => t.id === id);

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip, getTripById }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) throw new Error('useTrips must be used within a TripProvider');
  return context;
}
