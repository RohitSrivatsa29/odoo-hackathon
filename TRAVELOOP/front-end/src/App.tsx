import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { BudgetBreakdownPage } from './pages/BudgetBreakdownPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { JournalPage } from './pages/JournalPage';
import { PublicItineraryPage } from './pages/PublicItineraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { SecurityPrivacyPage } from './pages/SecurityPrivacyPage';
import { BillingPage } from './pages/BillingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/public-itinerary/:id" element={<PublicItineraryPage />} />
            
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/trips" element={<MyTripsPage />} />
              <Route path="/create-trip" element={<CreateTripPage />} />
              <Route path="/itinerary/:id" element={<ItineraryBuilderPage />} />
              <Route path="/itinerary-view" element={<ItineraryViewPage />} />
              <Route path="/itinerary-view/:id" element={<ItineraryViewPage />} />
              <Route path="/explore-cities" element={<CitySearchPage />} />
              <Route path="/explore-activities" element={<ActivitySearchPage />} />
              <Route path="/budget" element={<BudgetBreakdownPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings/personal-info" element={<PersonalInfoPage />} />
              <Route path="/settings/security" element={<SecurityPrivacyPage />} />
              <Route path="/settings/billing" element={<BillingPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}
