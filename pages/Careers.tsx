import React, { useState } from 'react';
import { MOCK_JOBS } from '../services/mockData';
import { Job } from '../types';

export const Careers: React.FC = () => {
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
             <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Join the Smartlearn Team</h1>
             <p className="text-lg text-slate-600 dark:text-slate-400">We are looking for passionate educators and staff to help shape the future of learning in Malawi.</p>
        </div>

        <div className="space-y-6">
            {MOCK_JOBS.map(job => (
                <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h2>
                            <div className="flex gap-3 text-sm text-slate-500 mt-1">
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{job.department}</span>
                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{job.type}</span>
                                <span>📍 {job.location}</span>
                            </div>
                        </div>
                        <button 
                          onClick={() => setApplyingJob(job)}
                          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                            Apply Now
                        </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{job.description}</p>
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {job.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>

        {/* Application Modal */}
        {applyingJob && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Apply for Position</h2>
                    <p className="text-primary-600 font-medium mb-6">{applyingJob.title}</p>
                    
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Application submitted successfully!'); setApplyingJob(null); }}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                             <input type="email" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                             <input type="tel" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Letter</label>
                             <textarea rows={4} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white"></textarea>
                        </div>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center">
                            <p className="text-sm text-slate-500">Drag and drop your CV / Resume here or click to upload.</p>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                             <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700">Submit Application</button>
                             <button type="button" onClick={() => setApplyingJob(null)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg">Cancel</button>
                        </div>
                    </form>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};