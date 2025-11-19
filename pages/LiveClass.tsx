import React, { useState } from 'react';
import { UPCOMING_LIVE_SESSIONS } from '../services/mockData';
import { LiveSession } from '../types';
import { useAuth } from '../context/AuthContext';

export const LiveClass: React.FC = () => {
  const { user, unlockLiveSession } = useAuth();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [payingForSession, setPayingForSession] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Check if the current user has unlocked a specific session
  const isUnlocked = (sessionId: string) => {
    return user?.unlockedLiveSessions?.includes(sessionId) || user?.role === 'TEACHER';
  };

  const handleJoinClick = (session: LiveSession) => {
    if (isUnlocked(session.id)) {
      setActiveSession(session);
    } else {
      setPayingForSession(session.id);
    }
  };

  const handlePayment = async () => {
    if (!payingForSession) return;
    await unlockLiveSession(payingForSession);
    setPayingForSession(null);
    setPhoneNumber('');
    // Auto join after unlock
    const session = UPCOMING_LIVE_SESSIONS.find(s => s.id === payingForSession);
    if (session) setActiveSession(session);
  };

  const getTimeRemaining = (endtime: string) => {
    const total = Date.parse(endtime) - Date.parse(new Date().toISOString());
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return { total, hours, minutes };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Smartlearn Live</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Exclusive real-time classes with expert tutors.</p>
        </div>

        {activeSession ? (
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-12 ring-4 ring-red-500/20">
            <div className="aspect-w-16 aspect-h-9 relative bg-slate-900 flex flex-col items-center justify-center text-white pb-[56.25%]">
              <div className="absolute inset-0 flex items-center justify-center">
                  {/* Internal Video Player Simulation */}
                  <div className="text-center p-8">
                      <div className="animate-pulse mb-4">
                          <div className="w-16 h-16 bg-red-600 rounded-full mx-auto flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-sm"></div>
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Live Broadcast</h3>
                      <p className="text-slate-400">Connected to Smartlearn Secure Stream</p>
                      <div className="mt-4 p-2 bg-black/50 rounded text-xs font-mono text-green-400">
                          Bitrate: 4500kbps | Latency: 120ms
                      </div>
                  </div>
              </div>
            </div>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{activeSession.title}</h2>
                <p className="text-slate-400">Instructor: {activeSession.instructorName}</p>
              </div>
              <button onClick={() => setActiveSession(null)} className="text-sm text-slate-400 hover:text-white underline">
                Leave Session
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {UPCOMING_LIVE_SESSIONS.map(session => {
              const unlocked = isUnlocked(session.id);
              return (
                <div key={session.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  <div className="md:w-64 h-48 md:h-auto relative">
                      <img src={session.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white">{session.title}</h3>
                         {!unlocked && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">MWK {session.price}</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Hosted by {session.instructorName}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm text-slate-500">
                            Starts: {new Date(session.startTime).toLocaleString()}
                        </div>
                        <button 
                            onClick={() => handleJoinClick(session)}
                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                                unlocked 
                                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                            }`}
                        >
                            {unlocked ? 'Enter Class' : `Pay MWK ${session.price} to Join`}
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {payingForSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unlock Live Session</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                      To join this live class, a one-time fee of <span className="font-bold text-primary-600">MWK 500</span> is required.
                  </p>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pay with Mobile Money</label>
                          <input 
                              type="tel" 
                              placeholder="Enter Phone Number" 
                              className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-3">
                          <button 
                            onClick={handlePayment}
                            disabled={!phoneNumber}
                            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
                          >
                              Pay MWK 500
                          </button>
                          <button 
                            onClick={() => { setPayingForSession(null); setPhoneNumber(''); }}
                            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                              Cancel
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
