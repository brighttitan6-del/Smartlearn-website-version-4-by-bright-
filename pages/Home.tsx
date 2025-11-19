import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, MOCK_LESSONS, MOCK_JOBS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const featuredLessons = MOCK_LESSONS.slice(0, 3);

  // --- Job Application State & Logic ---
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSubmitting) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isSubmitting) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      alert("Please upload your CV/Resume before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
        clearInterval(interval);
        alert(`Application for ${applyingJob?.title} submitted successfully!\nWe received your file: ${cvFile.name}`);
        closeModel();
    }, 2000);
  };

  const closeModel = () => {
    if (isSubmitting) return;
    setApplyingJob(null);
    setCvFile(null);
    setUploadProgress(0);
    setIsSubmitting(false);
  };

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

      {/* NEW CAREERS SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <div className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-1 rounded-full text-sm font-bold mb-4">WE ARE HIRING</div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Join the Smartlearn Team</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Passionate about education? Help us shape the future of learning in Malawi. Explore our open positions below.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_JOBS.map(job => (
                    <div key={job.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                                    <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{job.department}</span>
                                    <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{job.type}</span>
                                    <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">📍 {job.location}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">{job.description}</p>
                        <button 
                            onClick={() => setApplyingJob(job)}
                            className="w-full py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:hover:bg-primary-600 dark:hover:border-primary-600 transition-all"
                        >
                            View Details & Apply
                        </button>
                    </div>
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

      {/* Application Modal */}
      {applyingJob && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Apply for Position</h2>
                            <p className="text-primary-600 font-medium">{applyingJob.title}</p>
                        </div>
                        <button onClick={closeModel} disabled={isSubmitting} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                            {applyingJob.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <form className="space-y-4" onSubmit={handleJobSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" disabled={isSubmitting} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" disabled={isSubmitting} />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                             <input type="email" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" disabled={isSubmitting} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                             <input type="tel" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" disabled={isSubmitting} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Letter</label>
                             <textarea rows={3} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" disabled={isSubmitting}></textarea>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CV / Resume (PDF/DOC)</label>
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                    isSubmitting ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                } ${
                                    isDragging 
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]' 
                                        : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                    disabled={isSubmitting}
                                />
                                {cvFile ? (
                                    <div className="flex flex-col items-center text-primary-600 animate-fade-in">
                                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="font-bold text-sm">{cvFile.name}</span>
                                        {!isSubmitting && <span className="text-xs text-slate-500 mt-1 hover:underline">Click to change file</span>}
                                    </div>
                                ) : (
                                    <>
                                        <svg className="mx-auto h-10 w-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                            Drag and drop your CV here
                                        </p>
                                    </>
                                )}
                            </div>
                            
                            {isSubmitting && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-slate-400">
                                        <span>Uploading {cvFile?.name}...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-primary-600 h-full transition-all duration-100 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                             <button 
                                disabled={isSubmitting}
                                className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-wait"
                             >
                                 {isSubmitting ? 'Submitting...' : 'Submit Application'}
                             </button>
                             <button 
                                type="button" 
                                onClick={closeModel} 
                                disabled={isSubmitting}
                                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                             >
                                 Cancel
                             </button>
                        </div>
                    </form>
                </div>
             </div>
        )}
    </div>
  );
};
