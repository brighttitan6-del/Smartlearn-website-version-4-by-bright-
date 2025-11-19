import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg font-bold text-xl">SL</div>
              <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">Smartlearn</span>
            </Link>
            
            <div className="hidden md:flex ml-10 space-x-4">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/lessons">Lessons</NavLink>
              <NavLink to="/live">Live Classes</NavLink>
              <NavLink to="/bookstore">Bookstore</NavLink>
              <NavLink to="/careers">Careers</NavLink>
              {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? '🌞' : '🌙'}
            </button>

            {user ? (
              <div className="relative flex items-center gap-3">
                <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user.name}
                </span>
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700" />
                <button
                  onClick={logout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  Log in
                </Link>
                <Link to="/login?signup=true" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-sm transition-all">
                  Sign up
                </Link>
              </div>
            )}
            
             {/* Mobile menu button */}
             <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/lessons">Lessons</NavLink>
            <NavLink to="/live">Live Classes</NavLink>
            <NavLink to="/bookstore">Bookstore</NavLink>
            <NavLink to="/careers">Careers</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
            {!user && (
              <>
                <NavLink to="/login">Log in</NavLink>
                <NavLink to="/login?signup=true">Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};