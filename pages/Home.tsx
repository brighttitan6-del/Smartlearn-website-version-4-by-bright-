import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, MOCK_LESSONS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const featuredLessons = MOCK_LESSONS.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-secondary-500 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Unlock Your Potential with <span className="text-primary-400">Smartlearn</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
            Join thousands of students worldwide. Master new skills with our library of video lessons and interactive live classes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <Link to="/lessons" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-primary-500/30">
              Start Learning
            </Link>
            <Link to="/live" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full font-bold text-lg transition-all">
              Join Live Class
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="group cursor-pointer bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lessons */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Lessons</h2>
              <p className="text-slate-500 dark:text-slate-400">Hand-picked by our expert instructors</p>
            </div>
            <Link to="/lessons" className="text-primary-600 hover:text-primary-700 font-medium text-sm">View all &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLessons.map(lesson => (
              <Link to={`/lessons?id=${lesson.id}`} key={lesson.id} className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-800">
                <div className="relative aspect-video overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {lesson.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-2">
                    {lesson.category}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>👤 {lesson.instructorName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-primary-100 mb-8 text-lg">Create an account today to track your progress and get personalized recommendations.</p>
          {!user && (
            <Link to="/login?signup=true" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors shadow-lg">
              Sign Up for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};