import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SubscriptionGuard } from './components/SubscriptionGuard';

// Pages
import { Home } from './pages/Home';
import { Lessons } from './pages/Lessons';
import { LiveClass } from './pages/LiveClass';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Payment } from './pages/Payment';
import { Bookstore } from './pages/Bookstore';
import { Careers } from './pages/Careers';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/bookstore" element={<Bookstore />} />
                <Route path="/careers" element={<Careers />} />
                
                {/* Protected Routes requiring Subscription */}
                <Route path="/lessons" element={
                  <SubscriptionGuard>
                    <Lessons />
                  </SubscriptionGuard>
                } />
                <Route path="/live" element={
                  <SubscriptionGuard>
                    <LiveClass />
                  </SubscriptionGuard>
                } />
                <Route path="/dashboard" element={
                  <SubscriptionGuard>
                    <Dashboard />
                  </SubscriptionGuard>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;