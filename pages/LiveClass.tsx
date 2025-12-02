import React, { useState, useRef, useEffect } from 'react';
import { UPCOMING_LIVE_SESSIONS } from '../services/mockData';
import { LiveSession, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export const LiveClass: React.FC = () => {
  const { user, unlockLiveSession } = useAuth();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [payingForSession, setPayingForSession] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Simulation state for Teacher Recording
  const [isRecording, setIsRecording] = useState(false);
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Check if the current user has unlocked a specific session
  const isUnlocked = (sessionId: string) => {
    return user?.unlockedLiveSessions?.includes(sessionId) || user?.role === UserRole.TEACHER;
  };

  const handleJoinClick = (session: LiveSession) => {
    if (isUnlocked(session.id)) {
      setActiveSession(session);
      setIsRecording(false); // Reset recording state on new join
      setCameraError(null);
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

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      alert("Class recording saved successfully! It will be available to students shortly.");
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera/microphone. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Cleanup stream when session ends or component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // When activeSession changes to null, ensure camera is stopped
  useEffect(() => {
    if (!activeSession) {
      stopCamera();
    }
  }, [activeSession]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Smartlearn Live & Recorded Classes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Exclusive real-time classes and past session recordings.</p>
        </div>

        {activeSession ? (
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-12 ring-4 ring-primary-500/20">
            <div className="aspect-w-16 aspect-h-9 relative bg-slate-900 flex flex-col items-center justify-center text-white pb-[56.25%]">
              <div className="absolute inset-0 flex items-center justify-center">
                  {/* Internal Video Player Simulation */}
                  {activeSession.recordingUrl ? (
                     // Playback Mode
                     <iframe 
                        src={activeSession.recordingUrl} 
                        title={activeSession.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                  ) : (
                    // Live Mode
                    <div className="w-full h-full relative bg-slate-900 flex flex-col">
                        {/* Video Element for Stream */}
                        {stream && (
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            muted={user?.role === UserRole.TEACHER} // Mute self to prevent feedback
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        )}

                        {/* Controls Overlay */}
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                            {!stream && (
                                <div className="text-center p-8 pointer-events-auto">
                                    <div className="animate-pulse mb-4">
                                        <div className="w-16 h-16 bg-red-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-red-500/50">
                                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-md">Live Broadcast</h3>
                                    <p className="text-slate-300 drop-shadow-md mb-4">Connected to Smartlearn Secure Stream</p>
                                    
                                    {user?.role === UserRole.TEACHER ? (
                                        <div className="space-y-2">
                                            <button 
                                                onClick={startCamera}
                                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-2 mx-auto"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                Start Camera
                                            </button>
                                            {cameraError && <p className="text-red-400 text-sm font-bold bg-black/50 px-2 py-1 rounded">{cameraError}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">Waiting for instructor to start video...</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Teacher Controls (Always visible if teacher) */}
                        {user?.role === UserRole.TEACHER && (
                           <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                             {stream && (
                                <button 
                                    onClick={stopCamera}
                                    className="bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm border border-slate-600"
                                >
                                    Stop Camera
                                </button>
                             )}
                             <button 
                               onClick={handleToggleRecording}
                               className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-lg backdrop-blur-sm ${
                                 isRecording 
                                   ? 'bg-white/90 text-red-600 animate-pulse border-2 border-red-500' 
                                   : 'bg-red-600 text-white hover:bg-red-700'
                               }`}
                             >
                               <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-white'}`}></div>
                               {isRecording ? 'Recording...' : 'Start Recording'}
                             </button>
                           </div>
                        )}

                        {/* Stream Info (Bottom Left) */}
                        <div className="absolute bottom-4 left-4 z-20 p-2 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-green-400 border border-white/10">
                            Bitrate: {stream ? '4500kbps' : '0kbps'} | Latency: 120ms
                        </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{activeSession.title}</h2>
                  {activeSession.recordingUrl ? (
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded font-bold uppercase">Recorded</span>
                  ) : (
                    <span className="bg-red-600 text-xs px-2 py-1 rounded font-bold uppercase animate-pulse">Live</span>
                  )}
                </div>
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
              const isRecorded = !!session.recordingUrl;
              
              return (
                <div key={session.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  <div className="md:w-64 h-48 md:h-auto relative">
                      <img src={session.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                         {unlocked ? (
                           <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">UNLOCKED</div>
                         ) : (
                           <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">LOCKED</div>
                         )}
                         {isRecorded ? (
                           <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">RECORDING</div>
                         ) : (
                           <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">LIVE</div>
                         )}
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
                            {isRecorded ? 'Streamed on: ' : 'Starts: '} {new Date(session.startTime).toLocaleString()}
                        </div>
                        <button 
                            onClick={() => handleJoinClick(session)}
                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                                unlocked 
                                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                            }`}
                        >
                            {unlocked ? (isRecorded ? 'Watch Recording' : 'Enter Class') : `Pay MWK ${session.price} to ${isRecorded ? 'Watch' : 'Join'}`}
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unlock Session</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                      To access this content, a one-time fee of <span className="font-bold text-primary-600">MWK 500</span> is required.
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