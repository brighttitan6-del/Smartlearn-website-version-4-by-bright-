import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../services/mockData';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'upload'>('overview');
  const [selectedUploadSubject, setSelectedUploadSubject] = useState<string | null>(null);

  if (!user) return <Navigate to="/login" />;

  const isTeacher = user.role === UserRole.TEACHER;

  const UploadSection = () => {
    // If no subject selected, show the grid
    if (!selectedUploadSubject) {
      return (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Select Subject Panel to Upload</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Choose the subject category where you want to add new video lessons or resources.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedUploadSubject(cat.name)}
                  className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary-500 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-3 group"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Show Form for selected subject
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-fade-in">
        <button 
          onClick={() => setSelectedUploadSubject(null)}
          className="mb-4 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          ← Back to Subject Selection
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
          Upload to {selectedUploadSubject} Panel
        </h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Video uploaded successfully!'); setSelectedUploadSubject(null); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lesson Title</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" placeholder="e.g. Introduction to Photosynthesis" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Grade</label>
                <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white">
                    <option>Form 1</option>
                    <option>Form 2</option>
                    <option>Form 3</option>
                    <option>Form 4</option>
                    <option>Form 5</option>
                    <option>Form 6</option>
                </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internal Video ID / Source</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" placeholder="Paste internal resource ID or file path" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description & Notes</label>
            <textarea className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" rows={4} placeholder="What will students learn?"></textarea>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium text-sm mb-2 text-slate-700 dark:text-slate-300">Teacher Verification</h4>
             <div className="flex items-center gap-2">
                <input type="checkbox" id="approve" required className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="approve" className="text-sm text-slate-600 dark:text-slate-400">
                  I confirm this content is appropriate for the selected grade and subject.
                </label>
            </div>
          </div>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-lg shadow-primary-600/20">
            Upload Video
          </button>
        </form>
      </div>
    );
  };

  const ProgressSection = () => (
    <div className="space-y-6">
      <div className="bg-primary-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Subscription Status</h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono">{user.subscriptionStatus}</span>
          </div>
          <p className="text-primary-100">
              Current Plan: <span className="font-bold">{user.currentPlan || 'None'}</span>
          </p>
          <p className="text-sm mt-2 text-primary-200">
              Expires: {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toDateString() : 'N/A'}
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">85%</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Overall Completion</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-1">12</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Lessons Completed</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">{user.purchasedBooks?.length || 0}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Books Owned</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100 dark:border-slate-700" />
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide mb-6">{user.role}</p>
              
              <div className="flex flex-col gap-2 text-left">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                  Overview
                </button>
                <button 
                   onClick={() => setActiveTab('schedule')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'schedule' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                  Schedule
                </button>
                {isTeacher && (
                  <button 
                    onClick={() => { setActiveTab('upload'); setSelectedUploadSubject(null); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  >
                    Subject Panels (Upload)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {activeTab === 'overview' && "Dashboard Overview"}
                 {activeTab === 'schedule' && "Class Schedule"}
                 {activeTab === 'upload' && "Content Management Panel"}
               </h1>
            </div>

            {activeTab === 'overview' && (isTeacher ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl text-center border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-300">Welcome, Teacher. Use the Content Management Panel to upload new lessons.</p>
              </div>
            ) : <ProgressSection />)}

            {activeTab === 'upload' && isTeacher && <UploadSection />}
            
            {activeTab === 'schedule' && (
               <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                 <p className="text-slate-500 italic">No upcoming personal schedule items.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};