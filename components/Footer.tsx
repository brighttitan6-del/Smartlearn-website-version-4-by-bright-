import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Smartlearn</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Empowering students worldwide with accessible, high-quality education through modern technology.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-500">Browse Lessons</a></li>
              <li><a href="#" className="hover:text-primary-500">Live Classes</a></li>
              <li><a href="#" className="hover:text-primary-500">Teachers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>support@smartlearn.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Smartlearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
};