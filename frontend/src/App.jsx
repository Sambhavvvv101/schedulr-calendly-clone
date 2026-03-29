import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import EventTypesPage from './pages/EventTypesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MeetingsPage from './pages/MeetingsPage';
import BookingPage from './pages/BookingPage';

export default function App() {
  const [page,      setPage]      = useState('dashboard');
  const [bookingET, setBookingET] = useState(null); // event type being booked

  const openBooking = (et) => { setBookingET(et); setPage('booking'); };
  const closeBooking = () => { setBookingET(null); setPage('events'); };

  // Public booking page has its own full-screen layout
  if (page === 'booking' && bookingET) {
    return (
      <AppProvider>
        <BookingPage eventType={bookingET} onBack={closeBooking} />
        <Toast />
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <div className="app">
        <Sidebar page={page} setPage={setPage} />
        <main className="main">
          {page === 'dashboard'    && <Dashboard    onBook={openBooking} />}
          {page === 'events'       && <EventTypesPage onBook={openBooking} />}
          {page === 'availability' && <AvailabilityPage />}
          {page === 'meetings'     && <MeetingsPage />}
        </main>
      </div>
      <Toast />
    </AppProvider>
  );
}
